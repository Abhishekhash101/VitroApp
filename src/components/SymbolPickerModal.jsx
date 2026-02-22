import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

const SYMBOLS = [
    'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω',
    'Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π', 'Ρ', 'Σ', 'Τ', 'Υ', 'Φ', 'Χ', 'Ψ', 'Ω',
    '∑', '∏', '∫', '∮', '√', '∛', '∜', '∝', '∞', '∆', '∇', '∂',
    '≈', '≠', '≡', '≤', '≥', '±', '∓', '×', '÷', '·',
    '°', '℃', '℉', '‰', '‱', '∀', '∃', '∄', '∅', '∈', '∉', '⊂', '⊃', '⊆', '⊇', '∪', '∩',
    '←', '↑', '→', '↓', '↔', '↕', '⇐', '⇑', '⇒', '⇓', '⇔', '⇕'
];

export default function SymbolPickerModal({ isOpen, onClose, editor }) {
    const [searchQuery, setSearchQuery] = useState('');

    if (!isOpen) return null;

    const filteredSymbols = SYMBOLS.filter(sym => sym.toLowerCase().includes(searchQuery.toLowerCase()));

    const handleInsert = (symbol) => {
        if (editor) {
            editor.chain().focus().insertContent(symbol).run();
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-[#3E2A2F]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#F4EBE1] rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-[#D8C7B9]">

                {/* Header */}
                <div className="px-6 py-4 flex items-center justify-between border-b border-[#D8C7B9]">
                    <h2 className="text-[#3E2A2F] font-bold text-lg font-serif">Insert Symbol</h2>
                    <button
                        onClick={onClose}
                        className="p-2 bg-white/50 hover:bg-white rounded-full text-[#3E2A2F]/60 hover:text-[#3E2A2F] transition-colors flex items-center justify-center"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Search */}
                <div className="p-6 pb-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3E2A2F]/40" size={18} />
                        <input
                            type="text"
                            placeholder="Search symbols..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-[#D8C7B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B7684C]/40 text-[#3E2A2F] placeholder-[#3E2A2F]/40 font-medium"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Symbols Grid */}
                <div className="p-6 pt-4 h-64 overflow-y-auto w-full">
                    {filteredSymbols.length > 0 ? (
                        <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                            {filteredSymbols.map((sym, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleInsert(sym)}
                                    className="aspect-square flex items-center justify-center bg-white hover:bg-[#B7684C] hover:text-white text-[#3E2A2F] text-lg rounded-lg border border-[#D8C7B9]/50 transition-colors shadow-sm font-serif"
                                >
                                    {sym}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-[#3E2A2F]/40 w-full">
                            <p>No symbols found.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
