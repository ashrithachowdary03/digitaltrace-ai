from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from backend.app.models.schemas import IntelligenceReport
from backend.app.database.local_store import db

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("", response_model=List[Dict[str, Any]])
async def list_reports():
    return db.list_reports()

@router.get("/{target_id}", response_model=IntelligenceReport)
async def get_report(target_id: str):
    report = db.get_report(target_id)
    if not report:
        raise HTTPException(status_code=404, detail="Intelligence report not found.")
    return report

@router.delete("/{target_id}")
async def delete_report(target_id: str):
    success = db.delete_report(target_id)
    if not success:
        raise HTTPException(status_code=404, detail="Intelligence report not found.")
    return {"status": "deleted", "target_id": target_id}
