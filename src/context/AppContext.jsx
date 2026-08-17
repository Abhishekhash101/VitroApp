import React, { createContext, useContext, useEffect, useState } from 'react';

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

    useEffect(() => {
        if (user) {
            localStorage.setItem(USER_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(USER_KEY);
        }
    }, [user]);

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
        localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    }, [projects]);

    const createNewProject = (customTitle) => {
        const titleToUse = customTitle && customTitle.trim() !== "" ? customTitle : "Untitled Analysis";
        const newProject = {
            id: Date.now().toString(),
            name: titleToUse,
            owner: user?.name || "CurrentUser",
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
        return newProject.id;
    };

    const deleteProject = (projectId) => {
        setProjects(prev => prev.filter(p => p.id !== projectId));
    };

    const addFileToProject = (projectId, fileObject) => {
        setProjects(prev => prev.map(p => {
            if (p.id === projectId) {
                return { ...p, files: [...p.files, fileObject] };
            }
            return p;
        }));
    };

    const updateFileInProject = (projectId, fileId, updates) => {
        setProjects(prev => prev.map(p => {
            if (p.id === projectId) {
                return {
                    ...p,
                    files: p.files.map(f => f.id === fileId ? { ...f, ...updates } : f)
                };
            }
            return p;
        }));
    };

    const updateProjectTitle = (projectId, newTitle) => {
        setProjects(prev => prev.map(p => {
            if (p.id === projectId) {
                return { ...p, name: newTitle };
            }
            return p;
        }));
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
        setProjects(prev => prev.map(p => {
            if (p.id === projectId) {
                return { ...p, stamp, lastModified: Date.now() };
            }
            return p;
        }));
    };

    const setFileStamp = (projectId, fileId, stamp) => {
        setProjects(prev => prev.map(p => {
            if (p.id === projectId) {
                return {
                    ...p,
                    files: p.files.map(f => f.id === fileId ? { ...f, stamp } : f)
                };
            }
            return p;
        }));
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
