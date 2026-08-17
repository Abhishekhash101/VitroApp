import React, { useEffect, useRef, useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Sigma } from 'lucide-react';

/**
 * TableTools
 * ----------
 * Adds a right-click context menu (Add Row/Column, Delete Row/Column) and a
 * calculation bar (Avg/Sum/Min/Max) for the current column when the cursor is
 * inside a TipTap table.
 */
export default function TableTools({ editor }) {
    const [menu, setMenu] = useState(null); // { x, y }
    const [stats, setStats] = useState(null); // { column, avg, sum, min, max, count }
    const menuRef = useRef(null);

    // Compute column stats for the current table cell.
    useEffect(() => {
        if (!editor) return;
        const update = () => {
            const { selection } = editor.state;
            const { $from } = selection;
            const node = $from.parent;
            if (node.type.name !== 'tableCell' && node.type.name !== 'tableHeader') {
                setStats(null);
                return;
            }

            // Find the table node containing the cursor and the column index.
            let colIndex = -1;
            let columnName = '';
            let values = [];

            editor.state.doc.descendants((tbl, tblPos) => {
                if (tbl.type.name !== 'table') return;
                const rows = tbl.content?.content || [];
                if (rows.length === 0) return;

                // Determine which cell contains the cursor by walking positions.
                let cursor = tblPos + 1;
                let foundCol = -1;
                for (let ri = 0; ri < rows.length; ri++) {
                    const row = rows[ri];
                    const cells = row.content?.content || [];
                    for (let ci = 0; ci < cells.length; ci++) {
                        const cell = cells[ci];
                        const cellStart = cursor + 1;
                        const cellEnd = cursor + cell.nodeSize;
                        if ($from.pos >= cellStart && $from.pos <= cellEnd) {
                            foundCol = ci;
                            break;
                        }
                        cursor += cell.nodeSize;
                    }
                    if (foundCol >= 0) break;
                }

                if (foundCol < 0) return;

                // Header name for the column.
                const headerRow = rows[0];
                if (headerRow?.content?.[foundCol]) {
                    columnName = headerRow.content[foundCol].textContent;
                }

                // Collect numeric values in this column across data rows.
                for (let ri = 1; ri < rows.length; ri++) {
                    const cell = rows[ri].content?.content?.[foundCol];
                    if (!cell) continue;
                    const num = Number(cell.textContent);
                    if (!isNaN(num) && cell.textContent.trim() !== '') values.push(num);
                }

                colIndex = foundCol;
                return false;
            });

            if (colIndex < 0 || values.length === 0) {
                setStats(null);
                return;
            }

            const sum = values.reduce((a, b) => a + b, 0);
            setStats({
                column: columnName || `Column ${colIndex + 1}`,
                avg: sum / values.length,
                sum,
                min: Math.min(...values),
                max: Math.max(...values),
                count: values.length,
            });
        };
        editor.on('selectionUpdate', update);
        editor.on('transaction', update);
        update();
        return () => {
            editor.off('selectionUpdate', update);
            editor.off('transaction', update);
        };
    }, [editor]);

    // Right-click context menu on tables.
    useEffect(() => {
        if (!editor) return;
        const onContextMenu = (e) => {
            const target = e.target.closest('table');
            if (!target) return;
            e.preventDefault();
            setMenu({ x: e.clientX, y: e.clientY });
        };
        const dom = editor.view.dom;
        dom.addEventListener('contextmenu', onContextMenu);
        return () => dom.removeEventListener('contextmenu', onContextMenu);
    }, [editor]);

    useEffect(() => {
        const onClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenu(null);
        };
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    if (!editor) return null;

    const run = (fn) => {
        editor.chain().focus()[fn]().run();
        setMenu(null);
    };

    const menuItems = [
        { label: 'Add Row Above', icon: <ArrowUp className="w-4 h-4" />, action: () => run('addRowBefore') },
        { label: 'Add Row Below', icon: <ArrowDown className="w-4 h-4" />, action: () => run('addRowAfter') },
        { label: 'Add Column Left', icon: <ArrowLeft className="w-4 h-4" />, action: () => run('addColumnBefore') },
        { label: 'Add Column Right', icon: <ArrowRight className="w-4 h-4" />, action: () => run('addColumnAfter') },
        { label: 'Delete Row', icon: <Trash2 className="w-4 h-4" />, action: () => run('deleteRow') },
        { label: 'Delete Column', icon: <Trash2 className="w-4 h-4" />, action: () => run('deleteColumn') },
    ];

    return (
        <>
            {menu && (
                <div
                    ref={menuRef}
                    className="fixed z-[9999] bg-white border border-stone-200 rounded-xl shadow-lg py-1 w-48"
                    style={{ left: menu.x, top: menu.y }}
                >
                    <div className="px-3 py-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider">Table Actions</div>
                    {menuItems.map(item => (
                        <button
                            key={item.label}
                            onClick={item.action}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#3E2A2F] hover:bg-black/5 transition-colors focus:outline-none"
                        >
                            {item.icon} {item.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Calculation bar */}
            {stats && (
                <div className="flex items-center gap-4 bg-[#FBF7F2] border border-stone-200 rounded-lg px-4 py-2 mt-2 text-xs font-semibold text-[#3E2A2F]">
                    <span className="inline-flex items-center gap-1 text-[#62414A]">
                        <Sigma className="w-3.5 h-3.5" /> {stats.column}
                    </span>
                    <span>Avg: <span className="font-bold">{stats.avg.toFixed(2)}</span></span>
                    <span>Sum: <span className="font-bold">{stats.sum.toFixed(2)}</span></span>
                    <span>Min: <span className="font-bold">{stats.min}</span></span>
                    <span>Max: <span className="font-bold">{stats.max}</span></span>
                    <span>N: <span className="font-bold">{stats.count}</span></span>
                </div>
            )}
        </>
    );
}
