import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import CitationNode from '../components/CitationNode';

/**
 * Citation
 * --------
 * A block node representing a bibliographic citation. The user can edit the
 * citation text inline.
 */
export const Citation = Node.create({
    name: 'citation',
    group: 'block',
    atom: true,
    addAttributes() {
        return {
            text: { default: '' },
        };
    },
    parseHTML() {
        return [{ tag: 'div[data-citation]' }];
    },
    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-citation': '' })];
    },
    addNodeView() {
        return ReactNodeViewRenderer(CitationNode);
    },
    addCommands() {
        return {
            insertCitation: (text = '') => ({ commands }) => {
                return commands.insertContent({ type: this.name, attrs: { text } });
            },
        };
    },
});
