import { useState } from 'react';
import { Sparkles, Edit3, Check, ShieldAlert, Tag, Compass, Shirt } from 'lucide-react';
import type { GarmentAnalysis } from '../../api/analyze';

interface Props {
  analysis: GarmentAnalysis | null;
  isLoading: boolean;
  onUpdateDescription: (newDesc: string) => void;
}

export function GarmentIntelligenceCard({
  analysis,
  isLoading,
  onUpdateDescription,
}: Props) {
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [promptText, setPromptText] = useState('');

  if (isLoading) {
    return (
      <div className="mt-4 p-5 rounded-2xl bg-stone-900/60 border border-stone-800 backdrop-blur-md animate-pulse">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 animate-spin" />
          <span className="text-sm font-semibold text-stone-200">
            Garment Intelligence analyzing product details…
          </span>
        </div>
        <div className="h-4 bg-stone-800 rounded-md w-3/4 mb-2" />
        <div className="h-3 bg-stone-800/60 rounded-md w-1/2" />
      </div>
    );
  }

  if (!analysis) return null;

  if (analysis.unsafe) {
    return (
      <div className="mt-4 p-5 rounded-2xl bg-rose-950/30 border border-rose-500/30 backdrop-blur-md text-rose-300 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold text-rose-200">Inappropriate Garment Flagged</p>
          <p className="text-xs text-rose-300/80 mt-1">
            This item cannot be processed in accordance with our community safety and responsible AI guidelines. Please upload a suitable apparel or accessory image.
          </p>
        </div>
      </div>
    );
  }

  const handleSavePrompt = () => {
    if (promptText.trim()) {
      onUpdateDescription(promptText.trim());
    }
    setIsEditingPrompt(false);
  };

  return (
    <div className="mt-4 rounded-2xl bg-stone-900/90 border border-stone-800 p-5 backdrop-blur-md shadow-2xl transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Garment Intelligence</h4>
            <span className="text-sm font-semibold text-stone-200">{analysis.category} — {analysis.subcategory}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-800/80 border border-stone-700/60 text-[11px] text-stone-300">
          <Tag className="w-3 h-3 text-emerald-400" />
          <span>Route: {analysis.route}</span>
        </div>
      </div>

      {/* Human in the loop confirmation if confidence is low */}
      {analysis.confidence < 0.6 && (
        <div className="my-3 p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2">
          <Compass className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
          <div>
            <span className="font-semibold block text-amber-200">Category needs verification (Confidence: {Math.round(analysis.confidence * 100)}%)</span>
            <span className="text-[11px] text-amber-300/80">
              Is this item a top, bottom, dress, or accessory? You can adjust the route if needed.
            </span>
          </div>
        </div>
      )}

      {/* Diffusion Prompt with Inline Editing */}
      <div className="my-3 p-3 rounded-xl bg-stone-950/60 border border-stone-800/70">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 flex items-center gap-1">
            <Shirt className="w-3 h-3 text-stone-400" />
            Diffusion Prompt (used by IDM-VTON)
          </span>

          {!isEditingPrompt ? (
            <button
              type="button"
              onClick={() => {
                setPromptText(analysis.garment_description);
                setIsEditingPrompt(true);
              }}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium transition-colors"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSavePrompt}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Done</span>
            </button>
          )}
        </div>

        {isEditingPrompt ? (
          <input
            type="text"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            className="w-full text-xs bg-stone-900 border border-emerald-500/50 rounded-lg px-2.5 py-1.5 text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-400"
            autoFocus
          />
        ) : (
          <p className="text-xs text-stone-200 italic font-medium">"{analysis.garment_description}"</p>
        )}
      </div>

      {/* Attributes Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs my-3">
        {/* Colors */}
        <div className="p-2.5 rounded-xl bg-stone-950/40 border border-stone-800/50">
          <span className="text-[10px] text-stone-400 font-medium block mb-1">Colors</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {analysis.colors.map((c, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-stone-800 text-[11px] text-stone-200 font-medium">
                <span className="w-2 h-2 rounded-full border border-stone-700 shrink-0" style={{ backgroundColor: c.hex }} />
                {c.name}
              </span>
            ))}
          </div>
        </div>

        {/* Pattern & Fabric */}
        <div className="p-2.5 rounded-xl bg-stone-950/40 border border-stone-800/50">
          <span className="text-[10px] text-stone-400 font-medium block mb-1">Fabric & Pattern</span>
          <span className="text-[11px] text-stone-200 font-medium block truncate">{analysis.fabric_guess || 'Standard'}</span>
          <span className="text-[10px] text-stone-400 block truncate">{analysis.pattern || 'Plain'}</span>
        </div>

        {/* Silhouette & Neckline */}
        <div className="p-2.5 rounded-xl bg-stone-950/40 border border-stone-800/50">
          <span className="text-[10px] text-stone-400 font-medium block mb-1">Fit & Cut</span>
          <span className="text-[11px] text-stone-200 font-medium block truncate">{analysis.fit_style || 'Regular'}</span>
          <span className="text-[10px] text-stone-400 block truncate">{analysis.sleeve || analysis.neckline || 'Standard'}</span>
        </div>

        {/* Formality */}
        <div className="p-2.5 rounded-xl bg-stone-950/40 border border-stone-800/50">
          <span className="text-[10px] text-stone-400 font-medium block mb-1">Formality Rating</span>
          <div className="flex items-center gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <span
                key={lvl}
                className={`h-1.5 flex-1 rounded-full ${
                  lvl <= parseInt(analysis.formality || '2', 10) ? 'bg-emerald-400' : 'bg-stone-800'
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] text-stone-400 mt-1 block">Tier {analysis.formality || '2'} / 5</span>
        </div>
      </div>

      {/* Occasions & Pairing Suggestions */}
      {analysis.pairing_suggestions && analysis.pairing_suggestions.length > 0 && (
        <div className="pt-2.5 border-t border-stone-800/60 text-xs">
          <span className="text-[10px] text-stone-400 font-medium block mb-1.5 uppercase tracking-wider">Style Pairings (Gemini Fashion Engine)</span>
          <div className="flex flex-wrap gap-1.5">
            {analysis.pairing_suggestions.map((p, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded-full bg-stone-800/60 text-[11px] text-stone-300 border border-stone-700/50">
                + {p}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
