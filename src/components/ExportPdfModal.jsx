import React, { useState } from 'react';
import { FileDown, X, CheckSquare, Square, ChevronDown } from 'lucide-react';

export default function ExportPdfModal({ isOpen, onClose }) {
    const [paperSize, setPaperSize] = useState('A4');
    const [citationStyle, setCitationStyle] = useState('APA 7th Edition');
    const [includeRawData, setIncludeRawData] = useState(true);
    const [includeComments, setIncludeComments] = useState(false);
    const [addWatermark, setAddWatermark] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    if (!isOpen) return null;

    const handleExport = () => {
        setIsExporting(true);
        setTimeout(() => {
            setIsExporting(false);
            onClose();
        }, 2000);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="bg-[#F4EBE1] rounded-2xl shadow-xl max-w-md w-full flex flex-col pointer-events-auto overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-5 border-b border-[#3E2A2F]/10 bg-[#F4EBE1]">
                    <div className="flex items-center gap-2.5">
                        <FileDown className="text-[#62414A] w-5 h-5" />
                        <h2 className="text-[#3E2A2F] font-bold text-lg tracking-tight">Export Document</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 hover:bg-black/5 p-1.5 rounded-full transition-colors focus:outline-none"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body Content */}
                <div className="px-6 py-6 space-y-6">

                    {/* File Summary Box */}
                    <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#F1E0DD] rounded-lg flex items-center justify-center text-[#62414A] shrink-0">
                            <FileDown size={20} />
                        </div>
                        <div className="overflow-hidden">
                            <div className="text-sm font-bold text-[#3E2A2F] truncate">Analysis of Thermodynamic Variance.pdf</div>
                            <div className="text-xs text-gray-500 font-medium mt-0.5">~1.2 MB</div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-[#3E2A2F] uppercase tracking-wider mb-2">Export Settings</h3>

                        {/* Paper Size */}
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-semibold text-[#3E2A2F]">Paper Size</label>
                            <div className="relative">
                                <select
                                    value={paperSize}
                                    onChange={(e) => setPaperSize(e.target.value)}
                                    className="appearance-none bg-white border border-stone-200 text-[#3E2A2F] text-sm font-medium py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#62414A]/30 focus:border-[#62414A]/50 cursor-pointer shadow-sm w-40"
                                >
                                    <option value="A4">A4</option>
                                    <option value="US Letter">US Letter</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Citation Style */}
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-semibold text-[#3E2A2F]">Citation Style</label>
                            <div className="relative">
                                <select
                                    value={citationStyle}
                                    onChange={(e) => setCitationStyle(e.target.value)}
                                    className="appearance-none bg-white border border-stone-200 text-[#3E2A2F] text-sm font-medium py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#62414A]/30 focus:border-[#62414A]/50 cursor-pointer shadow-sm w-40"
                                >
                                    <option value="APA 7th Edition">APA 7th Edition</option>
                                    <option value="IEEE">IEEE</option>
                                    <option value="Nature">Nature</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-px bg-stone-200"></div>

                    {/* Include Options */}
                    <div className="space-y-3">
                        <h3 className="text-[11px] font-bold tracking-wider text-[#3E2A2F]/50 uppercase mb-3">Include Options</h3>

                        <button
                            className="flex items-center gap-3 w-full text-left group focus:outline-none"
                            onClick={() => setIncludeRawData(!includeRawData)}
                        >
                            {includeRawData ? (
                                <CheckSquare className="text-[#62414A] w-5 h-5 shrink-0" />
                            ) : (
                                <Square className="text-gray-400 group-hover:text-gray-500 w-5 h-5 shrink-0" />
                            )}
                            <span className="text-sm font-semibold text-[#3E2A2F]">Include Raw Data Tables</span>
                        </button>

                        <button
                            className="flex items-center gap-3 w-full text-left group focus:outline-none"
                            onClick={() => setIncludeComments(!includeComments)}
                        >
                            {includeComments ? (
                                <CheckSquare className="text-[#62414A] w-5 h-5 shrink-0" />
                            ) : (
                                <Square className="text-gray-400 group-hover:text-gray-500 w-5 h-5 shrink-0" />
                            )}
                            <span className="text-sm font-semibold text-[#3E2A2F]">Include Document Comments</span>
                        </button>

                        <button
                            className="flex items-center gap-3 w-full text-left group focus:outline-none"
                            onClick={() => setAddWatermark(!addWatermark)}
                        >
                            {addWatermark ? (
                                <CheckSquare className="text-[#62414A] w-5 h-5 shrink-0" />
                            ) : (
                                <Square className="text-gray-400 group-hover:text-gray-500 w-5 h-5 shrink-0" />
                            )}
                            <span className="text-sm font-semibold text-[#3E2A2F]">Add 'Draft' Watermark</span>
                        </button>

                    </div>

                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-stone-200 flex items-center justify-between bg-[#F4EBE1]">
                    <button
                        onClick={onClose}
                        className="text-sm font-bold text-gray-500 hover:text-[#3E2A2F] transition-colors focus:outline-none"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="bg-[#62414A] hover:bg-[#53353D] disabled:bg-[#62414A]/70 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#62414A]/50 focus:ring-offset-2 focus:ring-offset-[#F4EBE1] min-w-[120px] flex justify-center"
                    >
                        {isExporting ? "Generating..." : "Export PDF"}
                    </button>
                </div>

            </div>
        </div>
    );
}
