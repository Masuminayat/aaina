/**
 * Aaina — Main application store (Zustand)
 */
import { create } from 'zustand';
import type { TryOnStatus, TryOnResult, GarmentCategory } from '../types/providers';

export type AppStep = 'landing' | 'person' | 'product' | 'processing' | 'result';

interface GarmentInfo {
  category: GarmentCategory;
  description: string;
  colors: Array<{ name: string; hex: string }>;
  pattern?: string;
  confidence: number;
  route: string;
}

interface AppState {
  // Flow
  step: AppStep;
  setStep: (step: AppStep) => void;
  consentGiven: boolean;
  setConsentGiven: (v: boolean) => void;

  // Person image
  personImage: Blob | null;
  personImageUrl: string | null;
  setPersonImage: (blob: Blob) => void;
  clearPersonImage: () => void;

  // Product image
  productImage: Blob | null;
  productImageUrl: string | null;
  setProductImage: (blob: Blob) => void;
  clearProductImage: () => void;

  // Garment intelligence
  garmentInfo: GarmentInfo | null;
  setGarmentInfo: (info: GarmentInfo) => void;

  // Try-on
  tryOnStatus: TryOnStatus | null;
  setTryOnStatus: (status: TryOnStatus | null) => void;
  tryOnResult: TryOnResult | null;
  setTryOnResult: (result: TryOnResult | null) => void;

  // HF token (in memory only, never persisted)
  hfToken: string | null;
  setHfToken: (token: string | null) => void;

  // Reset everything
  resetAll: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  step: 'landing',
  setStep: (step) => set({ step }),
  consentGiven: false,
  setConsentGiven: (v) => set({ consentGiven: v }),

  personImage: null,
  personImageUrl: null,
  setPersonImage: (blob) => {
    const prev = get().personImageUrl;
    if (prev) URL.revokeObjectURL(prev);
    set({ personImage: blob, personImageUrl: URL.createObjectURL(blob) });
  },
  clearPersonImage: () => {
    const prev = get().personImageUrl;
    if (prev) URL.revokeObjectURL(prev);
    set({ personImage: null, personImageUrl: null });
  },

  productImage: null,
  productImageUrl: null,
  setProductImage: (blob) => {
    const prev = get().productImageUrl;
    if (prev) URL.revokeObjectURL(prev);
    set({ productImage: blob, productImageUrl: URL.createObjectURL(blob) });
  },
  clearProductImage: () => {
    const prev = get().productImageUrl;
    if (prev) URL.revokeObjectURL(prev);
    set({ productImage: null, productImageUrl: null });
  },

  garmentInfo: null,
  setGarmentInfo: (info) => set({ garmentInfo: info }),

  tryOnStatus: null,
  setTryOnStatus: (status) => set({ tryOnStatus: status }),
  tryOnResult: null,
  setTryOnResult: (result) => set({ tryOnResult: result }),

  hfToken: null,
  setHfToken: (token) => set({ hfToken: token }),

  resetAll: () => {
    const state = get();
    if (state.personImageUrl) URL.revokeObjectURL(state.personImageUrl);
    if (state.productImageUrl) URL.revokeObjectURL(state.productImageUrl);
    if (state.tryOnResult?.imageUrl) URL.revokeObjectURL(state.tryOnResult.imageUrl);
    set({
      step: 'landing',
      personImage: null,
      personImageUrl: null,
      productImage: null,
      productImageUrl: null,
      garmentInfo: null,
      tryOnStatus: null,
      tryOnResult: null,
      hfToken: null,
    });
  },
}));
