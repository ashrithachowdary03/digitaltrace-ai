import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { 
  User, 
  Building, 
  Code, 
  Mic, 
  BookOpen, 
  Cpu, 
  Award, 
  Globe,
  ShieldCheck,
  Zap
} from 'lucide-react';

const NODE_CONFIG = {
  person: {
    icon: User,
    color: 'border-cyan-400 bg-slate-900/95 shadow-[0_0_20px_rgba(6,182,212,0.4)]',
    text: 'text-cyan-300',
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
  },
  organization: {
    icon: Building,
    color: 'border-blue-500 bg-slate-900/90 shadow-[0_0_15px_rgba(59,130,246,0.3)]',
    text: 'text-blue-300',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40'
  },
  project: {
    icon: Code,
    color: 'border-emerald-500 bg-slate-900/90 shadow-[0_0_15px_rgba(16,185,129,0.3)]',
    text: 'text-emerald-300',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
  },
  event: {
    icon: Mic,
    color: 'border-purple-500 bg-slate-900/90 shadow-[0_0_15px_rgba(168,85,247,0.3)]',
    text: 'text-purple-300',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40'
  },
  publication: {
    icon: BookOpen,
    color: 'border-amber-500 bg-slate-900/90 shadow-[0_0_15px_rgba(245,158,11,0.3)]',
    text: 'text-amber-300',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
  },
  patent: {
    icon: Award,
    color: 'border-rose-500 bg-slate-900/90 shadow-[0_0_15px_rgba(244,63,94,0.3)]',
    text: 'text-rose-300',
    badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
  },
  product: {
    icon: Cpu,
    color: 'border-teal-500 bg-slate-900/90 shadow-[0_0_15px_rgba(20,184,166,0.3)]',
    text: 'text-teal-300',
    badge: 'bg-teal-500/20 text-teal-300 border-teal-500/40'
  },
  profile: {
    icon: Globe,
    color: 'border-slate-600 bg-slate-900/80',
    text: 'text-slate-200',
    badge: 'bg-slate-800 text-slate-300 border-slate-700'
  }
};

function CustomNode({ data }) {
  const type = data.type || 'profile';
  const config = NODE_CONFIG[type] || NODE_CONFIG.profile;
  const Icon = config.icon;
  const confPercent = Math.round((data.confidence || 0.9) * 100);

  return (
    <div className={`px-4 py-3 rounded-2xl border-2 ${config.color} min-w-[200px] max-w-[260px] transition-all group hover:scale-105 cursor-pointer`}>
      <Handle type="target" position={Position.Top} className="!bg-cyan-400" />
      
      <div className="flex items-start gap-2.5">
        <div className={`p-2 rounded-xl bg-slate-950 border border-slate-800 ${config.text} shrink-0`}>
          <Icon className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded border ${config.badge}`}>
              {type}
            </span>
            <span className="text-[10px] font-mono text-cyan-300 font-bold">
              {confPercent}%
            </span>
          </div>

          <h5 className="font-heading font-bold text-xs text-white truncate mt-1 group-hover:text-cyan-300 transition-colors">
            {data.label}
          </h5>

          {data.sublabel && (
            <p className="text-[10px] text-slate-400 truncate font-mono mt-0.5">
              {data.sublabel}
            </p>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-cyan-400" />
    </div>
  );
}

export default memo(CustomNode);
