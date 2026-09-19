from fastapi import APIRouter, HTTPException
from typing import List
from backend.app.models.schemas import ConsentedTargetInput, PublicProfile
from backend.app.services.candidate_generator import CandidateGenerator
from backend.app.services.source_discovery import SourceDiscoveryEngine

router = APIRouter(prefix="/discovery", tags=["Discovery"])

@router.post("/profiles", response_model=List[PublicProfile])
async def discover_profiles(target: ConsentedTargetInput):
    if not target.consent_acknowledged:
        raise HTTPException(
            status_code=403, 
            detail="User consent and authorization acknowledgment required."
        )
    candidates = CandidateGenerator.generate_candidates(target)
    primary = candidates[0]
    profiles = await SourceDiscoveryEngine.discover_all(target, primary)
    return profiles
