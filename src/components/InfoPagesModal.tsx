import { Shield, Sparkles, AlertTriangle, BookOpen, X, Trash2, CheckCircle2 } from 'lucide-react';

export type InfoPageTab = 'privacy' | 'responsible-ai' | 'limitations' | 'about';

interface Props {
  activeTab: InfoPageTab | null;
  onClose: () => void;
  onSelectTab: (tab: InfoPageTab) => void;
  onDeleteEverything: () => void;
}

export function InfoPagesModal({ activeTab, onClose, onSelectTab, onDeleteEverything }: Props) {
  if (!activeTab) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[85vh] rounded-3xl bg-stone-900 border border-stone-800 shadow-2xl flex flex-col text-stone-100 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg tracking-wide font-bold text-stone-100">آئینہ Aaina</span>
            <span className="text-xs text-stone-500 font-mono">| Transparency & Governance</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-stone-800/80 bg-stone-950/40 shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => onSelectTab('privacy')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'privacy'
                ? 'border-emerald-400 text-emerald-400 bg-stone-900'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Privacy Policy</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('responsible-ai')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'responsible-ai'
                ? 'border-emerald-400 text-emerald-400 bg-stone-900'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Responsible AI & Bias</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('limitations')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'limitations'
                ? 'border-emerald-400 text-emerald-400 bg-stone-900'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Limitations</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('about')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'about'
                ? 'border-emerald-400 text-emerald-400 bg-stone-900'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>About & Team</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs leading-relaxed text-stone-300">
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-stone-100 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                Privacy & Data Architecture
              </h3>
              <p>
                At Aaina, your biometric privacy is our foundational architectural constraint. We believe fitting technology must not compromise personal privacy.
              </p>
              <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800 space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Zero Server Storage:</strong> Your personal photos are processed ephemerally in browser memory and dispatched directly to Hugging Face ZeroGPU for inference. Aaina operates zero image storage databases.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Gemini Privacy Isolation:</strong> Commercial Gemini models on free tiers may use inputs to improve products. Therefore, Aaina NEVER sends user selfies to Gemini. Only product photos are processed by Gemini.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>No Tracking or Analytics:</strong> We do not track cookies, ad pixels, or personal identifiers.</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'responsible-ai' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-stone-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Responsible AI & Bias Considerations
              </h3>
              <p>
                Diffusion models for virtual try-on are trained on diverse datasets, yet real-world variance in lighting, posture, and body silhouettes can impact visual fidelity.
              </p>
              <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800 space-y-2">
                <p><strong>1. Demographic Inclusivity:</strong> We benchmark and evaluate models across diverse complexions, genders, and sizes. When models struggle with loose drapery or cultural attire (such as Shalwar Kameez or Kurtas), we document failure modes transparently.</p>
                <p><strong>2. Truth in Representation:</strong> Aaina produces an "AI preview", not a physical tailoring measurement. We prominently watermark all exports to prevent deceptive representations or commercial misinformation.</p>
                <p><strong>3. Content Safety:</strong> Automated classification filters out sexually explicit or hazardous garments before inference dispatch.</p>
              </div>
            </div>
          )}

          {activeTab === 'limitations' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-stone-100 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                System Limitations & Edge Cases
              </h3>
              <p>
                In alignment with NYLP Hackathon transparency standards, we state our technical boundaries plainly:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-stone-300">
                <li><strong>Public GPU Queues:</strong> Hugging Face ZeroGPU relies on shared community compute. During peak global traffic, queue times can range between 30 and 75 seconds.</li>
                <li><strong>Garment Coverage:</strong> Diffusion try-on excels primarily at upper garments (shirts, tops, jackets). Deep folds or wide hems may exhibit minor edge blending.</li>
                <li><strong>Perspective Dependency:</strong> Optimal try-on requires upright, front-facing poses with minimal arm occlusion over the torso.</li>
                <li><strong>Sizing Disclaimer:</strong> Virtual try-on cannot verify whether a garment fits your physical body dimensions or measurements. Always consult retailer size charts.</li>
              </ul>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-stone-100 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                About Aaina & NYLP Hackathon 2026
              </h3>
              <p>
                <strong>Aaina (آئینہ)</strong> is built for the NYLP AI Hackathon 2026 by senior full-stack and applied-ML engineer <strong>Masum Abbas</strong>.
              </p>
              <p>
                Our mission is to bring accessible, privacy-first virtual fitting room technology to every independent boutique and customer on a strict $0 budget using open-source AI.
              </p>
              <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800">
                <h4 className="font-semibold text-stone-200 mb-1">Open-Source Attribution</h4>
                <p className="text-[11px] text-stone-400">
                  IDM-VTON (Choi et al., CC BY-NC-SA 4.0), CatVTON (Zheng et al., CC BY-NC-SA 4.0), React 19, Tailwind CSS 4, Vite 8, Zustand, Lucide Icons, and Google Gemini API.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Delete Everything */}
        <div className="p-4 border-t border-stone-800 bg-stone-950 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onDeleteEverything}
            className="px-3.5 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Everything & Wipe Session</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
