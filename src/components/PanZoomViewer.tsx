import { useState, useRef, useCallback, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Move } from 'lucide-react';

interface Props {
  imageUrl: string;
  alt?: string;
  className?: string;
}

export function PanZoomViewer({ imageUrl, alt = 'Virtual Try-On Result', className = '' }: Props) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setScale((s) => Math.min(s * 1.3, 5));
  const handleZoomOut = () => setScale((s) => Math.max(s / 1.3, 0.7));
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
    setScale((s) => Math.min(Math.max(s * zoomFactor, 0.7), 5));
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1 && position.x === 0 && position.y === 0 && e.button !== 0) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      className={`relative overflow-hidden rounded-2xl bg-stone-950 border border-stone-800 shadow-2xl select-none ${
        isDragging ? 'cursor-grabbing' : scale > 1 ? 'cursor-grab' : 'cursor-default'
      } ${className}`}
    >
      {/* Centered Image with transform */}
      <div
        className="w-full h-full flex items-center justify-center transition-transform duration-75 ease-out will-change-transform"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
        }}
      >
        <img
          src={imageUrl}
          alt={alt}
          draggable={false}
          className="max-w-full max-h-full object-contain pointer-events-none"
        />
      </div>

      {/* Floating Viewport Controls */}
      <div className="absolute bottom-4 right-4 flex items-center gap-1.5 p-1.5 rounded-xl bg-stone-900/90 border border-stone-800/80 backdrop-blur-md shadow-2xl z-20">
        <button
          type="button"
          onClick={handleZoomIn}
          title="Zoom in (or mouse wheel)"
          className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleZoomOut}
          title="Zoom out"
          className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-stone-800 mx-0.5" />

        <button
          type="button"
          onClick={handleReset}
          title="Reset zoom & pan"
          className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition-colors text-xs font-semibold px-2 flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{Math.round(scale * 100)}%</span>
        </button>
      </div>

      {/* Top watermark tag */}
      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-[10px] font-medium text-stone-300 z-10 flex items-center gap-1.5">
        <Move className="w-3 h-3 text-emerald-400" />
        <span>Pan & Zoom enabled</span>
      </div>
    </div>
  );
}
