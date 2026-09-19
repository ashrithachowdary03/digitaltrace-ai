import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Sparkles, 
  User, 
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Cpu,
  GitFork,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { usePipeline } from '../../context/PipelineContext';
import { MOCK_SHOWCASE_PROFILES } from '../../services/mockData';
import TargetInputForm from './TargetInputForm';

export default function MinimalHero() {
  const { 
    targetInput, 
    setTargetInput, 
    executePipeline, 
    loadShowcaseProfile, 
    isRunning,
    showCustomSearch,
    setShowCustomSearch
  } = usePipeline();

  const [quickQuery, setQuickQuery] = useState('');

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (!quickQuery.trim()) return;
    const updated = {
      ...targetInput,
      name: quickQuery.trim(),
      username: quickQuery.trim().toLowerCase().replace(/\s+/g, '_')
    };
    setTargetInput(updated);
    executePipeline(updated);
  };

  return (
    <div className="space-y-4">
      
      {/* Minimal Hero Card */}
      <div className="cyber-glass-glow rounded-2xl p-6 sm:p-8 border border-cyan-500/30 text-center relative overflow-hidden">
        
        {/* Subtle background glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          
          {/* Logo Badge & Tagline */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/60 text-cyan-300 text-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 animate-pulse-slow" />
            <span>AI-Powered Public Profile & Digital Footprint Intelligence</span>
          </div>

          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
            Discover. <span className="text-cyan-400">Correlate.</span> Verify.
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Correlate fragmented public profiles across GitHub, LinkedIn, Google Scholar, and tech talks with auditable AI evidence and confidence scoring.
          </p>

          {/* 4 Feature Value Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px] font-mono text-slate-300">
            <span className="px-2.5 py-1 rounded-lg cyber-glass border border-slate-700/60 flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-cyan-400" />
              Entity Resolution
            </span>
            <span className="px-2.5 py-1 rounded-lg cyber-glass border border-slate-700/60 flex items-center gap-1.5">
              <GitFork className="w-3 h-3 text-blue-400" />
              Relationship Topology
            </span>
            <span className="px-2.5 py-1 rounded-lg cyber-glass border border-slate-700/60 flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Audited Evidence
            </span>
            <span className="px-2.5 py-1 rounded-lg cyber-glass border border-slate-700/60 flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-purple-400" />
              Consent Compliant
            </span>
          </div>

          {/* Quick Search Bar & Showcase Pills */}
          <div className="pt-3 max-w-xl mx-auto space-y-3">
            <form onSubmit={handleQuickSubmit} className="relative flex items-center">
              <Search className="absolute left-4 w-4 h-4 text-cyan-400" />
              <input
                type="text"
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                placeholder="Enter Target Name, Handle, or Keyword (e.g. Dr. Alex Vance)..."
                className="w-full pl-11 pr-28 py-3 rounded-2xl bg-slate-900/90 border border-slate-700 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-sans shadow-inner"
              />
              <button
                type="submit"
                disabled={isRunning || !quickQuery.trim()}
                className="absolute right-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Analyze
              </button>
            </form>

            {/* Quick 1-Click Profile Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <span className="text-[11px] font-mono text-slate-500">Quick Profiles:</span>
              {MOCK_SHOWCASE_PROFILES.map((p) => {
                const isSelected = targetInput.name === p.name;
                return (
                  <button
                    key={p.id}
                    onClick={() => loadShowcaseProfile(p.id)}
                    disabled={isRunning}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60 font-semibold shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                        : 'cyber-glass hover:bg-slate-800/80 text-slate-400 border border-slate-700/60'
                    }`}
                  >
                    <img src={p.image_url} alt={p.name} className="w-3.5 h-3.5 rounded-full object-cover" />
                    <span>{p.name}</span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setShowCustomSearch(!showCustomSearch)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono text-cyan-400 hover:text-cyan-300 cyber-glass border border-cyan-800/50 cursor-pointer"
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span>{showCustomSearch ? 'Hide Ingestion Portal' : 'Custom Ingestion Portal'}</span>
                {showCustomSearch ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Collapsible Advanced Custom Ingestion Portal */}
      {showCustomSearch && (
        <div className="animate-fadeIn">
          <TargetInputForm />
        </div>
      )}

    </div>
  );
}
