import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../services/api';

const PipelineContext = createContext();

export const PIPELINE_STAGES = [
  { id: 1, name: "Consent Verification", desc: "Validating ethical boundaries & authorization" },
  { id: 2, name: "Candidate Generation", desc: "Generating name permutations & handle hypotheses" },
  { id: 3, name: "Live API Source Discovery", desc: "Querying live GitHub API, CrossRef Scholar, Devpost" },
  { id: 4, name: "AI Entity Extraction", desc: "Extracting real repositories, publications & roles" },
  { id: 5, name: "Entity Resolution", desc: "Calculating Jaro-Winkler & Levenshtein string metrics" },
  { id: 6, name: "Multi-Signal Correlation", desc: "Evaluating 5-signal composite confidence matrix" },
  { id: 7, name: "Graph & Timeline Synthesis", desc: "Constructing React Flow topology & chronological timeline" },
  { id: 8, name: "Intelligence Dossier Ready", desc: "Compiling verified footprint dossier" }
];

export function PipelineProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('dt_theme') || 'dark';
  });

  const [targetInput, setTargetInput] = useState({
    name: "",
    username: "",
    platform_url: "",
    organization: "",
    location: "",
    image_url: "",
    keywords: [],
    consent_acknowledged: true,
    notes: ""
  });

  const [isRunning, setIsRunning] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
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
  }, []);

  const executePipeline = async (input) => {
    if (!consentGranted) {
      setShowConsentModal(true);
      return;
    }

    if (!input.name && !input.username && !input.platform_url && !input.organization) {
      alert("Please enter at least a Target Name, Username/Handle, or Platform Link.");
      return;
    }

    setIsRunning(true);
    setCurrentStage(1);

    try {
      for (let s = 1; s <= 7; s++) {
        setCurrentStage(s);
        await new Promise(r => setTimeout(r, 120));
      }

      const res = await apiClient.runPipeline({
        ...input,
        consent_acknowledged: true
      });

      setCurrentStage(8);
      setReport(res);
      setActiveTab('overview');
    } catch (err) {
      console.error("Pipeline execution error:", err);
      alert(err.message || "Pipeline execution failed. Please check backend connection.");
    } finally {
      setIsRunning(false);
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
