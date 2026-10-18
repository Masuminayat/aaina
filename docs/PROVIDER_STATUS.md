# Aaina — Provider Status & Benchmark

> Verified: 18 Oct 2026 for NYLP AI Hackathon 2026

## 1. Summary of Evaluated Try-On Providers

| Provider | Model / Architecture | HF Space ID | Supported Categories | Hardware Tier | Licence | Status |
|----------|----------------------|-------------|----------------------|---------------|---------|--------|
| **IDM-VTON** (Primary) | Diffusion-based Virtual Try-On with detailed garment-person attention | `yisol/IDM-VTON` | Upper garment, tops, shirts | ZeroGPU (Nvidia A100 / L40S) | CC BY-NC-SA 4.0 | **Active & Verified** |
| **CatVTON** (Secondary) | Category-agnostic lightweight VTON | `zhengchong/CatVTON` | Upper, lower, dresses/overall | ZeroGPU | CC BY-NC-SA 4.0 | **Active & Verified** |
| **Kolors VTON** (Candidate) | Kolors diffusion base with inpainting try-on | `Kwai-Kolors/Kolors-Virtual-Try-On` | Upper, dresses | ZeroGPU | Apache 2.0 / Kolors licence | **Standby** |
| **Instant Engine** (Local fallback) | Landmark anchoring + client-side compositing & warp | Local (on-device) | Glasses, hats, jewelry, watches, quick cloth preview | Local CPU/GPU/WebGPU | MIT (in-house) | **Active & $0 guaranteed** |

---

## 2. Primary Provider: IDM-VTON Details

- **Space ID:** `yisol/IDM-VTON`
- **Gradio API Endpoint:** `/tryon`
- **Expected Parameters:**
  - `dict`: `{"background": Blob, "layers": [], "composite": null}` (the target person image)
  - `garm_img`: `Blob` (isolated garment image)
  - `garment_des`: `string` (concise text prompt describing the garment, derived from Garment Intelligence)
  - `is_checked`: `boolean` (`true` to enable automatic garment masking)
  - `is_checked_crop`: `boolean` (`false` to preserve natural aspect ratio)
  - `denoise_steps`: `number` (default: 30)
  - `seed`: `number` (default: 42)
- **Output:**
  - `[0]`: Result try-on image URL / path
  - `[1]`: Mask image URL / path
- **Observed Latency:**
  - Cold queue: 40s – 75s
  - Warm execution: 20s – 35s
- **ZeroGPU Quota Behavior:**
  - Anonymous IP quota resets approximately every 12 hours.
  - When quota is exceeded, the Space returns an error payload containing "quota" / "ZeroGPU".
  - Graceful mitigation: Aaina offers user token override (kept in RAM only) and seamless fallback to Instant Engine.

---

## 3. CatVTON Details

- **Space ID:** `zhengchong/CatVTON`
- **Gradio API Endpoint:** `/predict`
- **Key Advantage:** Supports categories beyond tops (trousers, skirts, and full dresses).
- **Status:** Functional backup for multi-piece outfits and bottoms.

---

## 4. Privacy & Client-Side Execution Decision

- **Direct Browser Call:** By invoking `@gradio/client` directly from the client's browser, the user's personal photo travels directly from their machine to the Hugging Face ZeroGPU runtime without passing through or persisting on Aaina's intermediate servers.
- **Gemini Segregation:** Gemini (`/api/analyze`) is ONLY sent product photos and textual metadata. The user's selfie is never sent to Gemini.
