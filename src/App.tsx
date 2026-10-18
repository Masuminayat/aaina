/**
 * Aaina (آئینہ) — Main Application
 * "See it on you before you buy it"
 */
import { useCallback, useRef, useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, Wand2, Download, RotateCcw, Trash2, ChevronDown, Zap, Info } from 'lucide-react';
import { useAppStore } from './store/app-store';
import { ImageUpload } from './components/ImageUpload';
import { StatusIndicator } from './components/StatusIndicator';
import { ConsentGate } from './components/ConsentGate';
import { idmVtonProvider } from './engines/studio/idm-vton';
import type { TryOnStatus } from './types/providers';

function LandingSection() {
  const setStep = useAppStore((s) => s.setStep);
  const consentGiven = useAppStore((s) => s.consentGiven);

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-accent)] opacity-[0.04] rounded-full blur-[120px] pointer-events-none" />

      <div className="text-center max-w-2xl mx-auto animate-[fade-in_0.6s_ease-out] relative z-10">
        {/* Logo */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-accent-muted)] border border-[var(--color-accent)]/20 mb-8">
          <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />
          <span className="text-sm font-medium text-[var(--color-accent)]">AI Virtual Try-On</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight font-[family-name:var(--font-display)]">
          <span className="text-[var(--color-text-primary)]">Aaina</span>
          <span className="text-[var(--color-accent)] ml-3">آئینہ</span>
        </h1>

        <p className="mt-4 text-xl sm:text-2xl text-[var(--color-text-secondary)] font-light">
          See it on you before you buy it
        </p>

        <p className="mt-6 text-sm text-[var(--color-text-muted)] max-w-md mx-auto leading-relaxed">
          Upload your photo and any clothing item. Our AI shows you wearing it
          instantly — no sign-up, no cost, your photos stay private.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => setStep(consentGiven ? 'person' : 'landing')}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-surface)] font-semibold transition-all hover:shadow-[var(--shadow-glow)] cursor-pointer"
            id="start-btn"
          >
            Try it now
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* How it works */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          {[
            { step: '1', title: 'Upload your photo', desc: 'Take or upload a full-body photo of yourself' },
            { step: '2', title: 'Pick a product', desc: 'Upload any clothing or accessory image' },
            { step: '3', title: 'See the result', desc: 'AI generates you wearing the product' },
          ].map((item) => (
            <div key={item.step} className="p-5 rounded-xl bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)]">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-accent-muted)] flex items-center justify-center text-sm font-bold text-[var(--color-accent)] mb-3">
                {item.step}
              </div>
              <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">{item.title}</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-center gap-1 text-xs text-[var(--color-text-muted)]">
          <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
          <span>Scroll for samples</span>
        </div>
      </div>

      {/* Sample gallery */}
      <SampleGallery />
    </div>
  );
}

function SampleGallery() {
  const setStep = useAppStore((s) => s.setStep);
  const setPersonImage = useAppStore((s) => s.setPersonImage);
  const setProductImage = useAppStore((s) => s.setProductImage);
  const consentGiven = useAppStore((s) => s.consentGiven);
  const setConsentGiven = useAppStore((s) => s.setConsentGiven);

  const loadSample = async () => {
    try {
      // Load sample person image
      const personResp = await fetch('/demo-assets/sample outfit 1.jpeg');
      const personBlob = await personResp.blob();
      setPersonImage(personBlob);

      // Load sample garment image
      const garmentResp = await fetch('/demo-assets/sample shirt 1.jpeg');
      const garmentBlob = await garmentResp.blob();
      setProductImage(garmentBlob);

      if (!consentGiven) setConsentGiven(true);
      setStep('product');
    } catch (e) {
      console.error('Failed to load sample:', e);
    }
  };

  return (
    <div className="mt-16 max-w-2xl mx-auto w-full">
      <div className="text-center mb-6">
        <span className="text-xs px-3 py-1 rounded-full bg-[var(--color-sand-800)]/30 text-[var(--color-sand-400)] border border-[var(--color-sand-700)]/30">
          Sample
        </span>
      </div>
      <button
        onClick={loadSample}
        className="w-full p-4 rounded-xl bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] hover:border-[var(--color-accent)]/40 transition-colors cursor-pointer text-left"
        id="load-sample-btn"
      >
        <div className="flex items-center gap-4">
          <Zap className="w-5 h-5 text-[var(--color-accent)]" />
          <div>
            <p className="font-medium text-[var(--color-text-primary)]">Try with sample images</p>
            <p className="text-sm text-[var(--color-text-secondary)]">See a quick demo without uploading your own photos</p>
          </div>
          <ArrowRight className="w-4 h-4 text-[var(--color-text-muted)] ml-auto" />
        </div>
      </button>
    </div>
  );
}

