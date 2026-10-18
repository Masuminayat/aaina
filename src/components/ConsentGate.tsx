/**
 * ConsentGate — Shown before the user can upload photos.
 * Required by privacy policy: user must acknowledge how their data is processed.
 */
import { Shield, Eye, Trash2 } from 'lucide-react';
import { useAppStore } from '../store/app-store';

export function ConsentGate() {
  const setConsentGiven = useAppStore((s) => s.setConsentGiven);
  const setStep = useAppStore((s) => s.setStep);

  const handleAccept = () => {
    setConsentGiven(true);
    setStep('person');
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-12 animate-[fade-in_0.4s_ease-out]">
      <div className="rounded-2xl bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] p-6 sm:p-8 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[var(--color-accent-muted)] flex items-center justify-center">
            <Shield className="w-5 h-5 text-[var(--color-accent)]" />
          </div>
          <h2 className="text-xl font-semibold font-[var(--font-display)]">Before we begin</h2>
        </div>

        <div className="space-y-4 text-sm text-[var(--color-text-secondary)] leading-relaxed">
          <div className="flex items-start gap-3">
            <Eye className="w-4 h-4 mt-0.5 text-[var(--color-accent)] shrink-0" />
            <p>
              Your photo is processed by an <strong className="text-[var(--color-text-primary)]">open-source AI model</strong> hosted
              on Hugging Face to create the virtual try-on result. It is <strong className="text-[var(--color-text-primary)]">not stored</strong> by
              Aaina or sent to any other service.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <Shield className="w-4 h-4 mt-0.5 text-[var(--color-accent)] shrink-0" />
            <p>
              Product images may be analyzed by Google Gemini for garment understanding.
              Your personal photo is <strong className="text-[var(--color-text-primary)]">never sent to Gemini</strong>.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <Trash2 className="w-4 h-4 mt-0.5 text-[var(--color-accent)] shrink-0" />
            <p>
              You can <strong className="text-[var(--color-text-primary)]">delete everything</strong> at any time.
              Nothing persists after you close the tab.
            </p>
          </div>
        </div>

        <p className="mt-5 text-xs text-[var(--color-text-muted)] bg-[var(--color-surface-overlay)] rounded-lg p-3">
          By continuing, I confirm I'm uploading my own photo or have the person's permission. I understand
          the result is an AI preview, not a measurement — fit and appearance are not guaranteed.
        </p>

        <button
          onClick={handleAccept}
          className="mt-6 w-full py-3 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-surface)] font-semibold text-sm transition-colors cursor-pointer"
          id="consent-accept-btn"
        >
          I understand — let's try it on
        </button>
      </div>
    </div>
  );
}
