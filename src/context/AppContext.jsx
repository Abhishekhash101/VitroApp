import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
    createProject as createProjectBackend,
    fetchProjects as fetchProjectsBackend,
    updateProject as updateProjectBackend,
    deleteProject as deleteProjectBackend,
} from '../api/projects';

const AppContext = createContext();

const USER_KEY = 'vitro_user';
const PROJECTS_KEY = 'vitro_projects';

function loadJSON(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
        return JSON.parse(raw);
    } catch {
        return fallback;
    }
}

export function AppContextProvider({ children }) {
    // 1. Local Authentication State (persisted to localStorage)
    const [user, setUser] = useState(() => loadJSON(USER_KEY, null));
    const hasMigratedProjectsRef = useRef(false);

    const login = (userData) => {
        setUser(userData);
    };

    const signup = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    // 2. Dynamic Projects State (persisted to localStorage)
    const [projects, setProjects] = useState(() => loadJSON(PROJECTS_KEY, []));

    useEffect(() => {
        try {
            localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
        } catch (err) {
            // Documents with embedded images can exceed the localStorage quota.
            // The backend document store remains the source of truth.
            console.warn('Could not cache projects locally', err);
        }
    }, [projects]);

    // Load the project list from the backend whenever a user signs in.
    // If the backend has no projects but localStorage still holds old projects,
    // migrate them to the server so they survive future re-logins.
    useEffect(() => {
        if (user) {
            localStorage.setItem(USER_KEY, JSON.stringify(user));
            fetchProjectsBackend(user.email).then((serverProjects) => {
                if (serverProjects === null) return; // backend offline; keep localStorage
                if (serverProjects.length > 0) {
                    setProjects(serverProjects);
                } else {
                    const localProjects = loadJSON(PROJECTS_KEY, []);
                    if (localProjects.length > 0 && !hasMigratedProjectsRef.current) {
                        hasMigratedProjectsRef.current = true;
                        localProjects.forEach((p) => {
                            createProjectBackend({ ...p, user_email: user.email });
                        });
                        setProjects(localProjects);
                    }
                }
            });
        } else {
            localStorage.removeItem(USER_KEY);
            hasMigratedProjectsRef.current = false;
        }
    }, [user]);

    const createNewProject = (customTitle) => {
        const titleToUse = customTitle && customTitle.trim() !== "" ? customTitle : "Untitled Analysis";
        const newProject = {
            id: Date.now().toString(),
            name: titleToUse,
            owner: user?.name || "CurrentUser",
            user_email: user?.email || null,
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            size: '0 KB',
            type: 'folder',
            status: 'green',
            selected: false,
            content: "",
            lastModified: Date.now(),
            files: [],
            collaborators: []
        };
        setProjects(prev => [...prev, newProject]);
        createProjectBackend(newProject);
        return newProject.id;
    };

    const deleteProject = (projectId) => {
        setProjects(prev => prev.filter(p => p.id !== projectId));
        deleteProjectBackend(projectId);
    };

    const sanitizeFilesForBackend = (files) => {
        if (!files) return [];
        return files.map(f => {
            // The backend stores only metadata. File/blob objects and cached
            // editor content are excluded because they are not serializable or
            // are persisted separately in the document store.
            return Object.fromEntries(
                Object.entries(f).filter(([key]) => key !== 'file' && key !== 'content')
            );
        });
    };

    const addFileToProject = (projectId, fileObject) => {
        let updatedFiles;
        setProjects(prev => prev.map(p => {
            if (p.id === projectId) {
                updatedFiles = [...p.files, fileObject];
                return { ...p, files: updatedFiles };
            }
            return p;
        }));
        if (updatedFiles) {
            updateProjectBackend(projectId, { files: sanitizeFilesForBackend(updatedFiles) });
        }
    };

    const updateFileInProject = (projectId, fileId, updates) => {
        let updatedFiles;
        setProjects(prev => prev.map(p => {
            if (p.id === projectId) {
                updatedFiles = p.files.map(f => f.id === fileId ? { ...f, ...updates } : f);
                return { ...p, files: updatedFiles };
            }
            return p;
        }));
        if (updatedFiles) {
            updateProjectBackend(projectId, { files: sanitizeFilesForBackend(updatedFiles) });
        }
    };

    const updateProjectTitle = (projectId, newTitle) => {
        setProjects(prev => prev.map(p => {
            if (p.id === projectId) {
                return { ...p, name: newTitle };
            }
            return p;
        }));
        updateProjectBackend(projectId, { name: newTitle });
    };

    const updateProjectContent = (projectId, newContent) => {
        setProjects(prev => prev.map(p => {
            if (p.id === projectId) {
                return { ...p, content: newContent, lastModified: Date.now() };
            }
            return p;
        }));
    };

    // Integrity stamp storage (Data Provenance)
    const setProjectStamp = (projectId, stamp) => {
        const now = Date.now();
        setProjects(prev => prev.map(p => {
            if (p.id === projectId) {
                return { ...p, stamp, lastModified: now };
            }
            return p;
        }));
        updateProjectBackend(projectId, { stamp, lastModified: now });
    };

    const setFileStamp = (projectId, fileId, stamp) => {
        let updatedFiles;
        const now = Date.now();
        setProjects(prev => prev.map(p => {
            if (p.id === projectId) {
                updatedFiles = p.files.map(f => f.id === fileId ? { ...f, stamp } : f);
                return { ...p, files: updatedFiles, lastModified: now };
            }
            return p;
        }));
        if (updatedFiles) {
            updateProjectBackend(projectId, { files: sanitizeFilesForBackend(updatedFiles), lastModified: now });
        }
    };

    // 4. Modal and Panel States
    const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [activeRightPanel, setActiveRightPanel] = useState('properties'); // 'properties', 'settings', 'comments'

    // Chart Data State
    const [chartData, setChartData] = useState([]);

    // 3. Graph Logic Settings
    const [isBidirectionalEnabled, setIsBidirectionalEnabled] = useState(true);

    const value = {
        user,
        login,
        signup,
        logout,
        projects,
        createNewProject,
        deleteProject,
        addFileToProject,
        isNewProjectModalOpen,
        setIsNewProjectModalOpen,
        isExportModalOpen, setIsExportModalOpen,
        isBidirectionalEnabled, setIsBidirectionalEnabled,
        activeRightPanel, setActiveRightPanel,
        updateProjectTitle,
        updateProjectContent,
        updateFileInProject,
        setProjectStamp,
        setFileStamp,
        chartData,
        setChartData
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}
