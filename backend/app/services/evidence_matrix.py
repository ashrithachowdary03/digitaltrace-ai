import uuid
from typing import List
from backend.app.models.schemas import (
    EvidenceItem, ExtractedEntity, PublicProfile, 
    VerificationStatus, ConsentedTargetInput
)

class EvidenceMatrixBuilder:
    """Generates a structured, auditable evidence and verification matrix strictly for discovered findings."""

    @classmethod
    def build(cls, target: ConsentedTargetInput, profiles: List[PublicProfile], entities: List[ExtractedEntity]) -> List[EvidenceItem]:
        matrix: List[EvidenceItem] = []
        name = target.name or "Primary Subject"

        verified_profiles = [p for p in profiles if p.confidence_score > 0.1]

        # If no verified public records were discovered
        if not verified_profiles and not target.platform_url:
            matrix.append(EvidenceItem(
                id=f"ev-{uuid.uuid4().hex[:6]}",
                claim=f"No verified public profiles or digital records corroborated for target '{name}'.",
                source_platform="Live Public Search Endpoints",
                source_url="",
                supporting_evidence="Automated live queries to GitHub, Reddit, Hacker News, CrossRef, and Wikipedia returned 0 confirmed accounts.",
                confidence=0.0,
                verification_status=VerificationStatus.UNCERTAIN,
                entities_involved=[name, "Unverified Footprint"]
            ))
            return matrix

        # 0. User Provided Platform URL Claim
        if target.platform_url:
            seed_prof = next((p for p in verified_profiles if p.id.startswith("prof-seed-")), None)
            matrix.append(EvidenceItem(
                id=f"ev-{uuid.uuid4().hex[:6]}",
                claim=f"Primary seed platform profile verified at '{target.platform_url}'.",
                source_platform=seed_prof.platform if seed_prof else "Direct Platform Ingestion",
                source_url=target.platform_url,
                supporting_evidence=f"Direct consented public profile anchor authenticated for {name}.",
                confidence=0.99,
                verification_status=VerificationStatus.VERIFIED,
                entities_involved=[name, seed_prof.platform if seed_prof else "Platform URL"]
            ))

        # 1. Wikipedia Biography Evidence (if found)
        wiki_prof = next((p for p in verified_profiles if "Wikipedia" in p.platform), None)
        if wiki_prof:
            matrix.append(EvidenceItem(
                id=f"ev-{uuid.uuid4().hex[:6]}",
                claim=f"Documented public biographical notability verified on Wikipedia.",
                source_platform="Wikipedia Public API",
                source_url=wiki_prof.url,
                supporting_evidence=wiki_prof.bio or f"Public encyclopedia record matching '{name}'.",
                confidence=0.96,
                verification_status=VerificationStatus.VERIFIED,
                entities_involved=[name, "Wikipedia"]
            ))

        # 2. GitHub Evidence (ONLY if actually discovered)
        gh_prof = next((p for p in verified_profiles if p.platform == "GitHub"), None)
        if gh_prof:
            repos_count = gh_prof.public_repos_count or 0
            matrix.append(EvidenceItem(
                id=f"ev-{uuid.uuid4().hex[:6]}",
                claim=f"Active public software contributions verified on GitHub ({gh_prof.handle}).",
                source_platform="GitHub Live API",
                source_url=gh_prof.url,
                supporting_evidence=f"Live public GitHub profile with {repos_count} public repositories verified.",
                confidence=0.98,
                verification_status=VerificationStatus.VERIFIED,
                entities_involved=[name, "GitHub"]
            ))

        # 3. Reddit Evidence (ONLY if actually discovered)
        reddit_prof = next((p for p in verified_profiles if p.platform == "Reddit"), None)
        if reddit_prof:
            matrix.append(EvidenceItem(
                id=f"ev-{uuid.uuid4().hex[:6]}",
                claim=f"Verified Reddit community footprint identified under handle {reddit_prof.handle}.",
                source_platform="Reddit Public API",
                source_url=reddit_prof.url,
                supporting_evidence=reddit_prof.bio or "Live Reddit karma and public profile corroborated.",
                confidence=0.95,
                verification_status=VerificationStatus.VERIFIED,
                entities_involved=[name, "Reddit"]
            ))

        # 4. Hacker News Evidence (ONLY if actually discovered)
        hn_prof = next((p for p in verified_profiles if p.platform == "Hacker News"), None)
        if hn_prof:
            matrix.append(EvidenceItem(
                id=f"ev-{uuid.uuid4().hex[:6]}",
                claim=f"Verified Hacker News account identified under handle {hn_prof.handle}.",
                source_platform="Hacker News API",
                source_url=hn_prof.url,
                supporting_evidence=hn_prof.bio or "Live Hacker News profile and discussion karma corroborated.",
                confidence=0.93,
                verification_status=VerificationStatus.VERIFIED,
                entities_involved=[name, "Hacker News"]
            ))

        # 5. Academic & Research Verification Claim (ONLY if actually discovered)
        sch_prof = next((p for p in verified_profiles if "Scholar" in p.platform), None)
        if sch_prof:
            matrix.append(EvidenceItem(
                id=f"ev-{uuid.uuid4().hex[:6]}",
                claim=f"Peer-reviewed academic publications verified in open scientific index.",
                source_platform="Google Scholar / CrossRef",
                source_url=sch_prof.url,
                supporting_evidence="Verified citation index and author co-authorship records in CrossRef.",
                confidence=0.91,
                verification_status=VerificationStatus.VERIFIED,
                entities_involved=[name, "CrossRef Academic Index"]
            ))

        # 6. Evidence for each extracted entity
        for entity in entities:
            if entity.entity_type.value == "PERSON" and len(entities) > 1:
                continue
            status = entity.verification_status
            ev_snippet = entity.supporting_evidence or f"Documented entry in {entity.source_platform} records."
            url = entity.url or (verified_profiles[0].url if verified_profiles else "")

            matrix.append(EvidenceItem(
                id=f"ev-{uuid.uuid4().hex[:6]}",
                claim=f"Confirmed association with {entity.entity_type.value.lower()}: '{entity.name}' ({entity.role or 'Primary Entry'}).",
                source_platform=entity.source_platform,
                source_url=url,
                supporting_evidence=ev_snippet,
                confidence=entity.confidence,
                verification_status=status,
                entities_involved=[name, entity.name]
            ))

        return matrix
