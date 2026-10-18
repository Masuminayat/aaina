# NYLP AI Hackathon 2026 — Official Submission Pack

### 1. Project Information
- **Project Name:** Aaina (آئینہ) — AI Virtual Try-On Mirror
- **Tagline:** "See it on you before you buy it."
- **Team Name:** [PLACEHOLDER: Team Name]
- **Team Members:** Masum Abbas (Lead Architect & Applied ML Engineer), [PLACEHOLDER: Additional Members if any]

---

### 2. Problem Statement
Online shoppers and independent boutique customers struggle to visualize how garments, fabrics, and accessories will look on their specific body type and complexion. This causes frequent bad purchases, expensive returns, and lost sales for small boutique merchants who cannot afford enterprise AR fitting solutions.

---

### 3. Solution Overview
Aaina transforms any web browser or smartphone into a real-time virtual fitting room on a strict $0 budget. The user provides a photo of themselves and any product image. Aaina:
1. Performs on-device **Photo Coach** analysis (framing, lighting, sharpness) with one-click 3:4 auto-fixing.
2. Extracts structured apparel intelligence via **Google Gemini Vision** (category, fabric, colors, formality, and diffusion prompts).
3. Executes virtual try-on via open-source diffusion models (**IDM-VTON** on Hugging Face ZeroGPU).
4. Provides an interactive **Before/After Split Compare Slider** and **Pan & Zoom Inspector**, with secure watermarked exports.
5. Employs a strict **Zero-Storage Privacy Architecture**: the user's selfie is never stored on servers and never sent to Google Gemini.

---

### 4. Deliverable Links
- **GitHub Repository URL:** https://github.com/Masuminayat/aaina
- **Live Demo URL:** https://aaina-one.vercel.app
- **Demo Video URL (60–90s):** [PLACEHOLDER: YouTube / Loom / Drive Demo Video Link]

---

### 5. AI Tools & APIs Used

| AI Component | Architecture / Provider | Where it Runs | Licence | Role in Product |
|--------------|-------------------------|---------------|---------|-----------------|
| **Studio Try-On** | `yisol/IDM-VTON` (Diffusion attention) | Hugging Face ZeroGPU Space | CC BY-NC-SA 4.0 | Renders high-fidelity garment onto person |
| **Garment Intelligence** | Google Gemini 2.5 Flash | Vercel Serverless (`/api/analyze`) | Google AI Studio Free Tier | Classifies product image, colors, fabric, and diffusion prompt |
| **Photo Coach** | HTML5 Canvas Computer Vision | Client Browser (Local) | MIT | Computes 0–100 readiness score and auto-fixes framing |
| **Development Pair** | Antigravity IDE (DeepMind agentic assistant) | Local Dev Environment | Development Assistant | Architecture design, pair programming, debugging, and testing |

---

### 6. Known Limitations
1. **Public ZeroGPU Queue Times:** As documented in `docs/PROVIDER_STATUS.md`, Hugging Face ZeroGPU queues can experience peak latency between 30s and 75s.
2. **Category Boundaries:** Primary diffusion pipeline excels at upper garments (shirts, tops, jackets); complex full-length dresses or layered outerwear may exhibit minor edge blending.
3. **Lighting & Angles:** Best results occur with well-lit, upright, front-facing poses.
