import React, { useEffect, useRef, useState } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { Pencil, Check, X } from 'lucide-react';

/**
 * MathEquationNode
 * ----------------
 * Node view for the Math Equation block. Shows a rendered KaTeX formula, and
 * lets the user edit the LaTeX source inline.
 */
export default function MathEquationNode(props) {
    const { latex } = props.node.attrs;
    const [editing, setEditing] = useState(!latex);
    const [draft, setDraft] = useState(latex);
    const [error, setError] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (editing && inputRef.current) inputRef.current.focus();
    }, [editing]);

    const renderLatex = (src) => {
        try {
            return katex.renderToString(src, { throwOnError: true, displayMode: true });
        } catch {
            return null;
        }
    };

    const commit = () => {
        if (renderLatex(draft) === null) {
            setError('Invalid LaTeX');
            return;
        }
        props.updateAttributes({ latex: draft });
        setEditing(false);
        setError('');
    };

    const cancel = () => {
        setDraft(latex);
        setEditing(false);
        setError('');
    };

    const html = renderLatex(latex);

    return (
        <NodeViewWrapper className="my-4 flex items-center justify-center" contentEditable={false}>
            <div className="relative group bg-[#FBF7F2] border border-stone-200 rounded-xl px-6 py-4 min-w-[200px] text-center">
                {editing ? (
                    <div className="flex flex-col items-center gap-2">
                        <input
                            ref={inputRef}
                            value={draft}
                            onChange={(e) => { setDraft(e.target.value); setError(''); }}
                            onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') cancel(); }}
                            placeholder="Type LaTeX, e.g. E=mc^2"
                            className="w-full text-center text-sm font-mono px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#62414A]/30"
                        />
                        {error && <span className="text-xs text-red-600 font-semibold">{error}</span>}
                        <div className="flex gap-2">
                            <button onClick={commit} className="inline-flex items-center gap-1 text-xs font-bold text-white bg-[#62414A] hover:bg-[#53353D] px-3 py-1.5 rounded-lg transition-colors focus:outline-none">
                                <Check className="w-3.5 h-3.5" /> Done
                            </button>
                            <button onClick={cancel} className="inline-flex items-center gap-1 text-xs font-bold text-stone-500 hover:text-[#3E2A2F] px-3 py-1.5 rounded-lg transition-colors focus:outline-none">
                                <X className="w-3.5 h-3.5" /> Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {html ? (
                            <div dangerouslySetInnerHTML={{ __html: html }} />
                        ) : (
                            <span className="text-stone-400 italic">Empty equation</span>
                        )}
                        <button
                            onClick={() => { setDraft(latex); setEditing(true); }}
                            className="absolute top-2 right-2 text-stone-300 hover:text-[#62414A] p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none"
                            title="Edit equation"
                        >
                            <Pencil className="w-4 h-4" />
                        </button>
                    </>
                )}
            </div>
        </NodeViewWrapper>
    );
}
