from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.api.routes_ingest import router as ingest_router
from backend.app.api.routes_discovery import router as discovery_router
from backend.app.api.routes_pipeline import router as pipeline_router
from backend.app.api.routes_reports import router as reports_router
from backend.app.api.routes_supabase import router as supabase_router
from backend.app.api.routes_showcase import router as showcase_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="AI-Powered Public Profile & Digital Footprint Intelligence API (Discover. Correlate. Verify.)",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routers under /api
app.include_router(ingest_router, prefix=settings.API_V1_STR)
app.include_router(discovery_router, prefix=settings.API_V1_STR)
app.include_router(pipeline_router, prefix=settings.API_V1_STR)
app.include_router(reports_router, prefix=settings.API_V1_STR)
app.include_router(supabase_router, prefix=settings.API_V1_STR)
app.include_router(showcase_router, prefix=settings.API_V1_STR)

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.PROJECT_VERSION,
        "features": [
            "Candidate Generation",
            "Public Profile Discovery",
            "AI Information Extraction (Groq/Heuristics)",
            "Entity Resolution & Correlator",
            "Evidence & Confidence Matrix",
            "Interactive Relationship Graph",
            "Chronological Activity Timeline",
            "Supabase PostgreSQL Sync"
        ]
    }

@app.get("/")
async def root():
    return {
        "message": "Welcome to DigitalTrace AI Backend API",
        "tagline": "Discover. Correlate. Verify.",
        "docs": "/docs"
    }
