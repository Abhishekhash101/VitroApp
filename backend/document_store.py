"""
Document Store
==============
Simple JSON-file persistence for the current document content, used by the
auto-save trigger (PUT /api/documents/{id}).
"""

import json
import os
import threading
import time
from typing import Any, Dict, List, Optional

_STORE_PATH = os.path.join(os.path.dirname(__file__), "document_store.json")
_LOCK = threading.Lock()


def _load() -> Dict[str, Any]:
    if not os.path.exists(_STORE_PATH):
        return {"documents": {}}
    try:
        with open(_STORE_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError):
        return {"documents": {}}


def _save(store: Dict[str, Any]) -> None:
    with open(_STORE_PATH, "w", encoding="utf-8") as f:
        json.dump(store, f, ensure_ascii=False, indent=2)


def save_document(document_id: str, content: Any) -> Dict[str, Any]:
    with _LOCK:
        store = _load()
        store["documents"][document_id] = {
            "content": content,
            "updated_at": time.strftime("%Y-%m-%dT%H:%M:%S"),
        }
        _save(store)
        return store["documents"][document_id]


def get_document(document_id: str) -> Optional[Dict[str, Any]]:
    with _LOCK:
        store = _load()
        return store["documents"].get(document_id)


def get_document_ids() -> List[str]:
    """Return all stored document IDs."""
    with _LOCK:
        store = _load()
        return list(store["documents"].keys())


def delete_document(document_id: str) -> bool:
    """Remove a single document from the store."""
    with _LOCK:
        store = _load()
        if document_id not in store["documents"]:
            return False
        del store["documents"][document_id]
        _save(store)
        return True


def delete_documents_by_project(project_id: str) -> int:
    """Remove all documents whose ID belongs to the given project (id:<file>)."""
    with _LOCK:
        store = _load()
        prefix = f"{project_id}:"
        keys = [k for k in store["documents"] if k.startswith(prefix)]
        for k in keys:
            del store["documents"][k]
        if keys:
            _save(store)
        return len(keys)

