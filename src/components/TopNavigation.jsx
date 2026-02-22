import React, { useState } from 'react';
import { Search, Bell, LogOut, FileDown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function TopNavigation() {
    const { user, logout, setIsExportModalOpen } = useAppContext();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
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

            <div className="flex items-center gap-6 shrink-0 relative">
                {/* Export PDF Button explicitly wired for user request */}
                <button
                    onClick={() => setIsExportModalOpen(true)}
                    className="hidden lg:flex items-center gap-2 border border-white/20 px-3 py-1.5 rounded-lg text-white/80 hover:bg-white/10 transition-colors text-sm font-medium"
                >
                    <FileDown className="h-4 w-4" />
                    Export PDF
                </button>

                <button className="relative text-gray-800 hover:text-gray-600 transition-colors">
                    <Bell className="h-5 w-5 text-white/80" />
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-[#C06C4E] ring-2 ring-[#F6EFEA]"></span>
                </button>

                <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                >
                    <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-white/50 shadow-sm transition-all hover:border-white">
                        <img
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt="User profile"
                            className="h-full w-full object-cover"
                        />
                    </div>
                </button>

                {/* Profile Dropdown */}
                {dropdownOpen && (
                    <div className="absolute right-0 top-12 mt-2 w-56 rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100 flex flex-col">
                            <span className="text-sm font-semibold text-gray-900">{user?.name || "Guest User"}</span>
                            <span className="text-xs text-gray-500 font-medium">{user?.role || "Visitor"}</span>
                        </div>
                        <div className="py-1">
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2.5 text-sm text-[#864A3D] font-medium hover:bg-red-50 flex items-center gap-2 transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                                Sign out
                            </button>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}
