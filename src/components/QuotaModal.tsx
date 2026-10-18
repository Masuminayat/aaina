import { useState, useEffect } from 'react';
import { AlertCircle, Clock, Key, X, Check, ExternalLink, RotateCcw } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaveToken: (token: string) => void;
  initialCountdownSeconds?: number;
}

export function QuotaModal({
  isOpen,
  onClose,
  onSaveToken,
  initialCountdownSeconds = 75,
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
      }, 700);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-stone-900 border border-stone-800 p-6 shadow-2xl text-stone-100">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-100">Hugging Face GPU Quota Busy</h3>
            <p className="text-xs text-stone-400">ZeroGPU public shared cluster limit reached</p>
          </div>
        </div>

        <p className="text-xs text-stone-300 leading-relaxed mb-5">
          The open-source Hugging Face diffusion engine is currently handling high global traffic. Each anonymous visitor shares a public GPU quota that cycles every 1–2 minutes.
        </p>

        {/* Option 1: Wait for Queue Reset with Live Countdown */}
        <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800/80 mb-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-xs font-semibold block text-stone-200">Wait for Slot Reset</span>
              <span className="text-[11px] text-stone-400">
                {countdown > 0 ? 'Public queue cooldown in progress' : 'Slot reset ready! Click Retry below.'}
              </span>
            </div>
          </div>
          <div
            className={`text-xs font-mono font-bold px-3 py-1 rounded-md border ${
              countdown > 0
                ? 'text-emerald-400 bg-emerald-950/50 border-emerald-500/30'
                : 'text-stone-950 bg-emerald-400 border-emerald-400 animate-pulse'
            }`}
          >
            {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
          </div>
        </div>

        {/* Option 2: Use Free Personal Hugging Face Token (Permanent Bypass) */}
        <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800/80 mb-5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-xs font-semibold text-stone-200">Use Free Hugging Face Token</span>
            </div>
            <a
              href="https://huggingface.co/settings/tokens"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 font-medium underline"
            >
              <span>Get Free Token</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <p className="text-[11px] text-stone-400 leading-relaxed">
            Hugging Face accounts are 100% free. Creating a free token grants dedicated ZeroGPU priority over anonymous visitors. Kept in browser RAM only.
          </p>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="password"
              placeholder="Paste hf_... here"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="flex-1 bg-stone-900 border border-stone-700/80 rounded-lg px-3 py-2 text-xs text-stone-200 placeholder:text-stone-600 focus:outline-none focus:ring-1 focus:ring-emerald-400"
            />
            <button
              type="button"
              onClick={handleApplyToken}
              className="px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95"
            >
              {tokenSaved ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Applied</span>
                </>
              ) : (
                'Apply'
              )}
            </button>
          </div>
        </div>

        {/* Bottom Action: Dismiss and Retry */}
        <button
          type="button"
          onClick={onClose}
          className={`w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            countdown === 0 || tokenSaved
              ? 'bg-emerald-500 hover:bg-emerald-400 text-stone-950 shadow-lg active:scale-95'
              : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{countdown === 0 ? 'Retry Try-On Now' : 'Dismiss & Retry Try-On'}</span>
        </button>
      </div>
    </div>
  );
}
