import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';

const CompareTablesModal = ({ isOpen, onClose, editor, onCompare }) => {
    const [availableTables, setAvailableTables] = useState([]);
    const [selectedTableIds, setSelectedTableIds] = useState(['', '']);
    const [chartType, setChartType] = useState('bar');
    const [xLabel, setXLabel] = useState('');
    const [yLabel, setYLabel] = useState('');

    // 1. ROBUST TABLE DETECTION: Traverse TipTap JSON State
    useEffect(() => {
        if (isOpen && editor) {
            const tables = [];
            editor.state.doc.descendants((node, pos) => {
                if (node.type.name === 'table') {
                    tables.push({
                        id: node.attrs.tableId,
                        name: node.attrs.tableName || 'Unnamed Table',
                        node: node // Store the rich JSON node for extraction later
                    });
                }
            });
            // Ensure we only list tables that have valid IDs
            setAvailableTables(tables.filter(t => t.id));
        }
    }, [isOpen, editor]);

    if (!isOpen) return null;

    const addTableInput = () => setSelectedTableIds([...selectedTableIds, '']);
    const removeTableInput = (index) => setSelectedTableIds(selectedTableIds.filter((_, i) => i !== index));
    const updateSelection = (index, val) => {
        const newSel = [...selectedTableIds];
        newSel[index] = val;
        setSelectedTableIds(newSel);
    };

    // 2. ROBUST DATA MERGING: Extract from JSON Node
    const handleCompare = () => {
        const validIds = selectedTableIds.filter(id => id !== '');
        if (validIds.length < 2) return alert("Select at least 2 tables to compare.");

        const mergedDataMap = {};
        const seriesKeys = [];

        validIds.forEach((id, index) => {
            const tableMeta = availableTables.find(t => t.id === id);
            if (!tableMeta) return;

            // Safeguard: Ensure unique series keys if tables share the same name
            let seriesName = tableMeta.name;
            if (seriesKeys.includes(seriesName)) {
                seriesName = `${seriesName} (${index + 1})`;
            }
            seriesKeys.push(seriesName);

            // Parse from TipTap JSON directly
            const rows = tableMeta.node.content.content;
            if (!rows || rows.length < 2) return;

            // Skip header (row 0), extract data (row 1+)
            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];
                const cells = row.content.content;

                // Assuming Col 0 is X-Axis (Label) and Col 1 is Y-Axis (Number)
                if (cells && cells.length >= 2) {
                    const xValue = cells[0].textContent.trim();
                    const yValue = parseFloat(cells[1].textContent.trim());

                    if (xValue !== '' && !isNaN(yValue)) {
                        // Initialize the row in the map if it doesn't exist
                        if (!mergedDataMap[xValue]) {
                            mergedDataMap[xValue] = { name: xValue }; // 'name' maps to xAxisKey
                        }
                        // Add this table's data to the row
                        mergedDataMap[xValue][seriesName] = yValue;
                    }
                }
            }
        });

        const finalData = Object.values(mergedDataMap);

        if (finalData.length === 0) {
            return alert("No valid numerical data could be merged from these tables.");
        }

        // Send clean data array to GraphBlockNode
        onCompare({ data: finalData, type: chartType, seriesKeys, xLabel, yLabel });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-[#FDF6F0] rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-[#E7D5C9]">
                <div className="px-6 py-4 border-b border-[#E7D5C9] bg-[#FAF3E0]">
                    <h3 className="text-lg font-serif font-semibold text-[#8B5F54]">⚖️ Compare Datasets</h3>
                </div>
                <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                    {selectedTableIds.map((val, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <select value={val} onChange={(e) => updateSelection(idx, e.target.value)} className="flex-1 px-3 py-2 border border-stone-300 rounded-md bg-white">
                                <option value="">-- Select Table --</option>
                                {availableTables.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                            {selectedTableIds.length > 2 && (
                                <button onClick={() => removeTableInput(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"><Trash2 size={18} /></button>
                            )}
                        </div>
                    ))}
                    <button onClick={addTableInput} className="text-sm font-medium text-[#8B5F54] flex items-center gap-1 hover:underline"><Plus size={16} /> Add another table</button>

                    <div className="border-t border-[#E7D5C9] pt-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-stone-500 mb-1">CHART TYPE</label>
                            <select value={chartType} onChange={e => setChartType(e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-md bg-white">
                                <option value="bar">Clustered Bar</option>
                                <option value="line">Line Chart</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-stone-500 mb-1">X-AXIS LABEL</label>
                            <input type="text" placeholder="e.g., Student Name" value={xLabel} onChange={e => setXLabel(e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-md bg-white" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-stone-500 mb-1">Y-AXIS LABEL</label>
                            <input type="text" placeholder="e.g., Marks" value={yLabel} onChange={e => setYLabel(e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-md bg-white" />
                        </div>
                    </div>
                </div>
                <div className="px-6 py-4 bg-[#F5EBE0]/50 flex justify-end gap-3 border-t border-[#E7D5C9]">
                    <button onClick={() => { setSelectedTableIds(['', '']); setXLabel(''); setYLabel(''); }} className="px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-200/50 rounded-lg transition-colors">Reset</button>
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-200/50 rounded-lg transition-colors">Cancel</button>
                    <button onClick={handleCompare} className="px-4 py-2 text-sm font-medium text-white bg-[#8B5F54] hover:bg-[#70483C] rounded-lg shadow-sm transition-colors">Generate Comparison</button>
                </div>
            </div>
        </div>
    );
};
export default CompareTablesModal;
