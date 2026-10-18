declare const process: {
  env: Record<string, string | undefined>;
};

interface ApiRequest {
  method?: string;
  body?: any;
  query?: Record<string, string>;
  headers?: Record<string, string>;
}

interface ApiResponse {
  setHeader(name: string, value: string): ApiResponse;
  status(code: number): ApiResponse;
  json(data: any): ApiResponse;
  end(): void;
}

export interface StyleAdviceResponse {
  pairing_ideas: string[];
  color_harmony: {
    palette_type: string;
    complementary_colors: string[];
    explanation: string;
  };
  occasion_fit: {
    best_for: string[];
    avoid_for: string[];
    dress_code_level: string;
  };
  style_verdict: string;
  styling_tips: string[];
}

const DEFAULT_MOCK_ADVICE: StyleAdviceResponse = {
  pairing_ideas: [
    'Slim-tapered raw indigo denim jeans with rolled cuffs',
    'Chinos in desert sand or warm olive',
    'Rugged Goodyear-welted leather boots or minimal white leather sneakers',
    'Layer with a heavy ribbed-knit oatmeal crewneck or charcoal overcoat'
  ],
  color_harmony: {
    palette_type: 'Earthy Complementary',
    complementary_colors: ['#c29d59', '#1e293b', '#64748b', '#ffffff'],
    explanation: 'Deep forest green and navy plaid pairs harmoniously with warm tans, neutral slates, and crisp white base layers.'
  },
  occasion_fit: {
    best_for: ['Casual Fridays', 'Weekend Gatherings', 'Coffee dates', 'Fall / Winter outdoor activities'],
    avoid_for: ['Black Tie / Formal Galas', 'Strict Corporate Boardrooms'],
    dress_code_level: 'Smart Casual (Tier 2/5)'
  },
  style_verdict: 'A timeless, versatile heritage piece that balances relaxed comfort with structured flannel warmth. Exceptionally adaptable for layering.',
  styling_tips: [
    'Leave unbuttoned over a heavyweight 220gsm white tee for an effortless weekend silhouette.',
    'Roll the sleeves to mid-forearm to showcase a leather or field watch.',
    'Fasten the middle three buttons and tuck the front hem into chinos for an elevated casual feel.'
  ]
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  try {
    const { garment, occasion = 'casual', season = 'autumn/winter' } = req.body || {};

    if (!apiKey || !garment) {
      return res.status(200).json(DEFAULT_MOCK_ADVICE);
    }

    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const prompt = `You are a high-end personal stylist and fashion director for Aaina (Virtual Fitting Mirror).
Analyze this garment and provide professional styling advice.

GARMENT DATA:
Category: ${garment.category || 'Clothing'}
Subcategory: ${garment.subcategory || 'Apparel'}
Description: ${garment.garment_description || 'garment'}
Colors: ${JSON.stringify(garment.colors || [])}
Pattern: ${garment.pattern || 'Standard'}
Occasion Context: ${occasion}
Season Context: ${season}

STRICT GUARDRAILS:
1. NEVER comment on or assume the user's physical body shape, weight, height, skin tone, or attractiveness.
2. Focus 100% on garment aesthetics, color theory, silhouette balance, fabrics, and wardrobe coordination.
3. Return ONLY a valid JSON object matching this schema without markdown fences:
{
  "pairing_ideas": ["specific item 1", "specific item 2", "specific item 3", "specific item 4"],
  "color_harmony": {
    "palette_type": "e.g. Earthy Complementary / Monochrome / High Contrast",
    "complementary_colors": ["#HEX1", "#HEX2", "#HEX3"],
    "explanation": "concise explanation of why these colors work together"
  },
  "occasion_fit": {
    "best_for": ["occasion 1", "occasion 2", "occasion 3"],
    "avoid_for": ["occasion 1", "occasion 2"],
    "dress_code_level": "e.g. Smart Casual (Tier 2/5)"
  },
  "style_verdict": "2-3 sentences summarizing the aesthetic impact and versatile strengths of this item",
  "styling_tips": ["actionable tip 1 (e.g. rolling sleeves, tucking, unbuttoning)", "actionable tip 2", "actionable tip 3"]
}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!response.ok) {
      console.warn('Gemini Style Advisor API returned non-200, falling back to mock:', response.status);
      return res.status(200).json(DEFAULT_MOCK_ADVICE);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      return res.status(200).json(DEFAULT_MOCK_ADVICE);
    }

    const parsed = JSON.parse(candidateText.trim());
    return res.status(200).json(parsed);
  } catch (err) {
    console.error('Error in Style Advisor API handler:', err);
    return res.status(200).json(DEFAULT_MOCK_ADVICE);
  }
}
