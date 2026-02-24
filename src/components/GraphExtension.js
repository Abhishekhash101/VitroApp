import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import GraphBlockNode from './GraphBlockNode';

export default Node.create({
    name: 'graphBlock',
    group: 'block',
    atom: true,
    addAttributes() {
        return {
            chartType: { default: 'line' },
            xAxisKey: { default: '' },
            yAxisKey: { default: '' },
            rowLimit: { default: 100 },
            xAxisLabel: { default: '' },
            yAxisLabel: { default: '' },
            legends: { default: [] },
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
