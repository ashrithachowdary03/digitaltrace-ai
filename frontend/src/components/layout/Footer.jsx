import React from 'react';
import { ShieldCheck, Lock, EyeOff, Database, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950/90 text-slate-400 py-10 px-4 lg:px-8 text-xs font-mono">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

        {/* Brand & Purpose */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-slate-200 font-heading font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>DigitalTrace AI Engine</span>
          </div>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            Autonomous multi-signal public profile correlation, entity resolution, and auditable evidence verification pipeline.
          </p>
        </div>

        {/* Responsible AI Principles */}
        <div className="space-y-2">
          <h4 className="text-slate-300 font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            Ethical Boundaries
          </h4>
          <ul className="space-y-1 text-slate-500 text-[11px]">
            <li className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
              Strictly Consented & Authorized Input
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
              No Private Data or Credential Access
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
              Full Discrepancy & Uncertainty Disclosures
            </li>
          </ul>
        </div>

        {/* AI & Infrastructure */}
        <div className="space-y-2">
          <h4 className="text-slate-300 font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            Pipeline Engine
          </h4>
          <ul className="space-y-1 text-slate-500 text-[11px]">
            <li>FastAPI High-Throughput Core</li>
            <li>Groq LLM Structured Extraction</li>
            <li>Jaro-Winkler & Token Similarity</li>
            <li>Supabase PostgreSQL & Vector Storage</li>
          </ul>
        </div>

        {/* Verification Status */}
        <div className="space-y-2">
          <h4 className="text-slate-300 font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-blue-400" />
            Compliance
          </h4>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            Designed for hackathons, authorized talent verification, conference speaker profiling, and cybersecurity research.
          </p>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-600 text-[11px]">
        <p>© 2026 DigitalTrace AI. Discover. Correlate. Verify.</p>
        <p className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
          <span>Pipeline Ready — Verified Operational</span>
        </p>
      </div>
    </footer>
  );
}
