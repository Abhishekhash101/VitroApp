import React, { useState } from 'react';
import { Folder, Users, Star, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ConfirmationModal from './ConfirmationModal';

export default function Sidebar({ isCollapsed, toggleSidebar, activeProjectId }) {
    const navigate = useNavigate();
    const { deleteProject } = useAppContext();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleDelete = () => {
        if (!activeProjectId) return;
        setIsDeleteModalOpen(true);
    };

    return (
        <div className={`bg-[#8B5F54] text-[#FDF6F0] flex flex-col h-full shrink-0 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-64'}`}>
            <div className={`flex-1 py-8 px-4 relative`}>
                <div className={`flex items-center text-white/60 mb-4 ${isCollapsed ? 'justify-center' : 'justify-between px-3'}`}>
                    <span className={`text-xs font-semibold tracking-wider transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>NAVIGATION</span>
                    {toggleSidebar && (
                        <button onClick={toggleSidebar} className="hover:bg-white/10 p-1 rounded transition-colors">
                            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                        </button>
                    )}
                </div>

                <nav className="space-y-1">
                    <a href="/" className={`flex items-center gap-3 py-2.5 rounded-lg text-white font-medium transition-colors ${isCollapsed ? 'justify-center px-0 bg-transparent hover:bg-white/10' : 'px-3 bg-[#C06C4E]'}`}>
                        <Folder size={20} className="shrink-0" />
                        <span className={`transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>My Research</span>
                    </a>

                    <a href="#" className={`flex items-center gap-3 py-2.5 text-white/80 hover:bg-white/10 rounded-lg font-medium transition-colors ${isCollapsed ? 'justify-center px-0' : 'px-3'}`}>
                        <Users size={20} className="shrink-0" />
                        <span className={`transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>Shared with Me</span>
                    </a>

                    <a href="#" className={`flex items-center gap-3 py-2.5 text-white/80 hover:bg-white/10 rounded-lg font-medium transition-colors ${isCollapsed ? 'justify-center px-0' : 'px-3'}`}>
                        <Star size={20} className="shrink-0" />
                        <span className={`transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>Starred</span>
                    </a>

                    <button
                        onClick={handleDelete}
                        className={`w-full flex items-center gap-3 py-2.5 text-white/80 hover:bg-white/10 rounded-lg font-medium transition-colors ${isCollapsed ? 'justify-center px-0' : 'px-3'}`}
                        title="Delete active project"
                    >
                        <Trash2 size={20} className="shrink-0" />
                        <span className={`transition-opacity duration-200 text-left ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>Trash</span>
                    </button>
                </nav>
            </div>

            <div className={`p-6 mt-auto transition-opacity duration-200 ${isCollapsed ? 'opacity-0 pointer-events-none absolute bottom-0' : 'opacity-100'}`}>
                <div className="text-white/60 text-xs font-semibold tracking-wider mb-3">
                    STORAGE
                </div>
                <div className="w-full bg-black/20 rounded-full h-1.5 mb-2 overflow-hidden">
                    <div className="bg-[#A46761] h-1.5 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <div className="text-white/60 text-xs text-left">
                    75% of 2TB used
                </div>
            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Project"
                message="Are you sure you want to delete this project? This action cannot be undone and the data will be lost."
                confirmText="Delete Project"
                isDestructive={true}
                onConfirm={() => {
                    deleteProject(activeProjectId);
                    navigate('/dashboard');
                }}
            />
        </div>
    );
}
