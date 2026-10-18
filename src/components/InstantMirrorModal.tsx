import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, X, Sparkles, Video, Image as ImageIcon } from 'lucide-react';
import { downloadWithWatermark } from '../utils/watermark';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  stillPhotoUrl?: string | null;
}

type AccessoryType = 'glasses' | 'hat' | 'watch' | 'necklace' | 'shirt';

interface AccessoryItem {
  id: AccessoryType;
  label: string;
  icon: string;
  defaultScale: number;
  svgPath: string;
}

const ACCESSORIES: AccessoryItem[] = [
  {
    id: 'glasses',
    label: 'Dark Sunglasses',
    icon: '🕶️',
    defaultScale: 1.0,
    svgPath: 'M 10 25 Q 35 15 60 25 Q 75 25 90 25 Q 115 15 140 25 Q 148 45 130 55 Q 100 60 90 35 Q 75 35 60 35 Q 50 60 20 55 Q 2 45 10 25 Z',
  },
  {
    id: 'hat',
    label: 'Urban Cap',
    icon: '🧢',
    defaultScale: 1.4,
    svgPath: 'M 20 60 C 20 20 130 20 130 60 C 160 62 175 75 140 80 C 100 80 50 78 15 72 Z',
  },
  {
    id: 'necklace',
    label: 'Gold Chain',
    icon: '📿',
    defaultScale: 1.2,
    svgPath: 'M 20 10 Q 75 80 130 10 Q 75 95 20 10 Z',
  },
  {
    id: 'watch',
    label: 'Chronograph',
    icon: '⌚',
    defaultScale: 0.8,
    svgPath: 'M 50 0 L 70 0 L 70 20 A 25 25 0 1 0 50 20 L 50 0 Z M 50 60 L 50 80 L 70 80 L 70 60 Z',
  },
  {
    id: 'shirt',
    label: 'Quick Torso Warp',
    icon: '👕',
    defaultScale: 1.8,
    svgPath: 'M 30 20 L 50 10 L 70 25 L 90 10 L 110 20 L 130 40 L 115 50 L 105 45 L 105 100 L 35 100 L 35 45 L 25 50 L 10 40 Z',
  },
];

