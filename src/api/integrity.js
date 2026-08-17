/**
 * Integrity Engine API client (Data Provenance).
 *
 * stamp()  -> generate a SHA-256 snapshot of the document text + dataset.
 * verify() -> recompute the hash of the current data and compare to a stamp.
 *
 * Both fail silently (return a neutral result) if the backend is offline so
 * the editor never breaks.
 */

const API_BASE = '/api';

export async function stampDocument(documentText, rawDataset) {
    try {
        const response = await fetch(`${API_BASE}/integrity/stamp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ document_text: documentText, raw_dataset: rawDataset }),
        });
        if (!response.ok) return { stamp: null, status: 'error' };
        return await response.json();
    } catch {
        return { stamp: null, status: 'error' };
    }
}

export async function verifyDocument(documentText, rawDataset, stamp) {
    try {
        const response = await fetch(`${API_BASE}/integrity/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ document_text: documentText, raw_dataset: rawDataset, stamp }),
        });
        if (!response.ok) return { valid: false, status: 'error', message: 'Verification service unavailable.' };
        return await response.json();
    } catch {
        return { valid: false, status: 'error', message: 'Verification service unavailable.' };
    }
}
