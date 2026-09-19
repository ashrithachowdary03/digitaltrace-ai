import React, { useState, useMemo, useCallback } from 'react';
import { 
  ReactFlow, 
  MiniMap, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { 
  GitFork, 
  Layers, 
  ShieldCheck, 
  ExternalLink, 
  X, 
  Filter, 
  Maximize2,
  Sparkles,
  Info
} from 'lucide-react';
import CustomNode from './CustomNode';
import { usePipeline } from '../../context/PipelineContext';

const nodeTypes = {
  person: CustomNode,
  organization: CustomNode,
  project: CustomNode,
  event: CustomNode,
  publication: CustomNode,
  patent: CustomNode,
  product: CustomNode,
  profile: CustomNode,
};

export default function RelationshipGraph() {
  const { report } = usePipeline();
  const [selectedNodeData, setSelectedNodeData] = useState(null);
  const [filterType, setFilterType] = useState('ALL');

  const graphData = report?.relationship_graph;

  const initialNodes = useMemo(() => {
    if (!graphData?.nodes) return [];
    return graphData.nodes.map(n => ({
      id: n.id,
      type: n.type,
      position: n.position || { x: 400, y: 300 },
      data: {
        label: n.label,
        sublabel: n.sublabel,
        type: n.type,
        confidence: n.confidence,
        verification_status: n.verification_status,
        properties: n.properties || {},
        platform: n.platform
      }
    }));
  }, [graphData]);

  const initialEdges = useMemo(() => {
    if (!graphData?.edges) return [];
    return graphData.edges.map(e => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label,
      animated: true,
      style: { stroke: '#38bdf8', strokeWidth: 2 },
      labelStyle: { fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' },
      labelBgStyle: { fill: '#090d16', fillOpacity: 0.85 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#38bdf8',
      },
      data: {
        confidence: e.confidence,
        evidence: e.evidence
      }
    }));
  }, [graphData]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Filter nodes if user selects specific type
  const displayedNodes = useMemo(() => {
    if (filterType === 'ALL') return nodes;
    return nodes.filter(n => n.type === 'person' || n.type === filterType.toLowerCase());
  }, [nodes, filterType]);

  const onNodeClick = useCallback((event, node) => {
    setSelectedNodeData(node.data);
  }, []);

  if (!graphData) {
    return (
      <div className="p-12 text-center text-slate-400 cyber-glass rounded-2xl border border-slate-800">
        <GitFork className="w-8 h-8 text-cyan-400 mx-auto mb-2 animate-spin" />
        <p>Synthesizing relationship graph topology...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      
      {/* Top Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div>
          <h2 className="font-heading font-extrabold text-xl text-white flex items-center gap-2.5">
            <GitFork className="w-5 h-5 text-cyan-400" />
            Interactive Relationship Topology (Section 9.9)
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Topological map connecting Person ↔ Organizations ↔ Projects ↔ Events ↔ Publications ↔ Profiles.
          </p>
        </div>

        {/* Entity Type Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['ALL', 'PROJECT', 'ORGANIZATION', 'EVENT', 'PUBLICATION', 'PATENT', 'PROFILE'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                filterType === type
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-semibold shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Main Canvas Container */}
      <div className="relative w-full h-[620px] rounded-2xl cyber-glass border border-cyan-500/30 overflow-hidden shadow-2xl">
        
        <ReactFlow
          nodes={displayedNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-slate-950/90"
        >
          <Background color="#1e293b" gap={20} size={1} />
          <Controls className="!bg-slate-900 !border-slate-800 !text-slate-300 [&>button]:!bg-slate-900 [&>button]:!border-slate-800 [&>button]:!text-slate-300 hover:[&>button]:!text-cyan-400" />
          <MiniMap
            nodeColor={(node) => {
              switch (node.type) {
                case 'person': return '#06b6d4';
                case 'organization': return '#3b82f6';
                case 'project': return '#10b981';
                case 'event': return '#a855f7';
                case 'publication': return '#f59e0b';
                case 'patent': return '#f43f5e';
                default: return '#64748b';
              }
            }}
            className="!bg-slate-900/90 !border-slate-800 rounded-xl"
            maskColor="rgba(15, 23, 42, 0.7)"
          />
        </ReactFlow>

        {/* Node Detail Inspector Drawer */}
        {selectedNodeData && (
          <div className="absolute top-4 right-4 z-20 w-80 sm:w-96 cyber-glass-glow rounded-2xl p-5 border border-cyan-500/50 shadow-2xl animate-fadeIn space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                    {selectedNodeData.type} Node Details
                  </span>
                  <h4 className="font-heading font-bold text-sm text-white">
                    {selectedNodeData.label}
                  </h4>
                </div>
              </div>
              <button
                onClick={() => setSelectedNodeData(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 font-mono">Verification Status:</span>
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono font-semibold border border-cyan-800 text-[11px]">
                  {selectedNodeData.verification_status || 'VERIFIED'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 font-mono">Confidence Rating:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {Math.round((selectedNodeData.confidence || 0.9) * 100)}%
                </span>
              </div>

              {selectedNodeData.properties?.description && (
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-500 block mb-1">Description:</span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedNodeData.properties.description}
                  </p>
                </div>
              )}

              {selectedNodeData.properties?.evidence && (
                <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-900/50">
                  <span className="text-[10px] font-mono text-cyan-400 block mb-1">Supporting Evidence:</span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedNodeData.properties.evidence}
                  </p>
                </div>
              )}

              {selectedNodeData.properties?.url && (
                <a
                  href={selectedNodeData.properties.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition-all"
                >
                  <span>Open Source Record</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
