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

    const createNewProject = (title) => {
        const newProject = {
            id: Date.now().toString(),
            name: title,
            owner: user?.name || "CurrentUser",
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            size: '0 KB',
            type: 'folder',
            status: 'green',
            selected: false,
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

    // 4. Modal and Panel States
    const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [activeRightPanel, setActiveRightPanel] = useState('properties'); // 'properties', 'settings', 'comments'

    // 3. Graph Logic Settings
    const [isBidirectionalEnabled, setIsBidirectionalEnabled] = useState(true);

    return (
        <AppContext.Provider value={{
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
            isExportModalOpen,
            setIsExportModalOpen,
            activeRightPanel,
            setActiveRightPanel,
            isBidirectionalEnabled,
            setIsBidirectionalEnabled
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}
