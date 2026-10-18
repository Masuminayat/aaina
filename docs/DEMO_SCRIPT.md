# Aaina (آئینہ) — 60–90 Second Hackathon Demo Video Script

**Target Duration:** 75 seconds  
**Tone:** Confident, concise, focused on real-world impact, privacy, and technical innovation.  
**Live URL:** https://aaina-one.vercel.app  
**GitHub:** https://github.com/Masuminayat/aaina  

---

### Timeline & Stage Directions

#### [0:00 - 0:10] Hook & Problem (10 seconds)
- **Visual:** Open browser tab at `https://aaina-one.vercel.app`. The dark luxury landing page is visible with the glowing emerald badge *"NYLP AI Hackathon 2026 Entry"* and the Urdu calligraphy *"آئینہ"*.
- **Voiceover:**  
  *"Over 30% of online apparel orders are returned simply because shoppers can't see how clothes look on their own body before buying. Enterprise AR try-on costs thousands of dollars. Meet **Aaina** — the open-source virtual fitting mirror that runs entirely on a zero-dollar budget."*

---

#### [0:10 - 0:25] Step 1: You & On-Device Photo Coach (15 seconds)
- **Visual:** Click **"Try with your photo"** (or **"Try sample images"** for instantaneous demo). Show the user selfie appearing with the **Photo Coach** running instantly.
- **Action:** Point cursor to the Photo Coach card: Score: **96/100**, checking resolution, 3:4 framing, luminance exposure, and Laplacian sharpness. Click **"Auto-Fix to 3:4 Ratio"** to demonstrate one-click client-side canvas correction.
- **Voiceover:**  
  *"First, our on-device Photo Coach analyzes framing, lighting, and edge sharpness in under 35 milliseconds. With one click, it crops and auto-fixes the image to the optimal 3:4 aspect ratio without sending a single byte to the cloud."*

---

#### [0:25 - 0:40] Step 2: Product & Garment Intelligence (15 seconds)
- **Visual:** Proceed to Step 2. Select the sample garment (or upload any clothing image). The **Garment Intelligence Card** animates with extracted metadata.
- **Action:** Highlight the Gemini 2.5 Flash chips: Category (*Upper Garment*), Fabric (*Cotton Flannel*), Palette (*Forest Green & Navy*), and editable diffusion prompt.
- **Voiceover:**  
  *"Next, Google Gemini Vision classifies the garment cut, fabric, and color palette, generating an optimized prompt for the diffusion model. Notice our privacy guarantee: only the product photo is analyzed by Gemini — your selfie is never exposed."*

---

#### [0:40 - 0:58] Step 3: Studio Try-On & Interactive Workspace (18 seconds)
- **Visual:** Click **"Generate Virtual Try-On"**. Show the multi-stage progress indicator (*Checking photo → Understanding product → Diffusion on ZeroGPU*). Transition to the result workspace.
- **Action:**
  1. Drag the **Before / After Split Slider** back and forth across the torso.
  2. Click **"Pan & Zoom Inspector"** to show close-up fabric texture.
  3. Click **"2.5D Orbit Spin"** to rotate the person ±30° in 3D WebGL space.
- **Voiceover:**  
  *"Our ZeroGPU diffusion engine fits the garment naturally to the user's pose. In the workspace, you can slide before and after, inspect stitching with Pan & Zoom, and orbit in a 2.5D depth mesh to see the drape from every angle."*

---

#### [0:58 - 1:12] Step 4: Styling Suite & Instant AR Mode (14 seconds)
- **Visual:** Click **"Style Advisor (Gemini)"** to show occasion advice, then **"Outfit Stacker"** for Look A vs Look B, and open **"Instant AR Mirror"**.
- **Action:** Select sunglasses and cap overlay in Instant Mirror mode to show zero-latency accessory try-on. Click **"Export Look Card"** to show the generated 1080x1440 shareable Instagram/Pinterest card.
- **Voiceover:**  
  *"For styling, our Gemini Advisor suggests pairings and color harmony with strict body-neutral ethics. The Outfit Stacker lets you compare Look A versus Look B, while Instant AR mode offers zero-latency accessory fitting for sunglasses and caps."*

---

#### [1:12 - 1:20] Trust, Audit Panel & Outro (8 seconds)
- **Visual:** Scroll to the **"Under The Hood Pipeline Audit"** table showing runtime latency and zero retention across all 4 stages. End on the header logo.
- **Voiceover:**  
  *"Aaina is 100% zero-storage, watermarks every output responsibly, and operates completely free. Try it now at aaina-one.vercel.app. Thank you!"*

---

### Tips for Recording
1. **Resolution:** 1920x1080 (1080p) or 2560x1440.
2. **Audio:** Clean microphone with noise suppression.
3. **Browser:** Chrome or Edge in full-screen (`F11`), dark mode.
4. **Backup Plan:** Pre-load the sample demo assets so you can demonstrate the full workflow without waiting for public GPU queue times.
