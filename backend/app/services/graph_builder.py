import math
from typing import List, Dict, Any
from backend.app.models.schemas import (
    GraphData, GraphNode, GraphEdge, ExtractedEntity, 
    PublicProfile, IdentityCandidate, ConsentedTargetInput, EntityType
)

class GraphBuilder:
    """Builds interactive React Flow topological graph data representing interconnected digital footprints."""

    @classmethod
    def build_graph(
        cls, 
        target: ConsentedTargetInput, 
        candidate: IdentityCandidate,
        profiles: List[PublicProfile],
        entities: List[ExtractedEntity]
    ) -> GraphData:
        nodes: List[GraphNode] = []
        edges: List[GraphEdge] = []
        name = target.name or candidate.display_name

        # Center Node: Target Person
        person_id = "node-root-person"
        nodes.append(GraphNode(
            id=person_id,
            label=name,
            type="person",
            sublabel=candidate.primary_organization or "Verified Identity",
            avatar=candidate.avatar_url,
            confidence=candidate.likelihood_score,
            verification_status="VERIFIED",
            platform="Core Entity",
            properties={
                "aliases": candidate.potential_aliases,
                "handles": candidate.handle_variations,
                "organization": candidate.primary_organization
            },
            position={"x": 450, "y": 300}
        ))

        # Profile Nodes (Orbit 1: Radius ~240px)
        num_profiles = len(profiles)
        for idx, prof in enumerate(profiles):
            angle = (2 * math.pi / max(1, num_profiles)) * idx
            prof_node_id = f"node-prof-{prof.platform.lower().replace(' ', '-').replace('(', '').replace(')', '')}"
            x_pos = 450 + 260 * math.cos(angle)
            y_pos = 300 + 260 * math.sin(angle)

            nodes.append(GraphNode(
                id=prof_node_id,
                label=prof.platform,
                type="profile",
                sublabel=prof.handle,
                avatar=prof.avatar_url,
                confidence=prof.confidence_score,
                verification_status="VERIFIED" if prof.confidence_score > 0.85 else "HIGH_CONFIDENCE",
                platform=prof.platform,
                properties={
                    "url": prof.url,
                    "followers": prof.followers_count,
                    "match_reasons": prof.match_reasons
                },
                position={"x": round(x_pos, 1), "y": round(y_pos, 1)}
            ))

            # Edge from Person to Profile
            edges.append(GraphEdge(
                id=f"edge-person-{prof_node_id}",
                source=person_id,
                target=prof_node_id,
                label="OPERATES_PROFILE",
                confidence=prof.confidence_score,
                verified=True,
                evidence=f"Direct profile URL: {prof.url}"
            ))

        # Extracted Entity Nodes (Orbit 2: Outer Clusters)
        for idx, ent in enumerate(entities):
            if ent.entity_type == EntityType.PERSON:
                continue
                
            node_type = ent.entity_type.value.lower()
            ent_node_id = f"node-ent-{ent.id}"
            
            # Position calculation offset based on entity type
            angle = (2 * math.pi / max(1, len(entities))) * idx + 0.3
            dist = 440
            x_pos = 450 + dist * math.cos(angle)
            y_pos = 300 + dist * math.sin(angle)

            nodes.append(GraphNode(
                id=ent_node_id,
                label=ent.name[:32] + ("..." if len(ent.name) > 32 else ""),
                type=node_type,
                sublabel=ent.role or ent.organization or ent.entity_type.value,
                avatar=None,
                confidence=ent.confidence,
                verification_status=ent.verification_status.value,
                platform=ent.source_platform,
                properties={
                    "full_name": ent.name,
                    "role": ent.role,
                    "organization": ent.organization,
                    "period": f"{ent.period_start or ''} - {ent.period_end or ''}",
                    "description": ent.description,
                    "url": ent.url,
                    "evidence": ent.supporting_evidence
                },
                position={"x": round(x_pos, 1), "y": round(y_pos, 1)}
            ))

            # Relationship Label derivation
            if ent.entity_type == EntityType.ORGANIZATION:
                rel_label = "EMPLOYED_AT" if "Employ" in (ent.role or "") else "AFFILIATED_WITH"
            elif ent.entity_type == EntityType.PROJECT:
                rel_label = "CONTRIBUTED_TO"
            elif ent.entity_type == EntityType.EVENT:
                rel_label = "SPOKE_AT" if "Speak" in (ent.role or "") else "PARTICIPATED_IN"
            elif ent.entity_type == EntityType.PUBLICATION:
                rel_label = "AUTHORED"
            elif ent.entity_type == EntityType.PATENT:
                rel_label = "CO_INVENTED"
            elif ent.entity_type == EntityType.PRODUCT:
                rel_label = "ARCHITECTED"
            else:
                rel_label = "ASSOCIATED_WITH"

            edges.append(GraphEdge(
                id=f"edge-person-{ent_node_id}",
                source=person_id,
                target=ent_node_id,
                label=rel_label,
                confidence=ent.confidence,
                verified=ent.verification_status.value in ["VERIFIED", "HIGH_CONFIDENCE"],
                evidence=ent.supporting_evidence
            ))

            # Cross-connect entity to relevant platform node if matched
            matched_prof = next((p for p in profiles if p.platform.lower() in ent.source_platform.lower()), None)
            if matched_prof:
                prof_node_id = f"node-prof-{matched_prof.platform.lower().replace(' ', '-').replace('(', '').replace(')', '')}"
                edges.append(GraphEdge(
                    id=f"edge-{prof_node_id}-{ent_node_id}",
                    source=prof_node_id,
                    target=ent_node_id,
                    label="DOCUMENTED_IN",
                    confidence=ent.confidence,
                    verified=True,
                    evidence=f"Directly listed on {matched_prof.platform}"
                ))

        return GraphData(nodes=nodes, edges=edges)
