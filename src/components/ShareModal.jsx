import React from 'react';
import { UserPlus, X, Lock, Link, ChevronDown } from 'lucide-react';

export default function ShareModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        // The Overlay (Background Blur)
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            {/* The Modal Container */}
            <div
                className="bg-[#F4EBE1] rounded-2xl shadow-xl max-w-lg w-full overflow-hidden flex flex-col pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Header */}
                <div className="flex justify-between items-center px-6 py-5 border-b border-[#3E2A2F]/10">
                    <div className="flex items-center gap-2.5">
                        <UserPlus className="text-[#62414A] w-5 h-5" />
                        <h2 className="text-[#3E2A2F] font-bold text-lg tracking-tight">
                            Share "<span className="font-semibold">Analysis of Thermodynamic Variance</span>"
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 hover:bg-black/5 p-1.5 rounded-full transition-colors focus:outline-none"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body Content */}
                <div className="px-6 py-5 space-y-6">

                    {/* Search Input */}
                    <div>
                        <input
                            type="text"
                            placeholder="Add researchers or university groups..."
                            className="w-full px-4 py-3.5 bg-white rounded-xl border border-stone-200 text-sm font-medium text-[#3E2A2F] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#62414A]/30 focus:border-[#62414A]/50 transition-all shadow-sm"
                        />
                    </div>

                    {/* PEOPLE WITH ACCESS Section */}
                    <div>
                        <h3 className="text-[11px] font-bold tracking-wider text-[#3E2A2F]/50 uppercase mb-3">
                            People with Access
                        </h3>

                        <div className="space-y-4">

                            {/* Row 1 (Owner) */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full border border-[#FAF7F5] overflow-hidden shadow-sm shrink-0 bg-orange-100">
                                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Dr. Sarah Smith" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-[#3E2A2F]">Dr. Sarah Smith (You)</div>
                                        <div className="text-xs text-gray-500 font-medium">sarah.smith@univ.edu</div>
                                    </div>
                                </div>
                                <div className="px-3 py-1 bg-[#F1E0DD] text-[#62414A] text-[10px] font-bold tracking-widest uppercase rounded-full shrink-0">
                                    OWNER
                                </div>
                            </div>

                            {/* Row 2 */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full border border-[#FAF7F5] overflow-hidden shadow-sm shrink-0 bg-blue-100">
                                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Dr. James Chen" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-[#3E2A2F]">Dr. James Chen</div>
                                        <div className="text-xs text-gray-500 font-medium">j.chen@quantum-lab.org</div>
                                    </div>
                                </div>
                                <button className="flex items-center gap-2 bg-white border border-stone-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#62414A] hover:bg-gray-50 transition-colors shadow-sm focus:outline-none">
                                    Lead Author (Full Access)
                                    <ChevronDown size={14} className="text-[#62414A]/60" />
                                </button>
                            </div>

                            {/* Row 3 */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full border border-[#FAF7F5] overflow-hidden shadow-sm shrink-0 bg-green-100">
                                        <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Lab Assistant Alex" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-[#3E2A2F]">Lab Assistant Alex</div>
                                        <div className="text-xs text-gray-500 font-medium">alex.research@univ.edu</div>
                                    </div>
                                </div>
                                <button className="flex items-center gap-2 bg-white border border-stone-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#62414A] hover:bg-gray-50 transition-colors shadow-sm focus:outline-none">
                                    Data Analyst (Graph & Table)
                                    <ChevronDown size={14} className="text-[#62414A]/60" />
                                </button>
                            </div>

                        </div>
                    </div>

                    {/* General Access Box */}
                    <div className="bg-white/60 border border-stone-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2 shadow-sm">
                        <div className="flex items-start gap-3">
                            <div className="bg-gray-100 p-2 rounded-full shrink-0 mt-0.5">
                                <Lock size={16} className="text-gray-600" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-[#3E2A2F] mb-0.5">General Access</div>
                                <div className="text-[11px] text-gray-500 font-medium">
                                    Restricted • Only added people can open with this link
                                </div>
                            </div>
                        </div>

                        <button className="flex items-center justify-center gap-2 bg-transparent border border-[#62414A]/20 text-[#62414A] hover:bg-[#62414A]/5 px-4 py-2 rounded-full text-xs font-bold transition-colors w-full sm:w-auto shrink-0 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#62414A]/20">
                            <Link size={14} />
                            Copy Link
                        </button>
                    </div>

                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-[#3E2A2F]/10 flex items-center justify-between bg-[#F4EBE1]">
                    <a href="#" className="text-xs font-semibold text-[#3E2A2F]/50 hover:text-[#3E2A2F] transition-colors">
                        Feedback?
                    </a>
                    <button
                        onClick={onClose}
                        className="bg-[#62414A] hover:bg-[#53353D] text-white px-6 py-2 rounded-full text-sm font-bold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#62414A]/50 focus:ring-offset-2 focus:ring-offset-[#F4EBE1]"
                    >
                        Done
                    </button>
                </div>

            </div>
        </div>
    );
}
