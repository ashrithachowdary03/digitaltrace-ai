from fastapi import APIRouter, HTTPException
from typing import List
from backend.app.models.schemas import ConsentedTargetInput, IdentityCandidate
from backend.app.services.candidate_generator import CandidateGenerator

router = APIRouter(prefix="/ingest", tags=["Ingest & Candidates"])

@router.post("/candidates", response_model=List[IdentityCandidate])
async def generate_candidates(target: ConsentedTargetInput):
    if not target.consent_acknowledged:
        raise HTTPException(
            status_code=403, 
            detail="DigitalTrace AI requires explicit user consent and authorization acknowledgment."
        )
    if not target.name and not target.username and not target.organization:
        raise HTTPException(
            status_code=400,
            detail="At least one identifier (Name, Username, or Organization) is required."
        )
    
    candidates = CandidateGenerator.generate_candidates(target)
    return candidates
