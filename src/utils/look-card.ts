/**
 * Aaina (آئینہ) — Look Card Generator
 * Creates a high-fidelity, branded 1080x1440 shareable Look Card
 * combining the AI try-on result, garment intelligence metadata,
 * color swatches, and hackathon verification watermark.
 */
import type { GarmentAnalysis } from '../../api/analyze';

interface LookCardOptions {
  resultImageUrl: string;
  garment?: GarmentAnalysis | null;
  diffusionPrompt?: string;
  filename?: string;
}

export async function exportLookCard({
  resultImageUrl,
  garment,
  diffusionPrompt,
  filename = 'aaina-look-card.png',
}: LookCardOptions): Promise<void> {
  const canvas = document.createElement('canvas');
  const width = 1080;
  const height = 1440;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not acquire 2D canvas context');

  // 1. Load try-on result image
  const resultImg = new Image();
  resultImg.crossOrigin = 'anonymous';
  await new Promise<void>((resolve, reject) => {
    resultImg.onload = () => resolve();
    resultImg.onerror = () => reject(new Error('Failed to load result image for look card'));
    resultImg.src = resultImageUrl;
  });

  // 2. Background: Deep luxury dark canvas
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#0a0d10');
  bgGrad.addColorStop(0.5, '#12171e');
  bgGrad.addColorStop(1, '#07090b');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle emerald radial glow in background
  const glow = ctx.createRadialGradient(width / 2, 260, 40, width / 2, 260, 500);
  glow.addColorStop(0, 'rgba(52, 211, 153, 0.12)');
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  // Card Outer Border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 2;
  ctx.strokeRect(30, 30, width - 60, height - 60);

  // 3. Header Section
  // App Title & Urdu
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 38px "Playfair Display", Georgia, serif';
  ctx.fillText('Aaina', 60, 95);

  ctx.fillStyle = '#34d399';
  ctx.font = '700 48px serif';
  ctx.fillText('آئینہ', 190, 98);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = '500 16px Inter, system-ui, sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('AI VIRTUAL FITTING MIRROR', 60, 130);
  ctx.letterSpacing = '0px';

  // Hackathon Badge (Top right)
  const badgeText = 'NYLP AI HACKATHON 2026';
  ctx.font = '600 13px Inter, system-ui, sans-serif';
  const badgeWidth = ctx.measureText(badgeText).width + 30;
  ctx.fillStyle = 'rgba(52, 211, 153, 0.12)';
  ctx.beginPath();
  ctx.roundRect(width - 60 - badgeWidth, 68, badgeWidth, 34, 17);
  ctx.fill();
  ctx.strokeStyle = 'rgba(52, 211, 153, 0.3)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#34d399';
  ctx.fillText(badgeText, width - 60 - badgeWidth + 15, 90);

  // 4. Main Try-on Visual (Center)
  const imgBoxX = 60;
  const imgBoxY = 160;
  const imgBoxW = width - 120; // 960px
  const imgBoxH = 800; // Large hero visual

  // Draw container rounded shadow
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(imgBoxX, imgBoxY, imgBoxW, imgBoxH, 24);
  ctx.clip();

  // Draw image with aspect cover / fit
  const imgAspect = resultImg.width / resultImg.height;
  const boxAspect = imgBoxW / imgBoxH;
  let sWidth = resultImg.width;
  let sHeight = resultImg.height;
  let sx = 0;
  let sy = 0;

  if (imgAspect > boxAspect) {
    sWidth = resultImg.height * boxAspect;
    sx = (resultImg.width - sWidth) / 2;
  } else {
    sHeight = resultImg.width / boxAspect;
    sy = (resultImg.height - sHeight) / 2;
  }

  ctx.drawImage(resultImg, sx, sy, sWidth, sHeight, imgBoxX, imgBoxY, imgBoxW, imgBoxH);

  // Subtle inner gradient at bottom of image
  const imgBottomGlow = ctx.createLinearGradient(0, imgBoxY + imgBoxH - 120, 0, imgBoxY + imgBoxH);
  imgBottomGlow.addColorStop(0, 'rgba(0, 0, 0, 0)');
  imgBottomGlow.addColorStop(1, 'rgba(10, 13, 16, 0.85)');
  ctx.fillStyle = imgBottomGlow;
  ctx.fillRect(imgBoxX, imgBoxY + imgBoxH - 120, imgBoxW, 120);

  ctx.restore();

  // Draw subtle border around image
  ctx.beginPath();
  ctx.roundRect(imgBoxX, imgBoxY, imgBoxW, imgBoxH, 24);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // "AI GENERATED PREVIEW" tag on top-left of image
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.beginPath();
  ctx.roundRect(imgBoxX + 20, imgBoxY + 20, 195, 30, 15);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.font = '600 12px Inter, system-ui, sans-serif';
  ctx.fillText('✦ AI GENERATED PREVIEW', imgBoxX + 32, imgBoxY + 39);

  // 5. Metadata Card (Bottom section)
  const metaY = 1000;
  const metaH = 340;
  const metaX = 60;
  const metaW = width - 120;

  // Background panel for info
  ctx.fillStyle = 'rgba(24, 28, 35, 0.75)';
  ctx.beginPath();
  ctx.roundRect(metaX, metaY, metaW, metaH, 24);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.stroke();

  // Garment Title
  const title = garment?.garment_description || diffusionPrompt || 'Custom Apparel Piece';
  ctx.fillStyle = '#f3f4f6';
  ctx.font = '700 28px Inter, system-ui, sans-serif';
  // Truncate if too long
  const truncatedTitle = title.length > 55 ? title.slice(0, 52) + '…' : title;
  ctx.fillText(truncatedTitle, metaX + 35, metaY + 55);

  // Subtitle / category
  const subCategory = garment
    ? `${garment.category || 'Apparel'} · ${garment.subcategory || 'Fashion'} · ${garment.fit_style || 'Tailored fit'}`
    : 'Diffusion Fit Virtual Try-On';
  ctx.fillStyle = '#34d399';
  ctx.font = '500 16px Inter, system-ui, sans-serif';
  ctx.fillText(subCategory, metaX + 35, metaY + 90);

  // Chips: Fabric, Pattern, Formality
  let chipX = metaX + 35;
  const chipY = metaY + 120;

  const chips: string[] = [];
  if (garment?.fabric_guess) chips.push(`Fabric: ${garment.fabric_guess}`);
  if (garment?.pattern) chips.push(`Pattern: ${garment.pattern}`);
  if (garment?.formality) chips.push(`Formality: Tier ${garment.formality}/5`);
  if (chips.length === 0) chips.push('Studio ZeroGPU Inference', 'IDM-VTON Open Diffusion');

  chips.forEach((chip) => {
    ctx.font = '500 14px Inter, system-ui, sans-serif';
    const cWidth = ctx.measureText(chip).width + 24;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.beginPath();
    ctx.roundRect(chipX, chipY, cWidth, 32, 16);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.stroke();

    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(chip, chipX + 12, chipY + 21);
    chipX += cWidth + 12;
  });

  // Color Swatches
  const colors = garment?.colors && garment.colors.length > 0
    ? garment.colors
    : [{ name: 'Emerald', hex: '#34d399' }, { name: 'Dark Navy', hex: '#1e293b' }];

  let swatchX = metaX + 35;
  const swatchY = metaY + 185;

  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 13px Inter, system-ui, sans-serif';
  ctx.fillText('COLOR PALETTE:', swatchX, swatchY + 16);
  swatchX += 130;

  colors.forEach((c) => {
    // Circle swatch
    ctx.beginPath();
    ctx.arc(swatchX + 12, swatchY + 12, 12, 0, Math.PI * 2);
    ctx.fillStyle = c.hex || '#ffffff';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Color name label
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '500 14px Inter, system-ui, sans-serif';
    ctx.fillText(c.name, swatchX + 32, swatchY + 17);

    swatchX += ctx.measureText(c.name).width + 50;
  });

  // Style Advice / Pairing Note
  const pairing = garment?.pairing_suggestions?.slice(0, 3).join(', ')
    || 'Pair with crisp neutral chinos, denim, or minimalist sneakers';
  ctx.fillStyle = '#94a3b8';
  ctx.font = '400 14px Inter, system-ui, sans-serif';
  ctx.fillText(`Pairing Suggestions: ${pairing}`, metaX + 35, metaY + 245);

  // Guarantee / Trust statement
  ctx.fillStyle = '#64748b';
  ctx.font = '500 13px Inter, system-ui, sans-serif';
  ctx.fillText('🛡️ Zero-Storage Architecture · User photos never stored or retained on servers · Verified by NYLP Hackathon', metaX + 35, metaY + 295);

  // 6. Download Trigger
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png', 0.95));
  if (!blob) throw new Error('Failed to generate Look Card PNG blob');

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
