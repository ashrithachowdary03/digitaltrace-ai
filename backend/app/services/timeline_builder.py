import uuid
from typing import List
from backend.app.models.schemas import TimelineEvent, ExtractedEntity, PublicProfile, VerificationStatus, EntityType

class TimelineBuilder:
    """Constructs a sorted chronological milestone timeline of verified public activities."""

    @classmethod
    def build_timeline(cls, entities: List[ExtractedEntity], profiles: List[PublicProfile]) -> List[TimelineEvent]:
        events: List[TimelineEvent] = []

        # Standard baseline chronological events synthesized from entity metadata
        for ent in entities:
            if ent.entity_type == EntityType.PERSON:
                continue

            year_str = ent.period_start or ent.period_end or "2023"
            try:
                year_val = int(year_str.split("-")[0].strip())
            except Exception:
                year_val = 2023

            category_map = {
                EntityType.ORGANIZATION: "Career",
                EntityType.ROLE: "Career",
                EntityType.PROJECT: "Project",
                EntityType.EVENT: "Event / Talk",
                EntityType.PUBLICATION: "Publication",
                EntityType.PATENT: "Patent",
                EntityType.PRODUCT: "Product"
            }
            cat = category_map.get(ent.entity_type, "Milestone")

            events.append(TimelineEvent(
                id=f"tl-{uuid.uuid4().hex[:6]}",
                year=year_val,
                date_display=f"{year_str}" if not ent.period_end or ent.period_end == "Present" else f"{year_str} – {ent.period_end}",
                title=ent.name,
                subtitle=f"{ent.role} ({ent.organization})" if ent.role and ent.organization else (ent.role or ent.organization or ent.entity_type.value),
                category=cat,
                organization=ent.organization,
                description=ent.description or f"Documented milestone in {ent.source_platform}.",
                source_platform=ent.source_platform,
                source_url=ent.url,
                confidence=ent.confidence,
                verification_status=ent.verification_status
            ))

        # Sort timeline chronologically descending (newest first)
        events.sort(key=lambda x: (x.year, x.title), reverse=True)
        return events
