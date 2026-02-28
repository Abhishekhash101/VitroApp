import React, { useState } from 'react';

const CreateTableModal = ({ isOpen, onClose, onSubmit }) => {
    const [tableName, setTableName] = useState('');
    const [rows, setRows] = useState(3);
    const [cols, setCols] = useState(3);

    if (!isOpen) return null;

    const handleSubmit = () => {
        onSubmit({ name: tableName || 'Untitled Table', rows, cols });
        setTableName(''); // Reset
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-[#FDF6F0] rounded-xl shadow-2xl max-w-sm w-full border border-[#E7D5C9] overflow-hidden">
                <div className="px-6 py-4 border-b border-[#E7D5C9] bg-[#FAF3E0]">
                    <h3 className="text-lg font-serif font-semibold text-[#8B5F54]">Create Smart Table</h3>
                </div>
                <div className="px-6 py-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Table Name</label>
                        <input
                            type="text" value={tableName} onChange={(e) => setTableName(e.target.value)}
                            placeholder="e.g., Control Group Data"
                            className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5F54]/50"
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-stone-700 mb-1">Rows</label>
                            <input type="number" min="1" max="20" value={rows} onChange={(e) => setRows(Number(e.target.value))} className="w-full px-3 py-2 border border-stone-300 rounded-md" />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-stone-700 mb-1">Columns</label>
                            <input type="number" min="1" max="20" value={cols} onChange={(e) => setCols(Number(e.target.value))} className="w-full px-3 py-2 border border-stone-300 rounded-md" />
                        </div>
                    </div>
                </div>
                <div className="px-6 py-4 bg-[#F5EBE0]/50 flex justify-end gap-3 border-t border-[#E7D5C9]">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-200/50 rounded-lg">Cancel</button>
                    <button onClick={handleSubmit} className="px-4 py-2 text-sm font-medium text-white bg-[#8B5F54] hover:bg-[#70483C] rounded-lg">Insert Table</button>
                </div>
            </div>
        </div>
    );
};

export default CreateTableModal;