function PersonStep() {
  const personImageUrl = useAppStore((s) => s.personImageUrl);
  const setPersonImage = useAppStore((s) => s.setPersonImage);
  const clearPersonImage = useAppStore((s) => s.clearPersonImage);
  const setStep = useAppStore((s) => s.setStep);

  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-[fade-in_0.3s_ease-out]">
      <StepHeader number={1} title="Upload your photo" subtitle="A clear, full-body photo works best" />

      <div className="mt-6">
        <ImageUpload
          id="person-upload"
          label="Your photo"
          hint="Full-body photo, facing forward, good lighting"
          currentImageUrl={personImageUrl}
          onImageSelected={setPersonImage}
          onClear={clearPersonImage}
        />
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => setStep('landing')}
          className="flex-1 py-3 rounded-xl bg-[var(--color-surface-overlay)] hover:bg-[var(--color-border-subtle)] text-[var(--color-text-secondary)] font-medium text-sm transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 inline mr-1" />
          Back
        </button>
        <button
          onClick={() => setStep('product')}
          disabled={!personImageUrl}
          className="flex-1 py-3 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-surface)] font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          id="to-product-btn"
        >
          Next
          <ArrowRight className="w-4 h-4 inline ml-1" />
        </button>
      </div>
    </div>
  );
}

function ProductStep() {
  const productImageUrl = useAppStore((s) => s.productImageUrl);
  const setProductImage = useAppStore((s) => s.setProductImage);
  const clearProductImage = useAppStore((s) => s.clearProductImage);
  const personImageUrl = useAppStore((s) => s.personImageUrl);
  const personImage = useAppStore((s) => s.personImage);
  const productImage = useAppStore((s) => s.productImage);
  const setStep = useAppStore((s) => s.setStep);
  const setTryOnStatus = useAppStore((s) => s.setTryOnStatus);
  const setTryOnResult = useAppStore((s) => s.setTryOnResult);
  const hfToken = useAppStore((s) => s.hfToken);

  const abortRef = useRef<AbortController | null>(null);

  const handleTryOn = useCallback(async () => {
    if (!personImage || !productImage) return;

    abortRef.current = new AbortController();
    setStep('processing');
    setTryOnResult(null);

    try {
      const result = await idmVtonProvider.run(
        {
          personImage,
          garmentImage: productImage,
          garmentDescription: 'a clothing garment',
          category: 'upper',
          hfToken: hfToken || undefined,
        },
        (status: TryOnStatus) => setTryOnStatus(status),
        abortRef.current.signal,
      );

      setTryOnResult(result);
      setStep('result');
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setStep('product');
        return;
      }
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setTryOnStatus({
        stage: 'error',
        message: msg,
        retryable: true,
        isQuota: /quota|ZeroGPU/i.test(msg),
      });
      setStep('processing');
    }
  }, [personImage, productImage, hfToken, setStep, setTryOnStatus, setTryOnResult]);

  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-[fade-in_0.3s_ease-out]">
      <StepHeader number={2} title="Add the product" subtitle="Upload the clothing or accessory you want to try" />

      {/* Show person thumbnail */}
      {personImageUrl && (
        <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)]">
          <img src={personImageUrl} alt="Your photo" className="w-12 h-12 rounded-lg object-cover" />
          <div className="flex-1">
            <p className="text-sm font-medium text-[var(--color-text-primary)]">Your photo</p>
            <p className="text-xs text-[var(--color-text-secondary)]">Ready</p>
          </div>
          <button
            onClick={() => setStep('person')}
            className="text-xs text-[var(--color-accent)] hover:underline cursor-pointer"
          >
            Change
          </button>
        </div>
      )}

      <div className="mt-4">
        <ImageUpload
          id="product-upload"
          label="Product image"
          hint="A clear photo of the garment on a white/plain background"
          currentImageUrl={productImageUrl}
          onImageSelected={setProductImage}
          onClear={clearProductImage}
        />
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => setStep('person')}
          className="flex-1 py-3 rounded-xl bg-[var(--color-surface-overlay)] hover:bg-[var(--color-border-subtle)] text-[var(--color-text-secondary)] font-medium text-sm transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 inline mr-1" />
          Back
        </button>
        <button
          onClick={handleTryOn}
          disabled={!productImageUrl || !personImageUrl}
          className="flex-1 py-3 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-surface)] font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer inline-flex items-center justify-center gap-2"
          id="try-on-btn"
        >
          <Wand2 className="w-4 h-4" />
          Try it on
        </button>
      </div>
    </div>
  );
}

