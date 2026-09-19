import React from 'react';
import { 
  BarChart2, 
  ShieldCheck, 
  CheckCircle, 
  HelpCircle, 
  AlertOctagon,
  Scale,
  Sparkles
} from 'lucide-react';
import { usePipeline } from '../../context/PipelineContext';

export default function ConfidenceScorecard() {
  const { report } = usePipeline();
  if (!report) return null;

  const correlation = report.correlation_metrics;

  const signals = [
    {
      name: "Name Similarity (Jaro-Winkler / Levenshtein)",
      score: correlation.name_similarity_score,
      desc: "Syntactic distance between canonical name and discovered public aliases"
    },
    {
      name: "Username & Handle Permutation Alignment",
      score: correlation.handle_similarity_score,
      desc: "Normalized string metrics and sub-handle stem matching"
    },
    {
      name: "Organization & Institution Congruence",
      score: correlation.organization_congruence_score,
      desc: "Current and historical employer bio validation across repositories"
    },
    {
      name: "Role & Career Timeline Consistency",
      score: correlation.role_timeline_consistency,
      desc: "Chronological non-contradiction across graduation and employment dates"
    },
    {
      name: "Cross-Source Backlinks & Mutual Citations",
      score: correlation.cross_source_backlinks_score,
      desc: "Mutual URL references in bio sections and project contributor graphs"
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* 5-Signal Breakdown (Left 2 cols) */}
      <div className="lg:col-span-2 cyber-glass rounded-2xl p-6 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-cyan-400" />
            <h3 className="font-heading font-bold text-sm text-white">
              Multi-Signal Correlation Breakdown (Section 5 & 9.5)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Weighted AI Score Engine
          </span>
        </div>

        <div className="space-y-4">
          {signals.map((sig, i) => {
            const pct = Math.round(sig.score * 100);
            return (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-200">{sig.name}</span>
                  <span className="font-mono font-bold text-cyan-300">{pct}%</span>
                </div>
                
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>

                <p className="text-[10px] font-mono text-slate-500">
                  {sig.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Claim Audit Distribution (Right col) */}
      <div className="cyber-glass rounded-2xl p-6 border border-slate-800 flex flex-col justify-between space-y-6">
        <div>
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="font-heading font-bold text-sm text-white">
              Claim Audit Distribution
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Audit breakdown of all factual claims extracted across public platforms.
          </p>
        </div>

        <div className="space-y-3">
          
          <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/40">
            <div className="flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-xs font-semibold text-emerald-300">Verified Findings</p>
                <p className="text-[10px] font-mono text-emerald-400/80">Cross-corroborated &gt;88%</p>
              </div>
            </div>
            <span className="font-heading font-extrabold text-lg text-emerald-300">
              {correlation.verified_claims_count}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-amber-950/20 border border-amber-900/40">
            <div className="flex items-center gap-2.5">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <div>
                <p className="text-xs font-semibold text-amber-300">Uncertain / Single-Source</p>
                <p className="text-[10px] font-mono text-amber-400/80">Requires additional proof</p>
              </div>
            </div>
            <span className="font-heading font-extrabold text-lg text-amber-300">
              {correlation.uncertain_claims_count}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-rose-950/20 border border-rose-900/40">
            <div className="flex items-center gap-2.5">
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              <div>
                <p className="text-xs font-semibold text-rose-300">Conflicting Signals</p>
                <p className="text-[10px] font-mono text-rose-400/80">Disclosed in Center</p>
              </div>
            </div>
            <span className="font-heading font-extrabold text-lg text-rose-300">
              {correlation.conflicting_claims_count}
            </span>
          </div>

        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400 text-center">
          Confidence threshold for automatic confirmation: <strong className="text-cyan-300">80%</strong>
        </div>

      </div>

    </div>
  );
}
