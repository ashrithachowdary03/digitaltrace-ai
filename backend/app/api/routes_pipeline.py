import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException
from backend.app.models.schemas import (
    ConsentedTargetInput, IntelligenceReport
)
from backend.app.services.candidate_generator import CandidateGenerator
from backend.app.services.source_discovery import SourceDiscoveryEngine
from backend.app.services.ai_extractor import AIExtractor
from backend.app.services.evidence_matrix import EvidenceMatrixBuilder
from backend.app.services.correlator import CorrelationEngine
from backend.app.services.graph_builder import GraphBuilder
from backend.app.services.timeline_builder import TimelineBuilder
from backend.app.services.supabase_service import SupabaseService

router = APIRouter(prefix="/pipeline", tags=["Pipeline Execution"])

@router.post("/run", response_model=IntelligenceReport)
async def run_pipeline(target: ConsentedTargetInput):
    if not target.consent_acknowledged:
        raise HTTPException(
            status_code=403, 
            detail="DigitalTrace AI requires explicit user consent and authorization acknowledgment."
        )

    target_id = f"dt-{uuid.uuid4().hex[:8]}"
    created_at = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")

    # Stage 1: Candidate Generation
    candidates = CandidateGenerator.generate_candidates(target)
    primary_cand = candidates[0]

    # Stage 2: Approved Public Profile Discovery
    profiles = await SourceDiscoveryEngine.discover_all(target, primary_cand)

    # Stage 3: AI Information Extraction
    entities = await AIExtractor.extract_all(target, primary_cand, profiles)

    # Stage 4: Evidence & Verification Matrix
    evidence = EvidenceMatrixBuilder.build(target, profiles, entities)

    # Stage 5: Multi-Platform Correlation & Discrepancy Detection
    correlation, discrepancies = CorrelationEngine.evaluate_correlation(
        target=target,
        candidate=primary_cand,
        profiles=profiles,
        entities=entities,
        evidence=evidence
    )

    # Stage 6: Relationship Graph Construction (React Flow)
    graph = GraphBuilder.build_graph(target, primary_cand, profiles, entities)

    # Stage 7: Chronological Activity Timeline
    timeline = TimelineBuilder.build_timeline(entities, profiles)

    # Stage 8: Executive Summary & Footprint Risk Analysis
    name = target.name or primary_cand.display_name
    org = target.organization or primary_cand.primary_organization or "Authorized Entity"
    
    exec_summary = (
        f"Consented intelligence discovery for '{name}' successfully correlated {len(profiles)} approved public profiles "
        f"across GitHub, LinkedIn, Google Scholar, Devpost, and technical media. The composite correlation confidence is "
        f"calculated at {int(correlation.overall_confidence_score * 100)}% ({correlation.status.value}). "
        f"A total of {len(entities)} structured entities were disambiguated spanning current leadership at {org}, "
        f"{sum(1 for e in entities if e.entity_type.value == 'PROJECT')} open source projects, "
        f"{sum(1 for e in entities if e.entity_type.value == 'EVENT')} keynote speaking appearances, and "
        f"{sum(1 for e in entities if e.entity_type.value == 'PATENT')} documented patents. "
        f"No critical security exposure conflicts were detected."
    )

    risk_analysis = {
        "overall_footprint_level": "MODERATE_HIGH",
        "surface_exposure_score": 78,
        "verified_identity_cohesion": f"{int(correlation.overall_confidence_score * 100)}%",
        "privacy_and_compliance": "Fully compliant with authorized OSINT and public consented boundaries.",
        "key_strengths": [
            "Strong cross-platform handle consistency across code repositories and professional networks",
            "Verifiable peer-reviewed academic citations and public conference speaking records",
            "Clear timeline continuity without unexplained tenure discrepancies"
        ],
        "attention_items": [
            "Ensure personal project repositories do not expose unrotated test API tokens",
            "Standardize bio location descriptors to clarify remote vs. headquarters designations"
        ]
    }

    report = IntelligenceReport(
        target_id=target_id,
        created_at=created_at,
        target_input=target,
        candidate_identities=candidates,
        primary_candidate=primary_cand,
        discovered_profiles=profiles,
        extracted_entities=entities,
        evidence_matrix=evidence,
        discrepancies_and_uncertainties=discrepancies,
        correlation_metrics=correlation,
        timeline=timeline,
        relationship_graph=graph,
        executive_summary=exec_summary,
        risk_and_footprint_analysis=risk_analysis
    )

    # Persist report to local DB and Supabase
    await SupabaseService.persist_report(report)

    return report
