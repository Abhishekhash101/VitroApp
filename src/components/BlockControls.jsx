import React, { useEffect, useRef, useState } from 'react';
import { GripVertical, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

/**
 * BlockControls
 * -------------
 * A "six-dot" handle shown to the left of the current block. Clicking it opens
 * a small menu with Delete Block, Move Up, and Move Down. Replaces complex
 * drag-and-drop.
 */
export default function BlockControls({ editor }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [pos, setPos] = useState({ top: 0 });
    const menuRef = useRef(null);

    useEffect(() => {
        if (!editor) return;
        const update = () => {
            const { selection } = editor.state;
            const { $from } = selection;
            const node = $from.parent;
            if (!node || node.isTextblock === false) return;

            const dom = editor.view.domAtPos($from.before());
            const el = dom.node;
            if (el && el.getBoundingClientRect) {
                const rect = el.getBoundingClientRect();
                const editorRect = editor.view.dom.getBoundingClientRect();
                setPos({ top: rect.top - editorRect.top + rect.height / 2 });
            }
        };
        editor.on('selectionUpdate', update);
        editor.on('transaction', update);
        update();
        return () => {
            editor.off('selectionUpdate', update);
            editor.off('transaction', update);
        };
    }, [editor]);

    useEffect(() => {
        const onClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
        };
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    if (!editor) return null;

    const getBlockPos = () => {
        const { $from } = editor.state.selection;
        return $from.before();
    };

    const deleteBlock = () => {
        const pos = getBlockPos();
        const node = editor.state.doc.nodeAt(pos);
        if (node) {
            editor.chain().focus().deleteRange({ from: pos, to: pos + node.nodeSize }).run();
        }
        setMenuOpen(false);
    };

    const moveUp = () => {
        const pos = getBlockPos();
        const node = editor.state.doc.nodeAt(pos);
        if (!node) return;
        const prev = editor.state.doc.resolve(pos).nodeBefore;
        if (!prev) return;
        const prevPos = pos - prev.nodeSize;
        editor.chain().focus()
            .deleteRange({ from: pos, to: pos + node.nodeSize })
            .insertContentAt(prevPos, node.toJSON())
            .run();
        setMenuOpen(false);
    };

    const moveDown = () => {
        const pos = getBlockPos();
        const node = editor.state.doc.nodeAt(pos);
        if (!node) return;
        const next = editor.state.doc.resolve(pos + node.nodeSize).nodeAfter;
        if (!next) return;
        const nextPos = pos + node.nodeSize;
        editor.chain().focus()
            .deleteRange({ from: pos, to: pos + node.nodeSize })
            .insertContentAt(nextPos, node.toJSON())
            .run();
        setMenuOpen(false);
    };

    return (
        <div
            className="absolute -left-8 top-0 flex items-center"
            style={{ top: pos.top, transform: 'translateY(-50%)' }}
        >
            <button
                onClick={() => setMenuOpen(o => !o)}
                className="text-stone-300 hover:text-[#62414A] p-1 rounded transition-colors focus:outline-none"
                title="Block controls"
            >
                <GripVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
                <div
                    ref={menuRef}
                    className="absolute left-6 top-0 z-50 bg-white border border-stone-200 rounded-xl shadow-lg py-1 w-40"
                >
                    <button
                        onClick={deleteBlock}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors focus:outline-none"
                    >
                        <Trash2 className="w-4 h-4" /> Delete Block
                    </button>
                    <button
                        onClick={moveUp}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#3E2A2F] hover:bg-black/5 transition-colors focus:outline-none"
                    >
                        <ArrowUp className="w-4 h-4" /> Move Up
                    </button>
                    <button
                        onClick={moveDown}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#3E2A2F] hover:bg-black/5 transition-colors focus:outline-none"
                    >
                        <ArrowDown className="w-4 h-4" /> Move Down
                    </button>
                </div>
            )}
        </div>
    );
}