function ProcessingStep() {
  const tryOnStatus = useAppStore((s) => s.tryOnStatus);
  const setStep = useAppStore((s) => s.setStep);

  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-[fade-in_0.3s_ease-out]">
      <StepHeader number={3} title="Creating your look" subtitle="This takes 30–90 seconds on free GPU" />

      <div className="mt-6 space-y-4">
        {tryOnStatus && <StatusIndicator status={tryOnStatus} />}

        {tryOnStatus?.stage === 'error' && (
          <div className="flex gap-3">
            <button
              onClick={() => setStep('product')}
              className="flex-1 py-3 rounded-xl bg-[var(--color-surface-overlay)] hover:bg-[var(--color-border-subtle)] text-[var(--color-text-secondary)] font-medium text-sm transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 inline mr-1" />
              Go back
            </button>
            {'retryable' in tryOnStatus && tryOnStatus.retryable && (
              <button
                onClick={() => setStep('product')}
                className="flex-1 py-3 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-surface)] font-semibold text-sm transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Retry
              </button>
            )}
          </div>
        )}
      </div>

      {/* Under the hood preview */}
      <div className="mt-8 p-4 rounded-xl bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)]">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-[var(--color-text-muted)]" />
          <span className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">Under the hood</span>
        </div>
        <div className="space-y-2 text-xs text-[var(--color-text-secondary)]">
          <div className="flex justify-between">
            <span>Image preprocessing</span>
            <span className="text-[var(--color-text-muted)]">On-device ✓</span>
          </div>
          <div className="flex justify-between">
            <span>Virtual try-on (IDM-VTON)</span>
            <span className="text-[var(--color-text-muted)]">HF Space (ZeroGPU)</span>
          </div>
          <div className="flex justify-between">
            <span>Your photo sent to cloud?</span>
            <span className="text-yellow-400">Yes (HF Space only)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultStep() {
  const tryOnResult = useAppStore((s) => s.tryOnResult);
  const personImageUrl = useAppStore((s) => s.personImageUrl);
  const setStep = useAppStore((s) => s.setStep);
  const resetAll = useAppStore((s) => s.resetAll);

  const [showCompare, setShowCompare] = useState(false);
  const [comparePosition, setComparePosition] = useState(50);

  const handleDownload = useCallback(() => {
    if (!tryOnResult?.imageUrl) return;

    // Create watermarked version
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);

      // Watermark
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, img.height - 36, img.width, 36);
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Aaina · AI preview — not a real photograph', img.width / 2, img.height - 14);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'aaina-try-on.png';
        a.click();
        URL.revokeObjectURL(url);
      }, 'image/png');
    };
    img.src = tryOnResult.imageUrl;
  }, [tryOnResult]);

  if (!tryOnResult) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-[fade-in_0.4s_ease-out]">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold font-[family-name:var(--font-display)]">Your look is ready</h2>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Generated in {Math.round(tryOnResult.latencyMs / 1000)}s · AI preview
        </p>
      </div>

      {/* Result image with compare slider */}
      <div className="relative rounded-2xl overflow-hidden border border-[var(--color-border-subtle)] bg-black/20">
        {showCompare && personImageUrl ? (
          <div
            className="relative select-none"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setComparePosition(((e.clientX - rect.left) / rect.width) * 100);
            }}
            onTouchMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const touch = e.touches[0];
              setComparePosition(((touch.clientX - rect.left) / rect.width) * 100);
            }}
          >
            <img src={tryOnResult.imageUrl} alt="Try-on result" className="w-full" />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - comparePosition}% 0 0)` }}
            >
              <img src={personImageUrl} alt="Original photo" className="w-full h-full object-cover" />
            </div>
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
              style={{ left: `${comparePosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                <span className="text-[var(--color-surface)] text-xs font-bold">⇔</span>
              </div>
            </div>
          </div>
        ) : (
          <img src={tryOnResult.imageUrl} alt="Try-on result" className="w-full" />
        )}

        {/* AI-generated label */}
        <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm text-[10px] text-white/80">
          AI-generated preview
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setShowCompare(!showCompare)}
          className="py-2.5 rounded-xl bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] hover:border-[var(--color-accent)]/40 text-sm font-medium transition-colors cursor-pointer"
          id="compare-btn"
        >
          {showCompare ? 'Hide compare' : 'Compare'}
        </button>
        <button
          onClick={handleDownload}
          className="py-2.5 rounded-xl bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] hover:border-[var(--color-accent)]/40 text-sm font-medium transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
          id="download-btn"
        >
          <Download className="w-3.5 h-3.5" />
          Download
        </button>
        <button
          onClick={() => setStep('product')}
          className="py-2.5 rounded-xl bg-[var(--color-accent-muted)] border border-[var(--color-accent)]/20 text-[var(--color-accent)] text-sm font-medium transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
          id="try-another-btn"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Try another
        </button>
        <button
          onClick={() => { resetAll(); setStep('landing'); }}
          className="py-2.5 rounded-xl bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] hover:border-red-500/40 text-sm font-medium text-[var(--color-text-secondary)] hover:text-red-400 transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
          id="delete-all-btn"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete all
        </button>
      </div>

      {/* Under the hood */}
      <div className="mt-8 p-4 rounded-xl bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)]">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-[var(--color-text-muted)]" />
          <span className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">Under the hood</span>
        </div>
        <div className="space-y-2 text-xs text-[var(--color-text-secondary)]">
          <div className="flex justify-between">
            <span>Provider</span>
            <span>{tryOnResult.providerId}</span>
          </div>
          <div className="flex justify-between">
            <span>Latency</span>
            <span>{Math.round(tryOnResult.latencyMs / 1000)}s</span>
          </div>
          <div className="flex justify-between">
            <span>Image preprocessing</span>
            <span className="text-green-400">On-device ✓</span>
          </div>
          <div className="flex justify-between">
            <span>Try-on generation</span>
            <span>Hugging Face Space (ZeroGPU)</span>
          </div>
          <div className="flex justify-between">
            <span>Your photo sent to cloud?</span>
            <span className="text-yellow-400">Yes — HF Space only, not stored</span>
          </div>
          <div className="flex justify-between">
            <span>Model licence</span>
            <span>CC BY-NC-SA 4.0 (non-commercial)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepHeader({ number, title, subtitle }: { number: number; title: string; subtitle: string }) {
  return (
    <div>
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-accent-muted)] border border-[var(--color-accent)]/20 text-xs font-medium text-[var(--color-accent)] mb-3">
        Step {number}
      </div>
      <h2 className="text-2xl font-bold font-[family-name:var(--font-display)]">{title}</h2>
      <p className="text-sm text-[var(--color-text-secondary)] mt-1">{subtitle}</p>
    </div>
  );
}

