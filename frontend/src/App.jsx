import React from 'react';
import { PipelineProvider, usePipeline } from './context/PipelineContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './components/pages/HomePage';
import ShowcaseDemos from './components/input/ShowcaseDemos';
import TargetInputForm from './components/input/TargetInputForm';
import PipelineStepper from './components/pipeline/PipelineStepper';
import IdentityOverview from './components/dashboard/IdentityOverview';
import ConfidenceScorecard from './components/dashboard/ConfidenceScorecard';
import DiscrepancyAlerts from './components/dashboard/DiscrepancyAlerts';
import SourceGrid from './components/sources/SourceGrid';
import RelationshipGraph from './components/graph/RelationshipGraph';
import ActivityTimeline from './components/timeline/ActivityTimeline';
import EvidenceMatrix from './components/evidence/EvidenceMatrix';
import IntelligenceReport from './components/report/IntelligenceReport';
import ConsentModal from './components/input/ConsentModal';
import ExportModal from './components/report/ExportModal';

function MainDashboard() {
  const { activeTab, report, isRunning } = usePipeline();

  return (
    <div className="min-h-screen flex flex-col cyber-grid-bg transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        
        {/* 1. Home Page: Minimal Hero (Logo, Tagline, Overview, Feature Cards) */}
        {activeTab === 'home' && <HomePage />}

        {/* 2. Target Ingestion Portal Page */}
        {activeTab === 'portal' && (
          <div className="space-y-6 animate-fadeIn">
            <ShowcaseDemos />
            <TargetInputForm />
            {isRunning && <PipelineStepper />}
          </div>
        )}

        {/* 3. Overview Dashboard */}
        {activeTab === 'overview' && report && (
          <div className="space-y-6 animate-fadeIn">
            {isRunning && <PipelineStepper />}
            <IdentityOverview />
            <ConfidenceScorecard />
            <DiscrepancyAlerts />
          </div>
        )}

        {/* 4. Relationship Graph Page */}
        {activeTab === 'graph' && report && (
          <div className="animate-fadeIn">
            <RelationshipGraph />
          </div>
        )}

        {/* 5. Chronological Timeline Page */}
        {activeTab === 'timeline' && report && (
          <div className="animate-fadeIn">
            <ActivityTimeline />
          </div>
        )}

        {/* 6. Discovered Sources Page */}
        {activeTab === 'sources' && report && (
          <div className="animate-fadeIn">
            <SourceGrid />
          </div>
        )}

        {/* 7. Audited Evidence Matrix Page */}
        {activeTab === 'evidence' && report && (
          <div className="animate-fadeIn">
            <EvidenceMatrix />
          </div>
        )}

        {/* 8. Discrepancy & Conflict Center Page */}
        {activeTab === 'discrepancies' && report && (
          <div className="animate-fadeIn">
            <DiscrepancyAlerts />
          </div>
        )}

        {/* 9. Intelligence Dossier Page */}
        {activeTab === 'report' && report && (
          <div className="animate-fadeIn">
            <IntelligenceReport />
          </div>
        )}

      </main>

      <Footer />
      <ConsentModal />
      <ExportModal />
    </div>
  );
}

export default function App() {
  return (
    <PipelineProvider>
      <MainDashboard />
    </PipelineProvider>
  );
}
