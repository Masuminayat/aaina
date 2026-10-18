# Aaina (آئینہ) — Step-by-Step Setup & Deployment Guide

> For NYLP AI Hackathon 2026 Submission

This guide outlines the exact, click-by-click instructions to deploy Aaina to a live public URL on Vercel and set up your environment.

---

## 1. Prerequisites (All $0 Free Tiers)

1. **GitHub Account**: To host the public repository.
2. **Vercel Account**: Free Hobby tier for hosting the frontend & serverless API.
3. **Google Gemini API Key** (Free Tier):
   - Visit [Google AI Studio](https://aistudio.google.com/)
   - Click **Get API key** → **Create API key**
   - Copy your key (starts with `AIza...`)
   - *Note: Free tier is $0 and provides generous RPM/TPM limits for `gemini-2.5-flash`.*
4. **Hugging Face Account (Optional)**:
   - For free inference, no token is required (ZeroGPU anonymous quota is used).
   - If you wish to bypass queue traffic, create a free Read Token at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens).

---

## 2. Push Code to GitHub

Open your terminal in this repository folder and run:

```bash
git init
git add .
git commit -m "feat: complete Phase 0 Aaina virtual try-on architecture"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/aaina.git
git push -u origin main
```

*(Ensure the repo visibility is set to **Public** as required by the hackathon rulebook).*

---

## 3. Import & Deploy to Vercel

1. Log in to [Vercel](https://vercel.com).
2. Click **Add New...** → **Project**.
3. Select your newly created `aaina` GitHub repository and click **Import**.
4. In the Project Configuration screen:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Expand **Environment Variables** and add:
   - `GEMINI_API_KEY`: `AIza...` (your free Google AI Studio key)
   - `GEMINI_MODEL`: `gemini-2.5-flash`
   - `GEMINI_FALLBACK_MODEL`: `gemini-2.5-flash-lite`
6. Click **Deploy**.
7. Once deployment finishes (typically ~45 seconds), copy your live production URL (e.g., `https://aaina-xyz.vercel.app`).

---

## 4. Verification Checklist on Live URL

1. Open the live URL in an incognito window and on your mobile device.
2. Verify the **Consent Gate** appears and requires explicit acknowledgment.
3. Click **Try Sample Demo** to verify pre-loaded sample images (`sample-person.jpg` and `sample-garment.jpg`).
4. Click **Try On (Diffusion Studio)**:
   - Observe pipeline status stages: `Preparing` → `Queued` → `Generating` → `Done`.
   - Inspect the try-on result and test the interactive **Before/After Compare Slider**.
5. Test downloading the result and verify the **"Aaina · AI preview"** watermark is embedded.
6. Check the **Under the Hood** panel to see live latency and architecture diagnostics.

---

## 5. Local Development Instructions

To run locally on your machine:

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env.local

# 3. Add your GEMINI_API_KEY to .env.local (optional; local mock fallback is built-in)

# 4. Start Vite development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.
