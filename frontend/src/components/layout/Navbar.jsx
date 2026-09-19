import React from 'react';
import { 
  ShieldCheck, 
  Share2, 
  FileText, 
  Activity, 
  GitFork, 
  Clock, 
  Globe, 
  CheckCircle2, 
  AlertTriangle,
  Sun,
  Moon,
  Home,
  Search
} from 'lucide-react';
import { usePipeline } from '../../context/PipelineContext';

export default function Navbar() {
  const { 
    activeTab, 
    setActiveTab, 
    report, 
    theme,
    toggleTheme,
    setShowExportModal
  } = usePipeline();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'portal', label: 'Ingest Target', icon: Search },
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'graph', label: 'Relationship Graph', icon: GitFork, badge: report?.relationship_graph?.nodes?.length },
    { id: 'timeline', label: 'Timeline', icon: Clock, badge: report?.timeline?.length },
    { id: 'sources', label: 'Discovered Sources', icon: Globe, badge: report?.discovered_profiles?.length },
    { id: 'evidence', label: 'Evidence Matrix', icon: CheckCircle2, badge: report?.evidence_matrix?.length },
    { id: 'discrepancies', label: 'Discrepancy Center', icon: AlertTriangle, count: report?.discrepancies_and_uncertainties?.length },
    { id: 'report', label: 'Intelligence Dossier', icon: FileText }
  ];

  return (
    <header className="sticky top-0 z-50 cyber-glass border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand & Tagline -> Navigates to Home */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div 
            className="flex items-center gap-2.5 group cursor-pointer" 
            onClick={() => setActiveTab('home')}
            title="Go to Home Page"
          >
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 text-cyan-400 group-hover:border-cyan-400 transition-all">
              <ShieldCheck className="w-5 h-5 animate-pulse-slow" />
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping"></div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-lg tracking-wider bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  DIGITALTRACE <span className="text-cyan-400">AI</span>
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                  OSINT
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-400">
                Discover. Correlate. Verify.
              </p>
            </div>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg cyber-glass border border-slate-700 text-slate-300"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-600 text-white text-xs font-semibold"
            >
              <Share2 className="w-3.5 h-3.5" />
              Export
            </button>
          </div>
        </div>

        {/* Feature Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive 
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.2)] font-bold' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-cyan-500/30 text-cyan-200' : 'bg-slate-800/80 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {item.count !== undefined && item.count > 0 && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Theme Toggle & Export */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl cyber-glass hover:bg-slate-800/60 border border-slate-700/60 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-cyan-900/30 transition-all cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Export Dossier</span>
          </button>
        </div>

      </div>
    </header>
  );
}
