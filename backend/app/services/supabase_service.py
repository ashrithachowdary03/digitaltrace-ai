import httpx
from typing import Dict, Any, Optional, List
from backend.app.core.config import settings
from backend.app.models.schemas import IntelligenceReport
from backend.app.database.local_store import db

class SupabaseService:
    """Manages cloud Supabase PostgreSQL persistence with automatic local DB synchronization."""

    @classmethod
    def is_configured(cls) -> bool:
        return bool(settings.SUPABASE_URL and (settings.SUPABASE_KEY or settings.SUPABASE_SERVICE_ROLE_KEY))

    @classmethod
    async def check_health(cls) -> Dict[str, Any]:
        if not cls.is_configured():
            return {
                "status": "local_mode",
                "message": "Supabase credentials not configured. Using local JSON/in-memory persistent store.",
                "connected": False
            }
        try:
            headers = {
                "apikey": settings.SUPABASE_KEY or settings.SUPABASE_SERVICE_ROLE_KEY,
                "Authorization": f"Bearer {settings.SUPABASE_KEY or settings.SUPABASE_SERVICE_ROLE_KEY}"
            }
            url = f"{settings.SUPABASE_URL.rstrip('/')}/rest/v1/"
            async with httpx.AsyncClient(timeout=3.0) as client:
                res = await client.get(url, headers=headers)
                if res.status_code in [200, 404]:
                    return {
                        "status": "connected",
                        "message": "Connected to Supabase PostgreSQL cluster successfully.",
                        "connected": True
                    }
        except Exception as e:
            return {
                "status": "connection_error",
                "message": f"Could not reach Supabase endpoint: {str(e)}",
                "connected": False
            }
        return {
            "status": "disconnected",
            "message": "Supabase response unverified.",
            "connected": False
        }

    @classmethod
    async def persist_report(cls, report: IntelligenceReport) -> bool:
        # Always persist to local store first
        db.save_report(report.target_id, report)

        if not cls.is_configured():
            return True

        # Attempt push to Supabase REST endpoint
        try:
            headers = {
                "apikey": settings.SUPABASE_KEY or settings.SUPABASE_SERVICE_ROLE_KEY,
                "Authorization": f"Bearer {settings.SUPABASE_KEY or settings.SUPABASE_SERVICE_ROLE_KEY}",
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
            }
            url = f"{settings.SUPABASE_URL.rstrip('/')}/rest/v1/intelligence_reports"
            payload = {
                "target_id": report.target_id,
                "created_at": report.created_at,
                "executive_summary": report.executive_summary,
                "correlation_metrics": report.correlation_metrics.model_dump(),
                "discrepancies": [d.model_dump() for d in report.discrepancies_and_uncertainties],
                "risk_analysis": report.risk_and_footprint_analysis,
                "full_dossier": report.model_dump()
            }
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.post(url, headers=headers, json=payload)
                if res.status_code in [200, 201, 409]:
                    return True
        except Exception as e:
            print(f"[SupabaseService] Cloud sync notice: {e}")
        return True

    @classmethod
    def get_report(cls, target_id: str) -> Optional[IntelligenceReport]:
        return db.get_report(target_id)
