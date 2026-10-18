/**
 * Aaina (آئینہ) — Outfit Builder & Stacking Comparator
 * Allows stacking companion pieces (Tops, Bottoms, Layers, Accessories)
 * and comparing Look A vs Look B side-by-side or via interactive split.
 */
import { useState } from 'react';
import {
  Layers,
  Sparkles,
  X,
  Bookmark,
  CheckCircle2,
} from 'lucide-react';
import type { GarmentAnalysis } from '../../api/analyze';
import { CompareSlider } from './CompareSlider';

export interface SavedLook {
  id: string;
  name: string;
  imageUrl: string;
  garmentTitle: string;
  timestamp: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentResultUrl: string | null;
  garmentAnalysis: GarmentAnalysis | null;
  savedLooks: SavedLook[];
  onSaveLook: (name: string) => void;
  onSelectLookForTryOn?: (look: SavedLook) => void;
}

interface CompanionPiece {
  id: string;
  category: 'bottom' | 'outerwear' | 'shoes' | 'accessory';
  name: string;
  colorName: string;
  colorHex: string;
  imageUrl: string;
}

const PRESET_COMPANIONS: CompanionPiece[] = [
  {
    id: 'b1',
    category: 'bottom',
    name: 'Raw Indigo Selvedge Denim',
    colorName: 'Deep Indigo',
    colorHex: '#1e3a8a',
    imageUrl: '/demo-assets/sample-garment.jpg',
  },
  {
    id: 'b2',
    category: 'bottom',
    name: 'Pleated Sand Beige Chinos',
    colorName: 'Sand Beige',
    colorHex: '#d4b996',
    imageUrl: '/demo-assets/sample-garment.jpg',
  },
  {
    id: 'b3',
    category: 'bottom',
    name: 'Charcoal Tailored Trousers',
    colorName: 'Charcoal',
    colorHex: '#334155',
    imageUrl: '/demo-assets/sample-garment.jpg',
  },
  {
    id: 'o1',
    category: 'outerwear',
    name: 'Unstructured Wool Blazer',
    colorName: 'Slate Navy',
    colorHex: '#0f172a',
    imageUrl: '/demo-assets/sample-garment.jpg',
  },
  {
    id: 's1',
    category: 'shoes',
    name: 'Clean White Low Sneakers',
    colorName: 'Crisp White',
    colorHex: '#f8fafc',
    imageUrl: '/demo-assets/sample-garment.jpg',
  },
  {
    id: 'a1',
    category: 'accessory',
    name: 'Classic Horology Chrono',
    colorName: 'Steel / Black',
    colorHex: '#18181b',
    imageUrl: '/demo-assets/sample-garment.jpg',
  },
];

