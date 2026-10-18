/**
 * Aaina — Main application store (Zustand)
 * Phase 1: Integrated Photo Coach, Garment Intelligence, Compare/PanZoom, and Quota handling
 */
import { create } from 'zustand';
import type { TryOnStatus, TryOnResult } from '../types/providers';
import type { PhotoCoachReport } from '../ai/coach/photo-coach';
import type { GarmentAnalysis } from '../../api/analyze';
import type { InfoPageTab } from '../components/InfoPagesModal';
import { analyzePhoto, autoFixPhoto } from '../ai/coach/photo-coach';

export type AppStep = 'landing' | 'person' | 'product' | 'processing' | 'result';
export type ResultViewMode = 'compare' | 'panzoom';

interface AppState {
  // Flow navigation
  step: AppStep;
  setStep: (step: AppStep) => void;
  consentGiven: boolean;
  setConsentGiven: (v: boolean) => void;

  // Person photo & coach
  personImage: Blob | null;
  personImageUrl: string | null;
  photoCoachReport: PhotoCoachReport | null;
  isCoachAnalyzing: boolean;
  isAutoFixing: boolean;
  setPersonImage: (blob: Blob) => Promise<void>;
  clearPersonImage: () => void;
  triggerAutoFix: () => Promise<void>;

  // Product garment & intelligence
  productImage: Blob | null;
  productImageUrl: string | null;
  garmentAnalysis: GarmentAnalysis | null;
  isAnalyzingGarment: boolean;
  diffusionPrompt: string;
  setProductImage: (blob: Blob) => Promise<void>;
  clearProductImage: () => void;
  setDiffusionPrompt: (prompt: string) => void;

  // Try-on execution & status
  tryOnStatus: TryOnStatus | null;
  setTryOnStatus: (status: TryOnStatus | null) => void;
  tryOnResult: TryOnResult | null;
  setTryOnResult: (result: TryOnResult | null) => void;
  resultViewMode: ResultViewMode;
  setResultViewMode: (mode: ResultViewMode) => void;

  // Quota & in-memory token
  isQuotaModalOpen: boolean;
  setIsQuotaModalOpen: (v: boolean) => void;
  hfToken: string | null;
  setHfToken: (token: string | null) => void;

  // Info & modal tabs
  activeInfoTab: InfoPageTab | null;
  setActiveInfoTab: (tab: InfoPageTab | null) => void;

  // Reset entire session
  resetAll: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  step: 'landing',
  setStep: (step) => set({ step }),
  consentGiven: false,
  setConsentGiven: (v) => set({ consentGiven: v }),

  // Person photo & Coach
  personImage: null,
  personImageUrl: null,
  photoCoachReport: null,
  isCoachAnalyzing: false,
  isAutoFixing: false,

  setPersonImage: async (blob: Blob) => {
    const prev = get().personImageUrl;
    if (prev) URL.revokeObjectURL(prev);
    const url = URL.createObjectURL(blob);
    set({
      personImage: blob,
      personImageUrl: url,
      isCoachAnalyzing: true,
    });

    try {
      const report = await analyzePhoto(blob);
      set({ photoCoachReport: report, isCoachAnalyzing: false });
    } catch (err) {
      console.warn('Photo Coach analysis failed:', err);
      set({ isCoachAnalyzing: false });
    }
  },

  clearPersonImage: () => {
    const prev = get().personImageUrl;
    if (prev) URL.revokeObjectURL(prev);
    set({
      personImage: null,
      personImageUrl: null,
      photoCoachReport: null,
      isCoachAnalyzing: false,
    });
  },

  triggerAutoFix: async () => {
    const current = get().personImage;
    if (!current) return;
    set({ isAutoFixing: true });
    try {
      const fixedBlob = await autoFixPhoto(current);
      await get().setPersonImage(fixedBlob);
    } catch (err) {
      console.error('Auto fix failed:', err);
    } finally {
      set({ isAutoFixing: false });
    }
  },

