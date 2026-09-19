import uuid
import re
from typing import List
from backend.app.models.schemas import ConsentedTargetInput, IdentityCandidate

class CandidateGenerator:
    """Generates candidate identity hypotheses strictly derived from user-submitted form values."""

    @staticmethod
    def generate_handle_variations(name: str, username: str = None) -> List[str]:
        variations = set()
        
        if username:
            cleaned_u = username.strip().lower().replace("@", "")
            variations.add(cleaned_u)
            if "_" in cleaned_u or "-" in cleaned_u:
                variations.add(cleaned_u.replace("-", "_"))
                variations.add(cleaned_u.replace("_", "-"))
            if "." in cleaned_u:
                variations.add(cleaned_u.replace(".", ""))

        if name:
            parts = [re.sub(r'[^a-zA-Z0-9]', '', p.lower()) for p in name.split() if p]
            if len(parts) >= 2:
                first, last = parts[0], parts[-1]
                variations.add(f"{first}{last}")
                variations.add(f"{first}.{last}")
                variations.add(f"{first}_{last}")
                variations.add(f"{first}-{last}")
                variations.add(f"{first[0]}{last}")
                variations.add(f"{first}{last[0]}")
            elif len(parts) == 1:
                variations.add(parts[0])

        return list(variations)

    @staticmethod
    def generate_name_aliases(name: str) -> List[str]:
        aliases = set()
        if not name or not name.strip():
            return []
            
        parts = name.strip().split()
        aliases.add(name.strip())
        
        if len(parts) >= 2:
            first = parts[0]
            last = parts[-1]
            middle = parts[1:-1]
            
            aliases.add(f"{first[0]}. {last}")
            aliases.add(f"{first} {last[0]}.")
            aliases.add(f"{last}, {first}")
            if middle:
                aliases.add(f"{first} {' '.join(middle)} {last}")
                aliases.add(f"{first} {middle[0][0]}. {last}")
        return list(aliases)

    @classmethod
    def generate_candidates(cls, target: ConsentedTargetInput) -> List[IdentityCandidate]:
        candidates: List[IdentityCandidate] = []
        from backend.app.services.source_discovery import parse_platform_url
        
        parsed_platform, parsed_handle = parse_platform_url(target.platform_url) if target.platform_url else ("", "")
        username = (target.username or parsed_handle or "").replace("@", "").strip()
        name = (target.name or (f"User @{username}" if username else "Target Candidate")).strip()
        org = target.organization.strip() if target.organization else (f"Platform ({parsed_platform})" if parsed_platform else None)
        
        handle_vars = cls.generate_handle_variations(name, username)
        name_aliases = cls.generate_name_aliases(name)

        # Evaluate submitted signal strength
        signals = []
        if target.name:
            signals.append(f"Submitted Target Name: '{target.name}'")
        if target.username or parsed_handle:
            signals.append(f"Submitted Handle Seed: @{username}")
        if target.platform_url:
            signals.append(f"Submitted Direct Profile Link: {target.platform_url}")
        if target.organization:
            signals.append(f"Submitted Organization: {target.organization}")
        if target.location:
            signals.append(f"Submitted Location: {target.location}")
        if target.keywords:
            signals.append(f"Submitted Domain Keywords: {', '.join(target.keywords[:4])}")

        # Likelihood based strictly on quantity and specificity of user-provided information
        has_direct_url = bool(target.platform_url)
        has_name_and_user = bool(target.name and username)
        has_name = bool(target.name)
        has_user = bool(username)

        if has_direct_url:
            likelihood = 0.95
        elif has_name_and_user and target.organization:
            likelihood = 0.90
        elif has_name_and_user:
            likelihood = 0.85
        elif has_name or has_user:
            likelihood = 0.70
        else:
            likelihood = 0.20

        primary = IdentityCandidate(
            id=f"cand-{uuid.uuid4().hex[:8]}",
            canonical_name=name,
            display_name=name,
            handle_variations=handle_vars[:8],
            potential_aliases=name_aliases[:6],
            likelihood_score=likelihood,
            primary_organization=org or "Unspecified Affiliation",
            avatar_url=target.image_url,
            rationale=f"Primary candidate initialized from {len(signals)} consented input field(s).",
            matched_signals=signals or ["Submitted Unspecified Input"]
        )
        candidates.append(primary)

        # Secondary alias candidate hypothesis only if sufficient handle permutations exist
        if len(handle_vars) > 1 and username:
            alt_handles = [h for h in handle_vars if h != username.lower()][:3]
            if alt_handles:
                alt_candidate = IdentityCandidate(
                    id=f"cand-{uuid.uuid4().hex[:8]}",
                    canonical_name=f"{name} (Alternate Handle)",
                    display_name=f"@{alt_handles[0]}",
                    handle_variations=alt_handles,
                    potential_aliases=name_aliases[1:3] if len(name_aliases) > 1 else [],
                    likelihood_score=round(likelihood * 0.75, 2),
                    primary_organization=org or "Unspecified Affiliation",
                    avatar_url=target.image_url,
                    rationale="Hypothesized handle variation based on normalized naming patterns.",
                    matched_signals=["Normalized Handle Permutation"]
                )
                candidates.append(alt_candidate)

        return candidates
