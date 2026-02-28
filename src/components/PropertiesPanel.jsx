import React from 'react';
import {
    FileText, Plus, Bold, Italic, Underline as UnderlineIcon,
    Strikethrough, Subscript as SubscriptIcon, Superscript as SuperscriptIcon,
    AlignLeft, AlignCenter, AlignRight, ImageIcon,
    Trash2, ArrowRightToLine, ArrowLeftToLine, ArrowDownToLine, ArrowUpToLine
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PropertiesPanel({ project, editor, selectionType = 'document', chartData }) {
    const navigate = useNavigate();
    const [stats, setStats] = React.useState({ words: 0, characters: 0 });

    const [localChartType, setLocalChartType] = React.useState('line');
    const [localX, setLocalX] = React.useState('');
    const [localY, setLocalY] = React.useState('');
    const [localRows, setLocalRows] = React.useState(100);
    const [localXLabel, setLocalXLabel] = React.useState('');
    const [localYLabel, setLocalYLabel] = React.useState('');
    const [localLegends, setLocalLegends] = React.useState([]);
    const [tableHeaders, setTableHeaders] = React.useState([]);

    // Dynamically extract headers from the active table when cursor is inside one
    React.useEffect(() => {
        if (!editor) return;
        const updateHeaders = () => {
            const { selection } = editor.state;
            for (let i = selection.$from.depth; i > 0; i--) {
                const node = selection.$from.node(i);
                if (node.type.name === 'table') {
                    const rows = node.content.content;
                    if (rows && rows.length > 0) {
                        const headers = rows[0].content.content
                            .map(cell => cell.textContent.trim())
                            .filter(h => h !== '');
                        setTableHeaders(headers);
                        if (!localX && headers.length > 0) setLocalX(headers[0]);
                        if (!localY && headers.length > 1) setLocalY(headers[1]);
                    }
                    return;
                }
            }
        };
        updateHeaders();
        editor.on('selectionUpdate', updateHeaders);
        return () => editor.off('selectionUpdate', updateHeaders);
    }, [editor]);

    React.useEffect(() => {
        if (chartData && chartData.length > 0) {
            const cols = Object.keys(chartData[0] || {});
            if (!localX && cols.length > 0) setLocalX(cols[0]);
            if (!localY && cols.length > 1) setLocalY(cols[1]);
        }
    }, [chartData, localX, localY]);

    React.useEffect(() => {
        if (selectionType === 'graph' && editor) {
            const attrs = editor.getAttributes('graphBlock');
            if (attrs.chartType) setLocalChartType(attrs.chartType);
            if (attrs.xAxisKey) setLocalX(attrs.xAxisKey);
            if (attrs.yAxisKey) setLocalY(attrs.yAxisKey);
            if (attrs.rowLimit) setLocalRows(attrs.rowLimit);
            if (attrs.xAxisLabel !== undefined) setLocalXLabel(attrs.xAxisLabel);
            if (attrs.yAxisLabel !== undefined) setLocalYLabel(attrs.yAxisLabel);
            if (attrs.legends) setLocalLegends(Array.isArray(attrs.legends) ? attrs.legends : []);
        }
    }, [selectionType, editor]);

    React.useEffect(() => {
        if (!editor) return;

        const updateStats = () => {
            setStats({
                words: editor.storage.characterCount?.words() || 0,
                characters: editor.storage.characterCount?.characters() || 0
            });
        };

        // Initial set
        updateStats();

        // Listen for all typing and changes
        editor.on('update', updateStats);

        return () => {
            editor.off('update', updateStats);
        };
    }, [editor]);

    const handleInsertGraph = () => {
        if (!editor) return;

        // If editing an existing graph, update its attributes in-place
        if (selectionType === 'graph') {
            editor.chain().focus().updateAttributes('graphBlock', {
                type: localChartType,
                xAxisKey: localX,
                seriesKeys: [localY],
                xLabel: localX,
                yLabel: localY
            }).run();
            return;
        }

        // 1. Find the currently active table node using TipTap's resolved position
        const { selection } = editor.state;
        let tableNode = null;
        let tablePos = null;

        for (let i = selection.$from.depth; i > 0; i--) {
            const node = selection.$from.node(i);
            if (node.type.name === 'table') {
                tableNode = node;
                tablePos = selection.$from.after(i);
                break;
            }
        }

        if (!tableNode) {
            return alert("Please place your cursor inside a table to generate a graph.");
        }

        // 2. Extract Data directly from the TipTap JSON Model
        const rows = tableNode.content.content;
        if (!rows || rows.length < 2) {
            return alert("Table needs at least one header row and one data row.");
        }

        // Extract Headers (Row 0)
        const headers = rows[0].content.content.map(cell => cell.textContent.trim());
        const extractedData = [];

        // Extract Values (Row 1+)
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const rowData = {};
            let hasData = false;

            row.content.content.forEach((cell, index) => {
                const header = headers[index] || `col${index}`;
                const val = cell.textContent.trim();
                rowData[header] = (val !== '' && !isNaN(parseFloat(val))) ? parseFloat(val) : val;
                if (val !== '') hasData = true;
            });

            if (hasData) extractedData.push(rowData);
        }

        if (extractedData.length === 0) {
            return alert("No valid data found in the table.");
        }

        // 3. Insert the Graph Block with correct attributes
        editor.chain().focus().insertContentAt(tablePos, {
            type: 'graphBlock',
            attrs: {
                data: extractedData,
                type: localChartType || 'line',
                xAxisKey: localX || headers[0],
                seriesKeys: [localY || headers[1]], // MUST be an array
                xLabel: localX || headers[0],
                yLabel: localY || headers[1]
            }
        }).run();
    };

    return (
        <div className="flex flex-col h-full bg-[#FAF7F5] overflow-hidden whitespace-nowrap">


            <div className="px-6 py-4 flex-1 overflow-y-auto">

                {/* Selection-Based Contextual Panels */}

                {/* --- 1. DOCUMENT LEVEL --- */}
                {selectionType === 'document' && (
                    <div className="mb-8">
                        <h4 className="text-[10px] font-bold text-gray-400 tracking-wider mb-3 uppercase">Metadata</h4>
                        <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3 shadow-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Words</span>
                                <span className="text-xs text-gray-800 font-bold bg-gray-50 px-2 py-1 rounded">
                                    {stats.words}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Characters</span>
                                <span className="text-xs text-gray-800 font-bold bg-gray-50 px-2 py-1 rounded">
                                    {stats.characters}
                                </span>
                            </div>
                            <div className="pt-3 mt-3 border-t border-gray-50 flex justify-between items-center">
                                <span className="text-xs text-gray-500">Author</span>
                                <span className="text-xs text-[#B7684C] font-bold">You</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- 2. TEXT PROPERTIES --- */}
                {selectionType === 'text' && (
                    <div className="mb-8">
                        <h4 className="text-[10px] font-bold text-gray-400 tracking-wider mb-3 uppercase">Typography</h4>
                        <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-4 shadow-sm">

                            {/* Font Family & Size */}
                            <div className="flex gap-2">
                                <select
                                    className="flex-1 text-xs border border-gray-200 rounded-lg p-2 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500/50 cursor-pointer"
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val) {
                                            const formattedVal = val.includes(' ') && !val.startsWith("'") ? `'${val}'` : val;
                                            editor?.chain().focus().setFontFamily(formattedVal).run();
                                        } else {
                                            editor?.chain().focus().unsetFontFamily().run();
                                        }
                                    }}
                                    value={editor?.getAttributes('textStyle').fontFamily || ''}
                                >
                                    <option value="">Inter (Default)</option>
                                    <option value="Arial">Arial</option>
                                    <option value="Times New Roman">Times</option>
                                    <option value="Courier New">Courier</option>
                                </select>
                                <select
                                    className="w-20 text-xs border border-gray-200 rounded-lg p-2 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500/50 cursor-pointer"
                                    onChange={(e) => {
                                        if (e.target.value) editor?.chain().focus().setFontSize(e.target.value).run();
                                        else editor?.chain().focus().unsetFontSize().run();
                                    }}
                                    value={editor?.getAttributes('textStyle').fontSize || ''}
                                >
                                    <option value="">Auto</option>
                                    <option value="12px">12</option>
                                    <option value="14px">14</option>
                                    <option value="16px">16</option>
                                    <option value="20px">20</option>
                                    <option value="24px">24</option>
                                </select>
                            </div>

                            {/* Format Grid Array */}
                            <div className="grid grid-cols-5 gap-1.5 p-1 bg-gray-50 rounded-xl border border-gray-100">
                                <button onClick={() => editor?.chain().focus().toggleBold().run()} className={`flex items-center justify-center py-2 rounded-lg transition-colors ${editor?.isActive('bold') ? 'bg-white shadow-sm text-blue-600 font-bold border border-gray-200/50' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`} title="Bold"><Bold size={14} /></button>
                                <button onClick={() => editor?.chain().focus().toggleItalic().run()} className={`flex items-center justify-center py-2 rounded-lg transition-colors ${editor?.isActive('italic') ? 'bg-white shadow-sm text-blue-600 font-bold border border-gray-200/50' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`} title="Italic"><Italic size={14} /></button>
                                <button onClick={() => editor?.chain().focus().toggleUnderline().run()} className={`flex items-center justify-center py-2 rounded-lg transition-colors ${editor?.isActive('underline') ? 'bg-white shadow-sm text-blue-600 font-bold border border-gray-200/50' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`} title="Underline"><UnderlineIcon size={14} /></button>
                                <button onClick={() => editor?.chain().focus().toggleStrike().run()} className={`flex items-center justify-center py-2 rounded-lg transition-colors ${editor?.isActive('strike') ? 'bg-white shadow-sm text-blue-600 font-bold border border-gray-200/50' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`} title="Strike"><Strikethrough size={14} /></button>

                                <div className="flex items-center justify-center py-1">
                                    <input
                                        type="color"
                                        title="Text Color"
                                        onInput={(e) => editor?.chain().focus().setColor(e.target.value).run()}
                                        value={editor?.getAttributes('textStyle').color || '#000000'}
                                        className="w-6 h-6 p-0 border border-gray-200 rounded-full cursor-pointer bg-transparent overflow-hidden"
                                    />
                                </div>
                            </div>

                            {/* Sub/Super Grid */}
                            <div className="grid grid-cols-2 gap-2">
                                <button onClick={() => editor?.chain().focus().toggleSubscript().run()} className={`flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs transition-colors border ${editor?.isActive('subscript') ? 'bg-blue-50 text-blue-700 border-blue-200 font-medium' : 'bg-gray-50 text-gray-600 border-transparent hover:bg-gray-100'}`}>
                                    <SubscriptIcon size={14} /> Subscript
                                </button>
                                <button onClick={() => editor?.chain().focus().toggleSuperscript().run()} className={`flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs transition-colors border ${editor?.isActive('superscript') ? 'bg-blue-50 text-blue-700 border-blue-200 font-medium' : 'bg-gray-50 text-gray-600 border-transparent hover:bg-gray-100'}`}>
                                    <SuperscriptIcon size={14} /> Superscript
                                </button>
                            </div>

                            {/* Text Alignment */}
                            <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-50 rounded-xl border border-gray-100">
                                <button
                                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                                    className={`flex justify-center items-center py-2 rounded-lg transition-colors ${editor?.isActive({ textAlign: 'left' }) ? 'bg-white shadow-sm text-blue-600 font-bold border border-gray-200/50' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
                                >
                                    <AlignLeft size={16} />
                                </button>
                                <button
                                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                                    className={`flex justify-center items-center py-2 rounded-lg transition-colors ${editor?.isActive({ textAlign: 'center' }) ? 'bg-white shadow-sm text-blue-600 font-bold border border-gray-200/50' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
                                >
                                    <AlignCenter size={16} />
                                </button>
                                <button
                                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                                    className={`flex justify-center items-center py-2 rounded-lg transition-colors ${editor?.isActive({ textAlign: 'right' }) ? 'bg-white shadow-sm text-blue-600 font-bold border border-gray-200/50' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
                                >
                                    <AlignRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- 3. TABLE PROPERTIES AND GRAPH GENERATION --- */}
                {(selectionType === 'table' || selectionType === 'graph') && (
                    <div className="mb-8">
                        {selectionType === 'table' && (
                            <>
                                <h4 className="text-[10px] font-bold text-gray-400 tracking-wider mb-3 uppercase">Table Operations</h4>
                                <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-4 shadow-sm mb-4">
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => editor.chain().focus().addRowBefore().run()}
                                            className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 border border-transparent hover:border-blue-100 transition-colors"
                                        >
                                            <ArrowUpToLine size={18} className="mb-1.5" />
                                            <span className="text-[10px] font-bold">Add Row Above</span>
                                        </button>
                                        <button
                                            onClick={() => editor.chain().focus().addRowAfter().run()}
                                            className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 border border-transparent hover:border-blue-100 transition-colors"
                                        >
                                            <ArrowDownToLine size={18} className="mb-1.5" />
                                            <span className="text-[10px] font-bold">Add Row Below</span>
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => editor.chain().focus().addColumnBefore().run()}
                                            className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50 hover:bg-emerald-50 text-gray-600 hover:text-emerald-600 border border-transparent hover:border-emerald-100 transition-colors"
                                        >
                                            <ArrowLeftToLine size={18} className="mb-1.5" />
                                            <span className="text-[10px] font-bold">Add Col Left</span>
                                        </button>
                                        <button
                                            onClick={() => editor.chain().focus().addColumnAfter().run()}
                                            className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50 hover:bg-emerald-50 text-gray-600 hover:text-emerald-600 border border-transparent hover:border-emerald-100 transition-colors"
                                        >
                                            <ArrowRightToLine size={18} className="mb-1.5" />
                                            <span className="text-[10px] font-bold">Add Col Right</span>
                                        </button>
                                    </div>

                                    <div className="pt-2 border-t border-gray-100 grid grid-cols-3 gap-2">
                                        <button
                                            onClick={() => editor.chain().focus().deleteRow().run()}
                                            className="col-span-1 flex flex-col items-center justify-center py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-colors"
                                        >
                                            <span className="text-[9px]">Del Row</span>
                                        </button>
                                        <button
                                            onClick={() => editor.chain().focus().deleteColumn().run()}
                                            className="col-span-1 flex flex-col items-center justify-center py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-colors"
                                        >
                                            <span className="text-[9px]">Del Col</span>
                                        </button>
                                        <button
                                            onClick={() => editor.chain().focus().deleteTable().run()}
                                            className="col-span-1 flex flex-col items-center justify-center py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
                                        >
                                            <Trash2 size={12} className="mb-0.5" />
                                            <span className="text-[9px]">Table</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        <h4 className="text-[10px] font-bold text-gray-400 tracking-wider mb-3 uppercase">
                            {selectionType === 'graph' ? 'Graph Properties' : 'Generate Graph'}
                        </h4>
                        <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-4 shadow-sm">
                            <div className="flex flex-col">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 px-0.5">Chart Type</label>
                                <select
                                    className="bg-gray-50 border border-gray-200 text-gray-800 text-xs rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                                    value={localChartType}
                                    onChange={e => setLocalChartType(e.target.value)}
                                >
                                    <option value="line">Line Chart</option>
                                    <option value="bar">Clustered Bar</option>
                                    <option value="stacked-bar">Stacked Bar (Centered)</option>
                                    <option value="area">Area Chart</option>
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 px-0.5">X-Axis</label>
                                <select
                                    className="bg-gray-50 border border-gray-200 text-gray-800 text-xs rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                                    value={localX}
                                    onChange={e => setLocalX(e.target.value)}
                                >
                                    {(tableHeaders.length > 0 ? tableHeaders : (chartData && chartData.length > 0 ? Object.keys(chartData[0]) : [])).map(col => <option key={col} value={col}>{col}</option>)}
                                    {tableHeaders.length === 0 && (!chartData || chartData.length === 0) && <option value="">No data</option>}
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 px-0.5">Y-Axis</label>
                                <select
                                    className="bg-gray-50 border border-gray-200 text-gray-800 text-xs rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                                    value={localY}
                                    onChange={e => setLocalY(e.target.value)}
                                >
                                    {(tableHeaders.length > 0 ? tableHeaders : (chartData && chartData.length > 0 ? Object.keys(chartData[0]) : [])).map(col => <option key={col} value={col}>{col}</option>)}
                                    {tableHeaders.length === 0 && (!chartData || chartData.length === 0) && <option value="">No data</option>}
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 px-0.5">Rows</label>
                                <input
                                    type="number"
                                    className="bg-gray-50 border border-gray-200 text-gray-800 text-xs rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                                    value={localRows}
                                    onChange={e => setLocalRows(Math.max(1, Number(e.target.value)))}
                                    min="1"
                                />
                            </div>
                            <button
                                onClick={handleInsertGraph}
                                className="w-full mt-2 py-2.5 bg-[#B7684C] hover:bg-[#9d5840] text-white font-bold text-xs rounded-lg shadow-sm transition-colors"
                            >
                                {selectionType === 'graph' ? 'Update Graph' : 'Insert Graph'}
                            </button>
                        </div>


                    </div>
                )}

                {/* --- 4. IMAGE PROPERTIES --- */}
                {selectionType === 'image' && (
                    <div className="mb-8">
                        <h4 className="text-[10px] font-bold text-gray-400 tracking-wider mb-3 uppercase">Image</h4>
                        <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-5 shadow-sm">

                            {/* Width Slider */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-gray-600">Width</span>
                                    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                                        {parseInt(editor?.getAttributes('image')?.width) || 100}%
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="10"
                                    max="100"
                                    value={parseInt(editor?.getAttributes('image')?.width) || 100}
                                    onChange={(e) => editor?.chain().focus().updateAttributes('image', { width: `${e.target.value}%` }).run()}
                                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                            </div>

                            {/* Alignment Toggles */}
                            <div>
                                <span className="text-xs font-bold text-gray-600 block mb-2">Alignment Mode</span>
                                <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-50 rounded-xl border border-gray-100">
                                    <button
                                        onClick={() => editor?.chain().focus().updateAttributes('image', { style: 'float: left; margin: 1rem 1.5rem 1rem 0; clear: left;' }).run()}
                                        className={`flex flex-col items-center justify-center py-2.5 rounded-lg transition-colors ${editor?.getAttributes('image')?.style?.includes('float: left') ? 'bg-white shadow-sm text-blue-600 border border-gray-200/50' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
                                    >
                                        <AlignLeft size={16} className="mb-1" />
                                        <span className="text-[9px] font-bold">Float Left</span>
                                    </button>
                                    <button
                                        onClick={() => editor?.chain().focus().updateAttributes('image', { style: 'display: block; margin: 1rem auto; clear: both;' }).run()}
                                        className={`flex flex-col items-center justify-center py-2.5 rounded-lg transition-colors ${editor?.getAttributes('image')?.style?.includes('display: block') ? 'bg-white shadow-sm text-blue-600 border border-gray-200/50' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
                                    >
                                        <AlignCenter size={16} className="mb-1" />
                                        <span className="text-[9px] font-bold">Center</span>
                                    </button>
                                    <button
                                        onClick={() => editor?.chain().focus().updateAttributes('image', { style: 'float: right; margin: 1rem 0 1rem 1.5rem; clear: right;' }).run()}
                                        className={`flex flex-col items-center justify-center py-2.5 rounded-lg transition-colors ${editor?.getAttributes('image')?.style?.includes('float: right') ? 'bg-white shadow-sm text-blue-600 border border-gray-200/50' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
                                    >
                                        <AlignRight size={16} className="mb-1" />
                                        <span className="text-[9px] font-bold">Float Right</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
