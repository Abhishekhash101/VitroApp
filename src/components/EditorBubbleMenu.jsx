import React, { useState } from 'react';
import { BubbleMenu } from '@tiptap/react/menus';
import {
    Bold, Italic, Superscript as SuperscriptIcon, Subscript as SubscriptIcon,
    Link as LinkIcon, MessageSquarePlus, X, Check
} from 'lucide-react';

/**
 * EditorBubbleMenu
 * ----------------
 * Floating toolbar that appears only when text is selected.
 * Buttons: Bold, Italic, Superscript, Subscript, Link, Comment.
 */
export default function EditorBubbleMenu({ editor }) {
    const [linkMode, setLinkMode] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');

    if (!editor) return null;

    const setLink = () => {
        if (!linkUrl.trim()) {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
        } else {
            editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl.trim() }).run();
        }
        setLinkMode(false);
        setLinkUrl('');
    };

    const addComment = () => {
        const comment = window.prompt('Add a comment to the selected text:', '');
        if (comment === null) return;
        const commentId = `c_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        editor.chain().focus().setComment(commentId).run();
    };

    const buttonClass = (active) =>
        `p-1.5 rounded-md transition-colors focus:outline-none ${
            active ? 'bg-[#62414A]/15 text-[#62414A]' : 'text-[#3E2A2F] hover:bg-black/5'
        }`;

    return (
        <BubbleMenu
            editor={editor}
            tippyOptions={{ duration: 100, placement: 'top' }}
            shouldShow={({ editor: e }) => {
                const { selection } = e.state;
                return !selection.empty && e.isActive('paragraph');
            }}
        >
            <div className="flex items-center gap-0.5 bg-white border border-stone-200 rounded-xl shadow-lg px-1.5 py-1">
                {linkMode ? (
                    <>
                        <input
                            autoFocus
                            type="url"
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') setLink(); if (e.key === 'Escape') setLinkMode(false); }}
                            placeholder="https://..."
                            className="w-44 text-sm px-2 py-1 rounded-md border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#62414A]/30"
                        />
                        <button onClick={setLink} className={buttonClass(false)} title="Apply link"><Check className="w-4 h-4" /></button>
                        <button onClick={() => setLinkMode(false)} className={buttonClass(false)} title="Cancel"><X className="w-4 h-4" /></button>
                    </>
                ) : (
                    <>
                        <button onClick={() => editor.chain().focus().toggleBold().run()} className={buttonClass(editor.isActive('bold'))} title="Bold">
                            <Bold className="w-4 h-4" />
                        </button>
                        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={buttonClass(editor.isActive('italic'))} title="Italic">
                            <Italic className="w-4 h-4" />
                        </button>
                        <div className="w-px h-5 bg-stone-200 mx-1" />
                        <button onClick={() => editor.chain().focus().toggleSuperscript().run()} className={buttonClass(editor.isActive('superscript'))} title="Superscript">
                            <SuperscriptIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => editor.chain().focus().toggleSubscript().run()} className={buttonClass(editor.isActive('subscript'))} title="Subscript">
                            <SubscriptIcon className="w-4 h-4" />
                        </button>
                        <div className="w-px h-5 bg-stone-200 mx-1" />
                        <button
                            onClick={() => { setLinkMode(true); setLinkUrl(editor.getAttributes('link').href || ''); }}
                            className={buttonClass(editor.isActive('link'))}
                            title="Link"
                        >
                            <LinkIcon className="w-4 h-4" />
                        </button>
                        <button onClick={addComment} className={buttonClass(editor.isActive('comment'))} title="Comment">
                            <MessageSquarePlus className="w-4 h-4" />
                        </button>
                    </>
                )}
            </div>
        </BubbleMenu>
    );
}
