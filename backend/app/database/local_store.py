import json
import os
from typing import Dict, Any, Optional, List
from datetime import datetime
from backend.app.models.schemas import IntelligenceReport

class LocalStore:
    """In-memory and file-persisted storage engine for DigitalTrace AI"""
    def __init__(self, data_file: str = "local_storage.json"):
        self.data_file = os.path.join(os.path.dirname(__file__), data_file)
        self.reports: Dict[str, IntelligenceReport] = {}
        self.targets: Dict[str, Dict[str, Any]] = {}
        self._load()

    def _load(self):
        if os.path.exists(self.data_file):
            try:
                with open(self.data_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self.targets = data.get("targets", {})
                    reports_raw = data.get("reports", {})
                    for tid, r_dict in reports_raw.items():
                        self.reports[tid] = IntelligenceReport(**r_dict)
            except Exception as e:
                print(f"[LocalStore] Warning loading data file: {e}")

    def _save(self):
        try:
            data = {
                "targets": self.targets,
                "reports": {tid: report.model_dump() for tid, report in self.reports.items()}
            }
            with open(self.data_file, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            print(f"[LocalStore] Warning saving data file: {e}")

    def save_report(self, target_id: str, report: IntelligenceReport):
        self.reports[target_id] = report
        self._save()

    def get_report(self, target_id: str) -> Optional[IntelligenceReport]:
        return self.reports.get(target_id)

    def list_reports(self) -> List[Dict[str, Any]]:
        results = []
        for tid, rep in self.reports.items():
            results.append({
                "target_id": tid,
                "name": rep.primary_candidate.display_name,
                "organization": rep.primary_candidate.primary_organization,
                "confidence": rep.correlation_metrics.overall_confidence_score,
                "status": rep.correlation_metrics.status,
                "created_at": rep.created_at,
                "avatar_url": rep.primary_candidate.avatar_url
            })
        return results

    def delete_report(self, target_id: str) -> bool:
        if target_id in self.reports:
            del self.reports[target_id]
            if target_id in self.targets:
                del self.targets[target_id]
            self._save()
            return True
        return False

db = LocalStore()
