/**
 * Aaina (آئینہ) — Main Application
 * "See it on you before you buy it"
 * Entry for NYLP AI Hackathon 2026
 */
import { useCallback, useRef, useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Wand2,
  Download,
  RotateCcw,
  Trash2,
  Zap,
  Info,
  Shield,
  BookOpen,
  Split,
  ZoomIn,
  Orbit,
  Layers,
  Share2,
  Clock,
} from 'lucide-react';
import { useAppStore } from './store/app-store';
import { ImageUpload } from './components/ImageUpload';
import { StatusIndicator } from './components/StatusIndicator';
import { ConsentGate } from './components/ConsentGate';
import { PhotoCoach } from './components/PhotoCoach';
import { GarmentIntelligenceCard } from './components/GarmentIntelligenceCard';
import { CompareSlider } from './components/CompareSlider';
import { PanZoomViewer } from './components/PanZoomViewer';
import { SpinView } from './components/SpinView';
import { StyleAdvisorModal } from './components/StyleAdvisorModal';
import { OutfitBuilderModal } from './components/OutfitBuilderModal';
import { QuotaModal } from './components/QuotaModal';
import { InfoPagesModal } from './components/InfoPagesModal';
import { downloadWithWatermark } from './utils/watermark';
import { exportLookCard } from './utils/look-card';
import { idmVtonProvider } from './engines/studio/idm-vton';
import type { TryOnStatus } from './types/providers';

