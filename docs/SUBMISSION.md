# NYLP AI Hackathon 2026 — Official Submission Pack

### 1. Project Information
- **Project Name:** Aaina (آئینہ) — AI Virtual Try-On Mirror & Styling Suite
- **Tagline:** "See it on you before you buy it."
- **Team Name:** [PLACEHOLDER: Team Name]
- **Team Members:** Masum Abbas (Lead Architect & Applied ML Engineer), [PLACEHOLDER: Additional Members if any]

---

### 2. Problem Statement
Online shoppers and independent boutique customers struggle to visualize how garments, fabrics, and accessories will look on their specific body type and complexion. This causes frequent bad purchases, expensive returns (over 30% of apparel sales), and lost revenue for small boutique merchants who cannot afford enterprise AR fitting solutions.

---

### 3. Solution Overview
Aaina transforms any web browser or smartphone into a real-time virtual fitting room on a strict $0 budget. The user provides a photo of themselves and any product image. Aaina:
1. Performs on-device **Photo Coach** analysis (framing, lighting, sharpness) with one-click 3:4 auto-fixing.
2. Extracts structured apparel intelligence via **Google Gemini Vision** (category, fabric, colors, formality, and diffusion prompts).
3. Executes virtual try-on via open-source diffusion models (**IDM-VTON** on Hugging Face ZeroGPU).
4. Provides an interactive **Before/After Split Compare Slider**, **Pan & Zoom Inspector**, and **2.5D Orbit Spin View** (Three.js WebGL depth mesh).
5. Provides a **Gemini Style Advisor** (objective pairing & color theory with body-neutral guardrails) and an **Outfit Stacker (Look A vs Look B Decider)**.
6. Delivers a zero-latency **Instant AR Mirror** for accessories (sunglasses, caps, watches) directly on webcam or photo.
7. Generates branded, high-resolution 1080x1440 **Look Cards** for social sharing.
8. Enforces a strict **Zero-Storage Privacy Architecture**: the user's selfie is never stored on servers and never sent to Google Gemini.

---

### 4. Deliverable Links
- **GitHub Repository URL:** https://github.com/Masuminayat/aaina
- **Live Demo URL:** https://aaina-one.vercel.app
- **Demo Video URL (60–90s):** [PLACEHOLDER: YouTube / Loom / Drive Demo Video Link]
- **Demo Script:** [`docs/DEMO_SCRIPT.md`](docs/DEMO_SCRIPT.md)
- **Evaluation & Benchmark Matrix:** [`docs/EVALUATION.md`](docs/EVALUATION.md)
- **Deployment & Architecture Guide:** [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)

---

### 5. AI Tools & APIs Used

| AI Component | Architecture / Provider | Where it Runs | Licence | Role in Product |
|--------------|-------------------------|---------------|---------|-----------------|
| **Studio Try-On** | `yisol/IDM-VTON` (Diffusion attention) | Hugging Face ZeroGPU Space | CC BY-NC-SA 4.0 | Renders high-fidelity garment drape onto person pose |
| **Garment Intelligence** | Google Gemini 2.5 Flash | Vercel Serverless (`/api/analyze`) | Google AI Studio Free Tier | Classifies product image, colors, fabric, and diffusion prompt |
| **Style Advisor** | Google Gemini 2.5 Flash | Vercel Serverless (`/api/advise`) | Google AI Studio Free Tier | Objective fashion pairings & color harmony with body neutrality |
| **Photo Coach** | HTML5 Canvas Computer Vision | Client Browser (Local) | MIT | Computes 0–100 readiness score and auto-fixes framing |
| **2.5D Orbit Mesh** | Three.js Displaced Depth Plane | Client Browser (WebGL) | MIT | Real-time interactive 3D turntable orbit view (&plusmn;30&deg;) |
| **Instant AR Mirror** | Canvas Landmark Mesh & Overlay | Client Browser (Local) | MIT | Realtime 60 FPS accessory try-on (glasses, hats, watches) |
| **Look Card Generator** | 2D Canvas Compositor | Client Browser (Local) | MIT | High-resolution 1080x1440 branded image export |
| **Development Pair** | Antigravity IDE (DeepMind agentic assistant) | Local Dev Environment | Development Assistant | Architecture design, pair programming, debugging, and testing |

---

### 6. Known Limitations
1. **Public ZeroGPU Queue Times:** As documented in `docs/PROVIDER_STATUS.md`, Hugging Face ZeroGPU queues can experience peak latency between 30s and 75s under heavy public traffic. Instant AR mode is provided as an immediate fallback.
2. **Category Boundaries:** Primary diffusion pipeline excels at upper garments (shirts, tops, jackets); complex full-length dresses or layered outerwear may exhibit minor edge blending.
3. **Lighting & Angles:** Best results occur with well-lit, upright, front-facing poses. Photo Coach automatically warns users when contrast or orientation is suboptimal.
