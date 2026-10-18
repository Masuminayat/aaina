/**
 * Aaina — Provider Configuration
 * Verified against live HF Spaces on 18 Oct 2026.
 */
import type { ProviderConfig } from '../types/providers';

export const PROVIDER_CONFIGS: ProviderConfig[] = [
  {
    id: 'idm-vton',
    label: 'IDM-VTON (Studio)',
    spaceId: 'yisol/IDM-VTON',
    endpoint: '/tryon',
    supports: ['upper', 'lower', 'dress'],
    lastVerified: '2026-10-18',
    notes: 'CC BY-NC-SA 4.0. ZeroGPU, queue expected.',
  },
  {
    id: 'catvton',
    label: 'CatVTON (Studio)',
    spaceId: 'zhengchong/CatVTON',
    endpoint: '/submit',
    supports: ['upper', 'lower', 'dress'],
    lastVerified: '2026-10-18',
    notes: 'CC BY-NC-SA 4.0. Fallback provider.',
  },
];

/** Default denoise steps for IDM-VTON (higher = better quality but slower) */
export const DEFAULT_DENOISE_STEPS = 30;

/** Default seed for reproducibility (use -1 for random) */
export const DEFAULT_SEED = 42;

/** Per-provider timeout in milliseconds */
export const PROVIDER_TIMEOUT_MS = 180_000;

/** Max retries before failover */
export const MAX_RETRIES = 2;