function AppHeader() {
  const step = useAppStore((s) => s.step);
  const resetAll = useAppStore((s) => s.resetAll);
  const setStep = useAppStore((s) => s.setStep);

  if (step === 'landing') return null;

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-surface)]/80 backdrop-blur-xl border-b border-[var(--color-border-subtle)]">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <button
          onClick={() => { resetAll(); setStep('landing'); }}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />
          <span className="font-semibold font-[family-name:var(--font-display)]">Aaina</span>
        </button>

        <div className="flex items-center gap-1.5">
          {['person', 'product', 'result'].map((s, i) => (
            <div
              key={s}
              className={`w-2 h-2 rounded-full transition-colors ${
                step === s || (step === 'processing' && s === 'product')
                  ? 'bg-[var(--color-accent)]'
                  : i < ['person', 'product', 'result'].indexOf(step === 'processing' ? 'product' : step)
                    ? 'bg-[var(--color-accent)]/40'
                    : 'bg-[var(--color-border-default)]'
              }`}
            />
          ))}
        </div>
      </div>
    </header>
  );
}

export default function App() {
  const step = useAppStore((s) => s.step);
  const consentGiven = useAppStore((s) => s.consentGiven);

  return (
    <div className="min-h-[100dvh]">
      <AppHeader />

      {step === 'landing' && !consentGiven && <LandingSection />}
      {step === 'landing' && consentGiven && <LandingSection />}
      {step === 'person' && !consentGiven && <ConsentGate />}
      {step === 'person' && consentGiven && <PersonStep />}
      {step === 'product' && <ProductStep />}
      {step === 'processing' && <ProcessingStep />}
      {step === 'result' && <ResultStep />}

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-[var(--color-text-muted)]">
        <p>Aaina (آئینہ) · AI Virtual Try-On · NYLP AI Hackathon 2026</p>
        <p className="mt-1">Results are AI-generated previews. Not a measurement or guarantee of fit.</p>
      </footer>
    </div>
  );
}
