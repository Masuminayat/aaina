import { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronsLeftRight } from 'lucide-react';

interface Props {
  beforeUrl: string;
  afterUrl: string;
  className?: string;
}

export function CompareSlider({ beforeUrl, afterUrl, className = '' }: Props) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clampedX = Math.max(0, Math.min(x, rect.width));
    const percentage = (clampedX / rect.width) * 100;
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  return (
    <div
      ref={containerRef}
      className={`relative select-none overflow-hidden rounded-2xl bg-stone-950 border border-stone-800 shadow-2xl cursor-ew-resize group ${className}`}
      onMouseDown={() => setIsDragging(true)}
      onTouchStart={() => setIsDragging(true)}
    >
      {/* After Image (Full Background) */}
      <img
        src={afterUrl}
        alt="After Virtual Try-On"
        className="w-full h-full object-contain pointer-events-none block"
      />
      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[11px] font-semibold text-emerald-300 backdrop-blur-md pointer-events-none z-10 shadow-lg">
        After Try-On
      </div>

      {/* Before Image (Clipped Left Layer using standard CSS clip-path) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={beforeUrl}
          alt="Before Original Photo"
          className="w-full h-full object-contain pointer-events-none block"
        />
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-stone-900/80 border border-stone-700/60 text-[11px] font-semibold text-stone-300 backdrop-blur-md z-10 shadow-lg">
          Original Photo
        </div>
      </div>

      {/* Draggable Divider Line & Knob */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-emerald-400 pointer-events-none z-20 shadow-[0_0_12px_rgba(52,211,153,0.8)]"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-stone-900 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-xl group-hover:scale-110 transition-transform">
          <ChevronsLeftRight className="w-4 h-4" />
        </div>
      </div>

      {/* Instruction hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] text-stone-300 pointer-events-none z-10">
        Drag slider to compare
      </div>
    </div>
  );
}
