/**
 * Watermark Downloader
 * Implements Section 8 of PROJECT_SPEC.md:
 * "Watermark downloads ('Aaina · AI preview') and add a visible 'AI-generated' label"
 */

export async function downloadWithWatermark(imageUrl: string, filename = 'aaina-tryon-preview.png'): Promise<void> {
  const img = new Image();
  img.crossOrigin = 'anonymous';

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Failed to load image for watermarking'));
    img.src = imageUrl;
  });

  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;
  const ctx = canvas.getContext('2d')!;

  // Draw base image
  ctx.drawImage(img, 0, 0);

  // Compute proportional badge sizing
  const scale = Math.max(0.6, canvas.width / 1000);
  const badgeH = Math.round(38 * scale);
  const badgePadX = Math.round(18 * scale);
  const margin = Math.round(20 * scale);
  const fontSize = Math.round(14 * scale);

  ctx.font = `600 ${fontSize}px sans-serif`;
  const text = 'Aaina · AI preview';
  const textWidth = ctx.measureText(text).width;
  const badgeW = textWidth + badgePadX * 2;

  const bx = canvas.width - badgeW - margin;
  const by = canvas.height - badgeH - margin;

  // Background pill with soft shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 10 * scale;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'; // Slate 900 translucent
  ctx.beginPath();
  const radius = badgeH / 2;
  ctx.roundRect(bx, by, badgeW, badgeH, radius);
  ctx.fill();

  // Subtle border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // Accent emerald dot
  ctx.fillStyle = '#34d399'; // Emerald 400
  ctx.beginPath();
  const dotR = 3.5 * scale;
  const dotX = bx + badgePadX - 4 * scale;
  const dotY = by + badgeH / 2;
  ctx.arc(dotX, dotY, dotR, 0, Math.PI * 2);
  ctx.fill();

  // Text
  ctx.fillStyle = '#f8fafc';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, dotX + dotR + 8 * scale, dotY);
  ctx.restore();

  // Trigger download
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('Failed to generate watermarked blob');

  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}
