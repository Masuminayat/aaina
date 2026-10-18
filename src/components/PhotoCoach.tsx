import { Sparkles, CheckCircle2, AlertTriangle, Info, Wand2, RefreshCw } from 'lucide-react';
import type { PhotoCoachReport } from '../ai/coach/photo-coach';

interface Props {
  report: PhotoCoachReport | null;
  isAnalyzing: boolean;
  onAutoFix: () => void;
  isFixing?: boolean;
}

export function PhotoCoach({ report, isAnalyzing, onAutoFix, isFixing = false }: Props) {
  if (isAnalyzing) {
    return (
      <div className="mt-4 p-4 rounded-2xl bg-stone-900/60 border border-stone-800 backdrop-blur-sm flex items-center gap-3 animate-pulse">
        <RefreshCw className="w-5 h-5 text-emerald-400 animate-spin" />
        <span className="text-sm font-medium text-stone-300">
          Photo Coach analyzing framing, lighting, and resolution…
        </span>
      </div>
    );
  }

  if (!report) return null;

  const { score, checks, tips } = report;

  const scoreColor =
    score >= 80 ? 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20'
    : score >= 60 ? 'text-amber-400 border-amber-500/30 bg-amber-950/20'
    : 'text-rose-400 border-rose-500/30 bg-rose-950/20';

  const scoreLabel =
    score >= 80 ? 'Ready for Studio Try-On'
    : score >= 60 ? 'Good (Recommended to Auto-Fix)'
    : 'Needs Improvement';

  return (
    <div className="mt-4 rounded-2xl bg-stone-900/80 border border-stone-800/80 p-5 backdrop-blur-md transition-all shadow-xl">
      {/* Header with Score */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-stone-200">Photo Coach (On-Device AI)</h4>
            <p className="text-xs text-stone-400">{scoreLabel}</p>
          </div>
        </div>

        <div className={`px-3 py-1.5 rounded-full border text-xs font-bold flex items-center gap-1.5 ${scoreColor}`}>
          <span>Score:</span>
          <span className="text-sm">{score}/100</span>
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="grid grid-cols-2 gap-2.5 my-3.5">
        <div className="p-2.5 rounded-xl bg-stone-950/50 border border-stone-800/60 flex items-start gap-2">
          {checks.resolution.passed ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          )}
          <div className="text-xs">
            <span className="font-medium text-stone-200 block">Resolution</span>
            <span className="text-[11px] text-stone-400">{checks.resolution.details}</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-stone-950/50 border border-stone-800/60 flex items-start gap-2">
          {checks.framing.passed ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          )}
          <div className="text-xs">
            <span className="font-medium text-stone-200 block">Framing (3:4)</span>
            <span className="text-[11px] text-stone-400">{checks.framing.message}</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-stone-950/50 border border-stone-800/60 flex items-start gap-2">
          {checks.lighting.passed ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          )}
          <div className="text-xs">
            <span className="font-medium text-stone-200 block">Exposure</span>
            <span className="text-[11px] text-stone-400">{checks.lighting.message}</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-stone-950/50 border border-stone-800/60 flex items-start gap-2">
          {checks.sharpness.passed ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          )}
          <div className="text-xs">
            <span className="font-medium text-stone-200 block">Sharpness</span>
            <span className="text-[11px] text-stone-400">{checks.sharpness.message}</span>
          </div>
        </div>
      </div>

      {/* Actionable Tips & Auto-Fix */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-stone-800/60">
        <div className="flex items-start gap-2 text-xs text-stone-400 max-w-sm">
          <Info className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
          <span>{tips[0]}</span>
        </div>

        <button
          type="button"
          onClick={onAutoFix}
          disabled={isFixing}
          className="w-full sm:w-auto px-3.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
        >
          {isFixing ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Optimizing photo…</span>
            </>
          ) : (
            <>
              <Wand2 className="w-3.5 h-3.5" />
              <span>Auto-Fix Framing (3:4)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
