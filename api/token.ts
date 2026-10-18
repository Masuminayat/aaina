declare const process: {
  env: Record<string, string | undefined>;
};

interface ApiRequest {
  method?: string;
}

interface ApiResponse {
  setHeader(name: string, value: string): ApiResponse;
  status(code: number): ApiResponse;
  json(data: any): ApiResponse;
  end(): void;
}

/**
 * /api/token
 * Provides the backend-configured Hugging Face token to the client inference engine
 * automatically, so the end user never has to enter any API keys or tokens.
 */
export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const token = process.env.HF_TOKEN || process.env.VITE_HF_TOKEN || '';
  return res.status(200).json({ token });
}
