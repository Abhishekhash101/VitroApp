/**
 * Project metadata API client.
 *
 * The project list is now the source of truth on the backend so it survives
 * browser restarts, incognito windows, and cleared localStorage. All calls fail
 * silently when the backend is offline so the UI keeps working.
 */

const API_BASE = '/api';

export async function createProject(project) {
    try {
        const response = await fetch(`${API_BASE}/projects`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(project),
        });
        if (!response.ok) return null;
        return await response.json();
    } catch {
        return null;
    }
}

export async function fetchProjects(userEmail) {
    try {
        const url = userEmail
            ? `${API_BASE}/projects?user_email=${encodeURIComponent(userEmail)}`
            : `${API_BASE}/projects`;
        const response = await fetch(url);
        if (!response.ok) return null;
        const data = await response.json();
        return data.projects || [];
    } catch {
        return null;
    }
}

export async function updateProject(projectId, updates) {
    try {
        const response = await fetch(`${API_BASE}/projects/${encodeURIComponent(projectId)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        });
        if (!response.ok) return null;
        return await response.json();
    } catch {
        return null;
    }
}

export async function deleteProject(projectId) {
    try {
        const response = await fetch(`${API_BASE}/projects/${encodeURIComponent(projectId)}`, {
            method: 'DELETE',
        });
        return response.ok;
    } catch {
        return false;
    }
}
