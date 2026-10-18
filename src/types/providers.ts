/**
 * Aaina — Try-on provider types
 * Each provider wraps a different try-on backend (HF Space, on-device, etc.)
 */

export type GarmentCategory =
  | 'upper'      // shirts, tops, jackets, etc.
  | 'lower'      // pants, skirts, etc.
  | 'dress'      // full dresses, jumpsuits
  | 'face'       // glasses, sunglasses
  | 'head'       // hats, caps, hijab
  | 'neck'       // necklaces, scarves
  | 'hand'       // watches, bracelets, rings
  | 'unsupported';

export type TryOnRoute =
  | 'studio_upper'
  | 'studio_lower'
  | 'studio_dress'
  | 'instant_face'
  | 'instant_hand'
  | 'instant_neck'
  | 'instant_head'
  | 'unsupported';

export interface TryOnInput {
  /** Person image as a Blob */
  personImage: Blob;
  /** Garment image as a Blob */
  garmentImage: Blob;
  /** Short garment description (≤12 words) for diffusion prompt */
  garmentDescription: string;
  /** Category determined by Garment Intelligence */
  category: GarmentCategory;
  /** Optional HF token for higher quota */
  hfToken?: string;
}

export interface TryOnResult {
  /** Result image as a Blob */
  image: Blob;
  /** URL for displaying the result (object URL — must be revoked) */
  imageUrl: string;
  /** Optional mask image */
  maskImage?: Blob;
  /** Provider that produced this result */
  providerId: string;
  /** Latency in milliseconds */
  latencyMs: number;
  /** Any metadata from the provider */
  meta?: Record<string, unknown>;
}

export type TryOnStatus =
  | { stage: 'preparing'; message: string }
  | { stage: 'queued'; position?: number; message: string }
  | { stage: 'generating'; progress?: number; message: string }
  | { stage: 'finishing'; message: string }
  | { stage: 'error'; message: string; retryable: boolean; isQuota?: boolean; retryAfterMs?: number }
  | { stage: 'done'; message: string };

export interface TryOnProvider {
  /** Unique ID */
  id: string;
  /** Human-readable label */
  label: string;
  /** Categories this provider supports */
  supports: GarmentCategory[];
  /** Run a try-on */
  run(input: TryOnInput, onStatus: (status: TryOnStatus) => void, signal?: AbortSignal): Promise<TryOnResult>;
  /** Quick health check — returns true if the Space is reachable */
  healthCheck(): Promise<boolean>;
}

export interface ProviderConfig {
  id: string;
  label: string;
  spaceId: string;
  endpoint: string;
  supports: GarmentCategory[];
  lastVerified?: string;
  notes?: string;
}
