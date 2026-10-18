# Aaina (آئینہ) — AI Virtual Try-On Mirror & Styling Suite

> **"See it on you before you buy it."**  
> Entry for the **NYLP AI Hackathon 2026**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-aaina--one.vercel.app-emerald?style=for-the-badge&logo=vercel)](https://aaina-one.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Masuminayat%2Faaina-stone?style=for-the-badge&logo=github)](https://github.com/Masuminayat/aaina)
[![Vite](https://img.shields.io/badge/Vite-8.3-blue.svg)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19-cyan.svg)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black.svg)](https://threejs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8.svg)](https://tailwindcss.com/)
[![Licence](https://img.shields.io/badge/Licence-MIT%20%2F%20CC%20BY--NC--SA%204.0-amber.svg)](#credits--licences)
[![Budget](https://img.shields.io/badge/Budget-$0%20Strict%20Free%20Tier-success.svg)](#hard-constraints)

---

## 1. Problem Statement

Shoppers—both online and in boutique stores—face continuous friction because they cannot reliably tell how clothes or accessories will look on them before making a purchase. Over 30% of online apparel purchases are returned due to sizing, drape, and visual uncertainty, creating massive logistical costs and carbon footprints. Independent boutiques and emerging merchants cannot afford the million-dollar budgets required by enterprise AR try-on solutions.

*Note: In accordance with hackathon guidelines, all evaluations are stated qualitatively and empirically without unverified statistical claims.*

---

## 2. Solution Overview

**Aaina (آئینہ, Urdu for "Mirror")** transforms any smartphone or browser into an intelligent virtual fitting room and styling suite on a strict $0 budget.

The user provides a photo of themselves and any product image (clothing, sunglasses, hats, watches, or accessories). Aaina:
1. Coaches photo quality on-device (framing, luminance, sharpness).
2. Analyzes apparel intelligence via Google Gemini Vision.
3. Performs high-fidelity virtual try-on via open-source diffusion models (`yisol/IDM-VTON` on Hugging Face ZeroGPU).
4. Enables 360° inspection through split compare, zoom/pan, and **2.5D Orbit Spin View**.
5. Delivers objective **Style Advice** (with body-neutral guardrails), **Outfit Stacking (Look A vs Look B)**, zero-latency **Instant AR Mirror Mode**, and shareable **Look Card** exports.

---

## 3. Core Features

- **On-Device Photo Coach**: Instant client-side canvas analysis measuring resolution, 3:4 portrait framing, exposure luminance, and Laplacian edge sharpness (0–100 score) with one-click **Auto-Fix**.
- **Garment Intelligence Card**: Google Gemini 2.5 Flash analyzes cut, fabric, color swatches, formality tier, and generates editable diffusion prompts.
- **Studio Diffusion Try-On**: Direct browser-to-ZeroGPU inference via `@gradio/client` calling open-source diffusion models without server proxy bottleneck.
- **Interactive Result Workspace**:
  - **Before / After Split Compare Slider**: Drag across person and garment to verify seamless fit.
  - **Pan & Zoom Inspector**: Inspect fine textile stitching and pattern alignment.
  - **2.5D Orbit Spin View**: Interactive Three.js depth-displaced mesh with ±30° yaw, auto-spin turntable, and keyboard accessibility.
- **Gemini Style Advisor (`/api/advise`)**: Objective color harmony theory and occasion recommendations with strict body-neutrality guardrails (never comments on body shape, weight, or skin tone).
- **Outfit Stacker & Wardrobe Decider**: Stack layers (Tops, Bottoms, Footwear, Accessories) and compare **Look A vs Look B** with a dual-look slider.
- **Instant AR Mirror Mode**: Zero-latency (60 FPS) on-device AR overlay for sunglasses, hats, watches, and chains on live webcam or still photo.
- **Branded Look Card Generator**: One-click 1080x1440 high-resolution PNG export with garment metadata chips, color palette swatches, and verification watermark.
- **Under the Hood Audit Panel**: Complete transparency table displaying every pipeline stage, host environment, measured latency, and verifying that the user's selfie is never retained or stored.

---

## 4. Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend Framework** | React 19, TypeScript, Vite 8 |
| **Styling & UI System** | Tailwind CSS 4, Lucide Icons, Google Fonts (Outfit & Inter) |
| **3D & WebGL Graphics** | Three.js (2.5D depth displaced orbit mesh) |
| **State Management** | Zustand |
| **Diffusion Client** | `@gradio/client` (Direct browser connection to Hugging Face ZeroGPU) |
| **Serverless Functions** | Vercel Serverless (`/api/analyze` & `/api/advise`) |
| **Vision & Intelligence** | Google Gemini 2.5 Flash (Product analysis & objective style advice) |

---

## 5. AI / API Usage & Licence Disclosure

| Component | Model / Service | Where it Runs | Purpose | Licence / Terms |
|-----------|-----------------|---------------|---------|-----------------|
| **Studio Try-On** | `yisol/IDM-VTON` | Hugging Face ZeroGPU Space | High-fidelity cloth-to-person diffusion try-on | [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) |
| **Garment Intelligence** | Google Gemini 2.5 Flash | Vercel `/api/analyze` | Analyzes product photo only (category, color, prompt) | Free Tier (Google AI Studio) |
| **Style Advisor** | Google Gemini 2.5 Flash | Vercel `/api/advise` | Style opinion, occasion pairing & color harmony | Free Tier (Google AI Studio) |
| **Photo Coach** | HTML5 Canvas CV | Client Browser (Local) | Laplacian sharpness, exposure, aspect ratio | MIT |
| **2.5D Orbit Mesh** | Three.js WebGL | Client Browser (Local) | Turntable depth displacement orbit mesh | MIT |
| **AI Coding Assistant** | Antigravity IDE | Local developer environment | Pair programming, architecture design, and automation | Development tool |

> **Privacy Rule:** Under Google free-tier terms, submitted data may be used for product improvement. Therefore, **the user's personal selfie is NEVER sent to Gemini**. Gemini receives only the garment product image and text descriptors.

---

## 6. Setup Instructions

### Prerequisites
- Node.js (v18+) and npm
- (Optional) Free Google AI Studio API key for live Gemini garment analysis

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/Masuminayat/aaina.git
cd aaina

# 2. Install dependencies
npm install

# 3. Configure environment variables (optional; built-in fallbacks work out of the box)
cp .env.example .env.local

# 4. Start local development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

---

## 7. Documentation & Deliverables

- **Live Production App:** [`https://aaina-one.vercel.app`](https://aaina-one.vercel.app)
- **Official Submission Form:** [`docs/SUBMISSION.md`](docs/SUBMISSION.md)
- **60–90s Video Demo Script:** [`docs/DEMO_SCRIPT.md`](docs/DEMO_SCRIPT.md)
- **Empirical 8-Scenario Benchmark:** [`docs/EVALUATION.md`](docs/EVALUATION.md)
- **Architecture & Privacy Guide:** [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- **Provider Status Pre-Flight:** [`docs/PROVIDER_STATUS.md`](docs/PROVIDER_STATUS.md)
- **Click-by-Click Deployment Guide:** [`docs/SETUP_FOR_ME.md`](docs/SETUP_FOR_ME.md)

---

## 8. Responsible AI & Ethics

- **Explicit Consent**: Users are informed through a mandatory Consent Gate that their image is processed solely for generating the virtual try-on preview and is never stored on servers.
- **Body Neutrality**: Style Advisor guardrails strictly prohibit making comments on physical body shape, weight, skin color, or attractiveness.
- **Fairness & Diversity**: Virtual try-on diffusion models can exhibit variance across body sizes, skin complexions, and garment textures. Aaina transparently badges all results as "AI preview" to avoid deceptive tailoring claims.
- **Single-Click Wipe**: A "Delete Everything" action immediately purges all cached images, blobs, and session memory.

---

## 9. Team Contributions

- **Lead Architect & Full-Stack / Applied ML Engineering**: Masum Abbas
- **Development Assistant**: Google Antigravity IDE for the NYLP AI Hackathon 2026.

---

## 10. Credits & Licences

- IDM-VTON: Choi et al., Korea University & Kakao Corp (CC BY-NC-SA 4.0).
- Icons provided by [Lucide](https://lucide.dev/) (ISC Licence).
