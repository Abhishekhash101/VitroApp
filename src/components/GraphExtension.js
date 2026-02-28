import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import GraphBlockNode from './GraphBlockNode';

export default Node.create({
    name: 'graphBlock',
    group: 'block',
    atom: true,
    addAttributes() {
        return {
            data: { default: [] },
            type: { default: 'bar' }, // 'line', 'bar', etc.
            xAxisKey: { default: 'name' },
            seriesKeys: { default: ['value'] }, // Array of keys to plot (for multi-table)
            xLabel: { default: '' }, // New
            yLabel: { default: '' }, // New
        };
    },
    parseHTML() {
        return [{ tag: 'div[data-graph-block]' }];
    },
    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-graph-block': '' })];
    },
    addNodeView() {
        return ReactNodeViewRenderer(GraphBlockNode);
    },
});
