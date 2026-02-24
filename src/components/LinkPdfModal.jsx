import React from 'react';
import { FileText, X, BookOpen } from 'lucide-react';

export default function LinkPdfModal({ isOpen, onClose, pdfs, onSelect }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-10 bg-[#FDF6F0] rounded-2xl shadow-2xl border border-[#D8C7B9] w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-[#F4EBE1] border-b border-[#D8C7B9]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#B7684C] flex items-center justify-center">
                            <BookOpen size={16} className="text-white" />
                        </div>
                        <h3 className="text-[#3E2A2F] font-bold text-lg">Insert PDF Reference</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-[#3E2A2F]/60 hover:text-[#3E2A2F] transition-colors p-1 hover:bg-[#D8C7B9]/50 rounded-lg"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 max-h-80 overflow-y-auto">
                    {pdfs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <div className="w-14 h-14 rounded-full bg-[#D8C7B9]/40 flex items-center justify-center mb-4">
                                <FileText size={24} className="text-[#3E2A2F]/40" />
                            </div>
                            <p className="text-[#3E2A2F]/60 text-sm font-medium">No references found.</p>
                            <p className="text-[#3E2A2F]/40 text-xs mt-1">Upload a PDF in the sidebar first.</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {pdfs.map((pdf) => (
                                <button
                                    key={pdf.id}
                                    onClick={() => onSelect(pdf)}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#F4EBE1] border border-transparent hover:border-[#D8C7B9]/50 transition-all text-left group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                                        <FileText size={16} className="text-red-500" />
                                    </div>
                                    <span className="text-[#3E2A2F] text-sm font-medium truncate group-hover:text-[#B7684C] transition-colors flex-1">
                                        {pdf.name}
                                    </span>
                                    {pdf.source && (
                                        <span className={`text-[9px] font-bold tracking-wide uppercase px-1.5 py-0.5 rounded-full shrink-0 ${pdf.source === 'Workbench'
                                                ? 'bg-blue-50 text-blue-500 border border-blue-100'
                                                : 'bg-amber-50 text-amber-600 border border-amber-100'
                                            }`}>
                                            {pdf.source === 'Workbench' ? 'Project' : 'Ref'}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-3 bg-[#F4EBE1]/50 border-t border-[#D8C7B9]/50">
                    <p className="text-[#3E2A2F]/40 text-xs text-center">
                        Type <kbd className="px-1.5 py-0.5 bg-[#D8C7B9]/40 rounded text-[10px] font-mono">/link</kbd> in the editor to open this picker
                    </p>
                </div>
            </div>
        </div>
    );
}
