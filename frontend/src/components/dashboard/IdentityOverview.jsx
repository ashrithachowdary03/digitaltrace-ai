import React from 'react';
import { 
  UserCheck, 
  Building, 
  MapPin, 
  ShieldCheck, 
  Layers, 
  Globe, 
  CheckCircle2, 
  AlertTriangle, 
  Hash, 
  Cpu,
  Sparkles,
  Link2
} from 'lucide-react';
import { usePipeline } from '../../context/PipelineContext';

export default function IdentityOverview() {
  const { report, setActiveTab } = usePipeline();

  if (!report) return null;

  const candidate = report.primary_candidate;
  const correlation = report.correlation_metrics;
  const confidencePercent = Math.round(correlation.overall_confidence_score * 100);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'VERIFIED':
        return {
          label: 'Cross-Platform Verified',
          color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          icon: ShieldCheck
        };
      case 'HIGH_CONFIDENCE':
        return {
          label: 'High-Confidence Corroboration',
          color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          icon: CheckCircle2
        };
      case 'PROBABLE':
        return {
          label: 'Probable Match',
          color: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          icon: UserCheck
        };
      case 'CONFLICTING':
        return {
          label: 'Conflicting Signals Detected',
          color: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          icon: AlertTriangle
        };
      default:
        return {
          label: 'Uncertain Evidence',
          color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          icon: AlertTriangle
        };
    }
  };

  const statusBadge = getStatusBadge(correlation.status);
  const StatusIcon = statusBadge.icon;

  return (
    <div className="space-y-6">
      
      {/* Top Profile Banner Card */}
      <div className="cyber-glass-glow rounded-2xl p-6 lg:p-8 border border-cyan-500/30">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          {/* Avatar and Identity Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <img
                src={candidate.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400"}
                alt={candidate.display_name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              />
              <div className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-slate-900 border border-slate-700 text-cyan-400 shadow-md">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
                  {candidate.display_name}
                </h1>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge.color}`}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  {statusBadge.label}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-mono text-slate-300">
                <span className="flex items-center gap-1 text-cyan-400">
                  <Building className="w-3.5 h-3.5" />
                  {candidate.primary_organization || "Independent Researcher"}
                </span>
                {report.target_input?.platform_url && (
                  <a 
                    href={report.target_input.platform_url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 underline font-mono text-[11px]"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    {report.target_input.platform_url.replace(/^https?:\/\//, '').slice(0, 30)}...
                  </a>
                )}
                {report.target_input.location && (
                  <span className="flex items-center gap-1 text-slate-400">
                    <MapPin className="w-3.5 h-3.5" />
                    {report.target_input.location}
                  </span>
                )}
                <span className="flex items-center gap-1 text-slate-400">
                  <Hash className="w-3.5 h-3.5" />
                  ID: {report.target_id}
                </span>
              </div>

              <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                {candidate.rationale}
              </p>
            </div>
          </div>

          {/* Confidence Score Gauge */}
          <div className="w-full lg:w-auto flex flex-row lg:flex-col items-center justify-between lg:justify-center p-4 sm:p-5 rounded-xl bg-slate-900/90 border border-slate-800 text-center gap-4 min-w-[200px]">
            <div>
              <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Correlation Confidence
              </p>
              <div className="flex items-baseline justify-center gap-1 mt-1">
                <span className="font-heading font-extrabold text-3xl sm:text-4xl text-cyan-300">
                  {confidencePercent}%
                </span>
                <span className="text-xs font-mono text-slate-400">/ 100</span>
              </div>
            </div>

            <div className="w-32 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
              <div
                className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-1000"
                style={{ width: `${confidencePercent}%` }}
              ></div>
            </div>
          </div>

        </div>

        {/* Alias & Handle Resolution Bar (Spec Section 9.6) */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              Resolved Name Variations & Aliases (Section 9.6):
            </p>
            <div className="flex flex-wrap gap-1.5">
              {candidate.potential_aliases.map((alias, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  {alias}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              Correlated Handle Permutations:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {candidate.handle_variations.map((h, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-cyan-950/40 border border-cyan-800/50 text-[11px] font-mono text-cyan-300"
                >
                  @{h}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 4 Key Metric Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div 
          onClick={() => setActiveTab('sources')}
          className="p-4 rounded-xl cyber-glass hover:bg-slate-800/60 border border-slate-800 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400">Discovered Sources</span>
            <Globe className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="font-heading font-extrabold text-2xl text-white">
            {report.discovered_profiles?.length || 0}
          </p>
          <p className="text-[10px] font-mono text-cyan-400 mt-1">
            GitHub, LinkedIn, Scholar +
          </p>
        </div>

        <div 
          onClick={() => setActiveTab('graph')}
          className="p-4 rounded-xl cyber-glass hover:bg-slate-800/60 border border-slate-800 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400">Structured Entities</span>
            <Layers className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="font-heading font-extrabold text-2xl text-white">
            {report.extracted_entities?.length || 0}
          </p>
          <p className="text-[10px] font-mono text-blue-400 mt-1">
            Projects, Orgs, Patents & Talks
          </p>
        </div>

        <div 
          onClick={() => setActiveTab('evidence')}
          className="p-4 rounded-xl cyber-glass hover:bg-slate-800/60 border border-slate-800 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400">Audited Evidence</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="font-heading font-extrabold text-2xl text-white">
            {report.evidence_matrix?.length || 0}
          </p>
          <p className="text-[10px] font-mono text-emerald-400 mt-1">
            {correlation.verified_claims_count} Verified Claims
          </p>
        </div>

        <div 
          onClick={() => setActiveTab('timeline')}
          className="p-4 rounded-xl cyber-glass hover:bg-slate-800/60 border border-slate-800 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400">Timeline Milestones</span>
            <Cpu className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="font-heading font-extrabold text-2xl text-white">
            {report.timeline?.length || 0}
          </p>
          <p className="text-[10px] font-mono text-purple-400 mt-1">
            Chronologically Ordered
          </p>
        </div>

      </div>

    </div>
  );
}
