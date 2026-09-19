import React from 'react';
import { ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { usePipeline } from '../../context/PipelineContext';

export default function HomePage() {
  const { setActiveTab } = usePipeline();

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 py-12 animate-fadeIn">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Glowing Logo Badge */}
        <div className="inline-flex items-center justify-center p-6 rounded-3xl bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-purple-600/20 border-2 border-cyan-500/40 text-cyan-400 shadow-[0_0_50px_rgba(6,182,212,0.35)] animate-pulse-slow">
          <ShieldCheck className="w-16 h-16 text-cyan-400" />
        </div>

        {/* Project Title & Tagline */}
        <div className="space-y-4">
          <h1 className="font-heading font-extrabold text-5xl sm:text-6xl lg:text-7xl tracking-tight text-white">
            DIGITALTRACE <span className="text-cyan-400">AI</span>
          </h1>
          <p className="font-heading font-bold text-2xl sm:text-3xl text-cyan-400/90 tracking-wide">
            Discover. Correlate. Verify.
          </p>
        </div>

        {/* Minimal Navigation CTA */}
        <div className="pt-6">
          <button
            onClick={() => setActiveTab('portal')}
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-heading font-bold text-sm shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Start Trace Analysis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
