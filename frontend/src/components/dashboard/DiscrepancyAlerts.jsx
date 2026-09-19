import React from 'react';
import { 
  AlertTriangle, 
  Info, 
  ShieldAlert, 
  CheckCircle, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { usePipeline } from '../../context/PipelineContext';

export default function DiscrepancyAlerts() {
  const { report } = usePipeline();
  if (!report) return null;

  const discrepancies = report.discrepancies_and_uncertainties || [];

  return (
    <div className="cyber-glass rounded-2xl p-6 lg:p-8 border border-slate-800 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div>
          <h2 className="font-heading font-extrabold text-xl text-white flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Discrepancy & Uncertainty Center (Section 9.10)
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Ethical OSINT mandate: Explicitly flagging ambiguous, conflicting, or weak signals instead of asserting false certainty.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-amber-950/40 border border-amber-800/50 text-amber-300 font-mono text-xs">
          {discrepancies.length} Discrepancy Disclosures
        </span>
      </div>

      {discrepancies.length === 0 ? (
        <div className="p-8 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
          <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
          <h3 className="font-heading font-bold text-slate-200">
            Zero High-Risk Contradictions Detected
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            All discovered public records exhibit high cross-source correlation with congruent employment, project history, and handles.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {discrepancies.map((disc) => (
            <div
              key={disc.id}
              className="p-5 rounded-xl bg-slate-900/90 border border-amber-500/30 hover:border-amber-500/60 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-700/60 text-amber-300 text-[10px] font-mono font-semibold uppercase">
                  {disc.severity} Priority Discrepancy
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {disc.field_or_topic}
                </span>
              </div>

              <div>
                <h4 className="font-heading font-bold text-sm text-slate-100">
                  {disc.field_or_topic}
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {disc.description}
                </p>
              </div>

              {/* Conflicting Sources Badges */}
              <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-slate-400">
                <span>Affected Sources:</span>
                {disc.conflicting_sources.map((src, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200"
                  >
                    {src}
                  </span>
                ))}
              </div>

              {/* Recommendation */}
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-cyan-300 flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <p className="leading-snug">
                  <strong className="text-white">AI Resolution Note:</strong> {disc.recommendation}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ethical Safety Rule Card */}
      <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-900/40 text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-cyan-300">
          <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Section 16 Responsible Principle: Single-attribute matches are NEVER treated as conclusive proof.</span>
        </div>
        <span className="text-[11px] font-mono text-slate-500">Verified Pipeline Rule</span>
      </div>

    </div>
  );
}
