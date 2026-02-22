import React, { useState } from 'react';
import { X, FolderPlus } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function NewProjectModal() {
    const { isNewProjectModalOpen, setIsNewProjectModalOpen, createNewProject } = useAppContext();
    const [title, setTitle] = useState('');
    const navigate = useNavigate();

    if (!isNewProjectModalOpen) return null;

    const handleCreate = (e) => {
        e.preventDefault();
        if (title.trim()) {
            const newId = createNewProject(title.trim());
            setIsNewProjectModalOpen(false);
            setTitle(''); // Reset
            navigate(`/workspace/${newId}`);
        }
    };

    const handleClose = () => {
        setIsNewProjectModalOpen(false);
        setTitle('');
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={handleClose}
        >
            <div
                className="bg-white rounded-2xl shadow-xl max-w-md w-full flex flex-col pointer-events-auto overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
                    <div className="flex items-center gap-2.5">
                        <FolderPlus className="text-[#62414A] w-5 h-5" />
                        <h2 className="text-gray-900 font-bold text-lg tracking-tight">Create New Project</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-50 p-1.5 rounded-full transition-colors focus:outline-none"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body Content */}
                <form onSubmit={handleCreate} className="px-6 py-6 space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Project Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Thermodynamics Experiment V2"
                            className="w-full px-4 py-3 bg-white border border-gray-200 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#62414A]/30 focus:border-[#62414A]/50 transition-all font-medium placeholder-gray-400 shadow-sm"
                            autoFocus
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors focus:outline-none"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!title.trim()}
                            className="bg-[#62414A] hover:bg-[#53353D] disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#62414A]/50 focus:ring-offset-2"
                        >
                            Create Project
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
