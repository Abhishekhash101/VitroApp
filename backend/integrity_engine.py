"""
Integrity Engine (Data Provenance)
==================================
Deterministic SHA-256 hashing of a document's text + raw dataset.

The document text and the underlying dataset are combined into a single
canonical payload and hashed together. Because the JSON keys are sorted and
separators are fixed, the exact same data ALWAYS produces the exact same hash,
while any change to a single data point produces a completely different hash.

This powers the "anti-fraud" provenance check:
  * stamp()  -> generate the hash at publication time
  * verify() -> recompute the hash of the current data and compare to the stamp
"""

import hashlib
import json
from typing import Any, Dict


def canonical_json(obj: Any) -> str:
    """Serialize to a deterministic string (sorted keys, fixed separators)."""
    return json.dumps(
        obj,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
    )


def compute_stamp(document_text: str, raw_dataset: Any) -> str:
    """Return the SHA-256 hex digest of the canonical text+data payload."""
    payload = {
        "document_text": document_text,
        "raw_dataset": raw_dataset,
    }
    serialized = canonical_json(payload)
    return hashlib.sha256(serialized.encode("utf-8")).hexdigest()


def verify_stamp(document_text: str, raw_dataset: Any, stamp: str) -> Dict[str, Any]:
    """Compare the recomputed hash against the stored stamp."""
    current = compute_stamp(document_text, raw_dataset)
    if current == stamp:
        return {
            "valid": True,
            "status": "verified",
            "message": "Verified Snapshot: the underlying dataset matches the published stamp.",
        }
    return {
        "valid": False,
        "status": "tampered",
        "message": (
            "DATA PROVENANCE FAILED: Underlying dataset has been modified "
            "since publication."
        ),
    }
