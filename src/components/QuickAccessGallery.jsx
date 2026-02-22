import React from 'react';
import { FileText, Grid, Sigma, Image as ImageIcon, MoreVertical, ShieldCheck, Zap } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function QuickAccessGallery() {
    const { projects } = useAppContext();
    const navigate = useNavigate();
    return (
        <div className="mb-10">
            <div className="flex items-center gap-2 mb-4 text-gray-800">
                <Zap className="h-5 w-5 text-[#C06C4E]" fill="currentColor" />
                <h2 className="font-bold text-lg">Quick Access</h2>
            </div>

            {projects.length === 0 ? (
                // Empty State for Gallery
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {[1, 2, 3].map((placeholder) => (
                        <div key={placeholder} className="min-w-[180px] bg-white/40 border border-gray-100/50 rounded-2xl p-5 flex flex-col items-center justify-center opacity-50 select-none">
                            <div className="w-10 h-10 bg-gray-100 rounded-xl mb-3 flex items-center justify-center">
                                <Zap className="text-gray-300 w-5 h-5" />
                            </div>
                            <div className="h-3 w-20 bg-gray-200 rounded-full mb-2"></div>
                            <div className="h-2 w-12 bg-gray-100 rounded-full"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {projects.slice(0, 4).map((project) => {
                        const Icon = FileText; // Default icon for dynamic projects
                        return (
                            <div
                                key={project.id}
                                onClick={() => navigate(`/workspace/${project.id}`)}
                                className="min-w-[180px] bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col justify-between group cursor-pointer"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-2.5 rounded-xl bg-orange-100 text-orange-500`}>
                                        <Icon size={20} strokeWidth={2.5} />
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                                        <MoreVertical size={18} />
                                    </button>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-800 text-sm mb-1 truncate">{project.name}</h3>
                                    <p className="text-xs text-gray-400 mb-3">{project.date}</p>
                                    <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-700 rounded-md text-[10px] font-bold tracking-wide">
                                        <ShieldCheck size={12} />
                                        VERIFIED
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
