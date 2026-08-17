"""
Project Metadata Store
======================
Persistent JSON-backed store for project metadata (names, owners, file tree,
collaborators, status). Document/editor content is stored separately in the
document store; this layer only holds the project list so it survives across
browsers, incognito sessions, and localStorage resets.
"""

import json
import os
import threading
import time
from datetime import datetime
from typing import Any, Dict, List, Optional

_STORE_PATH = os.path.join(os.path.dirname(__file__), "projects_store.json")
_LOCK = threading.Lock()


def _load() -> Dict[str, Any]:
    if not os.path.exists(_STORE_PATH):
        return {"projects": {}}
    try:
        with open(_STORE_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError):
        return {"projects": {}}


def _save(store: Dict[str, Any]) -> None:
    with open(_STORE_PATH, "w", encoding="utf-8") as f:
        json.dump(store, f, ensure_ascii=False, indent=2)


def _format_date() -> str:
    """Match the frontend date display format (e.g. 'Aug 17, 2026')."""
    return datetime.now().strftime("%b %-d, %Y")


def create_project(project: Dict[str, Any]) -> Dict[str, Any]:
    """Persist a new project. Returns the stored project."""
    with _LOCK:
        store = _load()
        project_id = project["id"]
        now = time.strftime("%Y-%m-%dT%H:%M:%S")
        defaults = {
            "owner": "Researcher",
            "date": _format_date(),
            "size": "0 KB",
            "status": "green",
            "type": "folder",
            "files": [],
            "collaborators": [],
            "created_at": now,
            "updated_at": now,
        }
        for key, value in defaults.items():
            if not project.get(key):
                project[key] = value
        store["projects"][project_id] = project
        _save(store)
        return project


def get_project(project_id: str) -> Optional[Dict[str, Any]]:
    """Return a single project by ID, or None if it does not exist."""
    with _LOCK:
        store = _load()
        return store["projects"].get(project_id)


def list_projects(user_email: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Return projects for a user. If a user has no projects but orphan documents
    exist in the document store, recreate lightweight project metadata from
    those documents so previously created work is not lost.
    """
    with _LOCK:
        store = _load()
        projects = list(store["projects"].values())
        if user_email:
            projects = [p for p in projects if p.get("user_email") == user_email]

        # Recover orphan documents that lack project metadata (e.g. after
        # localStorage was cleared). This is a best-effort fallback for the
        # local single-user demo; if a user signs in and has no projects, any
        # documents saved on the server are surfaced under their account.
        if user_email and not projects:
            from document_store import get_document_ids

            doc_ids = get_document_ids()
            changed = False
            for doc_id in doc_ids:
                if doc_id.endswith(":main"):
                    project_id = doc_id[:-5]
                    existing = store["projects"].get(project_id)
                    if existing is None:
                        project = {
                            "id": project_id,
                            "name": "Untitled Analysis",
                            "owner": "Researcher",
                            "user_email": user_email,
                            "date": _format_date(),
                            "size": "0 KB",
                            "status": "green",
                            "type": "folder",
                            "files": [],
                            "collaborators": [],
                            "created_at": time.strftime("%Y-%m-%dT%H:%M:%S"),
                            "updated_at": time.strftime("%Y-%m-%dT%H:%M:%S"),
                        }
                        store["projects"][project_id] = project
                        changed = True
                    elif existing.get("user_email") != user_email:
                        existing["user_email"] = user_email
                        existing["updated_at"] = time.strftime("%Y-%m-%dT%H:%M:%S")
                        store["projects"][project_id] = existing
                        changed = True
            if changed:
                _save(store)
                projects = [
                    p for p in store["projects"].values()
                    if p.get("user_email") == user_email
                ]

        return projects


def update_project(project_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Merge updates into an existing project. Returns the updated project."""
    with _LOCK:
        store = _load()
        project = store["projects"].get(project_id)
        if project is None:
            return None
        project.update(updates)
        project["updated_at"] = time.strftime("%Y-%m-%dT%H:%M:%S")
        store["projects"][project_id] = project
        _save(store)
        return project


def delete_project(project_id: str) -> bool:
    """Delete a project and its associated documents/versions."""
    with _LOCK:
        store = _load()
        if project_id not in store["projects"]:
            return False
        del store["projects"][project_id]
        _save(store)

    # Cleanup any backend content tied to the project so it is truly gone.
    try:
        import document_store
        import version_control
        document_store.delete_documents_by_project(project_id)
        version_control.delete_versions_by_project(project_id)
    except Exception:
        pass

    return True
