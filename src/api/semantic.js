/**
 * Semantic Validator API client.
 *
 * Sends the current paragraph text plus the live data tables to the FastAPI
 * backend and returns the reviewer's verdict. Fails silently (returns a
 * no-error result) if the backend is not running, so the editor never breaks.
 */

const API_BASE = '/api';

export async function verifySemantics(text, tables) {
    try {
        const response = await fetch(`${API_BASE}/semantic/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, tables }),
        });

        if (!response.ok) {
            return { hasError: false };
        }

        return await response.json();
    } catch {
        // Backend offline — treat as "no error" rather than crashing the editor.
        return { hasError: false };
    }
}