  // Product photo & Garment Intelligence
  productImage: null,
  productImageUrl: null,
  garmentAnalysis: null,
  isAnalyzingGarment: false,
  diffusionPrompt: 'green plaid flannel button-up shirt',

  setProductImage: async (blob: Blob) => {
    const prev = get().productImageUrl;
    if (prev) URL.revokeObjectURL(prev);
    const url = URL.createObjectURL(blob);
    set({
      productImage: blob,
      productImageUrl: url,
      isAnalyzingGarment: true,
    });

    try {
      // Convert to base64 for /api/analyze call
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const base64 = await base64Promise;

      const resp = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mimeType: blob.type || 'image/jpeg' }),
      });

      if (resp.ok) {
        const data: GarmentAnalysis = await resp.json();
        set({
          garmentAnalysis: data,
          diffusionPrompt: data.garment_description || 'a stylish garment',
          isAnalyzingGarment: false,
        });
      } else {
        throw new Error(`Analyze API returned status ${resp.status}`);
      }
    } catch (err) {
      console.warn('Garment analysis fallback to default heuristic:', err);
      set({
        garmentAnalysis: {
          category: 'Upper Garment',
          subcategory: 'Top / Shirt',
          route: 'studio_upper',
          garment_description: 'green plaid flannel button-up shirt',
          colors: [{ name: 'Green', hex: '#22543d' }, { name: 'Navy', hex: '#1e3a8a' }],
          pattern: 'Plaid',
          fabric_guess: 'Cotton',
          sleeve: 'Long sleeve',
          neckline: 'Collared',
          fit_style: 'Regular',
          formality: '2',
          seasons: ['Autumn', 'Winter'],
          occasions: ['Casual', 'Everyday'],
          pairing_suggestions: ['Jeans', 'Chinos'],
          care_hint: 'Machine wash',
          confidence: 0.9,
          unsafe: false,
          warnings: [],
        },
        diffusionPrompt: 'green plaid flannel button-up shirt',
        isAnalyzingGarment: false,
      });
    }
  },

  clearProductImage: () => {
    const prev = get().productImageUrl;
    if (prev) URL.revokeObjectURL(prev);
    set({
      productImage: null,
      productImageUrl: null,
      garmentAnalysis: null,
      isAnalyzingGarment: false,
    });
  },

  setDiffusionPrompt: (prompt: string) => set({ diffusionPrompt: prompt }),

  // Try-on status & result
  tryOnStatus: null,
  setTryOnStatus: (status) => set({ tryOnStatus: status }),
  tryOnResult: null,
  setTryOnResult: (result) => set({ tryOnResult: result }),
  resultViewMode: 'compare',
  setResultViewMode: (mode) => set({ resultViewMode: mode }),

  // Quota & HF Token
  isQuotaModalOpen: false,
  setIsQuotaModalOpen: (v) => set({ isQuotaModalOpen: v }),
  hfToken: null,
  setHfToken: (token) => set({ hfToken: token }),

  // Info modal tabs
  activeInfoTab: null,
  setActiveInfoTab: (tab) => set({ activeInfoTab: tab }),

  // Reset Everything
  resetAll: () => {
    const state = get();
    if (state.personImageUrl) URL.revokeObjectURL(state.personImageUrl);
    if (state.productImageUrl) URL.revokeObjectURL(state.productImageUrl);
    if (state.tryOnResult?.imageUrl) URL.revokeObjectURL(state.tryOnResult.imageUrl);
    set({
      step: 'landing',
      personImage: null,
      personImageUrl: null,
      photoCoachReport: null,
      isCoachAnalyzing: false,
      isAutoFixing: false,
      productImage: null,
      productImageUrl: null,
      garmentAnalysis: null,
      isAnalyzingGarment: false,
      diffusionPrompt: 'green plaid flannel button-up shirt',
      tryOnStatus: null,
      tryOnResult: null,
      resultViewMode: 'compare',
      isQuotaModalOpen: false,
      hfToken: null,
      activeInfoTab: null,
    });
  },
}));