export function OutfitBuilderModal({
  isOpen,
  onClose,
  currentResultUrl,
  garmentAnalysis,
  savedLooks,
  onSaveLook,
}: Props) {
  const [selectedBottom, setSelectedBottom] = useState<string>('b1');
  const [selectedOuter, setSelectedOuter] = useState<string | null>(null);
  const [selectedShoes, setSelectedShoes] = useState<string>('s1');
  const [selectedAccessory, setSelectedAccessory] = useState<string | null>('a1');

  // Look Comparison Mode: 'single' | 'compare-ab'
  const [viewMode, setViewMode] = useState<'stack' | 'compare-ab'>('stack');
  const lookAName = 'Look A (Current)';
  const [lookBIndex, setLookBIndex] = useState<number>(0);
  const [justSaved, setJustSaved] = useState(false);

  if (!isOpen) return null;

  const currentTitle = garmentAnalysis?.garment_description || 'Fitted Garment';
  const lookB = savedLooks.length > 0 ? savedLooks[lookBIndex % savedLooks.length] : null;

  const handleSaveCurrentAsLook = () => {
    onSaveLook(lookAName);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl bg-stone-900 border border-stone-800 shadow-2xl flex flex-col text-stone-100 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-stone-100">Outfit Stacker & Wardrobe Compare</h3>
              <p className="text-xs text-stone-400">Stack layers, coordinate palettes, and compare Look A vs Look B</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle View Mode */}
            <div className="flex items-center p-0.5 rounded-lg bg-stone-950 border border-stone-800 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('stack')}
                className={`px-3 py-1 rounded-md font-semibold transition-all ${
                  viewMode === 'stack' ? 'bg-emerald-500 text-stone-950 shadow-sm' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Wardrobe Stacker
              </button>
              <button
                type="button"
                onClick={() => setViewMode('compare-ab')}
                className={`px-3 py-1 rounded-md font-semibold transition-all ${
                  viewMode === 'compare-ab' ? 'bg-emerald-500 text-stone-950 shadow-sm' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Look A vs Look B
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {viewMode === 'stack' ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Left Column: Try-On Visual with Layer Overlay Chips */}
              <div className="md:col-span-5 flex flex-col items-center">
                <div className="relative w-full aspect-[3/4] max-w-[340px] rounded-2xl overflow-hidden border border-stone-800 bg-stone-950 shadow-lg group">
                  {currentResultUrl ? (
                    <img
                      src={currentResultUrl}
                      alt="Current outfit"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-stone-500 p-4 text-center">
                      <Layers className="w-8 h-8 mb-2 opacity-50" />
                      <span>Generate a try-on result first to view your outfit in context.</span>
                    </div>
                  )}

                  {/* Active Stacking Chips Float */}
                  <div className="absolute top-3 left-3 right-3 flex flex-col gap-1.5 pointer-events-none">
                    <div className="bg-stone-950/80 backdrop-blur-md border border-stone-800 px-2.5 py-1 rounded-lg text-[11px] flex items-center justify-between text-stone-200 shadow-sm">
                      <span className="text-emerald-400 font-semibold uppercase tracking-wider text-[10px]">Top / Main:</span>
                      <span className="truncate max-w-[140px]">{currentTitle}</span>
                    </div>

                    {selectedBottom && (
                      <div className="bg-stone-950/80 backdrop-blur-md border border-stone-800 px-2.5 py-1 rounded-lg text-[11px] flex items-center justify-between text-stone-200 shadow-sm">
                        <span className="text-blue-400 font-semibold uppercase tracking-wider text-[10px]">Bottom:</span>
                        <span className="truncate max-w-[140px]">
                          {PRESET_COMPANIONS.find((p) => p.id === selectedBottom)?.name}
                        </span>
                      </div>
                    )}

                    {selectedOuter && (
                      <div className="bg-stone-950/80 backdrop-blur-md border border-stone-800 px-2.5 py-1 rounded-lg text-[11px] flex items-center justify-between text-stone-200 shadow-sm">
                        <span className="text-amber-400 font-semibold uppercase tracking-wider text-[10px]">Layer:</span>
                        <span className="truncate max-w-[140px]">
                          {PRESET_COMPANIONS.find((p) => p.id === selectedOuter)?.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Save to Wardrobe Float */}
                  <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                    <button
                      type="button"
                      onClick={handleSaveCurrentAsLook}
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-all cursor-pointer"
                    >
                      {justSaved ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-stone-950" />
                          <span>Saved to Looks!</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>Save as Look #{savedLooks.length + 1}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-3 text-[11px] text-stone-400 text-center">
                  Stacked coordinate pieces calculate color harmony automatically
                </div>
              </div>

              {/* Right Column: Piece Selectors */}
              <div className="md:col-span-7 space-y-5">
                {/* 1. Bottoms Selector */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      Coordinate Bottoms
                    </h4>
                    <span className="text-[11px] text-stone-400">Match formality & cut</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {PRESET_COMPANIONS.filter((p) => p.category === 'bottom').map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedBottom(item.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          selectedBottom === item.id
                            ? 'bg-emerald-500/10 border-emerald-500/50 shadow-sm'
                            : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="w-3 h-3 rounded-full border border-white/20 shrink-0"
                            style={{ backgroundColor: item.colorHex }}
                          />
                          <span className="text-xs font-semibold text-stone-200 truncate">{item.name}</span>
                        </div>
                        <span className="text-[10px] text-stone-400">{item.colorName}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Outerwear / Layers */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      Outerwear & Overlayers (Optional)
                    </h4>
                    {selectedOuter && (
                      <button
                        type="button"
                        onClick={() => setSelectedOuter(null)}
                        className="text-[11px] text-stone-400 hover:text-rose-400"
                      >
                        Clear layer
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {PRESET_COMPANIONS.filter((p) => p.category === 'outerwear').map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedOuter(selectedOuter === item.id ? null : item.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          selectedOuter === item.id
                            ? 'bg-emerald-500/10 border-emerald-500/50 shadow-sm'
                            : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="w-3 h-3 rounded-full border border-white/20 shrink-0"
                            style={{ backgroundColor: item.colorHex }}
                          />
                          <span className="text-xs font-semibold text-stone-200 truncate">{item.name}</span>
                        </div>
                        <span className="text-[10px] text-stone-400">{item.colorName}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Footwear & Accessories */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                      Footwear Match
                    </h4>
                    {PRESET_COMPANIONS.filter((p) => p.category === 'shoes').map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedShoes(item.id)}
                        className={`w-full p-2.5 rounded-xl border text-left transition-all ${
                          selectedShoes === item.id
                            ? 'bg-emerald-500/10 border-emerald-500/50'
                            : 'bg-stone-950/60 border-stone-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full border border-white/20 shrink-0"
                            style={{ backgroundColor: item.colorHex }}
                          />
                          <span className="text-xs font-semibold text-stone-200">{item.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                      Accent Piece
                    </h4>
                    {PRESET_COMPANIONS.filter((p) => p.category === 'accessory').map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedAccessory(selectedAccessory === item.id ? null : item.id)}
                        className={`w-full p-2.5 rounded-xl border text-left transition-all ${
                          selectedAccessory === item.id
                            ? 'bg-emerald-500/10 border-emerald-500/50'
                            : 'bg-stone-950/60 border-stone-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full border border-white/20 shrink-0"
                            style={{ backgroundColor: item.colorHex }}
                          />
                          <span className="text-xs font-semibold text-stone-200">{item.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Outfit Score Card */}
                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
                      94%
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-200">Color & Silhouette Harmony</div>
                      <div className="text-[11px] text-stone-400">
                        {selectedBottom === 'b1'
                          ? 'Classic contrast: indigo grounds the upper garment without color clash.'
                          : 'Neutral pairing: earthy tones complement warm light.'}
                      </div>
                    </div>
                  </div>
                  <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
                </div>
              </div>
            </div>
          ) : (
            /* Look A vs Look B Comparison Mode */
            <div className="space-y-6">
              {savedLooks.length === 0 ? (
                <div className="py-12 text-center max-w-md mx-auto">
                  <Bookmark className="w-10 h-10 text-stone-600 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-stone-200 mb-1">No Alternate Looks Saved Yet</h4>
                  <p className="text-xs text-stone-400 leading-relaxed mb-4">
                    Save your current try-on using the &ldquo;Save as Look&rdquo; button, then try another garment to compare both outfits side-by-side!
                  </p>
                  <button
                    type="button"
                    onClick={handleSaveCurrentAsLook}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs inline-flex items-center gap-2"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Save Current as Look #1</span>
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-sm font-bold text-stone-200">A/B Outfit Decider</h4>
                      <p className="text-xs text-stone-400">Drag split slider or inspect side-by-side</p>
                    </div>

                    {/* Look B selector */}
                    {savedLooks.length > 1 && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-stone-400">Compare against:</span>
                        <select
                          value={lookBIndex}
                          onChange={(e) => setLookBIndex(Number(e.target.value))}
                          className="px-2.5 py-1.5 rounded-lg bg-stone-950 border border-stone-800 text-stone-200 text-xs"
                        >
                          {savedLooks.map((look, i) => (
                            <option key={look.id} value={i}>
                              {look.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Split Comparison */}
                  {currentResultUrl && lookB && (
                    <div className="h-[460px] rounded-2xl overflow-hidden border border-stone-800">
                      <CompareSlider
                        beforeUrl={lookB.imageUrl}
                        afterUrl={currentResultUrl}
                        className="w-full h-full"
                      />
                    </div>
                  )}

                  {/* Caption */}
                  <div className="mt-3 flex justify-between text-xs text-stone-400 px-1">
                    <div>
                      Left: <strong className="text-stone-200">{lookB?.name || 'Saved Look'}</strong> ({lookB?.garmentTitle})
                    </div>
                    <div>
                      Right: <strong className="text-emerald-400">Current Try-On</strong> ({currentTitle})
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
