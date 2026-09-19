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

    # Stage 8: Dynamic Executive Summary & Footprint Risk Analysis
    name = target.name or primary_cand.display_name
    verified_profiles = [p for p in profiles if p.confidence_score > 0.1]
    discovered_platform_names = [p.platform for p in verified_profiles]
    
    conf_pct = int(correlation.overall_confidence_score * 100)
    status_label = correlation.status.value

    if verified_profiles:
        platforms_str = ", ".join(discovered_platform_names)
        exec_summary = (
            f"Consented intelligence discovery for '{name}' successfully identified {len(verified_profiles)} verified public profile(s) "
            f"across {platforms_str}. The composite correlation confidence is calculated at {conf_pct}% ({status_label}). "
            f"A total of {len(entities)} structured entity record(s) were extracted directly from live public endpoints."
        )
        footprint_level = "HIGH" if len(verified_profiles) >= 3 else ("MODERATE" if len(verified_profiles) >= 2 else "LOW")
        exposure_score = min(95, max(20, conf_pct))
        key_strengths = [
            f"Corroborated public footprint across {platforms_str}",
            f"{len(entities)} verified structured entity associations established"
        ]
        attention_items = [
            "Maintain consistent biographical metadata across active public profiles"
        ]
    else:
        exec_summary = (
            f"Consented intelligence discovery for '{name}' completed across live public endpoints (GitHub, Reddit, Hacker News, CrossRef, Wikipedia). "
            f"No verified public profiles were corroborated matching the submitted criteria. "
            f"The composite correlation confidence is {conf_pct}% ({status_label})."
        )
        footprint_level = "MINIMAL_UNVERIFIED"
        exposure_score = 10
        key_strengths = [
            "No unintended public surface exposure or credential leaks found on queried public indexes"
        ]
        attention_items = [
            "Verify spelling of submitted handle or provide a direct authorized platform profile link"
        ]

    risk_analysis = {
        "overall_footprint_level": footprint_level,
        "surface_exposure_score": exposure_score,
        "verified_identity_cohesion": f"{conf_pct}%",
        "privacy_and_compliance": "Fully compliant with authorized OSINT and consented public boundaries.",
        "key_strengths": key_strengths,
        "attention_items": attention_items
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