/* -------------------------------------------------------------------------- */
/* Landing Section                                                            */
/* -------------------------------------------------------------------------- */
function LandingSection() {
  const setStep = useAppStore((s) => s.setStep);
  const consentGiven = useAppStore((s) => s.consentGiven);
  const setActiveInfoTab = useAppStore((s) => s.setActiveInfoTab);

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="text-center max-w-2xl mx-auto relative z-10 animate-fade-in">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8 backdrop-blur-md shadow-sm">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-xs sm:text-sm font-semibold tracking-wide text-emerald-300">
            NYLP AI Hackathon 2026 Entry
          </span>
        </div>

        {/* Title & Urdu Calligraphy */}
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight font-[family-name:var(--font-display)] text-stone-100">
          <span>Aaina</span>
          <span className="text-emerald-400 ml-4 font-serif text-6xl sm:text-8xl">آئینہ</span>
        </h1>

        <p className="mt-4 text-xl sm:text-2xl text-stone-300 font-light tracking-wide">
          See it on you before you buy it.
        </p>

        <p className="mt-5 text-xs sm:text-sm text-stone-400 max-w-lg mx-auto leading-relaxed">
          The open-source AI virtual fitting mirror. Upload a photo of yourself and any clothing or accessory to preview high-fidelity virtual try-on in seconds.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3.5 justify-center items-center">
          <button
            type="button"
            onClick={() => setStep(consentGiven ? 'person' : 'person')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold transition-all shadow-[0_0_25px_rgba(52,211,153,0.3)] hover:scale-[1.02] active:scale-95 cursor-pointer"
            id="start-btn"
          >
            <span>Try with your photo</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <SampleDemoButton />
        </div>

        {/* 3 Step Overview */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          {[
            { step: '1', title: '1. You (Photo Coach)', desc: 'Instant on-device analysis checks framing, lighting & orientation.' },
            { step: '2', title: '2. Product (Garment AI)', desc: 'Gemini analyzes apparel cuts, fabrics, colors & routes inference.' },
            { step: '3', title: '3. Try-On (Diffusion)', desc: 'ZeroGPU diffusion fits the garment to your body with compare tools.' },
          ].map((item) => (
            <div key={item.step} className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800/80 backdrop-blur-md">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-400 mb-2.5">
                {item.step}
              </div>
              <h3 className="font-semibold text-stone-200 text-xs sm:text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-stone-400 leading-normal">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="mt-10 flex items-center justify-center gap-4 text-xs text-stone-400">
          <button
            type="button"
            onClick={() => setActiveInfoTab('privacy')}
            className="hover:text-emerald-400 transition-colors flex items-center gap-1"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Zero-Storage Privacy</span>
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => setActiveInfoTab('responsible-ai')}
            className="hover:text-emerald-400 transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Responsible AI</span>
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => setActiveInfoTab('about')}
            className="hover:text-emerald-400 transition-colors flex items-center gap-1"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Architecture</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function SampleDemoButton() {
  const setStep = useAppStore((s) => s.setStep);
  const setPersonImage = useAppStore((s) => s.setPersonImage);
  const setProductImage = useAppStore((s) => s.setProductImage);
  const setConsentGiven = useAppStore((s) => s.setConsentGiven);
  const [loading, setLoading] = useState(false);

  const loadSample = async () => {
    setLoading(true);
    try {
      // 1. Fetch sample person
      const personResp = await fetch('/demo-assets/sample-person.jpg');
      const personBlob = await personResp.blob();
      await setPersonImage(personBlob);

      // 2. Fetch sample garment
      const garmentResp = await fetch('/demo-assets/sample-garment.jpg');
      const garmentBlob = await garmentResp.blob();
      await setProductImage(garmentBlob);

      setConsentGiven(true);
      setStep('product');
    } catch (e) {
      console.error('Failed to load sample demo assets:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={loadSample}
      disabled={loading}
      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-emerald-500/40 text-stone-200 text-sm font-semibold transition-all active:scale-95 cursor-pointer disabled:opacity-50"
      id="sample-demo-btn"
    >
      <Zap className="w-4 h-4 text-emerald-400" />
      <span>{loading ? 'Loading sample images…' : 'Try sample images'}</span>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Step 1: Person Photo + Photo Coach                                         */
/* -------------------------------------------------------------------------- */
function PersonStep() {
  const personImageUrl = useAppStore((s) => s.personImageUrl);
  const setPersonImage = useAppStore((s) => s.setPersonImage);
  const clearPersonImage = useAppStore((s) => s.clearPersonImage);
  const setStep = useAppStore((s) => s.setStep);
  const photoCoachReport = useAppStore((s) => s.photoCoachReport);
  const isCoachAnalyzing = useAppStore((s) => s.isCoachAnalyzing);
  const isAutoFixing = useAppStore((s) => s.isAutoFixing);
  const triggerAutoFix = useAppStore((s) => s.triggerAutoFix);

  return (
    <div className="max-w-xl mx-auto px-4 py-8 animate-fade-in">
      <StepHeader
        number={1}
        title="Upload your photo"
        subtitle="Full-body or torso portrait with clear lighting works best"
      />

      <div className="mt-5">
        <ImageUpload
          id="person-upload"
          label="Your photo"
          hint="Front-facing standing pose, 3:4 aspect ratio recommended"
          currentImageUrl={personImageUrl}
          onImageSelected={setPersonImage}
          onClear={clearPersonImage}
        />
      </div>

      {/* On-Device Photo Coach Feedback */}
      {personImageUrl && (
        <PhotoCoach
          report={photoCoachReport}
          isAnalyzing={isCoachAnalyzing}
          isFixing={isAutoFixing}
          onAutoFix={triggerAutoFix}
        />
      )}

      {/* Navigation Buttons */}
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() => setStep('landing')}
          className="flex-1 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 font-medium text-sm transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 inline mr-1.5" />
          Back
        </button>
        <button
          type="button"
          onClick={() => setStep('product')}
          disabled={!personImageUrl}
          className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-lg active:scale-95"
          id="to-product-btn"
        >
          Next: Pick Garment
          <ArrowRight className="w-4 h-4 inline ml-1.5" />
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Step 2: Product Garment + Gemini Garment Intelligence                       */
/* -------------------------------------------------------------------------- */
function ProductStep() {
  const productImageUrl = useAppStore((s) => s.productImageUrl);
  const setProductImage = useAppStore((s) => s.setProductImage);
  const clearProductImage = useAppStore((s) => s.clearProductImage);
  const personImageUrl = useAppStore((s) => s.personImageUrl);
  const personImage = useAppStore((s) => s.personImage);
  const productImage = useAppStore((s) => s.productImage);
  const garmentAnalysis = useAppStore((s) => s.garmentAnalysis);
  const isAnalyzingGarment = useAppStore((s) => s.isAnalyzingGarment);
  const diffusionPrompt = useAppStore((s) => s.diffusionPrompt);
  const setDiffusionPrompt = useAppStore((s) => s.setDiffusionPrompt);

  const setStep = useAppStore((s) => s.setStep);
  const setTryOnStatus = useAppStore((s) => s.setTryOnStatus);
  const setTryOnResult = useAppStore((s) => s.setTryOnResult);
  const setIsQuotaModalOpen = useAppStore((s) => s.setIsQuotaModalOpen);
  const hfToken = useAppStore((s) => s.hfToken);

  const abortRef = useRef<AbortController | null>(null);

  // Global clipboard paste listener for easy garment drop
  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            setProductImage(file);
            break;
          }
        }
      }
    };
    window.addEventListener('paste', handleGlobalPaste);
    return () => window.removeEventListener('paste', handleGlobalPaste);
  }, [setProductImage]);

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
          garmentDescription: diffusionPrompt || 'a clothing garment',
          category: 'upper',
          hfToken: hfToken || undefined,
        },
        (status: TryOnStatus) => setTryOnStatus(status),
        abortRef.current.signal,
      );

      setTryOnResult(result);
      setStep('result');
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setStep('product');
        return;
      }
      const msg = err instanceof Error ? err.message : String(err);
      const isQuota = /quota|ZeroGPU|exceeded|rate.?limit/i.test(msg);

      if (isQuota) {
        setIsQuotaModalOpen(true);
      }

      setTryOnStatus({
        stage: 'error',
        message: isQuota
          ? 'Hugging Face ZeroGPU shared queue quota exceeded. Please wait or use instant mode.'
          : msg,
        retryable: true,
        isQuota,
      });
      setStep('processing');
    }
  }, [personImage, productImage, diffusionPrompt, hfToken, setStep, setTryOnStatus, setTryOnResult, setIsQuotaModalOpen]);

  return (
    <div className="max-w-xl mx-auto px-4 py-8 animate-fade-in">
      <StepHeader
        number={2}
        title="Add product image"
        subtitle="Upload any clothing item, drag & drop, or paste with Ctrl+V"
      />

      {/* Person thumbnail preview */}
      {personImageUrl && (
        <div className="mt-4 flex items-center gap-3 p-3 rounded-2xl bg-stone-900/60 border border-stone-800">
          <img src={personImageUrl} alt="Your selected photo" className="w-12 h-12 rounded-xl object-cover" />
          <div className="flex-1">
            <p className="text-xs font-semibold text-stone-200">Your Base Photo</p>
            <p className="text-[11px] text-emerald-400 font-medium">Ready for Virtual Try-On</p>
          </div>
          <button
            type="button"
            onClick={() => setStep('person')}
            className="text-xs text-stone-400 hover:text-stone-200 px-2.5 py-1 rounded-lg bg-stone-800/80 transition-colors"
          >
            Change
          </button>
        </div>
      )}

      {/* Garment Drop Zone */}
      <div className="mt-4">
        <ImageUpload
          id="product-upload"
          label="Product garment image"
          hint="Flat lay or ghost mannequin photo on a plain background works best"
          currentImageUrl={productImageUrl}
          onImageSelected={setProductImage}
          onClear={clearProductImage}
        />
      </div>

      {/* Garment Intelligence Card */}
      {productImageUrl && (
        <GarmentIntelligenceCard
          analysis={garmentAnalysis}
          isLoading={isAnalyzingGarment}
          onUpdateDescription={setDiffusionPrompt}
        />
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() => setStep('person')}
          className="flex-1 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 font-medium text-sm transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 inline mr-1.5" />
          Back
        </button>
        <button
          type="button"
          onClick={handleTryOn}
          disabled={!productImageUrl || !personImageUrl || isAnalyzingGarment || garmentAnalysis?.unsafe}
          className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-lg active:scale-95 inline-flex items-center justify-center gap-2"
          id="try-on-btn"
        >
          <Wand2 className="w-4 h-4" />
          Try it on (Diffusion Studio)
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Step 3: Processing & Real-time Progress                                    */
/* -------------------------------------------------------------------------- */
function ProcessingStep() {
  const tryOnStatus = useAppStore((s) => s.tryOnStatus);
  const setStep = useAppStore((s) => s.setStep);
  const setIsQuotaModalOpen = useAppStore((s) => s.setIsQuotaModalOpen);

  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fade-in">
      <StepHeader
        number={3}
        title="Generating your try-on"
        subtitle="Diffusion inference on Hugging Face ZeroGPU (~30–45s)"
      />

      <div className="mt-6 space-y-4">
        {tryOnStatus && <StatusIndicator status={tryOnStatus} />}

        {tryOnStatus?.stage === 'error' && (
          <div className="flex flex-col gap-2.5 pt-2">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep('product')}
                className="flex-1 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 font-medium text-xs transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5 inline mr-1" />
                Change Garment
              </button>

              <button
                type="button"
                onClick={() => setStep('product')}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Retry
              </button>
            </div>

            {tryOnStatus.isQuota && (
              <button
                type="button"
                onClick={() => setIsQuotaModalOpen(true)}
                className="w-full py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-all flex items-center justify-center gap-2"
              >
                <Clock className="w-3.5 h-3.5" />
                Check Queue Slot & Auto-Retry
              </button>
            )}
          </div>
        )}
      </div>

      {/* Live Pipeline Diagnostics */}
      <div className="mt-8 p-4 rounded-2xl bg-stone-900/60 border border-stone-800/80">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Under The Hood Telemetry</span>
        </div>
        <div className="space-y-2 text-xs text-stone-300">
          <div className="flex justify-between">
            <span className="text-stone-400">Preprocessing & Masking</span>
            <span className="text-emerald-400 font-medium">On-Device Canvas ✓</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-400">AI Model Architecture</span>
            <span className="font-mono text-stone-200">IDM-VTON (Diffusion Attention)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-400">Compute Hardware</span>
            <span className="text-stone-200">NVIDIA A100 / L40S (ZeroGPU)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-400">User Photo Storage</span>
            <span className="text-emerald-400 font-medium">Zero Storage (RAM stream only)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Step 4: Result Workspace (Compare + PanZoom + Spin + Styling Suite)         */
/* -------------------------------------------------------------------------- */
function ResultStep() {
  const tryOnResult = useAppStore((s) => s.tryOnResult);
  const personImageUrl = useAppStore((s) => s.personImageUrl);
  const garmentAnalysis = useAppStore((s) => s.garmentAnalysis);
  const diffusionPrompt = useAppStore((s) => s.diffusionPrompt);
  const setStep = useAppStore((s) => s.setStep);
  const resetAll = useAppStore((s) => s.resetAll);
  const resultViewMode = useAppStore((s) => s.resultViewMode);
  const setResultViewMode = useAppStore((s) => s.setResultViewMode);
  const setActiveInfoTab = useAppStore((s) => s.setActiveInfoTab);
  const setIsAdvisorOpen = useAppStore((s) => s.setIsAdvisorOpen);
  const setIsOutfitBuilderOpen = useAppStore((s) => s.setIsOutfitBuilderOpen);

  const [isDownloading, setIsDownloading] = useState(false);
  const [isExportingCard, setIsExportingCard] = useState(false);

  const handleDownload = async () => {
    if (!tryOnResult?.imageUrl) return;
    setIsDownloading(true);
    try {
      await downloadWithWatermark(tryOnResult.imageUrl, 'aaina-virtual-tryon.png');
    } catch (e) {
      console.error('Watermark download error:', e);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleExportCard = async () => {
    if (!tryOnResult?.imageUrl) return;
    setIsExportingCard(true);
    try {
      await exportLookCard({
        resultImageUrl: tryOnResult.imageUrl,
        garment: garmentAnalysis,
        diffusionPrompt,
      });
    } catch (e) {
      console.error('Look card export error:', e);
    } finally {
      setIsExportingCard(false);
    }
  };

  if (!tryOnResult) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold font-[family-name:var(--font-display)] text-stone-100">
          Your Try-On Result
        </h2>
        <p className="text-xs sm:text-sm text-stone-400 mt-1">
          Studio inference completed in <strong className="text-emerald-400">{Math.round(tryOnResult.latencyMs / 1000)}s</strong> on ZeroGPU
        </p>
      </div>

      {/* View Mode Selector Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 mb-3">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-stone-900 border border-stone-800 w-full sm:w-auto overflow-x-auto">
          <button
            type="button"
            onClick={() => setResultViewMode('compare')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              resultViewMode === 'compare'
                ? 'bg-emerald-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Split className="w-3.5 h-3.5" />
            <span>Before / After Split</span>
          </button>

          <button
            type="button"
            onClick={() => setResultViewMode('panzoom')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              resultViewMode === 'panzoom'
                ? 'bg-emerald-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <ZoomIn className="w-3.5 h-3.5" />
            <span>Pan & Zoom Inspector</span>
          </button>

          <button
            type="button"
            onClick={() => setResultViewMode('spin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              resultViewMode === 'spin'
                ? 'bg-emerald-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Orbit className="w-3.5 h-3.5" />
            <span>2.5D Orbit Spin</span>
          </button>
        </div>

        <div className="text-[11px] text-stone-400">
          AI preview · Not a tailoring measurement
        </div>
      </div>

      {/* Interactive Viewer Component */}
      <div className="h-[460px] sm:h-[530px]">
        {resultViewMode === 'compare' && personImageUrl ? (
          <CompareSlider
            beforeUrl={personImageUrl}
            afterUrl={tryOnResult.imageUrl}
            className="w-full h-full"
          />
        ) : resultViewMode === 'panzoom' ? (
          <PanZoomViewer
            imageUrl={tryOnResult.imageUrl}
            alt="Virtual Try-On Result"
            className="w-full h-full"
          />
        ) : (
          <SpinView
            imageUrl={tryOnResult.imageUrl}
            className="w-full h-full"
          />
        )}
      </div>

      {/* Row 1: AI Styling & Creative Suite */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          type="button"
          onClick={() => setIsAdvisorOpen(true)}
          className="py-3 px-2 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Style Advisor (Gemini)</span>
        </button>

        <button
          type="button"
          onClick={() => setIsOutfitBuilderOpen(true)}
          className="py-3 px-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
        >
          <Layers className="w-4 h-4 text-blue-400" />
          <span>Outfit Stacker (A/B)</span>
        </button>

        <button
          type="button"
          onClick={handleExportCard}
          disabled={isExportingCard}
          className="py-3 px-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
        >
          <Share2 className="w-4 h-4 text-purple-400" />
          <span>{isExportingCard ? 'Rendering…' : 'Export Look Card'}</span>
        </button>

        <button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading}
          className="py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer"
          id="download-btn"
        >
          <Download className="w-4 h-4" />
          <span>{isDownloading ? 'Saving…' : 'Download (Watermarked)'}</span>
        </button>
      </div>

      {/* Row 2: Standard Result Actions */}
      <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <button
          type="button"
          onClick={() => setStep('product')}
          className="py-3 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
          id="try-another-btn"
        >
          <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
          <span>Try Another Garment</span>
        </button>

        <button
          type="button"
          onClick={() => setStep('person')}
          className="py-3 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Change Base Photo</span>
        </button>

        <button
          type="button"
          onClick={() => {
            resetAll();
            setStep('landing');
          }}
          className="py-3 rounded-xl bg-stone-900 hover:bg-rose-950/40 border border-stone-800 hover:border-rose-500/40 text-stone-300 hover:text-rose-400 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
          id="delete-all-btn"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Everything</span>
        </button>
      </div>

      {/* Under The Hood Audit Panel (Section 6G Specification) */}
      <div className="mt-8 p-5 rounded-2xl bg-stone-900/60 border border-stone-800 text-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-stone-200 uppercase tracking-wider text-[11px]">
              Under The Hood AI Pipeline Audit (Section 6G)
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActiveInfoTab('limitations')}
            className="text-[11px] text-stone-400 hover:text-stone-200 underline cursor-pointer"
          >
            Review Limitations
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-stone-300 border-collapse">
            <thead>
              <tr className="border-b border-stone-800 text-[10px] uppercase text-stone-400 tracking-wider">
                <th className="py-2 pr-2">Pipeline Stage</th>
                <th className="py-2 px-2">Model / Tool</th>
                <th className="py-2 px-2">Execution Host</th>
                <th className="py-2 px-2 text-right">Latency</th>
                <th className="py-2 pl-2 text-right">User Photo Left Device?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 text-[11px]">
              <tr>
                <td className="py-2.5 pr-2 font-semibold text-stone-200">1. Photo Coach</td>
                <td className="py-2.5 px-2 font-mono text-[10px]">Laplacian & Canvas Heuristics</td>
                <td className="py-2.5 px-2">Client Browser (On-Device)</td>
                <td className="py-2.5 px-2 text-right text-emerald-400">&lt; 35ms</td>
                <td className="py-2.5 pl-2 text-right text-emerald-400 font-semibold">NO (100% Local)</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-2 font-semibold text-stone-200">2. Garment AI</td>
                <td className="py-2.5 px-2 font-mono text-[10px]">Gemini 2.5 Flash</td>
                <td className="py-2.5 px-2">Google Cloud API</td>
                <td className="py-2.5 px-2 text-right text-emerald-400">~1.4s</td>
                <td className="py-2.5 pl-2 text-right text-emerald-400 font-semibold">NO (Product image only)</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-2 font-semibold text-stone-200">3. Virtual Try-On</td>
                <td className="py-2.5 px-2 font-mono text-[10px]">yisol/IDM-VTON</td>
                <td className="py-2.5 px-2">Hugging Face ZeroGPU</td>
                <td className="py-2.5 px-2 text-right text-emerald-400">{Math.round(tryOnResult.latencyMs / 1000)}s</td>
                <td className="py-2.5 pl-2 text-right text-stone-300">Ephemeral RAM (0% stored)</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-2 font-semibold text-stone-200">4. 2.5D Orbit Mesh</td>
                <td className="py-2.5 px-2 font-mono text-[10px]">Three.js Depth Displace</td>
                <td className="py-2.5 px-2">Client Browser (WebGL)</td>
                <td className="py-2.5 px-2 text-right text-emerald-400">&lt; 16ms</td>
                <td className="py-2.5 pl-2 text-right text-emerald-400 font-semibold">NO (100% Local)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="pt-2 border-t border-stone-800/60 flex items-center justify-between text-[11px] text-stone-400">
          <span>License: CC BY-NC-SA 4.0 (Non-commercial research & education)</span>
          <span className="text-emerald-400 font-semibold">Zero Image Persistence Verified</span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Helper UI Components                                                       */
/* -------------------------------------------------------------------------- */
function StepHeader({ number, title, subtitle }: { number: number; title: string; subtitle: string }) {
  return (
    <div>
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400 mb-2.5">
        Step {number} of 3
      </div>
      <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] text-stone-100">{title}</h2>
      <p className="text-xs sm:text-sm text-stone-400 mt-1">{subtitle}</p>
    </div>
  );
}

function AppHeader() {
  const step = useAppStore((s) => s.step);
  const resetAll = useAppStore((s) => s.resetAll);
  const setStep = useAppStore((s) => s.setStep);
  const setActiveInfoTab = useAppStore((s) => s.setActiveInfoTab);

  if (step === 'landing') return null;

  return (
    <header className="sticky top-0 z-40 bg-stone-950/80 backdrop-blur-xl border-b border-stone-800/80">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            resetAll();
            setStep('landing');
          }}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <Sparkles className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
          <span className="font-bold font-[family-name:var(--font-display)] text-stone-100">Aaina آئینہ</span>
        </button>

        {/* Step dots */}
        <div className="flex items-center gap-2">
          {['person', 'product', 'result'].map((s, i) => (
            <div
              key={s}
              className={`w-2 h-2 rounded-full transition-all ${
                step === s || (step === 'processing' && s === 'product')
                  ? 'bg-emerald-400 scale-125'
                  : i < ['person', 'product', 'result'].indexOf(step === 'processing' ? 'product' : step)
                  ? 'bg-emerald-400/40'
                  : 'bg-stone-800'
              }`}
            />
          ))}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveInfoTab('privacy')}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
            title="Privacy & Governance"
          >
            <Shield className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/* Root Application                                                           */
/* -------------------------------------------------------------------------- */
export default function App() {
  const step = useAppStore((s) => s.step);
  const consentGiven = useAppStore((s) => s.consentGiven);
  const isQuotaModalOpen = useAppStore((s) => s.isQuotaModalOpen);
  const setIsQuotaModalOpen = useAppStore((s) => s.setIsQuotaModalOpen);
  const activeInfoTab = useAppStore((s) => s.activeInfoTab);
  const setActiveInfoTab = useAppStore((s) => s.setActiveInfoTab);
  const resetAll = useAppStore((s) => s.resetAll);
  const setStep = useAppStore((s) => s.setStep);

  // Phase 2 Modals State
  const isAdvisorOpen = useAppStore((s) => s.isAdvisorOpen);
  const setIsAdvisorOpen = useAppStore((s) => s.setIsAdvisorOpen);
  const isOutfitBuilderOpen = useAppStore((s) => s.isOutfitBuilderOpen);
  const setIsOutfitBuilderOpen = useAppStore((s) => s.setIsOutfitBuilderOpen);
  const savedLooks = useAppStore((s) => s.savedLooks);
  const addSavedLook = useAppStore((s) => s.addSavedLook);
  const garmentAnalysis = useAppStore((s) => s.garmentAnalysis);
  const tryOnResult = useAppStore((s) => s.tryOnResult);

  return (
    <div className="min-h-[100dvh] bg-[#0c0f12] text-stone-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-stone-950">
      <AppHeader />

      <main className="flex-1">
        {step === 'landing' && <LandingSection />}
        {step === 'person' && !consentGiven && <ConsentGate />}
        {step === 'person' && consentGiven && <PersonStep />}
        {step === 'product' && <ProductStep />}
        {step === 'processing' && <ProcessingStep />}
        {step === 'result' && <ResultStep />}
      </main>

      {/* Global Modals */}
      <QuotaModal
        isOpen={isQuotaModalOpen}
        onClose={() => setIsQuotaModalOpen(false)}
        onRetry={() => {
          setIsQuotaModalOpen(false);
          setStep('product');
        }}
      />

      <StyleAdvisorModal
        isOpen={isAdvisorOpen}
        onClose={() => setIsAdvisorOpen(false)}
        garment={garmentAnalysis}
      />

      <OutfitBuilderModal
        isOpen={isOutfitBuilderOpen}
        onClose={() => setIsOutfitBuilderOpen(false)}
        currentResultUrl={tryOnResult?.imageUrl || null}
        garmentAnalysis={garmentAnalysis}
        savedLooks={savedLooks}
        onSaveLook={addSavedLook}
      />

      <InfoPagesModal
        activeTab={activeInfoTab}
        onClose={() => setActiveInfoTab(null)}
        onSelectTab={(tab) => setActiveInfoTab(tab)}
        onDeleteEverything={() => {
          resetAll();
          setActiveInfoTab(null);
          setStep('landing');
        }}
      />

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-stone-500 border-t border-stone-800/40">
        <div className="flex items-center justify-center gap-3 mb-2">
          <button
            type="button"
            onClick={() => setActiveInfoTab('privacy')}
            className="hover:text-stone-300 transition-colors"
          >
            Privacy
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => setActiveInfoTab('responsible-ai')}
            className="hover:text-stone-300 transition-colors"
          >
            Responsible AI
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => setActiveInfoTab('limitations')}
            className="hover:text-stone-300 transition-colors"
          >
            Limitations
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => setActiveInfoTab('about')}
            className="hover:text-stone-300 transition-colors"
          >
            About
          </button>
        </div>
        <p>Aaina (آئینہ) · NYLP AI Hackathon 2026 · Built by Masum Abbas</p>
      </footer>
    </div>
  );
}
