import React from 'react';
import { Folder, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Sidebar({ isCollapsed, toggleSidebar }) {
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
                </nav>
            </div>
        </div>
    );
}
