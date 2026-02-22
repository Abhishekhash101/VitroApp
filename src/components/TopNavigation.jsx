import React from 'react';
import { Search, Bell } from 'lucide-react';

export default function TopNavigation() {
    return (
        <div className="h-20 flex items-center justify-between px-10 shrink-0">

            {/* Spacer for left side if needed, but in design search is centered/right-ish. We will take full width and handle layout. */}
            <div className="flex-1 max-w-2xl ml-auto mr-8">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-white/60" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-11 pr-4 py-2.5 bg-[#835A62] border-none rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-[#C06C4E] focus:outline-none transition-all"
                        placeholder="Search experiments, data sets..."
                    />
                </div>
            </div>

            <div className="flex items-center gap-6 shrink-0">
                <button className="relative text-gray-800 hover:text-gray-600 transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-[#C06C4E] ring-2 ring-[#F6EFEA]"></span>
                </button>

                <a href="/settings" className="h-9 w-9 rounded-full overflow-hidden border-2 border-white/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C06C4E] block">
                    <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt="User profile"
                        className="h-full w-full object-cover"
                    />
                </a>
            </div>

        </div>
    );
}
