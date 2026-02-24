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

        if (selectionType === 'graph') {
            editor.chain().focus().updateAttributes('graphBlock', { chartType: localChartType, xAxisKey: localX, yAxisKey: localY, rowLimit: localRows, xAxisLabel: localXLabel, yAxisLabel: localYLabel, legends: localLegends }).run();
            return;
        }

        let insertPos = editor.state.selection.to; // Default to current cursor position

        // If the user's cursor is currently inside a table, we must escape it
        if (editor.isActive('table')) {
            const { $from } = editor.state.selection;
            // Walk up the document tree to find the boundaries of the parent table
            for (let d = $from.depth; d > 0; d--) {
                const node = $from.node(d);
                if (node.type.name === 'table') {
                    // Set the insertion point to immediately AFTER the table node
                    insertPos = $from.after(d);
                    break;
                }
            }
        }

        // Insert the graph exactly at the calculated safe position
        editor.chain().focus().insertContentAt(insertPos, {
            type: 'graphBlock',
            attrs: {
                chartType: localChartType,
                xAxisKey: localX,
                yAxisKey: localY,
                rowLimit: localRows,
                xAxisLabel: localXLabel,
                yAxisLabel: localYLabel,
                legends: localLegends
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
                                    <option value="scatter">Scatter Plot</option>
                                    <option value="bar">Bar Chart</option>
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
                                    {chartData && chartData.length > 0 ? Object.keys(chartData[0]).map(col => <option key={col} value={col}>{col}</option>) : <option value="">No data</option>}
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 px-0.5">Y-Axis</label>
                                <select
                                    className="bg-gray-50 border border-gray-200 text-gray-800 text-xs rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                                    value={localY}
                                    onChange={e => setLocalY(e.target.value)}
                                >
                                    {chartData && chartData.length > 0 ? Object.keys(chartData[0]).map(col => <option key={col} value={col}>{col}</option>) : <option value="">No data</option>}
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

                        {/* ── ANALYSIS DATA INSPECTOR (only for selected graphs) ── */}
                        {selectionType === 'graph' && (
                            <div className="mt-4">
                                <h4 className="text-[10px] font-bold text-gray-400 tracking-wider mb-3 uppercase">📊 Analysis Data</h4>
                                <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-4 shadow-sm">

                                    {/* X-Axis Label */}
                                    <div className="flex flex-col">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 px-0.5">X-Axis Label</label>
                                        <input
                                            type="text"
                                            className="bg-gray-50 border border-gray-200 text-gray-800 text-xs rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#B7684C]/50"
                                            value={localXLabel}
                                            onChange={e => {
                                                setLocalXLabel(e.target.value);
                                                editor?.chain().focus().updateAttributes('graphBlock', { xAxisLabel: e.target.value }).run();
                                            }}
                                            placeholder="e.g. Wavelength (nm)"
                                        />
                                    </div>

                                    {/* Y-Axis Label */}
                                    <div className="flex flex-col">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 px-0.5">Y-Axis Label</label>
                                        <input
                                            type="text"
                                            className="bg-gray-50 border border-gray-200 text-gray-800 text-xs rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#B7684C]/50"
                                            value={localYLabel}
                                            onChange={e => {
                                                setLocalYLabel(e.target.value);
                                                editor?.chain().focus().updateAttributes('graphBlock', { yAxisLabel: e.target.value }).run();
                                            }}
                                            placeholder="e.g. Intensity (arb. units)"
                                        />
                                    </div>

                                    {/* Legend Names */}
                                    {localLegends.length > 0 && (
                                        <div className="flex flex-col">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 px-0.5">Legend Names</label>
                                            <div className="space-y-2">
                                                {localLegends.map((legend, i) => (
                                                    <input
                                                        key={i}
                                                        type="text"
                                                        className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-xs rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#B7684C]/50"
                                                        value={legend}
                                                        onChange={e => {
                                                            const updated = [...localLegends];
                                                            updated[i] = e.target.value;
                                                            setLocalLegends(updated);
                                                            editor?.chain().focus().updateAttributes('graphBlock', { legends: updated }).run();
                                                        }}
                                                        placeholder={`Legend ${i + 1}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Open Data Table */}
                                    <button
                                        onClick={() => alert('Opening Data View...')}
                                        className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-xs rounded-lg border border-gray-200 transition-colors"
                                    >
                                        Open Data Table
                                    </button>
                                </div>
                            </div>
                        )}
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
