import React from 'react';
import { ShieldCheck, Lock, AlertCircle, X, Check } from 'lucide-react';
import { usePipeline } from '../../context/PipelineContext';

export default function ConsentModal() {
  const {
    showConsentModal,
    setShowConsentModal,
    consentGranted,
    setConsentGranted
  } = usePipeline();

  if (!showConsentModal) return null;

  const handleConfirm = () => {
    setConsentGranted(true);
    setShowConsentModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl cyber-glass-glow rounded-2xl p-6 sm:p-8 border border-cyan-500/40 shadow-2xl space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">
                Ethical Authorization & Consent Protocol
              </h3>
              <p className="text-xs font-mono text-slate-400">
                DigitalTrace AI Responsible Operation Framework
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowConsentModal(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Responsible AI Notice Box */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 text-xs text-slate-300">
          <p className="font-semibold text-cyan-300 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            Strict Privacy & Consent Safeguards (Spec Sheet Section 16)
          </p>
          <p className="leading-relaxed text-slate-400">
            DigitalTrace AI is strictly designed for consented and authorized OSINT intelligence. The system operates exclusively on publicly accessible, consented information and will:
          </p>
          <ul className="space-y-1.5 text-slate-300 list-disc list-inside text-[11px]">
            <li><strong className="text-slate-200">Never</strong> access private, gated, or password-protected accounts.</li>
            <li><strong className="text-slate-200">Never</strong> utilize leaked, breached, or unauthorized credential databases.</li>
            <li><strong className="text-slate-200">Never</strong> circumvent platform privacy or access controls.</li>
            <li><strong className="text-slate-200">Always</strong> flag conflicting or uncertain evidence rather than asserting definitive conclusions.</li>
          </ul>
        </div>

        {/* Consent Checkbox */}
        <label className="flex items-start gap-3 p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-900/40 cursor-pointer hover:bg-cyan-950/30 transition-all">
          <input
            type="checkbox"
            checked={consentGranted}
            onChange={(e) => setConsentGranted(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400 border-slate-700 bg-slate-900"
          />
          <span className="text-xs text-slate-300 leading-snug">
            I confirm that I possess explicit authorization or consent to discover, correlate, and generate intelligence for the target profile in compliance with ethical guidelines.
          </span>
        </label>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setShowConsentModal(false)}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!consentGranted}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-semibold text-xs shadow-lg shadow-cyan-900/40 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Acknowledge & Proceed</span>
          </button>
        </div>

      </div>
    </div>
  );
}
