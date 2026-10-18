import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Orbit, Play, Pause, RotateCcw, Compass } from 'lucide-react';

interface Props {
  imageUrl: string;
  className?: string;
}

export function SpinView({ imageUrl, className = '' }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [yawAngle, setYawAngle] = useState(0); // -30 to +30 degrees
  const [isAutoSpinning, setIsAutoSpinning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const isDraggingRef = useRef(false);
  const prevMouseXRef = useRef(0);
  const prevMouseYRef = useRef(0);
  const currentYawRef = useRef(0);
  const currentPitchRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  // Initialize Three.js scene and 2.5D displaced depth plane
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.z = 3.6;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(2, 3, 4);
    scene.add(dirLight);

    // 4. Load Texture & Construct Displaced Depth Geometry
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(imageUrl, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;

      // Plane aspect ratio 3:4 (w: 2, h: 2.66)
      const planeGeo = new THREE.PlaneGeometry(2, 2.66, 96, 96);
      const posAttr = planeGeo.attributes.position;

      // Create synthetic depth curve: center torso pops forward in z, edges recess
      for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i);
        const y = posAttr.getY(i);
        // Normalized radial distance from central vertical torso
        const distFromCenter = Math.abs(x) / 1.0;
        const verticalFactor = 1.0 - Math.pow(Math.abs(y) / 1.5, 2);
        // Convex depth displacement: center is +0.18 units closer to camera
        const depthZ = Math.max(0, (1.0 - Math.pow(distFromCenter, 1.6)) * 0.22 * Math.max(0.2, verticalFactor));
        posAttr.setZ(i, depthZ);
      }
      planeGeo.computeVertexNormals();

      const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.45,
        metalness: 0.05,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(planeGeo, material);
      meshRef.current = mesh;
      scene.add(mesh);
      setIsLoading(false);
    });

    // 5. Render loop
    let autoSpinDirection = 1;
    const render = () => {
      if (meshRef.current) {
        if (isAutoSpinning) {
          currentYawRef.current += 0.008 * autoSpinDirection;
          if (currentYawRef.current > 0.45) autoSpinDirection = -1;
          if (currentYawRef.current < -0.45) autoSpinDirection = 1;
          setYawAngle(Math.round((currentYawRef.current * 180) / Math.PI));
        }

        meshRef.current.rotation.y = currentYawRef.current;
        meshRef.current.rotation.x = currentPitchRef.current;
      }
      renderer.render(scene, camera);
      animFrameRef.current = requestAnimationFrame(render);
    };
    animFrameRef.current = requestAnimationFrame(render);

    // Resize observer
    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [imageUrl, isAutoSpinning]);

  // Interactive Drag & Orbit
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    prevMouseXRef.current = e.clientX;
    prevMouseYRef.current = e.clientY;
    setIsAutoSpinning(false);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - prevMouseXRef.current;
    const deltaY = e.clientY - prevMouseYRef.current;
    prevMouseXRef.current = e.clientX;
    prevMouseYRef.current = e.clientY;

    // Clamp yaw to +/- 32 deg (+/- 0.55 rad), pitch to +/- 15 deg (+/- 0.26 rad)
    const newYaw = Math.max(-0.55, Math.min(0.55, currentYawRef.current + deltaX * 0.008));
    const newPitch = Math.max(-0.26, Math.min(0.26, currentPitchRef.current + deltaY * 0.008));

    currentYawRef.current = newYaw;
    currentPitchRef.current = newPitch;
    setYawAngle(Math.round((newYaw * 180) / Math.PI));
  }, []);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Touch Support
  const handleTouchStart = (e: React.TouchEvent) => {
    isDraggingRef.current = true;
    prevMouseXRef.current = e.touches[0].clientX;
    prevMouseYRef.current = e.touches[0].clientY;
    setIsAutoSpinning(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.touches[0].clientX - prevMouseXRef.current;
    const deltaY = e.touches[0].clientY - prevMouseYRef.current;
    prevMouseXRef.current = e.touches[0].clientX;
    prevMouseYRef.current = e.touches[0].clientY;

    const newYaw = Math.max(-0.55, Math.min(0.55, currentYawRef.current + deltaX * 0.008));
    const newPitch = Math.max(-0.26, Math.min(0.26, currentPitchRef.current + deltaY * 0.008));

    currentYawRef.current = newYaw;
    currentPitchRef.current = newPitch;
    setYawAngle(Math.round((newYaw * 180) / Math.PI));
  };

  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const deg = parseFloat(e.target.value);
    const rad = (deg * Math.PI) / 180;
    currentYawRef.current = rad;
    setYawAngle(deg);
    setIsAutoSpinning(false);
  };

  const handleResetOrbit = () => {
    currentYawRef.current = 0;
    currentPitchRef.current = 0;
    setYawAngle(0);
    setIsAutoSpinning(false);
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-stone-950 border border-stone-800 shadow-2xl flex flex-col ${className}`}>
      {/* 3D WebGL Canvas Mount */}
      <div
        ref={mountRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center relative select-none"
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-950/80 z-20">
            <div className="flex items-center gap-2 text-xs text-stone-300">
              <Compass className="w-4 h-4 text-emerald-400 animate-spin" />
              <span>Generating 2.5D Depth Mesh…</span>
            </div>
          </div>
        )}
      </div>

      {/* Top Badge */}
      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-emerald-300 flex items-center gap-1.5 pointer-events-none z-10 shadow-lg">
        <Orbit className="w-3.5 h-3.5 text-emerald-400" />
        <span>2.5D Depth Orbit (&plusmn;30&deg;)</span>
      </div>

      {/* Controls Floating Bar */}
      <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-2xl bg-stone-900/90 border border-stone-800/80 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 z-10 shadow-xl">
        {/* Scrubber */}
        <div className="flex-1 w-full flex items-center gap-2">
          <span className="text-[10px] text-stone-400 font-mono w-8 text-right">-30&deg;</span>
          <input
            type="range"
            min="-30"
            max="30"
            step="1"
            value={yawAngle}
            onChange={handleScrubberChange}
            className="flex-1 h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
          <span className="text-[10px] text-stone-400 font-mono w-8">+30&deg;</span>
          <span className="text-xs font-mono font-bold text-emerald-400 w-10 text-center">{yawAngle}&deg;</span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsAutoSpinning(!isAutoSpinning)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 ${
              isAutoSpinning
                ? 'bg-emerald-500 text-stone-950 shadow-md'
                : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
            }`}
          >
            {isAutoSpinning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoSpinning ? 'Pause' : 'Auto-Spin'}</span>
          </button>

          <button
            type="button"
            onClick={handleResetOrbit}
            title="Reset orbit angle"
            className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
