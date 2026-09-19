import React, { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  Building, 
  Code, 
  Mic, 
  BookOpen, 
  Award, 
  Cpu, 
  ExternalLink,
  ShieldCheck,
  Filter
} from 'lucide-react';
import { usePipeline } from '../../context/PipelineContext';

const CATEGORY_ICONS = {
  'Career': Building,
  'Project': Code,
  'Event / Talk': Mic,
  'Publication': BookOpen,
  'Patent': Award,
  'Product': Cpu
};

export default function ActivityTimeline() {
  const { report } = usePipeline();
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  if (!report) return null;

  const events = report.timeline || [];

  const categories = ['ALL', 'Career', 'Project', 'Event / Talk', 'Publication', 'Patent', 'Product'];

  const filteredEvents = selectedCategory === 'ALL'
    ? events
    : events.filter(e => e.category === selectedCategory);

  return (
    <div className="space-y-6">
      
      {/* Header & Filter Chips */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="font-heading font-extrabold text-xl text-white flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-cyan-400" />
            Chronological Activity Timeline (Section 9.8)
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Chronologically organized public milestones across career, open source releases, hackathons, and publications.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-semibold shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Vertical Timeline Thread */}
      <div className="relative pl-6 sm:pl-10 space-y-8 before:absolute before:left-3 sm:before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-blue-500 before:to-slate-800">
        {filteredEvents.map((evt, idx) => {
          const Icon = CATEGORY_ICONS[evt.category] || Calendar;
          const confPercent = Math.round(evt.confidence * 100);

          return (
            <div key={evt.id || idx} className="relative group">
              
              {/* Timeline Marker Node */}
              <div className="absolute -left-6 sm:-left-10 top-1.5 flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-slate-950 border-2 border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:scale-110 transition-transform">
                <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>

              {/* Event Card Content */}
              <div className="cyber-glass-card rounded-2xl p-5 sm:p-6 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 text-[11px] font-mono font-bold">
                      {evt.date_display}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-mono">
                      {evt.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {confPercent}% Verified
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-heading font-bold text-base sm:text-lg text-white group-hover:text-cyan-300 transition-colors">
                    {evt.title}
                  </h3>
                  {evt.subtitle && (
                    <p className="text-xs font-mono text-cyan-400 mt-0.5">
                      {evt.subtitle}
                    </p>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {evt.description}
                </p>

                {/* Footer source & link */}
                <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1.5">
                    Source: <strong className="text-slate-200">{evt.source_platform}</strong>
                  </span>

                  {evt.source_url && (
                    <a
                      href={evt.source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <span>View Source Record</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
