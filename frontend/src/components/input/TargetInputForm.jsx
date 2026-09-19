import React, { useState } from 'react';
import { 
  Search, 
  User, 
  AtSign, 
  Link2, 
  MapPin, 
  Tag, 
  Upload, 
  ShieldCheck, 
  Sparkles,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';
import { usePipeline } from '../../context/PipelineContext';

export default function TargetInputForm() {
  const { 
    targetInput, 
    setTargetInput, 
    executePipeline, 
    isRunning, 
    setShowConsentModal, 
    consentGranted 
  } = usePipeline();

  const [keywordInput, setKeywordInput] = useState('');

  const handleChange = (field, value) => {
    setTargetInput(prev => ({ ...prev, [field]: value }));
  };

  const handleAddKeyword = (e) => {
    if (e.key === 'Enter' && keywordInput.trim()) {
      e.preventDefault();
      if (!targetInput.keywords.includes(keywordInput.trim())) {
        setTargetInput(prev => ({
          ...prev,
          keywords: [...(prev.keywords || []), keywordInput.trim()]
        }));
      }
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (tagToRemove) => {
    setTargetInput(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== tagToRemove)
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('image_url', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!consentGranted) {
      setShowConsentModal(true);
      return;
    }
    executePipeline(targetInput);
  };

  return (
    <div className="cyber-glass-glow rounded-2xl p-6 lg:p-8 border border-cyan-500/30 relative overflow-hidden">
      <div className="relative z-10 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div>
            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-white flex items-center gap-2.5">
              <Search className="w-5 h-5 text-cyan-400" />
              Consented Target Ingestion Portal
            </h2>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Enter any real username from any platform (GitHub, Twitter/X, Reddit, LinkedIn, Hacker News) or direct platform profile link.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 font-mono text-[11px] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Consent Compliant
            </span>
          </div>
        </div>

        {/* Ingestion Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                Target Full Name (Optional)
              </label>
              <input
                type="text"
                value={targetInput.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. Linus Torvalds"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-sans"
              />
            </div>

            {/* Handle / Username */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <AtSign className="w-3.5 h-3.5 text-cyan-400" />
                Real Username / Handle
              </label>
              <input
                type="text"
                value={targetInput.username || ''}
                onChange={(e) => handleChange('username', e.target.value)}
                placeholder="e.g. torvalds, elonmusk, spez"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono"
              />
            </div>

            {/* Platform Link / Profile URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-cyan-400" />
                Platform Link / Profile URL
              </label>
              <input
                type="text"
                value={targetInput.platform_url || ''}
                onChange={(e) => handleChange('platform_url', e.target.value)}
                placeholder="e.g. https://x.com/elonmusk"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono"
              />
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                Geographic Region / Location
              </label>
              <input
                type="text"
                value={targetInput.location || ''}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="e.g. Portland, Oregon"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-sans"
              />
            </div>

            {/* Consented Photo Upload */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                  Consented Profile Photo
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Upload or Auto</span>
              </label>
              <div className="flex items-center gap-2">
                {targetInput.image_url ? (
                  <img
                    src={targetInput.image_url}
                    alt="Preview"
                    className="w-10 h-10 rounded-xl object-cover border border-cyan-500/50"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500">
                    <User className="w-5 h-5" />
                  </div>
                )}
                <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-dashed border-slate-700 hover:border-cyan-400 text-xs text-slate-300 cursor-pointer transition-all">
                  <Upload className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Choose file</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Domain Keywords */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-cyan-400" />
                  Domain Keywords & Skills
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Press Enter</span>
              </label>
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={handleAddKeyword}
                placeholder="e.g. Operating Systems, C, Git"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-sans"
              />
            </div>

          </div>

          {/* Keyword tags chips */}
          {targetInput.keywords && targetInput.keywords.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-mono text-slate-400">Context Tags:</span>
              {targetInput.keywords.map((kw, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-800 text-cyan-300 text-xs font-mono"
                >
                  {kw}
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(kw)}
                    className="text-cyan-400 hover:text-white cursor-pointer ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Real-time live GitHub API, CrossRef Scholar, and public footprint correlation enabled.</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowConsentModal(true)}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all cursor-pointer"
              >
                Verify Consent
              </button>

              <button
                type="submit"
                disabled={isRunning}
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-heading font-bold text-sm shadow-[0_0_25px_rgba(6,182,212,0.4)] disabled:opacity-50 transition-all cursor-pointer"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Querying Live Public Sources...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>Discover Real Footprint</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}
