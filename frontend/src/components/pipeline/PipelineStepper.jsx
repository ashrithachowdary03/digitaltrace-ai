import React from 'react';
import { 
  CheckCircle2, 
  Loader2, 
  Circle, 
  Sparkles, 
  ShieldCheck, 
  UserCheck, 
  Globe, 
  Cpu, 
  GitFork, 
  Scale, 
  Network, 
  FileCheck 
} from 'lucide-react';
import { usePipeline } from '../../context/PipelineContext';

const STAGE_ICONS = [
  ShieldCheck,
  UserCheck,
  Globe,
  Cpu,
  GitFork,
  Scale,
  Network,
  FileCheck
];

export default function PipelineStepper() {
  const { currentStage, isRunning, PIPELINE_STAGES } = usePipeline();

  return (
    <div className="cyber-glass rounded-2xl p-5 border border-slate-800">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h3 className="font-heading font-bold text-sm text-white">
            AI Multi-Stage Execution Pipeline
          </h3>
        </div>
        <span className="text-[11px] font-mono text-cyan-400">
          {isRunning ? `Executing Stage ${currentStage} of 8...` : 'Pipeline Operational & Correlated'}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {PIPELINE_STAGES.map((stage, idx) => {
          const Icon = STAGE_ICONS[idx] || Circle;
          const isDone = currentStage > stage.id || (!isRunning && currentStage === 8);
          const isCurrent = isRunning && currentStage === stage.id;
          const isPending = currentStage < stage.id && isRunning;

          return (
            <div
              key={stage.id}
              className={`p-3 rounded-xl border transition-all ${
                isCurrent
                  ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] scale-[1.02]'
                  : isDone
                  ? 'bg-slate-900/80 border-emerald-500/40 text-slate-300'
                  : 'bg-slate-900/40 border-slate-800 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-1.5 rounded-lg ${
                  isCurrent
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : isDone
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-slate-800 text-slate-500'
                }`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>

                {isCurrent && <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />}
                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                {isPending && <span className="text-[10px] font-mono text-slate-600">0{stage.id}</span>}
              </div>

              <div className="space-y-0.5">
                <p className={`font-semibold text-xs leading-tight truncate ${
                  isCurrent ? 'text-cyan-300' : isDone ? 'text-slate-200' : 'text-slate-400'
                }`}>
                  {stage.name}
                </p>
                <p className="text-[10px] font-mono text-slate-500 line-clamp-1">
                  {stage.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
