# Aaina (آئینہ) — Architectural Decisions

> NYLP AI Hackathon 2026

## 1. High-Level Architecture Overview

```
                 +--------------------------------------------+
                 |            User Browser (Client)           |
                 |  - React 18 + TypeScript + Tailwind CSS    |
                 |  - Zustand State Management                |
                 |  - On-device MediaPipe & Canvas processing |
                 +------+------------------------------+------+
                        |                              |
         (Product Photo | Only)        (Try-On Inference Direct)
                        v                              v
        +-----------------------------+   +-----------------------------+
        | Vercel Serverless Functions |   | Hugging Face ZeroGPU Spaces |
        |  /api/analyze (Gemini Vision)|   |  - yisol/IDM-VTON           |
        |  /api/advise (Gemini Text)  |   |  - zhengchong/CatVTON       |
        +--------------+--------------+   +-----------------------------+
                       |
                       v
         +----------------------------+
         | Google Gemini API (Free)   |
         |  - gemini-2.5-flash        |
         +----------------------------+
```

---

## 2. Decision: Direct Browser-to-Space Inference vs. Vercel API Proxy

### Option A: Direct Browser Call (`@gradio/client` in frontend) — **SELECTED**
- **Pros:**
  1. **User IP Quota:** Each visitor to Aaina utilizes their own anonymous Hugging Face ZeroGPU quota. If handled through a single server proxy, all users would share the server's single IP quota and exhaust it within minutes.
  2. **No Timeout Limits:** Vercel Hobby serverless functions have a 10s–15s execution timeout. Hugging Face diffusion queues and generation take 20s–60s on average. Direct client connection circumvents Vercel timeout restrictions completely.
  3. **Privacy First:** The user's photo is never routed through, processed by, or logged on Aaina's servers.
- **Cons:**
  1. CORS / WebSocket dependency on Hugging Face infrastructure.
- **Decision:** Use direct browser calling as the primary pipeline, backed by graceful UI error parsing and the Instant Engine fallback.

---

## 3. Garment Intelligence Isolation (Privacy Rule)

Google Gemini's free tier terms permit model improvement on submitted data. In compliance with strict privacy standards and rule 8 of `PROJECT_SPEC.md`:
1. **Never send user photos to Gemini.**
2. Only the standalone product garment photo and text metadata are sent to `/api/analyze`.
3. Garment classification returns structured JSON to steer diffusion parameters without compromising personal identity.

---

## 4. Resilience & Quota Strategy

1. **Pre-flight Health Checks:** The client attempts lightweight status probes before heavy dispatch.
2. **Clear Stage Feedback:** Real-time visibility into `Preparing` → `Queued` → `Generating` → `Finishing` stages.
3. **Graceful Fallback:** If GPU quota is depleted or queue is congested, the application allows:
   - Instant 2D/AR preview mode.
   - User-provided free HF access token (held in browser memory only, never stored or transmitted elsewhere).
