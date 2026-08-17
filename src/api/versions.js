/**
 * Version Control API client (Full Snapshot Strategy).
 *
 * saveVersion()   -> persist a full snapshot of the document JSON.
 * listVersions()  -> fetch version metadata (newest first).
 * getSnapshot()   -> fetch the full snapshot content of a specific version.
 * deleteVersion() -> remove a version.
 *
 * All calls fail silently (return a neutral result) if the backend is offline.
 */

const API_BASE = '/api';

export async function saveVersion(documentId, snapshotContent, label, author) {
    try {
        const response = await fetch(`${API_BASE}/versions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ document_id: documentId, snapshot_content: snapshotContent, label, author }),
        });
        if (!response.ok) return { version: null };
        return await response.json();
    } catch {
        return { version: null };
    }
}

export async function listVersions(documentId) {
    try {
        const response = await fetch(`${API_BASE}/versions/${encodeURIComponent(documentId)}`);
        if (!response.ok) return { versions: [] };
        return await response.json();
    } catch {
        return { versions: [] };
    }
}

export async function getSnapshot(documentId, versionId) {
    try {
        const response = await fetch(`${API_BASE}/versions/${encodeURIComponent(documentId)}/${encodeURIComponent(versionId)}`);
        if (!response.ok) return null;
        return await response.json();
    } catch {
        return null;
    }
}

export async function deleteVersion(documentId, versionId) {
    try {
        const response = await fetch(`${API_BASE}/versions/${encodeURIComponent(documentId)}/${encodeURIComponent(versionId)}`, {
            method: 'DELETE',
        });
        return response.ok;
    } catch {
        return false;
    }
}
