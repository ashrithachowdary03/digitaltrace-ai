import React from 'react';
import { 
  FileText, 
  ShieldCheck, 
  Printer, 
  Download, 
  Share2, 
  UserCheck, 
  Building, 
  Layers, 
  AlertTriangle, 
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { usePipeline } from '../../context/PipelineContext';

export default function IntelligenceReport() {
  const { report, setShowExportModal } = usePipeline();

  if (!report) return null;

  const candidate = report.primary_candidate;
  const correlation = report.correlation_metrics;
  const risk = report.risk_and_footprint_analysis || {};

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Top Dossier Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono text-[10px] uppercase font-bold tracking-wider">
              CONFIDENTIAL OSINT INTELLIGENCE REPORT
            </span>
            <span className="text-slate-500 font-mono text-xs">#{report.target_id}</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl text-white mt-1">
            Digital Footprint & Profile Verification Dossier
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Generated: {report.created_at} | Compliance: Authorized & Consented OSINT
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-900/30 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Full Dossier</span>
          </button>
        </div>
      </div>

      {/* Printable Report Canvas */}
      <div id="printable-dossier" className="cyber-glass-glow rounded-2xl p-6 sm:p-10 border border-cyan-500/40 space-y-8">
        
        {/* Executive Summary Card */}
        <div className="p-6 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-heading font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <h3>1. EXECUTIVE SUMMARY & VERIFICATION FINDING</h3>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {report.executive_summary}
          </p>
          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <span className="text-slate-400">
              Confidence Index: <strong className="text-cyan-300">{Math.round(correlation.overall_confidence_score * 100)}%</strong>
            </span>
            <span className="text-slate-400">
              Corroboration Status: <strong className="text-emerald-400">{correlation.status}</strong>
            </span>
          </div>
        </div>

        {/* Primary Candidate Identity & Resolution */}
        <div className="space-y-4">
          <h3 className="font-heading font-bold text-sm text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-cyan-400" />
            2. Primary Candidate Identity & Alias Resolution
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-slate-500 text-[10px]">Canonical Profile</span>
              <p className="font-sans font-bold text-base text-white">{candidate.display_name}</p>
              <p className="text-cyan-400">{candidate.primary_organization}</p>
              <p className="text-slate-400 text-[11px] font-sans">{candidate.rationale}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-slate-500 text-[10px]">Resolved Variations & Handles</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {candidate.potential_aliases.map((a, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                    {a}
                  </span>
                ))}
                {candidate.handle_variations.map((h, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[11px]">
                    @{h}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Structured Entity Extraction Table */}
        <div className="space-y-4">
          <h3 className="font-heading font-bold text-sm text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            3. Structured Entity Disambiguation ({report.extracted_entities?.length || 0} Entities)
          </h3>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Entity Type</th>
                  <th className="p-3">Entity Name</th>
                  <th className="p-3">Role / Affiliation</th>
                  <th className="p-3">Platform</th>
                  <th className="p-3">Confidence</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-950/60 text-slate-300">
                {report.extracted_entities?.map((ent) => (
                  <tr key={ent.id} className="hover:bg-slate-900/40">
                    <td className="p-3 text-cyan-400 font-semibold">{ent.entity_type}</td>
                    <td className="p-3 font-sans font-medium text-white">{ent.name}</td>
                    <td className="p-3 text-slate-400">{ent.role || ent.organization || '-'}</td>
                    <td className="p-3">{ent.source_platform}</td>
                    <td className="p-3 font-bold text-cyan-300">{Math.round(ent.confidence * 100)}%</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800">
                        {ent.verification_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footprint Exposure & Privacy Assessment */}
        <div className="space-y-4">
          <h3 className="font-heading font-bold text-sm text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            4. Digital Footprint & Surface Assessment
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">Key Corroboration Strengths</span>
              <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                {risk.key_strengths?.map((str, i) => (
                  <li key={i}>{str}</li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono text-amber-400 uppercase font-semibold">Attention / Clarification Items</span>
              <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                {risk.attention_items?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Sign-off & Audit Notice */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-slate-500 text-[11px] font-mono">
          <p>Verified by DigitalTrace AI Multi-Signal Correlation Engine</p>
          <p>Single Source of Truth Specification Adherence: 100%</p>
        </div>

      </div>

    </div>
  );
}
