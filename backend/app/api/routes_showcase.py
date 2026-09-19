from fastapi import APIRouter
from typing import List, Dict, Any

router = APIRouter(prefix="/showcase", tags=["Showcase Profiles"])

SHOWCASE_PROFILES = [
    {
        "id": "alex-vance",
        "name": "Dr. Alex Vance",
        "username": "alexvance_ai",
        "organization": "NeuroMesh Labs",
        "location": "San Francisco, CA / Geneva",
        "image_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
        "keywords": ["Generative AI", "Zero-Trust", "LLM Security", "Graph Neural Networks"],
        "notes": "Consented profile for AI research and public speaking footprint verification.",
        "tagline": "AI Research Lead & Open-Source Security Architect"
    },
    {
        "id": "elena-rostova",
        "name": "Elena Rostova",
        "username": "erostova_sec",
        "organization": "Aegis Cyber Defense",
        "location": "Boston, MA / London",
        "image_url": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80",
        "keywords": ["Cloud Security", "Kubernetes", "OSINT", "Threat Correlation"],
        "notes": "Consented profile for DEF CON workshop and cloud security audit footprint.",
        "tagline": "Principal Cloud Security Architect & DEF CON Speaker"
    },
    {
        "id": "siddharth-rao",
        "name": "Siddharth Rao",
        "username": "siddrao_dev",
        "organization": "Vortex Systems",
        "location": "Bengaluru / Singapore",
        "image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
        "keywords": ["Full-Stack", "Distributed Systems", "Hackathon Winner", "Rust"],
        "notes": "Consented profile for global hackathon judging & developer footprint analysis.",
        "tagline": "Global Hackathon Winner & Distributed Systems Engineer"
    },
    {
        "id": "aria-tanaka",
        "name": "Aria Tanaka",
        "username": "atanaka_crypto",
        "organization": "Privacy Mesh Foundation",
        "location": "Tokyo / Zurich",
        "image_url": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80",
        "keywords": ["Applied Cryptography", "Zero Knowledge", "Entity Resolution", "Patents"],
        "notes": "Consented research profile with US patents and academic citations.",
        "tagline": "Applied Cryptographer & Multi-Patent Inventor"
    }
]

@router.get("", response_model=List[Dict[str, Any]])
async def get_showcase_profiles():
    return SHOWCASE_PROFILES
