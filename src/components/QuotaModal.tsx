import { useState, useEffect } from 'react';
import { AlertCircle, Clock, Zap, Key, X, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToInstant: () => void;
  onSaveToken: (token: string) => void;
  initialCountdownSeconds?: number;
}

export function QuotaModal({
  isOpen,
  onClose,
  onSwitchToInstant,
  onSaveToken,
  initialCountdownSeconds = 90,
}: Props) {
  const [countdown, setCountdown] = useState(initialCountdownSeconds);
  const [tokenInput, setTokenInput] = useState('');
  const [tokenSaved, setTokenSaved] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(initialCountdownSeconds);
      return;
    }
    const timer = setInterval(() => {
      setCountdown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, initialCountdownSeconds]);

  if (!isOpen) return null;

  const handleApplyToken = () => {
    if (tokenInput.trim()) {
      onSaveToken(tokenInput.trim());
      setTokenSaved(true);
      setTimeout(() => {
        onClose();
      }, 800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-stone-900 border border-stone-800 p-6 shadow-2xl text-stone-100">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-100">Hugging Face GPU Quota Busy</h3>
            <p className="text-xs text-stone-400">ZeroGPU public shared cluster limit reached</p>
          </div>
        </div>

        <p className="text-xs text-stone-300 leading-relaxed mb-5">
          The open-source Hugging Face diffusion engine is currently under high global traffic. Each visitor shares anonymous GPU quota that cycles every few minutes.
        </p>

        {/* Option 1: Wait with Countdown */}
        <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800/80 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-xs font-semibold block text-stone-200">Wait for Queue Reset</span>
              <span className="text-[11px] text-stone-400">Automatic slot retry</span>
            </div>
          </div>
          <div className="text-xs font-mono font-bold text-emerald-400 px-2.5 py-1 rounded-md bg-emerald-950/50 border border-emerald-500/30">
            {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
          </div>
        </div>

        {/* Option 2: Instant Engine fallback */}
        <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800/80 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-xs font-semibold block text-stone-200">Switch to Instant Mode</span>
              <span className="text-[11px] text-stone-400">100% on-device preview ($0 guaranteed)</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onSwitchToInstant}
            className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-all active:scale-95"
          >
            Launch
          </button>
        </div>

        {/* Option 3: User HF Token */}
        <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800/80 mb-5">
          <div className="flex items-center gap-2.5 mb-2">
            <Key className="w-4 h-4 text-stone-400" />
            <span className="text-xs font-semibold text-stone-200">Use Personal Free Hugging Face Token</span>
          </div>
          <p className="text-[11px] text-stone-400 mb-2.5">
            Kept strictly in browser RAM. Never stored or logged.
          </p>

          <div className="flex items-center gap-2">
            <input
              type="password"
              placeholder="hf_..."
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="flex-1 bg-stone-900 border border-stone-700/80 rounded-lg px-2.5 py-1.5 text-xs text-stone-200 placeholder:text-stone-600 focus:outline-none focus:ring-1 focus:ring-emerald-400"
            />
            <button
              type="button"
              onClick={handleApplyToken}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-stone-950 text-xs font-bold transition-all flex items-center gap-1"
            >
              {tokenSaved ? <Check className="w-3.5 h-3.5" /> : 'Apply'}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-300 transition-colors"
        >
          Dismiss & Retry
        </button>
      </div>
    </div>
  );
}
