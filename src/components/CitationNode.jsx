import React, { useEffect, useRef, useState } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { Quote, Check, X } from 'lucide-react';

/**
 * CitationNode
 * ------------
 * Node view for a citation block. Shows the citation text and lets the user
 * edit it inline.
 */
export default function CitationNode(props) {
    const { text } = props.node.attrs;
    const [editing, setEditing] = useState(!text);
    const [draft, setDraft] = useState(text);
    const inputRef = useRef(null);

    useEffect(() => {
        if (editing && inputRef.current) inputRef.current.focus();
    }, [editing]);

    const commit = () => {
        props.updateAttributes({ text: draft });
        setEditing(false);
    };

    return (
        <NodeViewWrapper className="my-3" contentEditable={false}>
            <div className="group flex items-start gap-2 bg-[#F1E0DD]/40 border-l-4 border-[#62414A] rounded-r-lg px-4 py-3">
                <Quote className="w-4 h-4 text-[#62414A] mt-0.5 shrink-0" />
                {editing ? (
                    <div className="flex-1 flex items-center gap-2">
                        <input
                            ref={inputRef}
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false); }}
                            placeholder="e.g. Smith, J. (2024). Title. Journal, 12(3), 45-67."
                            className="flex-1 text-sm px-3 py-1.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#62414A]/30"
                        />
                        <button onClick={commit} className="text-[#62414A] hover:bg-[#62414A]/10 p-1 rounded transition-colors focus:outline-none"><Check className="w-4 h-4" /></button>
                        <button onClick={() => setEditing(false)} className="text-stone-400 hover:text-[#3E2A2F] p-1 rounded transition-colors focus:outline-none"><X className="w-4 h-4" /></button>
                    </div>
                ) : (
                    <>
                        <span className="text-sm text-[#3E2A2F] flex-1">{text || <span className="italic text-stone-400">Empty citation</span>}</span>
                        <button
                            onClick={() => { setDraft(text); setEditing(true); }}
                            className="text-stone-300 hover:text-[#62414A] p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none"
                            title="Edit citation"
                        >
                            <PencilIcon />
                        </button>
                    </>
                )}
            </div>
        </NodeViewWrapper>
    );
}

function PencilIcon() {
    return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
        </svg>
    );
}
