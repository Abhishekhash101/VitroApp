"""
Version Control Engine (Full Snapshot Strategy)
================================================
Stores full document snapshots (the entire editor JSON) keyed by document id.

Snapshots are saved on explicit triggers (user clicks "Save Version", idle
timeout, or tab close) — NOT on every keystroke. Because each snapshot stores
the WHOLE document JSON, restoring a version brings back the text, the data
tables, the graphs, and the math variables together, preserving scientific
consistency.

Storage is a simple JSON file on disk (MVP). Swap in a real database later by
replacing the load/save helpers.
"""

import json
import os
import threading
import time
from typing import Any, Dict, List, Optional

_STORE_PATH = os.path.join(os.path.dirname(__file__), "version_store.json")
_LOCK = threading.Lock()


def _load_store() -> Dict[str, Any]:
    if not os.path.exists(_STORE_PATH):
        return {"documents": {}}
    try:
        with open(_STORE_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError):
        return {"documents": {}}


def _save_store(store: Dict[str, Any]) -> None:
    with open(_STORE_PATH, "w", encoding="utf-8") as f:
        json.dump(store, f, ensure_ascii=False, indent=2)


def save_snapshot(
    document_id: str,
    snapshot_content: Any,
    label: Optional[str] = None,
    author: Optional[str] = None,
) -> Dict[str, Any]:
    """Persist a full snapshot for a document and return the created version."""
    with _LOCK:
        store = _load_store()
        doc_versions = store["documents"].setdefault(document_id, [])
        version = {
            "id": f"v{int(time.time() * 1000)}",
            "document_id": document_id,
            "snapshot_content": snapshot_content,
            "label": label or f"Version {len(doc_versions) + 1}",
            "author": author or "Unknown",
            "created_at": time.strftime("%Y-%m-%dT%H:%M:%S"),
        }
        doc_versions.append(version)
        _save_store(store)
        return version


def list_versions(document_id: str) -> List[Dict[str, Any]]:
    """Return all versions for a document (metadata only, newest first)."""
    with _LOCK:
        store = _load_store()
        versions = store["documents"].get(document_id, [])
        # Return metadata without the heavy snapshot content.
        meta = [
            {
                "id": v["id"],
                "document_id": v["document_id"],
                "label": v["label"],
                "author": v["author"],
                "created_at": v["created_at"],
            }
            for v in versions
        ]
        return list(reversed(meta))


def get_snapshot(document_id: str, version_id: str) -> Optional[Dict[str, Any]]:
    """Fetch the full snapshot content for a specific version."""
    with _LOCK:
        store = _load_store()
        versions = store["documents"].get(document_id, [])
        for v in versions:
            if v["id"] == version_id:
                return v
        return None


def delete_version(document_id: str, version_id: str) -> bool:
    """Remove a specific version. Returns True if it was deleted."""
    with _LOCK:
        store = _load_store()
        versions = store["documents"].get(document_id, [])
        new_versions = [v for v in versions if v["id"] != version_id]
        if len(new_versions) == len(versions):
            return False
        store["documents"][document_id] = new_versions
        _save_store(store)
        return True


def delete_versions_by_project(project_id: str) -> int:
    """Remove all version snapshots whose document ID belongs to the project."""
    with _LOCK:
        store = _load_store()
        prefix = f"{project_id}:"
        keys = [k for k in store["documents"] if k.startswith(prefix)]
        for k in keys:
            del store["documents"][k]
        if keys:
            _save_store(store)
        return len(keys)
