import React, { useMemo } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { Variable } from 'lucide-react';

/**
 * SmartVariableNode
 * -----------------
 * Renders a read-only chip that shows the current value of a linked table
 * cell. Recomputes on every editor transaction, so it stays in sync with the
 * table automatically.
 */
export default function SmartVariableNode(props) {
    const { tableId, rowIndex, columnName, label } = props.node.attrs;
    const editor = props.editor;

    const value = useMemo(() => {
        if (!editor || !tableId) return '—';
        let result = '—';
        editor.state.doc.descendants((node) => {
            if (node.type.name === 'table' && node.attrs.tableId === tableId) {
                const rows = node.content?.content || [];
                const targetRow = rows[rowIndex + 1]; // skip header
                if (targetRow?.content) {
                    const cells = targetRow.content.content;
                    const headerRow = rows[0];
                    let colIdx = -1;
                    if (headerRow?.content) {
                        headerRow.content.forEach((cell, idx) => {
                            const text = cell.content?.[0]?.content?.map(t => t.text).join('') || '';
                            if (text === columnName) colIdx = idx;
                        });
                    }
                    if (colIdx >= 0 && cells[colIdx]) {
                        result = cells[colIdx].textContent;
                    }
                }
                return false;
            }
        });
        return result;
    }, [editor, tableId, rowIndex, columnName]);

    const displayLabel = label || columnName || 'Variable';

    return (
        <NodeViewWrapper
            as="span"
            contentEditable={false}
            className="inline-flex items-center gap-1 bg-[#F1E0DD] text-[#62414A] border border-[#62414A]/30 rounded-full px-2 py-0.5 text-sm font-semibold align-middle mx-0.5"
            title={`Linked to ${columnName} (row ${rowIndex + 1}) in table`}
        >
            <Variable className="w-3 h-3" />
            <span>{displayLabel}:</span>
            <span className="font-bold">{value}</span>
        </NodeViewWrapper>
    );
}
