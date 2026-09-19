import uuid
import re
from typing import List
from backend.app.models.schemas import ConsentedTargetInput, IdentityCandidate

class CandidateGenerator:
    """Generates possible public identity candidates and alias permutations from consented input."""

    @staticmethod
    def generate_handle_variations(name: str, username: str = None) -> List[str]:
        variations = set()
        
        if username:
            cleaned_u = username.strip().lower()
            variations.add(cleaned_u)
            variations.add(cleaned_u.replace("-", "_"))
            variations.add(cleaned_u.replace("_", "-"))
            variations.add(cleaned_u.replace(".", ""))
            variations.add(f"{cleaned_u}dev")
            variations.add(f"{cleaned_u}tech")
            variations.add(f"{cleaned_u}io")

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
                variations.add(f"{first}_{last[0]}")
                variations.add(f"{last}{first[0]}")
                variations.add(f"{first}{last}tech")
                variations.add(f"{first}{last}dev")
                variations.add(f"{first}{last}ai")
            elif len(parts) == 1:
                variations.add(parts[0])
                variations.add(f"{parts[0]}tech")
                variations.add(f"{parts[0]}dev")

        return list(variations)

    @staticmethod
    def generate_name_aliases(name: str) -> List[str]:
        aliases = set()
        if not name:
            return ["Anonymous/Handle Target"]
            
        parts = name.strip().split()
        aliases.add(name.strip())
        
        if len(parts) >= 2:
            first = parts[0]
            last = parts[-1]
            middle = parts[1:-1]
            
            # e.g., John Kumar -> J. Kumar, John K., Kumar, John
            aliases.add(f"{first[0]}. {last}")
            aliases.add(f"{first} {last[0]}.")
            aliases.add(f"{last}, {first}")
            aliases.add(f"{first[0]}.{last[0]}. {last}")
            if middle:
                aliases.add(f"{first} {' '.join(middle)} {last}")
                aliases.add(f"{first} {middle[0][0]}. {last}")
        return list(aliases)

    @classmethod
    def generate_candidates(cls, target: ConsentedTargetInput) -> List[IdentityCandidate]:
        candidates: List[IdentityCandidate] = []
        name = target.name or target.username or "Target Candidate"
        username = target.username or ""
        org = target.organization or ""
        
        handle_vars = cls.generate_handle_variations(name, username)
        name_aliases = cls.generate_name_aliases(name)

        # Primary Candidate (High likelihood candidate)
        signals = []
        if target.name:
            signals.append("Exact/Canonical Name Match")
        if target.username:
            signals.append(f"Handle Seed: @{target.username}")
        if target.organization:
            signals.append(f"Organization Affiliation: {target.organization}")
        if target.location:
            signals.append(f"Regional Corroboration: {target.location}")
        if target.keywords:
            signals.append(f"Domain Focus: {', '.join(target.keywords[:3])}")

        primary = IdentityCandidate(
            id=f"cand-{uuid.uuid4().hex[:8]}",
            canonical_name=name,
            display_name=name,
            handle_variations=handle_vars[:8],
            potential_aliases=name_aliases[:6],
            likelihood_score=0.94 if (target.name and target.organization) else 0.85,
            primary_organization=org or "Independent / Multi-affiliation",
            avatar_url=target.image_url or f"https://api.dicebear.com/7.x/bottts/svg?seed={name}",
            rationale=f"Primary candidate synthesized from consented inputs with {len(signals)} matching corroboration signals.",
            matched_signals=signals or ["Direct Authorized Ingestion"]
        )
        candidates.append(primary)

        # Secondary Candidate Hypothesis (Alternative Alias / Short-handle persona)
        if len(handle_vars) > 1:
            sec_handle = [h for h in handle_vars if h != username][:3]
            alt_candidate = IdentityCandidate(
                id=f"cand-{uuid.uuid4().hex[:8]}",
                canonical_name=f"{name} (Developer / Online Handle Identity)",
                display_name=f"@{sec_handle[0]}" if sec_handle else f"{name} (Alt)",
                handle_variations=sec_handle,
                potential_aliases=name_aliases[1:3] if len(name_aliases) > 1 else name_aliases,
                likelihood_score=0.76,
                primary_organization=org or "Open Source Community",
                avatar_url=target.image_url or f"https://api.dicebear.com/7.x/identicon/svg?seed={sec_handle[0] if sec_handle else name}",
                rationale="Hypothesized online handle and open-source contributor identity variant.",
                matched_signals=["Normalized Handle Permutation", "Cross-Platform Handle Stem"]
            )
            candidates.append(alt_candidate)

        return candidates
