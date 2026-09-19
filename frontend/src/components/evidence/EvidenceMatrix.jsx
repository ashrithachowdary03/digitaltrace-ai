import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink, 
  Search, 
  Filter, 
  FileCheck,
  AlertTriangle,
  HelpCircle,
  Quote
} from 'lucide-react';
import { usePipeline } from '../../context/PipelineContext';

export default function EvidenceMatrix() {
  const { report } = usePipeline();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  if (!report) return null;

  const evidenceItems = report.evidence_matrix || [];

  const filteredItems = evidenceItems.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.claim.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supporting_evidence.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.source_platform.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || item.verification_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'VERIFIED':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'HIGH_CONFIDENCE':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'PROBABLE':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'CONFLICTING':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default:
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="font-heading font-extrabold text-xl text-white flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-cyan-400" />
            Audited Evidence & Confidence Matrix (Section 9.7)
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Every factual finding contains an explicit claim, supporting evidence quote, source platform, and calculated confidence level.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 font-mono text-xs">
          {evidenceItems.length} Factual Claims Audited
        </span>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search claims, quotes, sources..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {['ALL', 'VERIFIED', 'HIGH_CONFIDENCE', 'PROBABLE', 'UNCERTAIN', 'CONFLICTING'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-semibold'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

      </div>

      {/* Evidence Cards Table */}
      <div className="space-y-4">
        {filteredItems.map((item, idx) => {
          const confPercent = Math.round(item.confidence * 100);

          return (
            <div
              key={item.id || idx}
              className="cyber-glass-card rounded-2xl p-5 sm:p-6 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold border ${getStatusBadge(item.verification_status)}`}>
                    {item.verification_status}
                  </span>
                  <span className="text-xs font-mono text-cyan-400">
                    {item.source_platform}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">Confidence:</span>
                  <span className="font-heading font-bold text-sm text-cyan-300">
                    {confPercent}%
                  </span>
                  <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden border border-slate-700">
                    <div
                      className="bg-cyan-400 h-full rounded-full"
                      style={{ width: `${confPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Claim Title */}
              <h3 className="font-heading font-bold text-base text-white">
                {item.claim}
              </h3>

              {/* Supporting Evidence Snippet */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-3">
                <Quote className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 opacity-80" />
                <p className="text-xs text-slate-300 leading-relaxed font-sans italic">
                  "{item.supporting_evidence}"
                </p>
              </div>

              {/* Entities Involved & Source Link */}
              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-slate-500">Corroborated Entities:</span>
                  {item.entities_involved?.map((ent, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[11px]"
                    >
                      {ent}
                    </span>
                  ))}
                </div>

                {item.source_url && (
                  <a
                    href={item.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <span>View Evidence Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
