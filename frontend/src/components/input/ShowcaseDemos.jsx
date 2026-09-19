import React from 'react';
import { Sparkles, User, Building, MapPin, ArrowRight } from 'lucide-react';
import { usePipeline } from '../../context/PipelineContext';
import { MOCK_SHOWCASE_PROFILES } from '../../services/mockData';

export default function ShowcaseDemos() {
  const { loadShowcaseProfile, targetInput, isRunning } = usePipeline();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Interactive Showcase Profiles
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-500">1-Click Live Analysis</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {MOCK_SHOWCASE_PROFILES.map((profile) => {
          const isSelected = targetInput.name === profile.name;
          return (
            <button
              key={profile.id}
              onClick={() => loadShowcaseProfile(profile.id)}
              disabled={isRunning}
              className={`group text-left p-3.5 rounded-xl transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-cyan-950/40 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                  : 'cyber-glass hover:bg-slate-800/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <img
                    src={profile.image_url}
                    alt={profile.name}
                    className="w-10 h-10 rounded-full object-cover border border-cyan-500/40 group-hover:scale-105 transition-all"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-slate-900 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-heading font-bold text-sm text-white truncate group-hover:text-cyan-300 transition-colors">
                      {profile.name}
                    </h4>
                  </div>
                  <p className="text-[11px] text-cyan-400 font-mono truncate">
                    @{profile.username}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {profile.organization}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  {profile.badge}
                </span>
                <span className="text-cyan-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Load <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
