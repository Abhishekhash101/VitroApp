import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import { FileText } from 'lucide-react';
import React from 'react';

const PdfSmartChipComponent = ({ node }) => {
    const { src, fileName } = node.attrs;

    const handleClick = () => {
        window.dispatchEvent(
            new CustomEvent('open-pdf-preview', {
                detail: { src, fileName }
            })
        );
    };

    return (
        <NodeViewWrapper className="inline-block align-middle mx-1" as="span">
            <span
                onClick={handleClick}
                className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full cursor-pointer hover:bg-red-100 transition-colors select-none font-sans text-sm font-medium shadow-sm"
            >
                <FileText size={14} className="text-red-600 shrink-0" />
                <span className="truncate max-w-[200px]">{fileName}</span>
            </span>
        </NodeViewWrapper>
    );
};

export default Node.create({
    name: 'pdfSmartChip',
    group: 'inline',
    inline: true,
    selectable: true,
    atom: true,

    addAttributes() {
        return {
            src: {
                default: null,
            },
            fileName: {
                default: 'Document.pdf',
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'span[data-type="pdf-smart-chip"]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['span', mergeAttributes(HTMLAttributes, { 'data-type': 'pdf-smart-chip' })];
    },

    addNodeView() {
        return ReactNodeViewRenderer(PdfSmartChipComponent);
    },
});
