"""
Semantic Validator API
======================
FastAPI backend that exposes the real-time semantic verification endpoint.

Run locally:
    cd backend
    pip install -r requirements.txt
    uvicorn main:app --reload --port 8000

The Vite dev server proxies `/api` to this backend (see vite.config.js).
"""

from typing import Any, Dict, List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from semantic_validator import verify_semantics
from integrity_engine import compute_stamp, verify_stamp
from version_control import (
    save_snapshot,
    list_versions,
    get_snapshot,
    delete_version,
)
from document_store import save_document, get_document

app = FastAPI(title="VitroApp Semantic Validator", version="0.1.0")

# Allow the Vite dev server (and any local origin) to call the API directly.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TablePayload(BaseModel):
    tableId: str | None = None
    tableName: str = "Table"
    headers: List[str] = []
    rows: List[Dict[str, Any]] = []


class VerifyRequest(BaseModel):
    text: str = ""
    tables: List[TablePayload] = []


class VerifyResponse(BaseModel):
    hasError: bool
    errorMessage: str | None = None
    match: str | None = None


@app.get("/api/health")
def health() -> Dict[str, str]:
    return {"status": "ok"}


@app.post("/api/semantic/verify", response_model=VerifyResponse)
def verify(payload: VerifyRequest) -> VerifyResponse:
    tables = [t.model_dump() for t in payload.tables]
    result = verify_semantics(payload.text, tables)
    return VerifyResponse(**result)


# ---------------------------------------------------------------------------
# Integrity / Data Provenance
# ---------------------------------------------------------------------------
class StampRequest(BaseModel):
    document_text: str = ""
    raw_dataset: Any = None


class StampResponse(BaseModel):
    stamp: str
    status: str


class VerifyStampRequest(BaseModel):
    document_text: str = ""
    raw_dataset: Any = None
    stamp: str = ""


class VerifyStampResponse(BaseModel):
    valid: bool
    status: str
    message: str


@app.post("/api/integrity/stamp", response_model=StampResponse)
def stamp(payload: StampRequest) -> StampResponse:
    digest = compute_stamp(payload.document_text, payload.raw_dataset)
    return StampResponse(stamp=digest, status="verified")


@app.post("/api/integrity/verify", response_model=VerifyStampResponse)
def verify_integrity(payload: VerifyStampRequest) -> VerifyStampResponse:
    result = verify_stamp(payload.document_text, payload.raw_dataset, payload.stamp)
    return VerifyStampResponse(**result)


# ---------------------------------------------------------------------------
# Version Control (Full Snapshot Strategy)
# ---------------------------------------------------------------------------
class SaveVersionRequest(BaseModel):
    document_id: str
    snapshot_content: Any
    label: str | None = None
    author: str | None = None


class VersionMeta(BaseModel):
    id: str
    document_id: str
    label: str
    author: str
    created_at: str


class SaveVersionResponse(BaseModel):
    version: VersionMeta


class ListVersionsResponse(BaseModel):
    versions: List[VersionMeta]


class GetSnapshotResponse(BaseModel):
    id: str
    document_id: str
    label: str
    author: str
    created_at: str
    snapshot_content: Any


@app.post("/api/versions", response_model=SaveVersionResponse)
def create_version(payload: SaveVersionRequest) -> SaveVersionResponse:
    version = save_snapshot(
        payload.document_id,
        payload.snapshot_content,
        label=payload.label,
        author=payload.author,
    )
    return SaveVersionResponse(version=VersionMeta(**{
        k: version[k] for k in ("id", "document_id", "label", "author", "created_at")
    }))


@app.get("/api/versions/{document_id}", response_model=ListVersionsResponse)
def get_versions(document_id: str) -> ListVersionsResponse:
    versions = list_versions(document_id)
    return ListVersionsResponse(versions=[VersionMeta(**v) for v in versions])


@app.get("/api/versions/{document_id}/{version_id}", response_model=GetSnapshotResponse)
def get_version_snapshot(document_id: str, version_id: str) -> GetSnapshotResponse:
    version = get_snapshot(document_id, version_id)
    if version is None:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Version not found")
    return GetSnapshotResponse(**version)


@app.delete("/api/versions/{document_id}/{version_id}")
def remove_version(document_id: str, version_id: str) -> Dict[str, Any]:
    deleted = delete_version(document_id, version_id)
    if not deleted:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Version not found")
    return {"deleted": True}


# ---------------------------------------------------------------------------
# Document Auto-Save
# ---------------------------------------------------------------------------
class SaveDocumentRequest(BaseModel):
    content: Any


class SaveDocumentResponse(BaseModel):
    document_id: str
    updated_at: str


@app.put("/api/documents/{document_id}", response_model=SaveDocumentResponse)
def put_document(document_id: str, payload: SaveDocumentRequest) -> SaveDocumentResponse:
    saved = save_document(document_id, payload.content)
    return SaveDocumentResponse(document_id=document_id, updated_at=saved["updated_at"])


@app.get("/api/documents/{document_id}")
def get_document_endpoint(document_id: str) -> Dict[str, Any]:
    doc = get_document(document_id)
    if doc is None:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Document not found")
    return {"document_id": document_id, **doc}
