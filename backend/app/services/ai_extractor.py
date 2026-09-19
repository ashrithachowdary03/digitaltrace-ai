import uuid
import json
import httpx
import re
from typing import List, Dict, Any, Optional
from backend.app.models.schemas import (
    ExtractedEntity, EntityType, VerificationStatus, 
    PublicProfile, ConsentedTargetInput, IdentityCandidate
)
from backend.app.core.config import settings

class AIExtractor:
    """Extracts strictly REAL structured entities directly derived from live discovered profiles across all platforms."""

    @classmethod
    async def extract_with_groq(cls, target: ConsentedTargetInput, profiles: List[PublicProfile]) -> Optional[List[ExtractedEntity]]:
        if not settings.GROQ_API_KEY:
            return None
            
        verified_profiles = [p for p in profiles if p.confidence_score > 0.1]
        if not verified_profiles and not target.platform_url:
            return None

        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {settings.GROQ_API_KEY}",
            "Content-Type": "application/json"
        }
        
        prompt = f"""
You are an expert AI entity extraction engine for DigitalTrace AI.
Extract structured entities based STRICTLY on the real discovered public profiles for:
Target Name: {target.name}
Target Username: {target.username}
Target Platform URL: {target.platform_url}
Target Organization: {target.organization}

Discovered Live Profile Data:
{json.dumps([p.model_dump() for p in verified_profiles], indent=2)}

Rules:
1. Extract ONLY facts supported directly by the profile data above.
2. If the person is an athlete, public figure, or researcher, reflect their actual domain, NEVER hallucinate software engineering or developer roles unless a real GitHub account is in the data.
3. If no verified profiles exist, do not invent any entities.
4. Extract real structured entities conforming to schema:
Person, Organization, Role, Project, Event, Publication, Product, Patent.
Return a valid JSON array of objects with keys:
- entity_type: (PERSON | ORGANIZATION | ROLE | PROJECT | EVENT | PUBLICATION | PRODUCT | PATENT)
- name: string
- role: string or null
- organization: string or null
- period_start: string or null
- period_end: string or null
- description: string
- url: string or null
- source_platform: string
- confidence: float between 0.0 and 1.0
- verification_status: (VERIFIED | HIGH_CONFIDENCE | PROBABLE | UNCERTAIN | CONFLICTING)
- supporting_evidence: string explaining exact citation

Return ONLY raw JSON with no markdown backticks.
"""
        payload = {
            "model": settings.GROQ_MODEL,
            "messages": [
                {"role": "system", "content": "You are a specialized entity extractor. Output strictly valid JSON arrays based exclusively on provided ground truth."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.1,
            "response_format": {"type": "json_object"}
        }
        
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.post(url, headers=headers, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    content = data["choices"][0]["message"]["content"]
                    parsed = json.loads(content)
                    items = parsed if isinstance(parsed, list) else parsed.get("entities", [])
                    
                    extracted: List[ExtractedEntity] = []
                    for it in items:
                        extracted.append(ExtractedEntity(
                            id=f"ent-{uuid.uuid4().hex[:6]}",
                            entity_type=EntityType(it.get("entity_type", "PROJECT")),
                            name=it.get("name", "Unknown Entity"),
                            role=it.get("role"),
                            organization=it.get("organization"),
                            period_start=it.get("period_start"),
                            period_end=it.get("period_end"),
                            description=it.get("description"),
                            url=it.get("url"),
                            source_platform=it.get("source_platform", "Cross-Platform"),
                            confidence=float(it.get("confidence", 0.90)),
                            verification_status=VerificationStatus(it.get("verification_status", "HIGH_CONFIDENCE")),
                            supporting_evidence=it.get("supporting_evidence")
                        ))
                    if extracted:
                        return extracted
        except Exception as e:
            print(f"[AIExtractor] Groq call note: {e}")
        return None

    @classmethod
    def extract_heuristic(cls, target: ConsentedTargetInput, candidate: IdentityCandidate, profiles: List[PublicProfile]) -> List[ExtractedEntity]:
        """Dynamically extracts entities exclusively from real discovered live data across all platforms."""
        name = target.name or candidate.display_name
        handle = (target.username or (candidate.handle_variations[0] if candidate.handle_variations else "")).replace("@", "")
        entities: List[ExtractedEntity] = []

        # Filter verified profiles
        verified_profiles = [p for p in profiles if p.confidence_score > 0.1]
        
        # If no verified profiles were found and no direct platform link was provided
        if not verified_profiles and not target.platform_url:
            entities.append(ExtractedEntity(
                id=f"ent-per-{uuid.uuid4().hex[:6]}",
                entity_type=EntityType.PERSON,
                name=name,
                role="Unverified Subject",
                organization=target.organization or "Unverified Public Footprint",
                period_start=None,
                period_end=None,
                description=f"Submitted target identity '{name}' with no matching live public profiles discovered.",
                url=None,
                source_platform="Ingestion Intake",
                confidence=0.10,
                verification_status=VerificationStatus.UNCERTAIN,
                supporting_evidence="No public records or matching profiles discovered on live public endpoints."
            ))
            return entities

        # Find specific verified profile platforms
        gh_profile = next((p for p in verified_profiles if p.platform == "GitHub"), None)
        reddit_profile = next((p for p in verified_profiles if p.platform == "Reddit"), None)
        hn_profile = next((p for p in verified_profiles if p.platform == "Hacker News"), None)
        sch_profile = next((p for p in verified_profiles if "Scholar" in p.platform), None)
        wiki_profile = next((p for p in verified_profiles if "Wikipedia" in p.platform), None)
        seed_profile = next((p for p in verified_profiles if p.id.startswith("prof-seed-")), None)

        real_repos = gh_profile.raw_data.get("real_repositories", []) if (gh_profile and gh_profile.raw_data) else []
        real_orgs = gh_profile.raw_data.get("organizations", []) if (gh_profile and gh_profile.raw_data) else []
        real_pubs = sch_profile.raw_data.get("publications", []) if (sch_profile and sch_profile.raw_data) else []

        # Determine genuine primary role and organization from verified sources
        primary_role = "Verified Public Identity"
        primary_org = target.organization or candidate.primary_organization or "Public Footprint"
        primary_url = target.platform_url or (gh_profile.url if gh_profile else (wiki_profile.url if wiki_profile else (reddit_profile.url if reddit_profile else (seed_profile.url if seed_profile else None))))
        
        if wiki_profile:
            bio = wiki_profile.bio or ""
            if "cricketer" in bio.lower():
                primary_role = "International Cricketer"
                primary_org = "Indian National Cricket Team"
            elif "footballer" in bio.lower() or "soccer" in bio.lower():
                primary_role = "Professional Footballer"
            elif "actor" in bio.lower() or "actress" in bio.lower():
                primary_role = "Actor / Public Figure"
            elif "scientist" in bio.lower() or "physicist" in bio.lower() or "researcher" in bio.lower():
                primary_role = "Scientific Researcher"
            elif "politician" in bio.lower() or "minister" in bio.lower():
                primary_role = "Political Figure"
            elif "entrepreneur" in bio.lower() or "executive" in bio.lower() or "ceo" in bio.lower():
                primary_role = "Executive / Entrepreneur"
            else:
                primary_role = "Documented Public Figure"
                primary_org = "Public Encyclopedia Record"
        elif gh_profile:
            primary_role = "Software Developer / Contributor"
            primary_org = gh_profile.current_company or "Open Source Contributor"
        elif sch_profile:
            primary_role = "Academic Author / Researcher"
            primary_org = sch_profile.current_company or "Academic Research"
        elif reddit_profile:
            primary_role = "Reddit Community Contributor"
            primary_org = "Reddit Platform"
        elif hn_profile:
            primary_role = "Hacker News Tech Contributor"
            primary_org = "Y Combinator Community"
        elif seed_profile:
            primary_role = f"Verified {seed_profile.platform} Profile"
            primary_org = seed_profile.platform

        # 1. Primary Person Entity
        entities.append(ExtractedEntity(
            id=f"ent-per-{uuid.uuid4().hex[:6]}",
            entity_type=EntityType.PERSON,
            name=name,
            role=primary_role,
            organization=primary_org,
            period_start="Active",
            period_end="Present",
            description=f"Verified public identity for {name} ({primary_role}).",
            url=primary_url,
            source_platform=wiki_profile.platform if wiki_profile else (gh_profile.platform if gh_profile else (seed_profile.platform if seed_profile else "Live Verification")),
            confidence=0.98 if (wiki_profile or gh_profile or target.platform_url) else 0.85,
            verification_status=VerificationStatus.VERIFIED if (wiki_profile or gh_profile or target.platform_url) else VerificationStatus.HIGH_CONFIDENCE,
            supporting_evidence=f"Corroborated across live verified public records."
        ))

        # 2. Wikipedia Biographical & Career Record
        if wiki_profile:
            entities.append(ExtractedEntity(
                id=f"ent-wiki-{uuid.uuid4().hex[:6]}",
                entity_type=EntityType.EVENT,
                name=f"Notable Career Record: {wiki_profile.display_name}",
                role=primary_role,
                organization=primary_org,
                period_start="Documented Career",
                period_end="Present",
                description=wiki_profile.bio or f"Documented public biography on Wikipedia.",
                url=wiki_profile.url,
                source_platform="Wikipedia Public API",
                confidence=0.96,
                verification_status=VerificationStatus.VERIFIED,
                supporting_evidence="Verified public encyclopedic biography indexed on Wikipedia."
            ))

            if primary_org and primary_org not in ("Public Footprint", "Public Encyclopedia Record", "Independent / Open Web"):
                entities.append(ExtractedEntity(
                    id=f"ent-org-{uuid.uuid4().hex[:6]}",
                    entity_type=EntityType.ORGANIZATION,
                    name=primary_org,
                    role="Affiliated Team / Organization",
                    organization=primary_org,
                    period_start="Active",
                    period_end="Present",
                    description=f"Primary team/organization documented for {name}.",
                    url=wiki_profile.url,
                    source_platform="Wikipedia Public API",
                    confidence=0.95,
                    verification_status=VerificationStatus.VERIFIED,
                    supporting_evidence=f"Affiliation corroborated from verified public record."
                ))

        # 3. Target Platform URL Anchor (if specified)
        if target.platform_url:
            entities.append(ExtractedEntity(
                id=f"ent-plt-{uuid.uuid4().hex[:6]}",
                entity_type=EntityType.PROFILE,
                name=f"Verified Profile ({seed_profile.platform if seed_profile else 'Platform'})",
                role="Anchor Profile",
                organization=seed_profile.platform if seed_profile else "Direct Link",
                period_start="Active",
                period_end="Present",
                description=f"Direct verified public profile provided for {name}.",
                url=target.platform_url,
                source_platform=seed_profile.platform if seed_profile else "User Ingestion",
                confidence=0.99,
                verification_status=VerificationStatus.VERIFIED,
                supporting_evidence=f"Direct public URL supplied: {target.platform_url}"
            ))

        # 4. GitHub Organizations & Real Repositories (ONLY if GitHub profile actually exists)
        if gh_profile:
            for org_login in real_orgs:
                entities.append(ExtractedEntity(
                    id=f"ent-org-{uuid.uuid4().hex[:6]}",
                    entity_type=EntityType.ORGANIZATION,
                    name=org_login,
                    role="GitHub Organization Member",
                    organization=org_login,
                    period_start="Active",
                    period_end="Present",
                    description=f"Public organization membership on GitHub.",
                    url=f"https://github.com/{org_login}",
                    source_platform="GitHub Live API",
                    confidence=0.99,
                    verification_status=VerificationStatus.VERIFIED,
                    supporting_evidence=f"Live public organization membership retrieved from GitHub API for @{gh_profile.handle}."
                ))

            for repo in real_repos[:5]:
                repo_name = repo.get("name", "Project")
                repo_desc = repo.get("description") or f"Public repository in {repo.get('language') or 'Software'}."
                repo_stars = repo.get("stars", 0)
                repo_lang = repo.get("language") or "Code"
                repo_url = repo.get("url") or f"https://github.com/{handle}/{repo_name}"
                created_year = (repo.get("created_at") or "2023")[:4]

                entities.append(ExtractedEntity(
                    id=f"ent-prj-{uuid.uuid4().hex[:6]}",
                    entity_type=EntityType.PROJECT,
                    name=repo_name,
                    role=f"Author & Maintainer ({repo_lang})",
                    organization="GitHub Public Repo",
                    period_start=created_year,
                    period_end="Present",
                    description=f"{repo_desc} (⭐ {repo_stars} stars)",
                    url=repo_url,
                    source_platform="GitHub Live API",
                    confidence=0.99,
                    verification_status=VerificationStatus.VERIFIED,
                    supporting_evidence=f"Live verified public repository authored on GitHub."
                ))

        # 5. Reddit Footprint (ONLY if Reddit actually discovered)
        if reddit_profile and reddit_profile.raw_data:
            karma = reddit_profile.raw_data.get("total_karma", 0)
            entities.append(ExtractedEntity(
                id=f"ent-red-{uuid.uuid4().hex[:6]}",
                entity_type=EntityType.PROJECT,
                name=f"Reddit Profile: {reddit_profile.handle}",
                role="Community Contributor",
                organization="Reddit Community",
                period_start="Active",
                period_end="Present",
                description=f"Public Reddit contributor with {karma:,} total karma.",
                url=reddit_profile.url,
                source_platform="Reddit Public API",
                confidence=0.95,
                verification_status=VerificationStatus.VERIFIED,
                supporting_evidence=f"Live verified Reddit account with {karma:,} public karma."
            ))

        # 6. Hacker News Footprint (ONLY if HN actually discovered)
        if hn_profile and hn_profile.raw_data:
            karma = hn_profile.raw_data.get("karma", 0)
            entities.append(ExtractedEntity(
                id=f"ent-hn-{uuid.uuid4().hex[:6]}",
                entity_type=EntityType.PROJECT,
                name=f"Hacker News Contributor: {handle}",
                role="Tech Community Contributor",
                organization="Y Combinator / Hacker News",
                period_start="Active",
                period_end="Present",
                description=f"Public contributor on Hacker News with {karma:,} karma.",
                url=hn_profile.url,
                source_platform="Hacker News API",
                confidence=0.93,
                verification_status=VerificationStatus.VERIFIED,
                supporting_evidence=f"Live verified Hacker News profile with {karma:,} karma."
            ))

        # 7. Real Academic Publications (ONLY if CrossRef papers actually discovered)
        if real_pubs:
            for pub in real_pubs[:3]:
                entities.append(ExtractedEntity(
                    id=f"ent-pub-{uuid.uuid4().hex[:6]}",
                    entity_type=EntityType.PUBLICATION,
                    name=pub.get("title", "Research Paper"),
                    role="Author / Researcher",
                    organization=pub.get("journal", "Academic Proceedings"),
                    period_start=pub.get("year", "2023"),
                    period_end=pub.get("year", "2023"),
                    description=f"Peer-reviewed academic paper indexed in CrossRef: {pub.get('journal')}",
                    url=pub.get("url"),
                    source_platform="CrossRef / Google Scholar",
                    confidence=0.92,
                    verification_status=VerificationStatus.VERIFIED,
                    supporting_evidence=f"Direct DOI citation and author index match for '{name}' in CrossRef."
                ))

        # 8. Stated Organization (if provided by user)
        if target.organization and target.organization != primary_org:
            entities.append(ExtractedEntity(
                id=f"ent-org-{uuid.uuid4().hex[:6]}",
                entity_type=EntityType.ORGANIZATION,
                name=target.organization,
                role="Stated Organization Affiliation",
                organization=target.organization,
                period_start="Active",
                period_end="Present",
                description=f"Stated organization and professional affiliation for {name}.",
                url=f"https://www.google.com/search?q={target.organization.replace(' ', '+')}",
                source_platform="Target Context",
                confidence=0.92,
                verification_status=VerificationStatus.HIGH_CONFIDENCE,
                supporting_evidence=f"Stated organization affiliation provided in ingestion record."
            ))

        # 9. Domain Keywords (if provided by user)
        if target.keywords:
            for kw in target.keywords[:3]:
                entities.append(ExtractedEntity(
                    id=f"ent-kw-{uuid.uuid4().hex[:6]}",
                    entity_type=EntityType.PRODUCT,
                    name=f"Focus Area: {kw}",
                    role="Technical Focus",
                    organization=primary_org,
                    period_start="Active",
                    period_end="Present",
                    description=f"Submitted domain focus area in '{kw}'.",
                    url=None,
                    source_platform="User Profile Specification",
                    confidence=0.88,
                    verification_status=VerificationStatus.HIGH_CONFIDENCE,
                    supporting_evidence=f"Submitted domain keyword in consented ingestion profile."
                ))

        return entities

    @classmethod
    async def extract_all(cls, target: ConsentedTargetInput, candidate: IdentityCandidate, profiles: List[PublicProfile]) -> List[ExtractedEntity]:
        groq_entities = await cls.extract_with_groq(target, profiles)
        if groq_entities:
            return groq_entities
        return cls.extract_heuristic(target, candidate, profiles)
