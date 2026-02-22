import React from 'react';
import { FileText, FileSpreadsheet, FileIcon, Folder, Code, Filter, List, Trash2, Import } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const getIcon = (type) => {
    switch (type) {
        case 'doc': return <FileText size={18} className="text-blue-400" />;
        case 'csv': return <FileSpreadsheet size={18} className="text-emerald-400" />;
        case 'pdf': return <FileIcon size={18} className="text-rose-400" />;
        case 'folder': return <Folder size={18} className="text-amber-400" />;
        case 'code': return <Code size={18} className="text-purple-400" />;
        default: return <FileIcon size={18} className="text-gray-400" />;
    }
};

export default function FilesTable({ selectedProject, setSelectedProject }) {
    const { projects, deleteProject, setIsNewProjectModalOpen } = useAppContext();
    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg text-gray-800">All Files</h2>
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsNewProjectModalOpen(true)} className="bg-[#62414A] hover:bg-[#53353D] text-white px-4 py-1.5 rounded-lg font-bold text-sm shadow-sm transition-colors focus:outline-none hidden sm:block">
                        New Project
                    </button>
                    <div className="flex bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        <button className="px-3 py-1.5 text-gray-500 hover:bg-gray-50 border-r border-gray-100 transition-colors">
                            <Filter size={16} />
                        </button>
                        <button className="px-3 py-1.5 text-gray-500 hover:bg-gray-50 transition-colors">
                            <List size={16} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="w-full">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-bold text-[#A46761] tracking-wider uppercase">
                    <div className="col-span-5">NAME</div>
                    <div className="col-span-3">OWNER</div>
                    <div className="col-span-2">LAST MODIFIED</div>
                    <div className="col-span-1">FILE SIZE</div>
                    <div className="col-span-1 text-right">PROVENANCE</div>
                </div>

                {/* Table Body / Empty State */}
                <div className="bg-[#734A54] rounded-2xl overflow-hidden shadow-sm relative min-h-[250px] flex flex-col justify-center">

                    {projects.length === 0 ? (
                        // MD3 Styled Empty State
                        <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                                <Folder size={32} className="text-white/40" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2 tracking-tight">No projects found</h3>
                            <p className="text-sm font-medium text-white/50 max-w-sm mb-6">
                                Your workspace is empty. Create a new project to start analyzing experiments and visualizing Data.
                            </p>
                            <button
                                onClick={() => setIsNewProjectModalOpen(true)}
                                className="bg-[#B7684C] hover:bg-[#A45C49] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#B7684C]"
                            >
                                Create your first project
                            </button>
                        </div>
                    ) : (
                        // Render Dynamic Projects
                        projects.map((file, index) => (
                            <div
                                key={file.id}
                                onClick={() => setSelectedProject(file)}
                                className={`grid grid-cols-12 gap-4 px-6 py-4 items-center text-sm text-white cursor-pointer transition-colors ${selectedProject?.id === file.id ? 'bg-black/15 shadow-inner' : 'hover:bg-white/5'} ${index !== projects.length - 1 ? 'border-b border-white/10' : ''}`}
                            >
                                <div className="col-span-5 flex items-center gap-3 font-medium">
                                    {getIcon(file.type)}
                                    {file.name}
                                </div>

                                <div className="col-span-3 flex items-center gap-2">
                                    {file.owner === 'Me' ? (
                                        <div className="h-6 w-6 rounded-full bg-[#C06C4E] flex items-center justify-center text-[10px] font-bold text-white shrink-0">ME</div>
                                    ) : (
                                        <div className="h-6 w-6 rounded-full bg-orange-200 overflow-hidden shrink-0">
                                            <img src={`https://ui-avatars.com/api/?name=${file.owner.replace(' ', '+')}&background=random&color=fff`} alt={file.owner} className="h-full w-full object-cover" />
                                        </div>
                                    )}
                                    <span className="text-white/80 text-xs">{file.owner}</span>
                                </div>

                                <div className="col-span-2 flex flex-col justify-center">
                                    <span className="text-white/80 text-xs leading-tight">{file.date}</span>
                                </div>

                                <div className="col-span-1 flex flex-col justify-center">
                                    <span className="text-white/80 text-xs leading-tight">{file.size.split(' ')[0]}</span>
                                    {file.size.includes(' ') && <span className="text-white/60 text-[10px] leading-tight font-bold">{file.size.split(' ')[1]}</span>}
                                </div>

                                <div className="col-span-1 flex justify-end items-center pr-4 gap-4">
                                    <div className={`h-3 w-3 rounded-full border-2 border-[#734A54] outline outline-2 ${file.status === 'green' ? 'bg-emerald-400 outline-emerald-400/50' : 'bg-rose-400 outline-rose-400/50'}`}></div>

                                    {/* Delete Action button */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); deleteProject(file.id); }}
                                        className="text-white/30 hover:text-rose-400 transition-colors focus:outline-none p-1"
                                        title="Delete Project"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Floating Action Button */}
            <div className="fixed bottom-6 right-[400px] z-20">
                <button
                    onClick={() => setIsNewProjectModalOpen(true)}
                    className="bg-[#734A54] hover:bg-[#5E3C44] text-white px-6 py-3 rounded-full shadow-lg font-medium flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
                >
                    <span className="text-xl leading-none font-light">+</span> New Project
                </button>
            </div>

        </div>
    );
}
