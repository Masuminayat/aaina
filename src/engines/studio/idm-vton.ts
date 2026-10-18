/**
 * IDM-VTON Provider — calls yisol/IDM-VTON on Hugging Face via @gradio/client
 *
 * Licence: CC BY-NC-SA 4.0 (non-commercial)
 * This runs in the browser; each visitor uses their own anonymous GPU quota.
 */
import { Client } from '@gradio/client';
import type { TryOnProvider, TryOnInput, TryOnResult, TryOnStatus, GarmentCategory } from '../../types/providers';
import { PROVIDER_CONFIGS, DEFAULT_DENOISE_STEPS, DEFAULT_SEED } from '../../config/providers';

const config = PROVIDER_CONFIGS.find(p => p.id === 'idm-vton')!;

/**
 * Preprocess an image: resize to fit within maxW×maxH, return as Blob.
 */
async function preprocessImage(blob: Blob, maxW = 768, maxH = 1024): Promise<Blob> {
  const img = new Image();
  const url = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    img.onload = () => {
      URL.revokeObjectURL(url);
      let w = img.width;
      let h = img.height;

      // Scale to fit
      const ratio = Math.min(maxW / w, maxH / h, 1);
      w = Math.round(w * ratio);
      h = Math.round(h * ratio);

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, w, h);

      canvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error('Failed to convert canvas to blob'));
        },
        'image/png',
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for preprocessing'));
    };
    img.src = url;
  });
}

export const idmVtonProvider: TryOnProvider = {
  id: config.id,
  label: config.label,
  supports: config.supports as GarmentCategory[],

  async healthCheck(): Promise<boolean> {
    try {
      const client = await Client.connect(config.spaceId, { events: ['status'] });
      // If we connected, the space is up
      client.close();
      return true;
    } catch {
      return false;
    }
  },

  async run(
    input: TryOnInput,
    onStatus: (status: TryOnStatus) => void,
    signal?: AbortSignal,
  ): Promise<TryOnResult> {
    const startTime = Date.now();

    onStatus({ stage: 'preparing', message: 'Preparing images…' });

    // Preprocess images
    const [personBlob, garmentBlob] = await Promise.all([
      preprocessImage(input.personImage, 768, 1024),
      preprocessImage(input.garmentImage, 768, 1024),
    ]);

    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');

    onStatus({ stage: 'preparing', message: 'Connecting to try-on server…' });

    // Connect to the HF Space
    const connectOpts: Record<string, unknown> = {};
    if (input.hfToken) {
      connectOpts.hf_token = input.hfToken;
    }

    const client = await Client.connect(config.spaceId, connectOpts);

    if (signal?.aborted) {
      client.close();
      throw new DOMException('Aborted', 'AbortError');
    }

    onStatus({ stage: 'queued', message: 'Waiting in queue…' });

    try {
      // Call the /tryon endpoint
      // IDM-VTON expected inputs (verified via view_api):
      //   dict: {background: file, layers: [], composite: null}
      //   garm_img: file
      //   garment_des: string
      //   is_checked: bool (auto-mask)
      //   is_checked_crop: bool (auto-crop)
      //   denoise_steps: number
      //   seed: number
      const result = await client.predict(config.endpoint, {
        dict: { background: personBlob, layers: [], composite: null },
        garm_img: garmentBlob,
        garment_des: input.garmentDescription || 'a garment',
        is_checked: true,   // auto-mask
        is_checked_crop: false,
        denoise_steps: DEFAULT_DENOISE_STEPS,
        seed: DEFAULT_SEED,
      });

      if (signal?.aborted) {
        client.close();
        throw new DOMException('Aborted', 'AbortError');
      }

      onStatus({ stage: 'finishing', message: 'Processing result…' });

      // Result typically has two images: [result_image, mask_image]
      const data = result.data as Array<{ url?: string; path?: string }>;

      if (!data || data.length === 0) {
        throw new Error('No result returned from IDM-VTON');
      }

      // Fetch the result image
      const resultUrl = data[0]?.url || data[0]?.path;
      if (!resultUrl) {
        throw new Error('No result image URL in response');
      }

      const imageResponse = await fetch(resultUrl);
      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch result image: ${imageResponse.status}`);
      }
      const imageBlob = await imageResponse.blob();
      const imageUrl = URL.createObjectURL(imageBlob);

      // Optionally fetch mask
      let maskImage: Blob | undefined;
      if (data.length > 1 && (data[1]?.url || data[1]?.path)) {
        try {
          const maskUrl = data[1].url || data[1].path!;
          const maskResp = await fetch(maskUrl);
          if (maskResp.ok) {
            maskImage = await maskResp.blob();
          }
        } catch {
          // Mask is optional
        }
      }

      const latencyMs = Date.now() - startTime;

      onStatus({ stage: 'done', message: `Done in ${Math.round(latencyMs / 1000)}s` });

      client.close();

      return {
        image: imageBlob,
        imageUrl,
        maskImage,
        providerId: config.id,
        latencyMs,
      };
    } catch (error) {
      client.close();

      const errMsg = error instanceof Error ? error.message : String(error);

      // Check for quota errors
      const isQuota = /quota|ZeroGPU|exceeded|rate.?limit/i.test(errMsg);
      if (isQuota) {
        onStatus({
          stage: 'error',
          message: 'GPU quota exhausted. Try again later, switch to Instant mode, or use your own HF token.',
          retryable: true,
          isQuota: true,
        });
      }

      throw error;
    }
  },
};
