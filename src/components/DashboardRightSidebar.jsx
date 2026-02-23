import React from 'react';
import { FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DashboardRightSidebar({ project }) {
    const navigate = useNavigate();

    if (!project) {
        return (
            <div className="p-8 flex flex-col items-center justify-center h-full text-center text-gray-400">
                <FileText size={48} className="text-gray-200 mb-4" strokeWidth={1} />
                <p className="font-medium">Select a file to view properties.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-[#FAF7F5]">
            {/* File Preview Card */}
            <div className="p-6 pb-2">
                <div className="w-full bg-gradient-to-br from-rose-100 via-rose-50 to-[#EAD4C7] rounded-3xl p-8 flex flex-col items-center justify-center shadow-sm relative overflow-hidden">
                    {/* The subtle gradient shape at the top */}
                    <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-rose-200/50 to-transparent"></div>

                    <div className="h-20 w-20 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 relative z-10">
                        <FileText size={36} className="text-blue-500" />
                    </div>

                    <h3 className="font-bold text-[#1F2937] text-lg mb-1 relative z-10 text-center truncate w-full">{project.name}</h3>
                    <p className="text-sm text-[#734A54] font-medium relative z-10">Document • {project.size}</p>
                </div>
            </div>

            {/* Action Button */}
            <div className="px-6 pb-4">
                <button
                    onClick={() => navigate(`/workspace/${project.id}`)}
                    className="w-full bg-[#B7684C] hover:bg-[#A45C49] text-white py-3 rounded-xl font-bold text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#B7684C] flex justify-center items-center gap-2"
                >
                    Open in Editor
                </button>
            </div>

            <div className="px-6 py-4 flex-1 overflow-y-auto">
                <div className="mb-6">
                    <h4 className="text-[10px] font-bold tracking-widest text-gray-400 mb-4 bg-gray-100/50 px-3 py-1.5 rounded inline-block uppercase">PROPERTIES</h4>

                    <div className="space-y-4">
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400 font-medium mb-1">Type</span>
                            <span className="text-sm font-semibold text-gray-800">Word Document</span>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400 font-medium mb-1">Created</span>
                            <span className="text-sm font-semibold text-gray-800">{project.date}</span>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400 font-medium mb-1">Modified</span>
                            <span className="text-sm font-semibold text-gray-800">{project.date}</span>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400 font-medium mb-1">Location</span>
                            <span className="text-sm font-semibold text-gray-800">My Projects / {project.name}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
