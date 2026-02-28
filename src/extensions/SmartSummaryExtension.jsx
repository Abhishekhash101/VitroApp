import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import React, { useState, useEffect } from 'react';

const SmartSummaryComponent = ({ editor, node }) => {
    const { tableId, tableName, columnName } = node.attrs;
    const [stats, setStats] = useState(null);

    const calculateStats = (numbers) => {
        if (!numbers || numbers.length === 0) return null;
        const count = numbers.length;
        const sum = numbers.reduce((a, b) => a + b, 0);
        const avg = sum / count;
        const min = Math.min(...numbers);
        const max = Math.max(...numbers);
        const variance = numbers.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / (count > 1 ? count - 1 : 1);
        const stdDev = Math.sqrt(variance);
        const sorted = [...numbers].sort((a, b) => a - b);
        const mid = Math.floor(count / 2);
        const median = count % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

        const freq = {};
        let maxFreq = 0; let mode = sorted[0];
        for (const num of sorted) {
            freq[num] = (freq[num] || 0) + 1;
            if (freq[num] > maxFreq) { maxFreq = freq[num]; mode = num; }
        }

        return { count, sum: sum.toFixed(2), mean: avg.toFixed(2), median: median.toFixed(2), mode: mode.toString(), min: min.toFixed(2), max: max.toFixed(2), stdDev: stdDev.toFixed(2) };
    };

    useEffect(() => {
        const updateData = () => {
            let targetTable = null;
            editor.state.doc.descendants((n) => {
                if (n.type.name === 'table' && n.attrs.tableId === tableId) {
                    targetTable = n;
                }
            });

            if (!targetTable) return setStats(null);

            const rows = targetTable.content.content;
            if (rows.length < 2) return setStats(null);

            const headers = rows[0].content.content.map(c => c.textContent.trim());
            const colIndex = headers.indexOf(columnName);
            if (colIndex === -1) return setStats(null);

            const numbers = [];
            for (let i = 1; i < rows.length; i++) {
                const cellText = rows[i].content.content[colIndex]?.textContent.trim();
                const val = parseFloat(cellText);
                if (!isNaN(val)) numbers.push(val);
            }
            setStats(calculateStats(numbers));
        };

        updateData();
        editor.on('update', updateData);
        return () => editor.off('update', updateData);
    }, [editor, tableId, columnName]);

    return (
        <NodeViewWrapper className="my-6 p-4 bg-[#FDF6F0] border-l-4 border-[#8B5F54] rounded-r-lg shadow-sm" contentEditable={false}>
            <div className="flex items-center gap-2 mb-2">
                <span className="text-[#8B5F54]">📊</span>
                <h4 className="text-sm font-bold text-stone-800 font-serif">
                    Live Summary: <span className="text-[#8B5F54]">{columnName}</span> <span className="text-stone-500 text-xs font-normal font-sans">(from {tableName})</span>
                </h4>
            </div>
            {stats ? (
                <p className="text-sm text-stone-600 leading-relaxed font-mono bg-white p-3 rounded border border-[#E7D5C9]">
                    <span className="font-bold text-stone-800">Mean:</span> {stats.mean} | <span className="font-bold text-stone-800">Median:</span> {stats.median} | <span className="font-bold text-stone-800">Mode:</span> {stats.mode} <br />
                    <span className="font-bold text-stone-800">Min:</span> {stats.min} | <span className="font-bold text-stone-800">Max:</span> {stats.max} | <span className="font-bold text-stone-800">Std Dev:</span> {stats.stdDev} <span className="text-stone-400 ml-2">(n={stats.count})</span>
                </p>
            ) : (
                <p className="text-sm text-stone-400 italic">Awaiting valid numeric data...</p>
            )}
        </NodeViewWrapper>
    );
};

export default Node.create({
    name: 'smartSummary',
    group: 'block',
    atom: true,
    addAttributes() {
        return {
            tableId: { default: null },
            tableName: { default: 'Table' },
            columnName: { default: '' },
        };
    },
    parseHTML() { return [{ tag: 'smart-summary' }]; },
    renderHTML({ HTMLAttributes }) { return ['smart-summary', mergeAttributes(HTMLAttributes)]; },
    addNodeView() { return ReactNodeViewRenderer(SmartSummaryComponent); },
});
