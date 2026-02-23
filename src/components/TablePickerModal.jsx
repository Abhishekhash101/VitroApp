import React, { useState, useEffect } from 'react';
import { X, Table2 } from 'lucide-react';
import { useEditor } from '@tiptap/react';

export default function TablePickerModal({ editor }) {
    const [isOpen, setIsOpen] = useState(false);
    const [rows, setRows] = useState(3);
    const [cols, setCols] = useState(3);
    const [error, setError] = useState('');

    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        window.addEventListener('open-table-picker', handleOpen);
        return () => window.removeEventListener('open-table-picker', handleOpen);
    }, []);

    if (!isOpen) return null;

    const handleCreate = (e) => {
        e.preventDefault();

        const r = parseInt(rows);
        const c = parseInt(cols);

        if (isNaN(r) || isNaN(c) || r <= 0 || c <= 0) {
            setError("Please enter valid row and column numbers.");
            return;
        }

        setError('');

        if (editor) {
            editor.chain().focus().insertTable({ rows: r, cols: c, withHeaderRow: true }).run();
        }

        handleClose();
    };

    const handleClose = () => {
        setIsOpen(false);
        setRows(3);
        setCols(3);
        setError('');
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={handleClose}
        >
            <div
                className="bg-white rounded-2xl shadow-xl max-w-sm w-full flex flex-col pointer-events-auto overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
                    <div className="flex items-center gap-2.5">
                        <Table2 className="text-[#62414A] w-5 h-5" />
                        <h2 className="text-gray-900 font-bold text-lg tracking-tight">Insert Table</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-50 p-1.5 rounded-full transition-colors focus:outline-none"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body Content */}
                <form onSubmit={handleCreate} className="px-6 py-6 space-y-6">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Rows</label>
                            <input
                                type="number"
                                min="1"
                                max="100"
                                value={rows}
                                onChange={(e) => setRows(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-gray-200 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#62414A]/30 focus:border-[#62414A]/50 transition-all font-medium text-center"
                                autoFocus
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Columns</label>
                            <input
                                type="number"
                                min="1"
                                max="20"
                                value={cols}
                                onChange={(e) => setCols(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-gray-200 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#62414A]/30 focus:border-[#62414A]/50 transition-all font-medium text-center"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm font-medium bg-red-50 px-3 py-2 rounded-lg break-words">
                            {error}
                        </div>
                    )}

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors focus:outline-none"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-[#62414A] hover:bg-[#53353D] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#62414A]/50 focus:ring-offset-2"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
