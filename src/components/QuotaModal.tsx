import { Clock, X, RotateCcw, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
}

export function QuotaModal({
  isOpen,
  onClose,
  onRetry,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-stone-900 border border-stone-800 p-6 sm:p-7 shadow-2xl text-stone-100 overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-100">AI Cluster Busy</h3>
            <p className="text-xs text-stone-400">Holding your position in queue automatically</p>
          </div>
        </div>

        {/* Body Text */}
        <p className="text-xs text-stone-300 leading-relaxed mb-5">
          The open-source diffusion cluster is currently under high global traffic. You don't need to do anything—we are holding your position and will automatically run your try-on the moment your slot clears.
        </p>

        {/* Automatic Instant Card */}
        <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800/80 mb-5 flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <span className="text-xs font-bold block text-stone-200">
                Instant Neural Drape Available
              </span>
              <span className="text-[11px] text-stone-400">
                Zero waiting: Fits garment contours on-device
              </span>
            </div>
          </div>

          <div className="text-xs font-bold text-emerald-400 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 shadow-sm">
            Instant (&lt;1s)
          </div>
        </div>

        {/* Trust Badge */}
        <div className="flex items-center gap-2 mb-6 px-1 text-[11px] text-stone-400">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Your uploaded photo and garment analysis are safely preserved.</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onRetry}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Fit Instantly (No Waiting)</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-stone-800/80 hover:bg-stone-800 text-xs font-semibold text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
          >
            Back to Garment Studio
          </button>
        </div>
      </div>
    </div>
  );
}
