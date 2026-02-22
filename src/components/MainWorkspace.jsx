import React from 'react';
import {
    FlaskConical, ChevronDown, Folder, FileText, BarChart2, Option,
    Settings, Download, Trash2, Cloud, Share, CheckCircle2, Save, Upload,
    Clock
} from 'lucide-react';
import ShareModal from './ShareModal';
import ExportPdfModal from './ExportPdfModal';
import RightSidebar from './RightSidebar';

export default function MainWorkspace() {
    const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = React.useState(false);

    return (
        <div className="h-screen flex flex-col font-sans w-full bg-[#E5D7CC] overflow-hidden">

            {/* Top Navigation */}
            <div className="h-20 bg-[#F4EBE1] border-b border-[#D8C7B9] px-6 lg:px-10 flex items-center justify-between shrink-0 z-20">

                {/* Left: Logo */}
                <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="w-9 h-9 rounded-xl bg-[#62414A] flex items-center justify-center text-white shadow-sm">
                        <FlaskConical size={20} strokeWidth={2.5} />
                    </div>
                    <span className="font-extrabold text-[#3E2A2F] text-xl tracking-tight">Vitro Workspace</span>
                </a>

                {/* Center-Right: Links */}
                <nav className="hidden md:flex items-center gap-8 text-[#62414A]">
                    <a href="/" className="font-semibold text-[15px] hover:text-[#3E2A2F] transition-colors">Dashboard</a>
                    <a href="/workspace" className="font-bold text-[15px] text-[#3E2A2F]">Projects</a>
                    <a href="#" className="font-semibold text-[15px] hover:text-[#3E2A2F] transition-colors">Templates</a>
                    <a href="#" className="font-semibold text-[15px] hover:text-[#3E2A2F] transition-colors">Help</a>
                </nav>

                {/* Right: Actions & User */}
                <div className="flex items-center gap-5">
                    <button className="hidden sm:block px-6 py-2.5 rounded-full border-2 border-[#B7684C] text-[#B7684C] font-bold text-sm tracking-wide hover:bg-[#B7684C]/5 transition-colors">
                        New Project
                    </button>
                    <a href="/settings" className="h-10 w-10 rounded-full border-2 border-white shadow-sm overflow-hidden shrink-0 block hover:opacity-90 transition-opacity">
                        <img
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt="User Avatar"
                            className="h-full w-full object-cover"
                        />
                    </a>
                </div>

            </div>

            {/* Main Body Wrapper */}
            <div className="flex-1 flex overflow-hidden">

                {/* Column 1: Left Workbench Sidebar */}
                <div className="w-72 hidden md:flex flex-col bg-gradient-to-b from-[#62414A] to-[#B7684C] flex-shrink-0 z-10 m-4 lg:m-6 rounded-3xl overflow-hidden shadow-lg border border-white/10">

                    <div className="p-6">
                        <h2 className="text-[#3E2A2F] font-bold text-lg mb-4">Project Workbench</h2>
                        <div className="w-full h-px bg-[#3E2A2F]/20 mb-6"></div>

                        {/* File Tree */}
                        <div className="space-y-3">

                            <div className="flex justify-between items-center bg-[#F4EBE1]/90 rounded-xl px-4 py-3 shadow-sm cursor-pointer">
                                <div className="flex items-center gap-3 text-[#3E2A2F] font-semibold text-sm">
                                    <Folder size={18} className="text-[#B7684C]" fill="currentColor" />
                                    Experiments 2026
                                </div>
                                <ChevronDown size={16} className="text-[#3E2A2F]" />
                            </div>

                            <div className="pl-4 space-y-3">
                                <div className="flex items-center gap-3 bg-white/95 rounded-xl px-4 py-3 shadow-sm cursor-pointer hover:bg-white transition-colors">
                                    <FileText size={18} className="text-gray-400" />
                                    <span className="text-[#3E2A2F] font-medium text-sm">Abstract.docx</span>
                                </div>

                                <div className="flex items-center gap-3 bg-white/95 rounded-xl px-4 py-3 shadow-sm cursor-pointer hover:bg-white transition-colors">
                                    <BarChart2 size={18} className="text-gray-400" />
                                    <span className="text-[#3E2A2F] font-medium text-sm">Raw_Data_Set_1.csv</span>
                                </div>

                                <div className="flex items-center gap-3 bg-[#B7684C] rounded-xl px-4 py-3 shadow-md cursor-pointer">
                                    <FileText size={18} className="text-white" />
                                    <span className="text-white font-bold text-sm">Final_Report.tex</span>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="mt-auto p-6 space-y-4 border-t border-white/10">
                        <a href="/settings" className="flex items-center gap-3 text-[#3E2A2F] font-medium text-sm hover:text-white transition-colors">
                            <Settings size={18} />
                            Settings
                        </a>
                        <button
                            onClick={() => setIsExportModalOpen(true)}
                            className="flex w-full items-center gap-3 text-[#3E2A2F] font-medium text-sm hover:text-white transition-colors text-left"
                        >
                            <Download size={18} />
                            Export PDF
                        </button>
                        <a href="#" className="flex items-center gap-3 text-[#3E2A2F]/60 font-medium text-sm hover:text-[#3E2A2F]/80 transition-colors">
                            <Trash2 size={18} />
                            Trash
                        </a>
                    </div>

                </div>

                {/* Column 2: Center Editor */}
                <div className="flex-1 bg-white my-4 lg:my-6 rounded-3xl shadow-lg border border-gray-100 overflow-y-auto z-0 flex flex-col">

                    <div className="max-w-[800px] w-full mx-auto px-8 lg:px-12 py-10">

                        {/* Top Bar inside Editor */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-14">
                            <div className="text-[10px] font-bold text-gray-400 tracking-[0.15em]">
                                MY PROJECTS / THESIS CHAPTER 4 / <span className="text-[#3E2A2F] font-extrabold uppercase">QUANTUM_ANALYSIS_V2</span>
                            </div>

                            <div className="flex items-center gap-5">
                                <div className="flex items-center gap-2 text-emerald-600 font-medium text-sm">
                                    <Cloud size={16} />
                                    Saved to Cloud
                                </div>

                                <div className="flex items-center">
                                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Collab 1" className="w-8 h-8 rounded-full border-2 border-white relative z-20 object-cover" />
                                    <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Collab 2" className="w-8 h-8 rounded-full border-2 border-white -ml-3 relative z-10 object-cover" />
                                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Collab 3" className="w-8 h-8 rounded-full border-2 border-white -ml-3 relative z-0 object-cover bg-[#E5D7CC]" />
                                </div>

                                <button
                                    onClick={() => setIsShareModalOpen(true)}
                                    className="bg-[#B7684C] hover:bg-[#A45C49] text-white px-5 py-2 rounded-full font-bold text-sm shadow-sm transition-colors"
                                >
                                    Share
                                </button>
                            </div>
                        </div>

                        {/* Document Content */}
                        <div className="mb-14">
                            <h1 className="text-4xl lg:text-[44px] font-serif text-[#111111] font-bold leading-tight mb-4 tracking-tight">
                                Analysis of Thermodynamic Variance
                            </h1>
                            <div className="inline-block bg-[#62414A] text-white text-[10px] font-extrabold tracking-widest px-3 py-1.5 rounded uppercase mb-8">
                                Dr. Sarah Smith
                            </div>

                            <p className="text-[#444] text-lg leading-relaxed mb-10 font-serif">
                                In this section, we delve into the thermodynamic variance observed in our quantum experiments. The data, meticulously collected and processed, reveals intriguing patterns that challenge conventional models. Our analysis focuses on identifying and interpreting the deviations from expected thermodynamic behavior, particularly in the context of quantum entanglement and superposition. The results suggest a complex interplay of factors influencing the system's energy distribution and entropy, warranting further investigation into the underlying mechanisms.<span className="inline-block w-0.5 h-[1.1em] bg-[#62414A] animate-pulse ml-0.5 align-text-bottom"></span>
                            </p>

                            {/* Data Table */}
                            <div className="border border-[#E5D7CC] rounded-xl overflow-hidden mb-12 shadow-sm font-sans">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-[#DFC0A3] text-[#3E2A2F] text-xs uppercase tracking-wider font-bold">
                                        <tr>
                                            <th className="px-6 py-4">Time (S)</th>
                                            <th className="px-6 py-4">Temp (C)</th>
                                            <th className="px-6 py-4">Pressure (KPA)</th>
                                            <th className="px-6 py-4">Outlier?</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        <tr className="bg-white hover:bg-gray-50/50">
                                            <td className="px-6 py-4 text-gray-600">0.0</td>
                                            <td className="px-6 py-4 text-gray-600">25.0</td>
                                            <td className="px-6 py-4 text-gray-600">100.0</td>
                                            <td className="px-6 py-4 text-gray-600">No</td>
                                        </tr>
                                        <tr className="bg-white hover:bg-gray-50/50">
                                            <td className="px-6 py-4 text-gray-600">1.0</td>
                                            <td className="px-6 py-4 text-gray-600">25.5</td>
                                            <td className="px-6 py-4 text-gray-600">100.5</td>
                                            <td className="px-6 py-4 text-gray-600">No</td>
                                        </tr>
                                        <tr className="bg-[#9B594D] text-white font-bold">
                                            <td className="px-6 py-4">2.0</td>
                                            <td className="px-6 py-4">35.0</td>
                                            <td className="px-6 py-4">110.0</td>
                                            <td className="px-6 py-4">Yes</td>
                                        </tr>
                                        <tr className="bg-white hover:bg-gray-50/50">
                                            <td className="px-6 py-4 text-gray-600">3.0</td>
                                            <td className="px-6 py-4 text-gray-600">26.0</td>
                                            <td className="px-6 py-4 text-gray-600">101.0</td>
                                            <td className="px-6 py-4 text-gray-600">No</td>
                                        </tr>
                                        <tr className="bg-white hover:bg-gray-50/50">
                                            <td className="px-6 py-4 text-gray-600">4.0</td>
                                            <td className="px-6 py-4 text-gray-600">26.2</td>
                                            <td className="px-6 py-4 text-gray-600">101.2</td>
                                            <td className="px-6 py-4 text-gray-600">No</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Chart Section */}
                            <div className="bg-[#EAD4C7] rounded-xl p-8 shadow-inner border border-[#D8C7B9] font-sans">
                                <h3 className="text-[#3E2A2F] font-bold text-lg mb-8 font-serif">Time vs. Temperature Analysis</h3>

                                {/* SVG Chart Mock */}
                                <div className="relative w-full h-48 border-b border-l border-[#3E2A2F]/20 pb-4 pl-4 pt-4 pr-4">

                                    {/* Grid Lines */}
                                    <div className="absolute inset-x-4 top-[20%] border-t border-[#3E2A2F]/10"></div>
                                    <div className="absolute inset-x-4 top-[50%] border-t border-[#3E2A2F]/10"></div>
                                    <div className="absolute inset-x-4 top-[80%] border-t border-[#3E2A2F]/10"></div>

                                    <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
                                        <defs>
                                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#62414A" stopOpacity="0.8" />
                                                <stop offset="100%" stopColor="#62414A" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                        {/* Area under curve */}
                                        <path d="M 10 120 L 100 115 L 200 20 L 300 110 L 390 108 L 390 150 L 10 150 Z" fill="url(#chartGradient)" />
                                        {/* The Line */}
                                        <path d="M 10 120 L 100 115 L 200 20 L 300 110 L 390 108" fill="none" stroke="#3E2A2F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        {/* Data Points */}
                                        <circle cx="10" cy="120" r="3" fill="#3E2A2F" />
                                        <circle cx="100" cy="115" r="3" fill="#3E2A2F" />
                                        {/* Peak Point */}
                                        <circle cx="200" cy="20" r="4" fill="white" stroke="#3E2A2F" strokeWidth="2" />
                                        <circle cx="300" cy="110" r="3" fill="#3E2A2F" />
                                        <circle cx="390" cy="108" r="3" fill="#3E2A2F" />
                                    </svg>

                                    {/* X Axis Labels */}
                                    <div className="absolute -bottom-6 left-0 w-full flex justify-between px-4 text-[10px] font-bold text-[#3E2A2F]/50">
                                        <span>0s</span>
                                        <span>1s</span>
                                        <span>2s</span>
                                        <span>3s</span>
                                        <span>4s</span>
                                    </div>
                                </div>

                                <div className="flex justify-between mt-10 text-[9px] font-bold text-[#3E2A2F]/40 tracking-widest uppercase">
                                    <span>Time (S)</span>
                                    <span>Temp (C)</span>
                                </div>

                            </div>

                        </div>
                    </div>

                </div>

                {/* Column 3: Dynamic Right Sidebar */}
                <RightSidebar />

            </div>

            {/* Share Modal Overlay */}
            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
            />

            {/* Export PDF Modal Overlay */}
            <ExportPdfModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
            />
        </div>
    );
}
