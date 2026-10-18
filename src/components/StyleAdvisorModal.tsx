import { useState, useEffect, useCallback } from 'react';
import { Sparkles, Palette, Check, X, ShieldCheck, Compass, Lightbulb, RefreshCw } from 'lucide-react';
import type { GarmentAnalysis } from '../../api/analyze';
import type { StyleAdviceResponse } from '../../api/advise';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  garment: GarmentAnalysis | null;
}

export function StyleAdvisorModal({ isOpen, onClose, garment }: Props) {
  const [occasion, setOccasion] = useState('Smart Casual');
  const [season, setSeason] = useState('Autumn / Winter');
  const [advice, setAdvice] = useState<StyleAdviceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAdvice = useCallback(async () => {
    if (!garment) return;
    setIsLoading(true);
    try {
      const resp = await fetch('/api/advise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ garment, occasion, season }),
      });
      if (resp.ok) {
        const data: StyleAdviceResponse = await resp.json();
        setAdvice(data);
      }
    } catch (err) {
      console.warn('Failed to fetch style advice:', err);
    } finally {
      setIsLoading(false);
    }
  }, [garment, occasion, season]);

  useEffect(() => {
    if (isOpen && garment && !advice) {
      fetchAdvice();
    }
  }, [isOpen, garment, advice, fetchAdvice]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[88vh] rounded-3xl bg-stone-900 border border-stone-800 shadow-2xl flex flex-col text-stone-100 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-stone-100">Style Advisor (Gemini Fashion Engine)</h3>
              <p className="text-xs text-stone-400">Objective garment styling, pairings, and color theory</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guardrail Banner */}
        <div className="px-5 py-2 bg-emerald-950/30 border-b border-emerald-500/20 flex items-center gap-2 text-[11px] text-emerald-300 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Body-Neutral Guarantee: Advice is formulated strictly around garment silhouette & color theory without judging user anatomy.</span>
        </div>

        {/* Context Controls */}
        <div className="p-4 bg-stone-950/60 border-b border-stone-800/80 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Occasion:</span>
            <select
              value={occasion}
              onChange={(e) => {
                setOccasion(e.target.value);
                setAdvice(null);
              }}
              className="bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1 text-xs text-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-400"
            >
              <option value="Casual Weekend">Casual Weekend</option>
              <option value="Smart Casual">Smart Casual</option>
              <option value="Business Casual">Business Casual</option>
              <option value="Evening / Date Night">Evening / Date Night</option>
              <option value="Outdoor / Travel">Outdoor / Travel</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-400">Season:</span>
            <select
              value={season}
              onChange={(e) => {
                setSeason(e.target.value);
                setAdvice(null);
              }}
              className="bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1 text-xs text-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-400"
            >
              <option value="Autumn / Winter">Autumn / Winter</option>
              <option value="Spring / Summer">Spring / Summer</option>
              <option value="Transitional">Transitional</option>
            </select>

            <button
              type="button"
              onClick={fetchAdvice}
              disabled={isLoading}
              className="p-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
              title="Refresh Advice"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-stone-400 animate-pulse">
              <Sparkles className="w-6 h-6 text-emerald-400 animate-spin" />
              <span>Analyzing color harmony and wardrobe pairings with Gemini…</span>
            </div>
          ) : advice ? (
            <>
              {/* Executive Style Verdict */}
              <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  Stylist Verdict
                </span>
                <p className="text-xs text-stone-200 leading-relaxed font-medium">
                  {advice.style_verdict}
                </p>
              </div>

              {/* Color Harmony */}
              <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-emerald-400" />
                    Color Harmony: {advice.color_harmony.palette_type}
                  </span>
                </div>
                <p className="text-stone-300 text-[11px] mb-2.5">
                  {advice.color_harmony.explanation}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-stone-500">Coordinating Palette:</span>
                  <div className="flex items-center gap-1.5">
                    {advice.color_harmony.complementary_colors.map((hex, idx) => (
                      <div
                        key={idx}
                        className="w-5 h-5 rounded-full border border-stone-700 shadow-inner"
                        style={{ backgroundColor: hex }}
                        title={hex}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommended Coordinates & Pairings */}
              <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-emerald-400" />
                  Recommended Wardrobe Coordinates
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {advice.pairing_ideas.map((idea, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-stone-900 border border-stone-800/80 text-stone-200 flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-snug">{idea}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Occasions: Best For vs Avoid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/20">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1.5">
                    Ideal Occasions
                  </span>
                  <ul className="space-y-1 text-stone-300 text-[11px]">
                    {advice.occasion_fit.best_for.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-950/50 border border-stone-800">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">
                    Not Recommended For
                  </span>
                  <ul className="space-y-1 text-stone-400 text-[11px]">
                    {advice.occasion_fit.avoid_for.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-stone-600 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Pro Styling Tips */}
              <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  Stylist Wear & Fit Tips
                </span>
                <ul className="space-y-1.5 text-stone-300 text-[11px]">
                  {advice.styling_tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">&bull;</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-950 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-stone-500">
            Powered by Gemini 2.5 Flash · Free Tier
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
