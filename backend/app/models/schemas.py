from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum

class VerificationStatus(str, Enum):
    VERIFIED = "VERIFIED"
    HIGH_CONFIDENCE = "HIGH_CONFIDENCE"
    PROBABLE = "PROBABLE"
    UNCERTAIN = "UNCERTAIN"
    CONFLICTING = "CONFLICTING"

class EntityType(str, Enum):
    PERSON = "PERSON"
    ORGANIZATION = "ORGANIZATION"
    ROLE = "ROLE"
    PROJECT = "PROJECT"
    EVENT = "EVENT"
    PUBLICATION = "PUBLICATION"
    PRODUCT = "PRODUCT"
    PATENT = "PATENT"
    PROFILE = "PROFILE"

class ConsentedTargetInput(BaseModel):
    name: Optional[str] = Field(default=None, description="Target full or partial name")
    username: Optional[str] = Field(default=None, description="Known handle or username")
    organization: Optional[str] = Field(default=None, description="Associated organization or company")
    location: Optional[str] = Field(default=None, description="Geographic location or region")
    image_url: Optional[str] = Field(default=None, description="Consented avatar / profile photo data URL")
    keywords: Optional[List[str]] = Field(default_factory=list, description="Keywords, domains, or skills")
    consent_acknowledged: bool = Field(default=True, description="Explicit authorization confirmation")
    notes: Optional[str] = Field(default=None, description="Additional authorized context")

class IdentityCandidate(BaseModel):
    id: str
    canonical_name: str
    display_name: str
    handle_variations: List[str]
    potential_aliases: List[str]
    likelihood_score: float = Field(ge=0.0, le=1.0)
    primary_organization: Optional[str] = None
    avatar_url: Optional[str] = None
    rationale: str
    matched_signals: List[str]

class PublicProfile(BaseModel):
    id: str
    platform: str  # GitHub, LinkedIn, Devpost, YouTube, Scholar, Twitter, Medium, Company
    url: str
    handle: str
    display_name: str
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    location: Optional[str] = None
    current_company: Optional[str] = None
    headline: Optional[str] = None
    followers_count: Optional[int] = None
    public_repos_count: Optional[int] = None
    raw_data: Optional[Dict[str, Any]] = None
    confidence_score: float = Field(ge=0.0, le=1.0)
    match_reasons: List[str] = Field(default_factory=list)

class ExtractedEntity(BaseModel):
    id: str
    entity_type: EntityType
    name: str
    role: Optional[str] = None
    organization: Optional[str] = None
    period_start: Optional[str] = None
    period_end: Optional[str] = None
    description: Optional[str] = None
    url: Optional[str] = None
    source_platform: str
    confidence: float = Field(ge=0.0, le=1.0)
    verification_status: VerificationStatus
    supporting_evidence: Optional[str] = None

class EvidenceItem(BaseModel):
    id: str
    claim: str
    source_platform: str
    source_url: str
    supporting_evidence: str
    confidence: float = Field(ge=0.0, le=1.0)
    verification_status: VerificationStatus
    entities_involved: List[str] = Field(default_factory=list)
    timestamp: Optional[str] = None

class DiscrepancyWarning(BaseModel):
    id: str
    field_or_topic: str
    description: str
    conflicting_sources: List[str]
    severity: str = "medium"  # low, medium, high
    recommendation: str

class TimelineEvent(BaseModel):
    id: str
    year: int
    date_display: str
    title: str
    subtitle: Optional[str] = None
    category: str  # Career, Project, Event, Publication, Patent, Award
    organization: Optional[str] = None
    description: str
    source_platform: str
    source_url: Optional[str] = None
    confidence: float
    verification_status: VerificationStatus

class GraphNode(BaseModel):
    id: str
    label: str
    type: str  # person, organization, role, project, event, publication, product, patent, profile
    sublabel: Optional[str] = None
    avatar: Optional[str] = None
    confidence: float
    verification_status: str
    platform: Optional[str] = None
    properties: Dict[str, Any] = Field(default_factory=dict)
    position: Optional[Dict[str, float]] = None

class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    label: str  # FOUNDED, WORKED_AT, CREATED, SPOKE_AT, AUTHORED, LINKED_TO, PATENTED
    confidence: float
    verified: bool
    evidence: Optional[str] = None

class GraphData(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]

class MultiSignalCorrelation(BaseModel):
    name_similarity_score: float
    handle_similarity_score: float
    organization_congruence_score: float
    role_timeline_consistency: float
    cross_source_backlinks_score: float
    overall_confidence_score: float
    status: VerificationStatus
    verified_claims_count: int
    uncertain_claims_count: int
    conflicting_claims_count: int

class IntelligenceReport(BaseModel):
    target_id: str
    created_at: str
    target_input: ConsentedTargetInput
    candidate_identities: List[IdentityCandidate]
    primary_candidate: IdentityCandidate
    discovered_profiles: List[PublicProfile]
    extracted_entities: List[ExtractedEntity]
    evidence_matrix: List[EvidenceItem]
    discrepancies_and_uncertainties: List[DiscrepancyWarning]
    correlation_metrics: MultiSignalCorrelation
    timeline: List[TimelineEvent]
    relationship_graph: GraphData
    executive_summary: str
    risk_and_footprint_analysis: Dict[str, Any]
