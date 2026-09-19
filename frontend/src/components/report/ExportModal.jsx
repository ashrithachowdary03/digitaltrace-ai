import React, { useState } from 'react';
import { 
  Download, 
  Printer, 
  FileCode, 
  Copy, 
  Check, 
  X, 
  ShieldCheck, 
  Share2 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { usePipeline } from '../../context/PipelineContext';

export default function ExportModal() {
  const { showExportModal, setShowExportModal, report } = usePipeline();
  const [copied, setCopied] = useState(false);

  if (!showExportModal || !report) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `digitaltrace_intelligence_${report.target_id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 }
    });
  };

  const handleCopySummary = () => {
    const text = `DIGITALTRACE AI INTELLIGENCE REPORT #${report.target_id}
Target: ${report.primary_candidate.display_name} (${report.primary_candidate.primary_organization})
Correlation Confidence: ${Math.round(report.correlation_metrics.overall_confidence_score * 100)}% (${report.correlation_metrics.status})
Discovered Profiles: ${report.discovered_profiles?.length || 0}
Entities Extracted: ${report.extracted_entities?.length || 0}
Evidence Claims Audited: ${report.evidence_matrix?.length || 0}

Executive Summary:
${report.executive_summary}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);

    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.7 }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg cyber-glass-glow rounded-2xl p-6 sm:p-8 border border-cyan-500/40 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">
                Export Intelligence Dossier
              </h3>
              <p className="text-xs font-mono text-slate-400">
                Target: {report.primary_candidate.display_name} (#{report.target_id})
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowExportModal(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 gap-3">
          
          {/* Print / PDF Option */}
          <button
            onClick={handlePrint}
            className="flex items-center justify-between p-4 rounded-xl cyber-glass hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 group-hover:scale-110 transition-transform">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                  Print / Save as PDF Dossier
                </h4>
                <p className="text-[11px] text-slate-400">
                  Formatted for formal cybersecurity executive review.
                </p>
              </div>
            </div>
          </button>

          {/* Machine-Readable JSON */}
          <button
            onClick={handleDownloadJSON}
            className="flex items-center justify-between p-4 rounded-xl cyber-glass hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-blue-400 group-hover:scale-110 transition-transform">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-white group-hover:text-blue-300 transition-colors">
                  Download Full JSON Dossier
                </h4>
                <p className="text-[11px] text-slate-400">
                  Complete structured payload matching database schema.
                </p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
          </button>

          {/* Copy Summary Text */}
          <button
            onClick={handleCopySummary}
            className="flex items-center justify-between p-4 rounded-xl cyber-glass hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 group-hover:scale-110 transition-transform">
                {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                  {copied ? 'Summary Copied to Clipboard!' : 'Copy Executive Summary'}
                </h4>
                <p className="text-[11px] text-slate-400">
                  Quick text summary for emails or briefings.
                </p>
              </div>
            </div>
          </button>

        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={() => setShowExportModal(false)}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
