import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppContextProvider({ children }) {
    // 1. Mock Authentication State
    const [user, setUser] = useState(null);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    // 2. Dynamic Projects State (Starts Empty as per Phase 3)
    const [projects, setProjects] = useState([]);

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

    const updateProjectTitle = (projectId, newTitle) => {
        console.log("updateProjectTitle called with:", projectId, newTitle);
        setProjects(prev => {
            const next = prev.map(p => {
                if (p.id === projectId) {
                    return { ...p, name: newTitle };
                }
                return p;
            });
            console.log("updateProjectTitle next state:", next);
            return next;
        });
    };

    const updateProjectContent = (projectId, newContent) => {
        setProjects(prev => prev.map(p => {
            if (p.id === projectId) {
                return { ...p, content: newContent, lastModified: Date.now() };
            }
            return p;
        }));
    };

    // 4. Modal and Panel States
    const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [activeRightPanel, setActiveRightPanel] = useState('properties'); // 'properties', 'settings', 'comments'

    // Chart Data State
    const [chartData, setChartData] = useState([]);

    // 3. Graph Logic Settings
    const [isBidirectionalEnabled, setIsBidirectionalEnabled] = useState(true);

    const value = {
        user,
        login,
        logout,
        projects,
        createNewProject,
        deleteProject,
        addFileToProject,
        isNewProjectModalOpen,
        setIsNewProjectModalOpen,
        isShareModalOpen,
        setIsShareModalOpen,
        isExportModalOpen, setIsExportModalOpen,
        isBidirectionalEnabled, setIsBidirectionalEnabled,
        activeRightPanel, setActiveRightPanel,
        updateProjectTitle,
        updateProjectContent,
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
