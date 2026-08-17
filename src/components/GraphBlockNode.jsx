import React, { useState } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { ResponsiveContainer, BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label } from 'recharts';
import { BarChart2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const COLORS = ['#8B5F54', '#E07A5F', '#3D405B', '#81B29A', '#F2CC8F'];

// Find the absolute position of a specific cell inside a table node.
// rowIndex is 0-based over DATA rows (row 0 of the table is the header).
function findCellPos(doc, tableId, rowIndex, colIndex) {
    let result = null;
    doc.descendants((node, pos) => {
        if (node.type.name === 'table' && node.attrs.tableId === tableId) {
            const rows = node.content?.content || [];
            const targetRow = rows[rowIndex + 1]; // skip header row
            if (!targetRow) return false;

            let cursor = pos + 1; // start of table content
            for (let r = 0; r < rowIndex + 1; r++) {
                cursor += rows[r].nodeSize;
            }
            cursor += 1; // move into targetRow's content (past its open delimiter)
            const cells = targetRow.content?.content || [];
            const targetCell = cells[colIndex];
            if (!targetCell) return false;

            for (let c = 0; c < colIndex; c++) {
                cursor += cells[c].nodeSize;
            }
            // cursor now at start of targetCell
            result = { cellPos: cursor, cellNode: targetCell };
            return false;
        }
    });
    return result;
}

// Flow 2 (Graph -> Table): write a new value into the linked table cell.
function updateTableCell(editor, tableId, rowIndex, columnName, newValue) {
    if (!editor || !tableId) return;

    const { state } = editor;
    let colIndex = -1;

    // Resolve the column index from the table's header row.
    state.doc.descendants((node) => {
        if (node.type.name === 'table' && node.attrs.tableId === tableId) {
            const rows = node.content?.content || [];
            const headerRow = rows[0];
            if (headerRow?.content) {
                headerRow.content.forEach((cell, idx) => {
                    const text = cell.content?.[0]?.content?.map(t => t.text).join('') || '';
                    if (text === columnName) colIndex = idx;
                });
            }
            return false;
        }
    });

    if (colIndex < 0) return;

    const found = findCellPos(state.doc, tableId, rowIndex, colIndex);
    if (!found) return;

    const { cellPos, cellNode } = found;
    const from = cellPos + 1;
    const to = cellPos + cellNode.nodeSize - 1;
    const paragraph = state.schema.nodes.paragraph.create(
        null,
        state.schema.text(String(newValue))
    );

    const tr = state.tr.replaceWith(from, to, paragraph);
    editor.view.dispatch(tr);
}

// Extract column headers + rows from a linked table node.
function getTableColumns(editor, tableId) {
    if (!editor || !tableId) return { headers: [], rows: [] };
    let headers = [];
    let rows = [];
    editor.state.doc.descendants((node) => {
        if (node.type.name === 'table' && node.attrs.tableId === tableId) {
            const content = node.content?.content || [];
            if (content.length > 0) {
                const headerRow = content[0];
                if (headerRow?.content) {
                    headerRow.content.forEach(cell => {
                        headers.push(cell.content?.[0]?.content?.map(t => t.text).join('') || '');
                    });
                }
                for (let i = 1; i < content.length; i++) {
                    const row = {};
                    const cells = content[i].content || [];
                    cells.forEach((cell, idx) => {
                        const text = cell.content?.[0]?.content?.map(t => t.text).join('') || '';
                        const num = Number(text);
                        row[headers[idx] || `col${idx}`] = !isNaN(num) && text !== '' ? num : text;
                    });
                    rows.push(row);
                }
            }
            return false;
        }
    });
    return { headers, rows };
}

export default function GraphBlockNode(props) {
    const { data, type, xAxisKey, seriesKeys, xLabel, yLabel, tableId } = props.node.attrs;
    const { isBidirectionalEnabled } = useAppContext();
    const editor = props.editor;
    const [setupX, setSetupX] = useState('');
    const [setupY, setSetupY] = useState('');

    // Setup mode: linked to a table but not yet configured.
    const needsSetup = tableId && (!data || data.length === 0);
    const { headers } = getTableColumns(editor, tableId);

    if (needsSetup) {
        const configure = () => {
            if (!setupX || !setupY) return;
            const { rows } = getTableColumns(editor, tableId);
            const extracted = rows.map(r => ({ [setupX]: r[setupX], [setupY]: r[setupY] }));
            props.updateAttributes({
                data: extracted,
                xAxisKey: setupX,
                seriesKeys: [setupY],
                xLabel: setupX,
                yLabel: setupY,
            });
        };

        return (
            <NodeViewWrapper className="my-8 p-6 bg-white border-2 border-dashed border-[#62414A]/40 rounded-xl shadow-sm" contentEditable={false}>
                <div className="text-center">
                    <div className="text-sm font-bold text-[#3E2A2F] mb-1">Configure Graph</div>
                    <div className="text-xs text-stone-500 mb-4">Select the data columns from the linked table.</div>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <div className="flex flex-col items-start gap-1">
                            <label className="text-xs font-semibold text-[#3E2A2F]">X-Axis Data</label>
                            <select
                                value={setupX}
                                onChange={(e) => setSetupX(e.target.value)}
                                className="bg-white border border-stone-300 text-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#62414A]/30"
                            >
                                <option value="">Select X-Axis</option>
                                {headers.map(h => <option key={h} value={h}>{h}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col items-start gap-1">
                            <label className="text-xs font-semibold text-[#3E2A2F]">Y-Axis Data</label>
                            <select
                                value={setupY}
                                onChange={(e) => setSetupY(e.target.value)}
                                className="bg-white border border-stone-300 text-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#62414A]/30"
                            >
                                <option value="">Select Y-Axis</option>
                                {headers.map(h => <option key={h} value={h}>{h}</option>)}
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={configure}
                        disabled={!setupX || !setupY}
                        className="mt-4 inline-flex items-center gap-2 bg-[#62414A] hover:bg-[#53353D] disabled:bg-[#62414A]/50 text-white text-sm font-bold px-5 py-2 rounded-full shadow-sm transition-colors focus:outline-none"
                    >
                        <BarChart2 className="w-4 h-4" /> Create Graph
                    </button>
                </div>
            </NodeViewWrapper>
        );
    }

    if (!data || data.length === 0) return <NodeViewWrapper>Empty Graph</NodeViewWrapper>;

    // Treat 'stacked-bar' as a standard BarChart container
    const isBar = type === 'bar' || type === 'stacked-bar';
    const ChartComponent = isBar ? BarChart : LineChart;
    const DataComponent = isBar ? Bar : Line;

    const handlePointClick = (pointData) => {
        if (!isBidirectionalEnabled || !tableId || !editor) return;
        const seriesKey = seriesKeys[0];
        if (!seriesKey) return;

        const idx = data.findIndex(
            d => d === pointData || (xAxisKey && d[xAxisKey] === pointData?.[xAxisKey])
        );
        if (idx < 0) return;

        const currentVal = pointData?.[seriesKey];
        const newVal = window.prompt(
            `Enter new value for "${seriesKey}" (${xAxisKey}: ${pointData?.[xAxisKey]}):`,
            currentVal
        );
        if (newVal === null || isNaN(Number(newVal))) return;

        updateTableCell(editor, tableId, idx, seriesKey, Number(newVal));
    };

    return (
        <NodeViewWrapper className="my-8 p-4 bg-white border border-stone-200 rounded-xl shadow-sm" contentEditable={false}>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ChartComponent data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey={xAxisKey} tick={{ fill: '#6B7280' }}>
                            {xLabel && <Label value={xLabel} offset={-15} position="insideBottom" fill="#4B5563" fontWeight="bold" />}
                        </XAxis>
                        <YAxis tick={{ fill: '#6B7280' }}>
                            {yLabel && <Label value={yLabel} angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} fill="#4B5563" fontWeight="bold" />}
                        </YAxis>
                        <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Legend verticalAlign="top" height={36} />
                        {seriesKeys.map((key, index) => (
                            <DataComponent
                                key={key}
                                type="monotone"
                                dataKey={key}
                                stackId={type === 'stacked-bar' ? "a" : undefined}
                                fill={COLORS[index % COLORS.length]}
                                stroke={COLORS[index % COLORS.length]}
                                strokeWidth={3}
                                radius={isBar ? [4, 4, 0, 0] : 0}
                                onClick={handlePointClick}
                                style={{ cursor: isBidirectionalEnabled && tableId ? 'pointer' : 'default' }}
                            />
                        ))}
                    </ChartComponent>
                </ResponsiveContainer>
            </div>
            {isBidirectionalEnabled && tableId && (
                <div className="mt-2 text-[11px] text-stone-400 text-center">
                    Click a data point to edit its value in the source table.
                </div>
            )}
        </NodeViewWrapper>
    );
}
