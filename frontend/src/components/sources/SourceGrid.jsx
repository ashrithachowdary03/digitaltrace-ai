import React, { useState } from 'react';
import { 
  Globe, 
  ExternalLink, 
  BookOpen, 
  Code, 
  Video, 
  FileText, 
  CheckCircle2,
  ShieldCheck,
  Search,
  Eye,
  Share2,
  GitBranch,
  MessageSquare
} from 'lucide-react';
import { usePipeline } from '../../context/PipelineContext';

const PLATFORM_ICONS = {
  'GitHub': GitBranch,
  'LinkedIn': Share2,
  'Google Scholar': BookOpen,
  'Devpost': Code,
  'YouTube (Tech Talks)': Video,
  'Twitter / X': MessageSquare,
  'Medium / Technical Blog': FileText
};

export default function SourceGrid() {
  const { report } = usePipeline();
  const [selectedProfile, setSelectedProfile] = useState(null);

  if (!report) return null;

  const profiles = report.discovered_profiles || [];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div>
          <h2 className="font-heading font-extrabold text-xl text-white flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-cyan-400" />
            Approved Public Source Discovery (Section 9.3)
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Profiles retrieved from approved public APIs, open repositories, academic registries, and conference portals.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 font-mono text-xs">
          {profiles.length} Public Profiles Discovered
        </span>
      </div>

      {/* Grid of Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {profiles.map((prof) => {
          const Icon = PLATFORM_ICONS[prof.platform] || Globe;
          const confPercent = Math.round(prof.confidence_score * 100);

          return (
            <div
              key={prof.id}
              className="cyber-glass-card rounded-2xl p-5 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3.5">
                
                {/* Top Row: Platform & Confidence */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 group-hover:text-cyan-300 group-hover:border-cyan-500/40 transition-all">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-sm text-white">
                        {prof.platform}
                      </h4>
                      <p className="text-[11px] font-mono text-cyan-400">
                        {prof.handle}
                      </p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-800 text-cyan-300 text-[11px] font-mono font-semibold">
                    {confPercent}% Match
                  </span>
                </div>

                {/* Bio / Headline */}
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {prof.bio || prof.headline || "Documented public account affiliated with verified target."}
                </p>

                {/* Match Reasons Tags */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    Verification Signals:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {prof.match_reasons?.map((reason, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300 flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                        {reason}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedProfile(prof)}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Metadata</span>
                </button>

                <a
                  href={prof.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-cyan-950/50 hover:bg-cyan-900/50 border border-cyan-800/50 text-cyan-300 text-xs font-medium transition-all"
                >
                  <span>Open URL</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

            </div>
          );
        })}
      </div>

      {/* Profile Metadata Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg cyber-glass-glow rounded-2xl p-6 border border-cyan-500/40 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <h3 className="font-heading font-bold text-base text-white">
                  Source Metadata: {selectedProfile.platform}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProfile(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 font-mono text-[10px]">Handle:</span>
                  <p className="font-mono text-cyan-300 mt-0.5">{selectedProfile.handle}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 font-mono text-[10px]">Confidence:</span>
                  <p className="font-mono text-emerald-300 mt-0.5">{Math.round(selectedProfile.confidence_score * 100)}%</p>
                </div>
              </div>

              <div>
                <span className="text-slate-500 font-mono text-[10px]">Full URL:</span>
                <p className="font-mono text-slate-300 break-all p-2 rounded bg-slate-900 border border-slate-800 mt-1">
                  {selectedProfile.url}
                </p>
              </div>

              {selectedProfile.raw_data && (
                <div>
                  <span className="text-slate-500 font-mono text-[10px]">Extracted Payload:</span>
                  <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto max-h-48">
                    {JSON.stringify(selectedProfile.raw_data, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedProfile(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
