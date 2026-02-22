import React from 'react';
import {
    FlaskConical, User, Lock, Building, Key, Bell,
    Rocket, MapPin, Mail, Pencil, Building2, Fingerprint, Trash2, Save
} from 'lucide-react';

export default function AccountSettingsPage() {
    return (
        <div className="min-h-screen flex flex-col font-sans w-full bg-[#F4EBE1]">

            {/* Top Navigation */}
            <div className="h-20 bg-white border-b border-gray-100 px-6 lg:px-10 flex items-center justify-between shrink-0 z-20 relative">
                <div className="flex items-center gap-4">
                    <a href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 rounded-lg bg-[#62414A] flex items-center justify-center text-white">
                            <FlaskConical size={18} strokeWidth={2.5} />
                        </div>
                        <span className="font-bold text-lg text-[#3E2A2F] tracking-tight">Vitro Workspace</span>
                    </a>
                    <span className="text-gray-400 font-medium text-sm mt-0.5">Physicist Edition</span>
                </div>

                <div className="flex items-center gap-8">
                    <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-500">
                        <a href="/" className="hover:text-[#62414A] transition-colors">Dashboard</a>
                        <a href="/workspace" className="hover:text-[#62414A] transition-colors">Experiments</a>
                        <a href="#" className="hover:text-[#62414A] transition-colors">Collaborators</a>
                    </nav>
                    <div className="h-10 w-10 rounded-full border-2 border-white shadow-sm overflow-hidden shrink-0">
                        <img
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt="User Avatar"
                            className="h-full w-full object-cover"
                        />
                    </div>
                </div>
            </div>

            {/* Body Area - Split Background Container */}
            <div className="flex-1 flex flex-col lg:flex-row w-full relative">

                {/* Left Column Background/Sidebar Container */}
                <div className="w-full lg:w-80 flex-shrink-0 bg-gradient-to-b from-[#62414A] to-[#B7684C] lg:min-h-full p-6 lg:p-10 z-10">

                    <div className="flex flex-col gap-6 sticky top-10">

                        {/* Nav Card */}
                        <div className="bg-[#FAF7F5] rounded-2xl shadow-md overflow-hidden pb-2">
                            <div className="px-6 py-5 text-[11px] font-bold tracking-wider text-[#3E2A2F]/50 uppercase">
                                Account Settings
                            </div>
                            <nav className="flex flex-col">
                                <a href="#" className="flex items-center gap-3 px-6 py-3.5 bg-rose-50/60 border-l-4 border-[#62414A] text-[#62414A] font-semibold text-sm transition-colors">
                                    <User size={18} />
                                    Profile
                                </a>
                                <a href="#" className="flex items-center gap-3 px-6 py-3.5 border-l-4 border-transparent text-[#3E2A2F]/60 hover:text-[#3E2A2F] hover:bg-black/5 font-semibold text-sm transition-colors">
                                    <Lock size={18} />
                                    Security
                                </a>
                                <a href="#" className="flex items-center gap-3 px-6 py-3.5 border-l-4 border-transparent text-[#3E2A2F]/60 hover:text-[#3E2A2F] hover:bg-black/5 font-semibold text-sm transition-colors">
                                    <Building size={18} />
                                    University Affiliation
                                </a>
                                <a href="#" className="flex items-center gap-3 px-6 py-3.5 border-l-4 border-transparent text-[#3E2A2F]/60 hover:text-[#3E2A2F] hover:bg-black/5 font-semibold text-sm transition-colors">
                                    <Key size={18} />
                                    API Keys
                                </a>
                                <a href="#" className="flex items-center gap-3 px-6 py-3.5 border-l-4 border-transparent text-[#3E2A2F]/60 hover:text-[#3E2A2F] hover:bg-black/5 font-semibold text-sm transition-colors">
                                    <Bell size={18} />
                                    Notifications
                                </a>
                            </nav>
                        </div>

                        {/* Pro Features Card */}
                        <div className="bg-[#FAF7F5] rounded-2xl shadow-md p-6">
                            <div className="flex items-center gap-2 mb-3 text-[#3E2A2F]">
                                <Rocket size={18} className="text-[#B7684C]" />
                                <h3 className="font-bold text-sm tracking-tight">Pro Features</h3>
                            </div>
                            <p className="text-xs text-[#3E2A2F]/60 leading-relaxed mb-5 font-medium">
                                Upgrade to access unlimited compute hours for quantum simulations.
                            </p>
                            <button className="w-full bg-[#62414A] hover:bg-[#53353D] text-white text-xs font-bold py-3 rounded-xl transition-colors shadow-sm">
                                Upgrade Plan
                            </button>
                        </div>

                    </div>
                </div>

                {/* Right Column Main Content */}
                <div className="flex-1 bg-[#F4EBE1] p-6 lg:p-10 lg:pl-12 flex justify-center z-10">
                    <div className="w-full max-w-4xl flex flex-col gap-6">

                        {/* Card 1: Profile Header */}
                        <div className="bg-gradient-to-r from-[#9A6256] to-[#7B4D4B] rounded-2xl p-8 relative overflow-hidden shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-8 z-10">
                            {/* Decorative Background Swoosh */}
                            <div className="absolute -top-24 -right-12 w-96 h-96 bg-[#B27063] rounded-full blur-3xl opacity-20 pointer-events-none"></div>

                            <div className="relative shrink-0">
                                <div className="w-28 h-28 rounded-full border-4 border-[#FAF7F5] shadow-md overflow-hidden bg-rose-100">
                                    <img
                                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                        alt="Abhishek Kumar"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#62414A] border-2 border-[#FAF7F5] flex items-center justify-center text-white hover:bg-[#53353D] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-white">
                                    <Pencil size={14} />
                                </button>
                            </div>

                            <div className="flex-1 text-center sm:text-left text-white mt-2">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                                    <h1 className="text-3xl font-bold tracking-tight">Abhishek Kumar</h1>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#3E2A2F]/40 text-xs font-bold tracking-wide backdrop-blur-md">
                                        PhD Scholar - VIT
                                    </span>
                                </div>

                                <p className="text-white/90 text-sm leading-relaxed max-w-2xl mb-6 font-medium">
                                    Experimental Physicist specializing in thermodynamic variance in quantum systems. Currently researching at Vitro Labs.
                                </p>

                                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-sm text-white/80 font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin size={16} />
                                        Vellore, India
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Mail size={16} />
                                        abhishek.kumar@vit.ac.in
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Storage Usage */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex justify-between items-end mb-3">
                                <h2 className="text-[#3E2A2F] font-bold text-lg tracking-tight">Storage Usage</h2>
                                <span className="text-sm font-bold text-[#A45C49]">2.4GB / 5GB</span>
                            </div>
                            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
                                <div className="h-full bg-[#62414A] rounded-full" style={{ width: '48%' }}></div>
                            </div>
                            <p className="text-xs text-gray-400 font-medium">
                                Your research data, simulation logs, and high-res plots are stored securely.
                            </p>
                        </div>

                        {/* Card 3: Academic Details Form */}
                        <div className="bg-[#A45C49] rounded-2xl shadow-sm text-white p-8">
                            <h2 className="text-xl font-bold tracking-tight text-[#3E2A2F] mb-6 inline-block pb-6 w-full border-b border-white/20">Academic Details</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold tracking-wider text-rose-100/80">Full Name</label>
                                    <input
                                        type="text"
                                        defaultValue="Abhishek Kumar"
                                        className="w-full px-4 py-3.5 rounded-xl bg-[#FAF7F5] text-[#3E2A2F] font-medium border-none focus:ring-2 focus:ring-[#3E2A2F]/30"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold tracking-wider text-rose-100/80">Email Address</label>
                                    <input
                                        type="email"
                                        defaultValue="abhishek.kumar@vit.ac.in"
                                        className="w-full px-4 py-3.5 rounded-xl bg-[#FAF7F5] text-[#3E2A2F] font-medium border-none focus:ring-2 focus:ring-[#3E2A2F]/30"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold tracking-wider text-rose-100/80">Department</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Building2 size={16} className="text-[#3E2A2F]/40" />
                                        </div>
                                        <input
                                            type="text"
                                            defaultValue="Department of Physics"
                                            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#FAF7F5] text-[#3E2A2F] font-medium border-none focus:ring-2 focus:ring-[#3E2A2F]/30"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold tracking-wider text-rose-100/80">ORCID ID</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Fingerprint size={16} className="text-[#3E2A2F]/40" />
                                        </div>
                                        <input
                                            type="text"
                                            defaultValue="0000-0002-1825-0097"
                                            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#FAF7F5] text-[#3E2A2F] font-medium border-none focus:ring-2 focus:ring-[#3E2A2F]/30"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-xs font-bold tracking-wider text-rose-100/80">Research Interests</label>
                                    <textarea
                                        defaultValue="Quantum Thermodynamics, Entanglement Entropy, Condensed Matter Physics"
                                        rows={3}
                                        className="w-full px-4 py-3.5 rounded-xl bg-[#FAF7F5] text-[#3E2A2F] font-medium border-none focus:ring-2 focus:ring-[#3E2A2F]/30 resize-none"
                                    ></textarea>
                                </div>

                            </div>

                            {/* Footer Actions */}
                            <div className="mt-8 pt-6 border-t border-white/20 flex flex-col sm:flex-row justify-between items-center gap-4">
                                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/30 text-rose-100 hover:bg-white/10 hover:text-white transition-colors text-sm font-bold w-full sm:w-auto justify-center">
                                    <Trash2 size={16} />
                                    Delete Account
                                </button>

                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    <button className="flex-1 sm:flex-none px-5 py-2.5 text-rose-100 hover:text-white font-bold text-sm transition-colors text-center">
                                        Cancel
                                    </button>
                                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#4A2D33] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#3E262B] transition-colors shadow-sm shadow-black/20">
                                        <Save size={16} />
                                        Save Changes
                                    </button>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
