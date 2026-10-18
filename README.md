# Aaina (آئینہ) — AI Virtual Try-On Mirror

> **"See it on you before you buy it."**  
> Entry for the **NYLP AI Hackathon 2026**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-aaina--one.vercel.app-emerald?style=for-the-badge&logo=vercel)](https://aaina-one.vercel.app)
[![Vite](https://img.shields.io/badge/Vite-8.3-blue.svg)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19-cyan.svg)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8.svg)](https://tailwindcss.com/)
[![Licence](https://img.shields.io/badge/Licence-MIT%20%2F%20CC%20BY--NC--SA%204.0-amber.svg)](#credits--licences)
[![Budget](https://img.shields.io/badge/Budget-$0%20Free%20Tier-success.svg)](#hard-constraints)

---

## 1. Problem Statement

Shoppers—both online and in-store—face continuous friction because they cannot reliably tell how clothes or accessories will look on them before making a purchase. This uncertainty drives hesitations, ill-fitting purchases, return costs, and post-purchase dissatisfaction. Small independent boutiques and online sellers struggle even more, lacking the million-dollar budgets required by enterprise AR try-on solutions.

*Note: In accordance with hackathon guidelines, all evaluations are stated qualitatively without unverified statistical claims.*

---

## 2. Solution Overview

**Aaina (آئینہ, Urdu for "Mirror")** transforms any smartphone or browser into an intelligent virtual fitting room. 

The user provides a photo of themselves and any product image (clothing, glasses, hats, or accessories). Aaina intelligently classifies the item, respects user privacy, and performs high-fidelity virtual try-on using open-source diffusion models and instant on-device computer vision. Users can inspect the result with an interactive compare slider, zoom and pan, preview outfits, and receive intelligent styling guidance.

---

## 3. Core Features

- **Sample Try-On & Custom Upload**: Zero-friction sample gallery lets judges test immediately with verified sample images; prominent support for user-uploaded photos.
- **Privacy Consent Gate**: Mandatory acknowledgment explaining data flows, local processing, and a strict no-storage policy before photos are handled.
- **Studio Diffusion Try-On**: Direct browser-to-ZeroGPU inference via `@gradio/client` calling state-of-the-art diffusion models (`yisol/IDM-VTON`).
- **Interactive Result Workspace**:
  - Split before/after compare slider.
  - Smooth pan & zoom in all directions.
  - Safe download with embedded **"Aaina · AI preview"** watermark.
- **Under the Hood Transparency Panel**: Real-time observability displaying latency, pipeline stages, model architectures, and proving the user's selfie never leaves the device for proprietary training.
- **Quota-Resilient Design**: Honest detection of Hugging Face ZeroGPU queue states with fallback to local instant preview and optional user token override.

---

## 4. Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend Framework** | React 19, TypeScript, Vite 8 |
| **Styling & Design System** | Tailwind CSS 4, Lucide Icons, Google Fonts (Outfit & Inter) |
| **State Management** | Zustand |
| **Inference Client** | `@gradio/client` (Direct browser connection to Hugging Face ZeroGPU) |
| **Serverless & APIs** | Vercel Serverless Functions (`/api/analyze`) |
| **Vision & Intelligence** | Google Gemini 2.5 Flash (Vision classification for product items only) |

---

## 5. AI / API Usage & Licence Disclosure

| Component | Model / Service | Where it Runs | Purpose | Licence / Terms |
|-----------|-----------------|---------------|---------|-----------------|
| **Studio Try-On** | `yisol/IDM-VTON` | Hugging Face ZeroGPU Space | High-fidelity cloth-to-person diffusion try-on | [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) |
| **Multi-piece VTON** | `zhengchong/CatVTON` | Hugging Face ZeroGPU Space | Category-agnostic try-on for bottoms and dresses | [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) |
| **Garment Intelligence** | Google Gemini 2.5 Flash | Vercel `/api/analyze` | Analyzes product photo only (category, color, prompt) | Free Tier (Google AI Studio) |
| **AI Coding Assistant** | Antigravity IDE | Local developer environment | Pair programming, architecture design, and automation | Development tool |

> **Privacy Rule:** Under Google free-tier terms, submitted data may be used for product improvement. Therefore, **the user's personal photo is NEVER sent to Gemini**. Gemini receives only the garment product image.

---

## 6. Setup Instructions

### Prerequisites
- Node.js (v18+) and npm
- (Optional) Free Google AI Studio API key for live Gemini garment analysis

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/aaina.git
cd aaina

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Edit .env.local and add your GEMINI_API_KEY (optional; fallback mock works out of the box)

# 4. Start local development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

---

## 7. Responsible AI & Ethics

- **Explicit Consent**: Users are informed that their image is processed solely for generating the virtual try-on preview and is never stored on our servers.
- **Fairness & Diversity**: Virtual try-on diffusion models can exhibit variance across body sizes, skin complexions, and garment textures. Aaina transparently badges all results as "AI preview" to avoid unrealistic expectations.
- **Misuse Safeguards**: Automated checks ensure product images are safe and suitable for wear. We refuse sexually explicit or prohibited items.
- **Single-Click Wipe**: A "Delete Everything" action immediately clears all cached images, blobs, and session memory.

---

## 8. Known Limitations

1. **Hugging Face ZeroGPU Queues**: Free public ZeroGPU Spaces can experience congestion during peak usage hours. When queues are busy, latency can increase up to 60–90 seconds.
2. **Category Boundaries**: Pure IDM-VTON excels primarily on upper-body apparel (shirts, tops, jackets). Multi-category models (CatVTON) handle trousers and dresses.
3. **Lighting & Pose Sensitivity**: Best try-on results occur with front-facing, well-lit standing poses with minimal limb occlusion.

---

## 9. Team Contributions

- **Architect & ML/Full-Stack Engineering**: Masum Abbas
- **Special Acknowledgments**: Built with Google Antigravity IDE for the NYLP AI Hackathon 2026.

---

## 10. Credits & Licences

- IDM-VTON: Choi et al., Korea University & Kakao Corp (CC BY-NC-SA 4.0).
- CatVTON: Zheng et al. (CC BY-NC-SA 4.0).
- Icons provided by [Lucide](https://lucide.dev/) (ISC Licence).
