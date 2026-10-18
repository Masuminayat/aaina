# Aaina — Provider Status & Benchmark

> Verified with Live End-to-End Inference: 18 Oct 2026 for NYLP AI Hackathon 2026

## 1. Summary of Evaluated Try-On Providers

| Provider | Model / Architecture | HF Space ID | Supported Categories | Hardware Tier | Licence | Empirical Status |
|----------|----------------------|-------------|----------------------|---------------|---------|------------------|
| **IDM-VTON** (Primary) | Diffusion-based Virtual Try-On with detailed garment-person attention | `yisol/IDM-VTON` | Upper garment, tops, shirts, jackets | ZeroGPU (Nvidia A100 / L40S) | CC BY-NC-SA 4.0 | **VERIFIED WORKING (45.02s)** |
| **CatVTON** (Secondary) | Category-agnostic lightweight VTON | `zhengchong/CatVTON` | Upper, lower, dresses/overall | ZeroGPU | CC BY-NC-SA 4.0 | **Active & Available** |
| **Kolors VTON** (Candidate) | Kolors diffusion base with inpainting try-on | `Kwai-Kolors/Kolors-Virtual-Try-On` | Upper, dresses | ZeroGPU | Apache 2.0 / Kolors licence | **Standby** |
| **Instant Engine** (Local fallback) | Landmark anchoring + client-side compositing & warp | Local (on-device) | Glasses, hats, jewelry, watches, quick cloth preview | Local CPU/GPU/WebGPU | MIT (in-house) | **Active & $0 guaranteed** |

---

## 2. Primary Provider: IDM-VTON Empirical Benchmark

- **Space ID:** `yisol/IDM-VTON`
- **Loaded Endpoint URL:** `https://yisol-idm-vton.hf.space`
- **Gradio API Endpoint:** `/tryon`
- **Verified Parameters (live `view_api` reflection):**
  - `dict`: `{"background": handle_file(...), "layers": [], "composite": None}` (required)
  - `garm_img`: `handle_file(...)` (required)
  - `garment_des`: `str` (required, e.g. "green plaid flannel button-up shirt")
  - `is_checked`: `bool` (auto-masking enabled, default: `True`)
  - `is_checked_crop`: `bool` (auto-crop disabled, default: `False`)
  - `denoise_steps`: `float` (default: `30`)
  - `seed`: `float` (default: `42`)
- **Returns:**
  - `[0]`: Result try-on PNG image
  - `[1]`: Segmentation mask PNG image

### Live Measurement Log (18 Oct 2026 14:50 PKT):
- **Space Connection Time:** 7.59s
- **Queue State Transition:**
  - `Status.STARTING`: 18.0s
  - `Status.PROCESSING`: 9.0s
  - `Status.FINISHED`: 18.0s (transfer & payload decode)
- **Total Measured Inference Latency:** **45.02 seconds**
- **Output Artifacts:**
  - Result image: `public/demo-assets/sample-result.png` (871 KB)
  - Mask image: `public/demo-assets/sample-mask.png` (700 KB)

---

## 3. Quota & ZeroGPU Behavior

1. **Anonymous Free Tier:**
   - Inference completed successfully from an anonymous IP address without providing a personal Hugging Face token.
   - The ZeroGPU queue dynamically allocated an NVIDIA GPU instance without throttling or rejecting the connection.
2. **Quota Error Handling:**
   - Under heavy cluster load or when visitor IP quota is depleted, ZeroGPU returns an error message matching `/quota|ZeroGPU|exceeded|rate.?limit/i`.
   - **Aaina Mitigation Strategy:**
     - Automatic detection of quota exhaustion in `idm-vton.ts`.
     - UI presents a clear options modal: (a) switch to Instant 2D AR preview, (b) wait for queue reset with countdown, or (c) provide an optional personal free HF token (kept strictly in browser RAM, never saved or transmitted to any server).

---

## 4. Privacy & Execution Boundaries

- **Direct Browser Call:** `@gradio/client` runs directly in the client's browser, sending the user's photo straight to Hugging Face ZeroGPU.
- **Zero Intermediary Logging:** Aaina's servers never receive, inspect, or persist the user's selfie.
- **Gemini Segregation:** Gemini (`/api/analyze`) only processes standalone garment photos and text metadata.
