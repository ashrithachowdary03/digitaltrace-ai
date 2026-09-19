from fastapi import APIRouter
from typing import Dict, Any
from backend.app.services.supabase_service import SupabaseService

router = APIRouter(prefix="/supabase", tags=["Supabase Status"])

@router.get("/status")
async def get_supabase_status() -> Dict[str, Any]:
    return await SupabaseService.check_health()
