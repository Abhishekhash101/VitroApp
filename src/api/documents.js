/**
 * Document auto-save API client.
 *
 * saveDocument() -> PUT the current editor JSON to the backend.
 * Fails silently if the backend is offline.
 */

const API_BASE = '/api';

export async function saveDocument(documentId, content) {
    try {
        const response = await fetch(`${API_BASE}/documents/${encodeURIComponent(documentId)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content }),
        });
        if (!response.ok) return null;
        return await response.json();
    } catch {
        return null;
    }
}
