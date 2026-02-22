import React, { useState } from 'react';
import { Settings2, Check } from 'lucide-react';

export default function GraphSettingsPanel() {
    const [biDirectional, setBiDirectional] = useState(true);
    const [showGridlines, setShowGridlines] = useState(true);
    const [showErrorBars, setShowErrorBars] = useState(true);

    return (
        <div className="flex flex-col py-4 space-y-6 w-full">

            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
                <Settings2 className="text-[#3E2A2F] w-5 h-5 shrink-0" />
                <h2 className="text-[#3E2A2F] font-bold text-lg">Graph Configuration</h2>
            </div>

            {/* Section 1: DATA MAPPING */}
            <div className="space-y-4">
                <h3 className="text-[10px] font-black text-[#62414A] tracking-widest uppercase">Data Mapping</h3>

                <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-[#3E2A2F]">X-Axis Variable</label>
                    <div className="relative">
                        <select className="appearance-none w-full bg-[#F4EBE1] border border-[#62414A]/30 text-[#3E2A2F] text-xs font-semibold py-2.5 pl-3 pr-8 rounded-lg outline-none focus:ring-1 focus:ring-[#62414A] shadow-sm cursor-pointer">
                            <option>Time (s)</option>
                        </select>
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-[#3E2A2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-[#3E2A2F]">Y-Axis Variable</label>
                    <div className="relative">
                        <select className="appearance-none w-full bg-[#F4EBE1] border border-[#62414A]/30 text-[#3E2A2F] text-xs font-semibold py-2.5 pl-3 pr-8 rounded-lg outline-none focus:ring-1 focus:ring-[#62414A] shadow-sm cursor-pointer">
                            <option>Temperature (°C)</option>
                        </select>
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-[#3E2A2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-[#3E2A2F]">Group By</label>
                    <div className="relative">
                        <select className="appearance-none w-full bg-[#F4EBE1] border border-[#62414A]/30 text-[#3E2A2F] text-xs font-semibold py-2.5 pl-3 pr-8 rounded-lg outline-none focus:ring-1 focus:ring-[#62414A] shadow-sm cursor-pointer">
                            <option>Trial ID</option>
                        </select>
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-[#3E2A2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full h-px bg-white/20"></div>

            {/* Section 2: INTERACTIVE LOGIC */}
            <div className="space-y-4">
                <h3 className="text-[10px] font-black text-[#62414A] tracking-widest uppercase">Interactive Logic</h3>

                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="text-[11px] font-bold text-[#3E2A2F]">Bi-Directional Editing</div>
                        <div className="text-[10px] font-medium text-[#62414A] leading-tight mt-1">
                            Drag nodes on the graph to automatically update the underlying data table.
                        </div>
                    </div>
                    <button
                        onClick={() => setBiDirectional(!biDirectional)}
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${biDirectional ? 'bg-blue-500' : 'bg-white/50 border border-[#3E2A2F]/30'}`}
                    >
                        {biDirectional && <Check size={12} className="text-white" strokeWidth={3} />}
                    </button>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-[#3E2A2F]">Regression Model</label>
                    <div className="relative">
                        <select className="appearance-none w-full bg-[#F4EBE1] border border-[#62414A]/30 text-[#3E2A2F] text-xs font-semibold py-2.5 pl-3 pr-8 rounded-lg outline-none focus:ring-1 focus:ring-[#62414A] shadow-sm cursor-pointer">
                            <option>Linear</option>
                        </select>
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-[#3E2A2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 pt-1 cursor-pointer">
                    <div className="w-3.5 h-3.5 bg-white/50 border border-[#62414A]/30 rounded flex items-center justify-center shrink-0 shadow-sm"></div>
                    <span className="text-[11px] font-bold text-[#3E2A2F]">Show 95% Confidence Interval</span>
                </div>
            </div>

            <div className="w-full h-px bg-white/20"></div>

            {/* Section 3: DISPLAY & AESTHETICS */}
            <div className="space-y-4">
                <h3 className="text-[10px] font-black text-[#62414A] tracking-widest uppercase">Display & Aesthetics</h3>

                <div className="flex bg-[#F4EBE1] p-1 rounded-xl shadow-inner border border-[#62414A]/10">
                    <button className="flex-1 py-1.5 flex justify-center text-[#62414A] hover:bg-white/50 rounded-lg transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="4" cy="20" r="2" /><circle cx="12" cy="14" r="2" /><circle cx="20" cy="4" r="2" /><path d="M4 18L4 4" /><path d="M4 20L20 20" /></svg>
                    </button>
                    <button className="flex-1 py-1.5 flex justify-center text-blue-500 bg-white shadow-sm rounded-lg transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20L20 20" /><path d="M4 16L12 10L20 4" /></svg>
                    </button>
                    <button className="flex-1 py-1.5 flex justify-center text-[#62414A] hover:bg-white/50 rounded-lg transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                    </button>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#3E2A2F]">Show Gridlines</span>
                    <button
                        onClick={() => setShowGridlines(!showGridlines)}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors relative ${showGridlines ? 'bg-purple-800' : 'bg-white/40 border border-[#3E2A2F]/30'}`}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${showGridlines ? 'translate-x-4' : 'translate-x-0'}`}></div>
                    </button>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#3E2A2F]">Show Error Bars</span>
                    <button
                        onClick={() => setShowErrorBars(!showErrorBars)}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors relative flex items-center ${showErrorBars ? 'bg-blue-500' : 'bg-white/40 border border-[#3E2A2F]/30'}`}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm flex items-center justify-center transition-transform ${showErrorBars ? 'translate-x-4' : 'translate-x-0'}`}>
                            {showErrorBars && <Check size={10} className="text-blue-500" strokeWidth={3} />}
                        </div>
                    </button>
                </div>

                <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#3E2A2F]">Data Point Size</span>
                        <span className="text-[10px] font-bold text-[#62414A]">4px</span>
                    </div>
                    <div className="w-full h-2 bg-white/40 border border-white/20 rounded-full relative">
                        <div className="absolute left-0 top-0 bottom-0 w-2/3 bg-white rounded-full"></div>
                    </div>
                </div>
            </div>

        </div>
    );
}
