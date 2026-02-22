import React from 'react';
import { Folder, Users, Star, Trash2 } from 'lucide-react';

export default function Sidebar() {
    return (
        <div className="w-64 bg-[#734A54] text-white flex flex-col h-full shrink-0">
            <div className="flex-1 px-4 py-8">
                <div className="text-white/60 text-xs font-semibold tracking-wider mb-4 px-3">
                    NAVIGATION
                </div>

                <nav className="space-y-1">
                    <a href="/" className="flex items-center gap-3 px-3 py-2.5 bg-[#C06C4E] rounded-lg text-white font-medium transition-colors">
                        <Folder size={20} className="shrink-0" />
                        My Research
                    </a>

                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-white/80 hover:bg-white/10 rounded-lg font-medium transition-colors">
                        <Users size={20} className="shrink-0" />
                        Shared with Me
                    </a>

                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-white/80 hover:bg-white/10 rounded-lg font-medium transition-colors">
                        <Star size={20} className="shrink-0" />
                        Starred
                    </a>

                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-white/80 hover:bg-white/10 rounded-lg font-medium transition-colors">
                        <Trash2 size={20} className="shrink-0" />
                        Trash
                    </a>
                </nav>
            </div>

            <div className="p-6 mt-auto">
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
        </div>
    );
}
