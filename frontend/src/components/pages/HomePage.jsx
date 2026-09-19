import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  GitFork, 
  Clock, 
  Globe, 
  CheckCircle2, 
  AlertTriangle, 
  FileText,
  Search,
  Sparkles,
  User,
  AtSign,
  Building
} from 'lucide-react';
import { usePipeline } from '../../context/PipelineContext';

export default function HomePage() {
  const { setActiveTab, executePipeline, targetInput, setTargetInput, isRunning } = usePipeline();
  const [quickName, setQuickName] = useState('');
  const [quickHandle, setQuickHandle] = useState('');
  const [quickPlatformUrl, setQuickPlatformUrl] = useState('');

  const features = [
    {
      id: 'graph',
      icon: GitFork,
      title: 'Relationship Topology Graph',
      desc: 'Interactive topological node graph connecting Person ↔ Platforms ↔ Projects ↔ Publications.',
      tag: 'Interactive React Flow',
      color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10'
    },
    {
      id: 'sources',
      icon: Globe,
      title: 'Live Multi-Source OSINT Discovery',
      desc: 'Queries real live GitHub API, Reddit public data, Hacker News, CrossRef Open Academic index, and Wikipedia.',
      tag: 'Live Real-Time APIs',
      color: 'text-blue-400 border-blue-500/40 bg-blue-500/10'
    },
    {
      id: 'evidence',
      icon: CheckCircle2,
      title: 'Audited Evidence & Confidence Matrix',
      desc: 'Every finding contains verbatim public evidence snippets, source URLs, and multi-signal confidence scores.',
      tag: 'Auditable Proof',
      color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
    },
    {
      id: 'timeline',
      icon: Clock,
      title: 'Chronological Activity Timeline',
      desc: 'Automatically orders real repository release dates, research papers, and career milestones chronologically.',
      tag: 'Activity Milestones',
      color: 'text-purple-400 border-purple-500/40 bg-purple-500/10'
    },
    {
      id: 'discrepancies',
      icon: AlertTriangle,
      title: 'Ethical Discrepancy Center',
      desc: 'Never assert false certainty: ambiguous, conflicting, or unverified signals are explicitly disclosed.',
      tag: 'Responsible AI',
      color: 'text-amber-400 border-amber-500/40 bg-amber-500/10'
    },
    {
      id: 'report',
      icon: FileText,
      title: 'Executive Intelligence Dossier',
      desc: 'Generate, print, and export complete cybersecurity profile verification dossiers in PDF or JSON format.',
      tag: 'Export Ready',
      color: 'text-teal-400 border-teal-500/40 bg-teal-500/10'
    }
  ];

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (!quickName.trim() && !quickHandle.trim() && !quickPlatformUrl.trim()) {
      alert('Please enter a Real Username/Handle, Platform Link, or Target Name.');
      return;
    }
    const updated = {
      name: quickName.trim(),
      username: quickHandle.trim().replace('@', ''),
      platform_url: quickPlatformUrl.trim(),
      organization: '',
      location: '',
      image_url: '',
      keywords: [],
      consent_acknowledged: true,
      notes: ''
    };
    setTargetInput(updated);
    executePipeline(updated);
  };

  return (
    <div className="space-y-12 py-4 animate-fadeIn">
      
      {/* Hero Section: Logo, Title, Tagline */}
      <div className="text-center max-w-4xl mx-auto space-y-6 pt-6">
        
        {/* Glowing Logo Badge */}
        <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-purple-600/20 border-2 border-cyan-500/40 text-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.3)] mb-2">
          <ShieldCheck className="w-12 h-12 animate-pulse-slow text-cyan-400" />
        </div>

        {/* Project Title & Tagline */}
        <div className="space-y-2">
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white">
            DIGITALTRACE <span className="text-cyan-400">AI</span>
          </h1>
          <p className="font-heading font-bold text-xl sm:text-2xl text-cyan-400/90 tracking-wide">
            Discover. Correlate. Verify.
          </p>
        </div>

        {/* Description */}
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          AI-Powered Real-Time Public Profile & Digital Footprint Intelligence.
          Enter any real username from any platform (GitHub, Twitter/X, Reddit, LinkedIn, Hacker News, Devpost) or direct platform link to discover live public repositories, community footprints, and correlated topologies.
        </p>

        {/* Real Live Ingestion Search Box */}
        <div className="pt-2 max-w-3xl mx-auto">
          <form onSubmit={handleQuickSubmit} className="cyber-glass-glow rounded-2xl p-4 sm:p-5 border border-cyan-500/40 text-left space-y-3 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5" />
                Live Real User Ingestion
              </span>
              <span className="text-[10px] font-mono text-slate-500">Cross-Platform Live APIs</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Target Name (Optional)</label>
                <input
                  type="text"
                  value={quickName}
                  onChange={(e) => setQuickName(e.target.value)}
                  placeholder="e.g. Linus Torvalds"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Real Username / Handle</label>
                <input
                  type="text"
                  value={quickHandle}
                  onChange={(e) => setQuickHandle(e.target.value)}
                  placeholder="e.g. torvalds, elonmusk, spez"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Platform Link / Profile URL</label>
                <input
                  type="text"
                  value={quickPlatformUrl}
                  onChange={(e) => setQuickPlatformUrl(e.target.value)}
                  placeholder="e.g. https://x.com/elonmusk"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-[11px] font-mono text-slate-400">
                Operates on real public live API endpoints (GitHub, Reddit, Hacker News, CrossRef, Wikipedia).
              </span>
              <button
                type="submit"
                disabled={isRunning}
                className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 font-heading font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isRunning ? "Querying Live APIs..." : "Analyze Real User"}</span>
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* Feature Capabilities Grid */}
      <div className="space-y-6 pt-6">
        <div className="text-center space-y-1">
          <h2 className="font-heading font-extrabold text-2xl text-white">
            Core Intelligence Capabilities
          </h2>
          <p className="text-xs font-mono text-slate-400">
            Powered by live API discovery, mathematical string distance metrics, and graph correlation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                onClick={() => setActiveTab(feat.id)}
                className="cyber-glass-card rounded-2xl p-6 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group flex flex-col justify-between space-y-4 hover:scale-[1.02] shadow-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl border ${feat.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                      {feat.tag}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-base text-white group-hover:text-cyan-300 transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-cyan-400 group-hover:text-cyan-300">
                  <span>Open Feature</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
