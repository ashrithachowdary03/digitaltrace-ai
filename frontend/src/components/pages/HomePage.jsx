import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Cpu, 
  GitFork, 
  Clock, 
  Globe, 
  CheckCircle2, 
  AlertTriangle, 
  FileText,
  Lock,
  Search,
  Zap,
  Users
} from 'lucide-react';
import { usePipeline } from '../../context/PipelineContext';
import { MOCK_SHOWCASE_PROFILES } from '../../services/mockData';

export default function HomePage() {
  const { setActiveTab, loadShowcaseProfile, isRunning } = usePipeline();

  const features = [
    {
      id: 'graph',
      icon: GitFork,
      title: 'Relationship Topology Graph',
      desc: 'Interactive visual graph connecting Person ↔ Organizations ↔ Projects ↔ Events ↔ Publications.',
      tag: 'Interactive React Flow',
      color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10'
    },
    {
      id: 'sources',
      icon: Globe,
      title: 'Multi-Source OSINT Discovery',
      desc: 'Cross-correlate public footprints across GitHub, LinkedIn, Google Scholar, Devpost, and tech talks.',
      tag: 'Multi-Platform',
      color: 'text-blue-400 border-blue-500/40 bg-blue-500/10'
    },
    {
      id: 'evidence',
      icon: CheckCircle2,
      title: 'Audited Evidence & Confidence',
      desc: 'Every factual finding includes verbatim source evidence, source URL, and calculated confidence scores.',
      tag: 'Auditable Verification',
      color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
    },
    {
      id: 'timeline',
      icon: Clock,
      title: 'Chronological Activity Timeline',
      desc: 'Sort career history, open source releases, hackathon awards, and research papers chronologically.',
      tag: 'Activity Milestones',
      color: 'text-purple-400 border-purple-500/40 bg-purple-500/10'
    },
    {
      id: 'discrepancies',
      icon: AlertTriangle,
      title: 'Ethical Discrepancy Center',
      desc: 'Never assert false certainty: ambiguous, conflicting, or weak signals are explicitly disclosed.',
      tag: 'Responsible AI',
      color: 'text-amber-400 border-amber-500/40 bg-amber-500/10'
    },
    {
      id: 'report',
      icon: FileText,
      title: 'Executive Intelligence Dossier',
      desc: 'Generate, print, and export complete cybersecurity profile verification dossiers in PDF or JSON.',
      tag: 'Export Ready',
      color: 'text-teal-400 border-teal-500/40 bg-teal-500/10'
    }
  ];

  return (
    <div className="space-y-12 py-4 animate-fadeIn">
      
      {/* Hero Section: Logo, Title, Tagline */}
      <div className="text-center max-w-4xl mx-auto space-y-6 pt-6">
        
        {/* Glowing Logo Badge */}
        <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-purple-600/20 border-2 border-cyan-500/40 text-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.3)] mb-2">
          <ShieldCheck className="w-12 h-12 animate-pulse-slow text-cyan-400" />
        </div>

        {/* Project Title */}
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
          AI-Powered Public Profile & Digital Footprint Intelligence for Cybersecurity.
          Discover fragmented public identities, resolve aliases, evaluate multi-signal evidence, and construct interactive relationship graphs.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => setActiveTab('portal')}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-heading font-bold text-sm shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all cursor-pointer hover:scale-105"
          >
            <Search className="w-4 h-4 text-slate-950" />
            <span>Launch Ingestion Portal</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl cyber-glass hover:bg-slate-800/80 border border-slate-700 text-slate-200 font-heading font-bold text-sm transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>View Active Dossier</span>
          </button>
        </div>

        {/* 1-Click Quick Sample Badges */}
        <div className="pt-4 border-t border-slate-800/60 max-w-2xl mx-auto">
          <p className="text-xs font-mono text-slate-500 mb-3 uppercase tracking-wider">
            Explore 1-Click Verified Profiles:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {MOCK_SHOWCASE_PROFILES.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  loadShowcaseProfile(p.id);
                  setActiveTab('overview');
                }}
                disabled={isRunning}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl cyber-glass hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-xs text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
              >
                <img src={p.image_url} alt={p.name} className="w-4 h-4 rounded-full object-cover" />
                <span className="font-medium">{p.name}</span>
                <span className="text-[10px] font-mono text-cyan-400">({p.badge})</span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Feature Grid Cards Section */}
      <div className="space-y-6 pt-6">
        <div className="text-center space-y-1">
          <h2 className="font-heading font-extrabold text-2xl text-white">
            Core Intelligence Capabilities
          </h2>
          <p className="text-xs font-mono text-slate-400">
            Click any capability to open its dedicated view
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
