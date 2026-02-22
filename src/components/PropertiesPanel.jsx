import React from 'react';
import { FileText, Plus, MessageSquare } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

export default function PropertiesPanel({ project }) {
    const navigate = useNavigate();

    if (!project) {
        return (
            <div className="p-8 flex flex-col items-center justify-center h-full text-center text-gray-400">
                <FileText size={48} className="text-gray-200 mb-4" strokeWidth={1} />
                <p className="font-medium">Select a project to view details.</p>
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

                {/* Properties Section */}
                <div className="mb-8">
                    <h4 className="text-xs font-bold text-[#A46761] tracking-wider mb-4">PROPERTIES</h4>

                    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4 shadow-sm">
                        <div className="flex justify-between items-start">
                            <span className="text-sm text-gray-500 w-1/3">Type</span>
                            <span className="text-sm text-gray-800 font-medium text-right w-2/3">Vitro Document</span>
                        </div>
                        <div className="flex justify-between items-start">
                            <span className="text-sm text-gray-500 w-1/3">Created</span>
                            <span className="text-sm text-gray-800 font-medium text-right w-2/3">{project.date}</span>
                        </div>
                        <div className="flex justify-between items-start">
                            <span className="text-sm text-gray-500 w-1/3">Owner</span>
                            <span className="text-sm text-gray-800 font-medium text-right w-2/3">{project.owner}</span>
                        </div>
                        {project.location && (
                            <div className="flex justify-between items-start">
                                <span className="text-sm text-gray-500 w-1/3">Location</span>
                                <span className="text-sm text-gray-800 font-medium text-right w-2/3 text-wrap break-words">{project.location}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Collaborators Section */}
                <div className="mb-8">
                    <h4 className="text-xs font-bold text-[#A46761] tracking-wider mb-4">COLLABORATORS</h4>
                    <div className="flex items-center gap-1.5">
                        <img
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt="Sarah"
                            className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-sm bg-orange-100"
                        />
                        <div className="h-10 w-10 rounded-full border-2 border-white bg-[#734A54] flex items-center justify-center shadow-sm text-white font-bold text-xs">
                            ME
                        </div>
                        <button className="h-10 w-10 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors ml-1">
                            <Plus size={20} />
                        </button>
                    </div>
                </div>

                {/* Activity Section */}
                <div>
                    <h4 className="text-xs font-bold text-[#A46761] tracking-wider mb-4">ACTIVITY</h4>

                    <div className="relative pl-6 space-y-6 before:absolute before:inset-y-2 before:left-[7px] before:w-0.5 before:bg-[#E2D2C8]">

                        {/* Activity Item 1 */}
                        <div className="relative">
                            <div className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-[#C06C4E] border-2 border-[#FAF7F5]"></div>
                            <div className="text-xs text-[#A46761] font-bold mb-2">Today, 10:23 AM</div>
                            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm text-sm text-gray-700">
                                Sarah commented on "Abstract"
                            </div>
                        </div>

                        {/* Activity Item 2 */}
                        <div className="relative">
                            <div className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-[#D1C2BB] border-2 border-[#FAF7F5]"></div>
                            <div className="text-xs text-gray-400 mb-1">Yesterday, 4:15 PM</div>
                            <div className="text-sm text-gray-600">
                                You edited the file
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
