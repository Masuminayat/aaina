# Aaina (آئینہ) — Architectural Decisions & System Design

> NYLP AI Hackathon 2026 — Verified with Live Inference on 18 Oct 2026

## 1. High-Level Architecture Overview

```
                 +--------------------------------------------+
                 |            User Browser (Client)           |
                 |  - React 19 + TypeScript + Tailwind CSS 4  |
                 |  - Zustand Store (Reactive Pipeline State) |
                 |  - On-device Canvas / Photo Coach Check    |
                 +------+------------------------------+------+
                        |                              |
         (Product Photo | Only)        (Try-On Inference Direct)
                        v                              v
        +-----------------------------+   +-----------------------------+
        | Vercel Serverless Functions |   | Hugging Face ZeroGPU Spaces |
        |  /api/analyze (Gemini Vision)|   |  - yisol/IDM-VTON (45.0s)   |
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

## 2. Decision: Direct Client-to-Space vs Serverless Proxy

### Why Direct Client-to-Space was selected:
1. **Measured Latency exceeds Serverless Timeouts:**
   - Real-world benchmark confirmed total inference duration of **45.02s** (7.59s connection + 37.43s queue & execution).
   - Vercel's standard Hobby plan enforces a **10s–15s** hard serverless execution timeout. Relaying diffusion generation through a standard Vercel API route would trigger `504 Gateway Timeout` errors.
2. **IP Quota Distribution:**
   - Hugging Face ZeroGPU limits anonymous requests per client IP address.
   - If proxied through a single Vercel server, all global users would share one outbound Vercel IP, quickly exhausting the shared quota. Direct browser execution ensures each user utilizes their own independent quota.
3. **Data Sovereignty & Privacy:**
   - The user's selfie never touches Aaina's intermediate serverless infrastructure.

---

## 3. Garment Intelligence Isolation (Strict Privacy Guardrail)

In compliance with Rule 8 and Section 8 of `PROJECT_SPEC.md`:
1. **The user's personal selfie is NEVER sent to Google Gemini.**
2. Only the standalone product garment photo and text metadata are sent to `/api/analyze`.
3. Gemini classifies category, subcategory, dominant colors, pattern, sleeve length, formality, and generates the diffusion prompt (`≤ 12 words`).
4. If Gemini API is unreachable or rate-limited (HTTP 429), the frontend automatically falls back to local heuristic extraction, maintaining an uninterrupted user experience.

---

## 4. Quota Resilience & Recovery Chain

```
[User initiates Try-On]
         │
         ├───> [TryOnProvider: yisol/IDM-VTON]
         │             │
         │             ├── Success (20s - 45s) ───> [Render Result + Compare Slider]
         │             │
         │             └── Quota Exceeded / Busy Queue
         │                     │
         │                     ├── Option A: Switch to Instant Mode (Local Canvas / AR)
         │                     ├── Option B: Wait with countdown timer
         │                     └── Option C: Provide Personal Free HF Token (held in RAM only)
         │
         └───> [Local Cache (IndexedDB/State)] ───> Prevents duplicate regeneration
```