export function InstantMirrorModal({ isOpen, onClose, stillPhotoUrl }: Props) {
  const [sourceMode, setSourceMode] = useState<'webcam' | 'photo'>(stillPhotoUrl ? 'photo' : 'webcam');
  const [selectedAccessory, setSelectedAccessory] = useState<AccessoryType>('glasses');
  const [position, setPosition] = useState({ x: 200, y: 150 });
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0); // degrees
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Start webcam
  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: unknown) {
      console.warn('Webcam access error:', err);
      setCameraError('Camera access unavailable. Switched to Still Photo mode.');
      setSourceMode('photo');
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isOpen && sourceMode === 'webcam') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen, sourceMode, startCamera, stopCamera]);

  // Real-time canvas render loop
  useEffect(() => {
    if (!isOpen) return;
    let animId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const cw = canvas.width;
      const ch = canvas.height;
      ctx.clearRect(0, 0, cw, ch);

      // 1. Draw Background (Webcam video or Still photo)
      if (sourceMode === 'webcam' && videoRef.current && videoRef.current.readyState >= 2) {
        ctx.save();
        // Mirror webcam horizontally for natural mirror feel
        ctx.translate(cw, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(videoRef.current, 0, 0, cw, ch);
        ctx.restore();
      } else if (sourceMode === 'photo' && stillPhotoUrl) {
        const photo = new Image();
        photo.src = stillPhotoUrl;
        if (photo.complete) {
          ctx.drawImage(photo, 0, 0, cw, ch);
        }
      } else {
        // Fallback neutral backdrop
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, cw, ch);
      }

      // 2. Draw Simulated AR Accessory
      const currentItem = ACCESSORIES.find((a) => a.id === selectedAccessory) || ACCESSORIES[0];
      ctx.save();
      ctx.translate(position.x, position.y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(scale * currentItem.defaultScale, scale * currentItem.defaultScale);

      // Soft AR Contact Shadow
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 6;

      // Render vector accessory path
      const path = new Path2D(currentItem.svgPath);
      ctx.fillStyle = currentItem.id === 'glasses' ? '#0f172a' : currentItem.id === 'necklace' ? '#eab308' : '#10b981';
      ctx.fill(path);
      ctx.lineWidth = 2;
      ctx.strokeStyle = currentItem.id === 'necklace' ? '#fde047' : '#34d399';
      ctx.stroke(path);
      ctx.restore();

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isOpen, sourceMode, stillPhotoUrl, selectedAccessory, position, scale, rotation]);

  // Touch & Mouse Dragging of Accessory
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    isDraggingRef.current = true;
    dragStartRef.current = { x: x - position.x, y: y - position.y };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPosition({
      x: x - dragStartRef.current.x,
      y: y - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Snapshot Capture
  const handleCaptureSnapshot = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    await downloadWithWatermark(dataUrl, `aaina-instant-${selectedAccessory}.png`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-stone-900 border border-stone-800 shadow-2xl flex flex-col text-stone-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-stone-100">Mirror Mode: Instant On-Device AR</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-mono">
              30+ FPS · $0 Cost
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Source Switcher */}
        <div className="px-4 py-2 bg-stone-950/60 border-b border-stone-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSourceMode('webcam')}
              className={`px-3 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                sourceMode === 'webcam'
                  ? 'bg-emerald-500 text-stone-950 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Live Webcam</span>
            </button>

            {stillPhotoUrl && (
              <button
                type="button"
                onClick={() => setSourceMode('photo')}
                className={`px-3 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                  sourceMode === 'photo'
                    ? 'bg-emerald-500 text-stone-950 font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Uploaded Photo</span>
              </button>
            )}
          </div>

          <span className="text-[11px] text-stone-400 hidden sm:inline">
            Drag item to position · Scale & Rotate below
          </span>
        </div>

        {/* Viewport Canvas */}
        <div className="relative bg-stone-950 flex items-center justify-center overflow-hidden h-[340px] sm:h-[400px]">
          {/* Hidden video element for webcam frame ingestion */}
          <video ref={videoRef} playsInline muted className="hidden" />

          {/* Interactive AR Overlay Canvas */}
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="w-full h-full object-contain cursor-move"
          />

          {cameraError && (
            <div className="absolute top-3 left-3 right-3 p-2 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-200 text-xs text-center backdrop-blur-md">
              {cameraError}
            </div>
          )}
        </div>

        {/* Accessory Selection Shelf */}
        <div className="p-3 bg-stone-950/80 border-t border-stone-800 flex items-center gap-2 overflow-x-auto">
          {ACCESSORIES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setSelectedAccessory(item.id);
                // Center item on selection
                setPosition({ x: 320, y: 200 });
              }}
              className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 shrink-0 transition-all ${
                selectedAccessory === item.id
                  ? 'border-emerald-400 bg-emerald-950/40 text-emerald-300 shadow-md'
                  : 'border-stone-800 bg-stone-900 text-stone-300 hover:border-stone-700'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Sliders & Capture Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          {/* Controls */}
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2 flex-1 sm:w-36">
              <span className="text-[11px] text-stone-400 font-mono">Scale</span>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.05"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>

            <div className="flex items-center gap-2 flex-1 sm:w-36">
              <span className="text-[11px] text-stone-400 font-mono">Rotate</span>
              <input
                type="range"
                min="-60"
                max="60"
                step="2"
                value={rotation}
                onChange={(e) => setRotation(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>
          </div>

          {/* Snapshot Button */}
          <button
            type="button"
            onClick={handleCaptureSnapshot}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg active:scale-95"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Capture AR Snapshot</span>
          </button>
        </div>
      </div>
    </div>
  );
}
