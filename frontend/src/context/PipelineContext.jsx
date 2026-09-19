import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import { MOCK_SHOWCASE_PROFILES } from '../services/mockData';

const PipelineContext = createContext();

export const PIPELINE_STAGES = [
  { id: 1, name: "Consent & Ingestion", desc: "Validating authorization boundaries" },
  { id: 2, name: "Candidate Generation", desc: "Generating name permutations & handle hypotheses" },
  { id: 3, name: "Public Source Discovery", desc: "Querying GitHub, LinkedIn, Scholar, Devpost" },
  { id: 4, name: "AI Information Extraction", desc: "Extracting structured entities & roles" },
  { id: 5, name: "Entity Resolution", desc: "Resolving aliases, nick variations & syntax" },
  { id: 6, name: "Multi-Platform Correlation", desc: "Evaluating multi-signal confidence matrix" },
  { id: 7, name: "Graph & Timeline Construction", desc: "Synthesizing topological relationships" },
  { id: 8, name: "Intelligence Report Ready", desc: "Compiling executive verification dossier" }
];

export function PipelineProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('dt_theme') || 'dark';
  });

  const [targetInput, setTargetInput] = useState({
    name: "Dr. Alex Vance",
    username: "alexvance_ai",
    organization: "NeuroMesh Labs",
    location: "San Francisco, CA / Geneva",
    image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    keywords: ["Generative AI", "Zero-Trust", "LLM Security", "Graph Neural Networks"],
    consent_acknowledged: true,
    notes: "Consented profile for AI research and public speaking footprint verification."
  });

  const [isRunning, setIsRunning] = useState(false);
  const [currentStage, setCurrentStage] = useState(8);
  const [report, setReport] = useState(null);
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'portal', 'overview', 'graph', 'timeline', 'sources', 'evidence', 'discrepancies', 'report'
  const [selectedNode, setSelectedNode] = useState(null);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [consentGranted, setConsentGranted] = useState(true);
  const [backendHealth, setBackendHealth] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    // Apply theme to document root
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('dt_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    // Check backend health on initial load
    apiClient.getHealth().then(data => setBackendHealth(data));
    // Preload background report for immediate feature viewing
    executePipeline(targetInput, true);
  }, []);

  const executePipeline = async (input, isInitial = false) => {
    if (!consentGranted) {
      setShowConsentModal(true);
      return;
    }

    setIsRunning(true);
    setCurrentStage(1);

    try {
      for (let s = 1; s <= 7; s++) {
        setCurrentStage(s);
        await new Promise(r => setTimeout(r, isInitial ? 80 : 250));
      }

      const res = await apiClient.runPipeline({
        ...input,
        consent_acknowledged: true
      });

      setCurrentStage(8);
      setReport(res);
      if (!isInitial) {
        setActiveTab('overview');
      }
    } catch (err) {
      console.error("Pipeline execution error:", err);
    } finally {
      setIsRunning(false);
    }
  };

  const loadShowcaseProfile = (profileId) => {
    const found = MOCK_SHOWCASE_PROFILES.find(p => p.id === profileId);
    if (found) {
      const updated = {
        name: found.name,
        username: found.username,
        organization: found.organization,
        location: found.location,
        image_url: found.image_url,
        keywords: found.keywords,
        consent_acknowledged: true,
        notes: found.notes
      };
      setTargetInput(updated);
      executePipeline(updated);
    }
  };

  return (
    <PipelineContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        targetInput,
        setTargetInput,
        isRunning,
        currentStage,
        report,
        setReport,
        activeTab,
        setActiveTab,
        selectedNode,
        setSelectedNode,
        showConsentModal,
        setShowConsentModal,
        consentGranted,
        setConsentGranted,
        backendHealth,
        showExportModal,
        setShowExportModal,
        executePipeline,
        loadShowcaseProfile,
        PIPELINE_STAGES
      }}
    >
      {children}
    </PipelineContext.Provider>
  );
}

export function usePipeline() {
  const context = useContext(PipelineContext);
  if (!context) {
    throw new Error('usePipeline must be used within a PipelineProvider');
  }
  return context;
}
