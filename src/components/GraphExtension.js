import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import GraphBlockNode from './GraphBlockNode';

// Arrays/objects must be JSON encoded in the HTML, otherwise they are
// stringified as "[object Object]" and the graph loses its data on reload.
function parseJson(raw, fallback) {
    if (!raw) return fallback;
    try {
        const parsed = JSON.parse(raw);
        return parsed ?? fallback;
    } catch {
        return fallback;
    }
}

export default Node.create({
    name: 'graphBlock',
    group: 'block',
    atom: true,
    addAttributes() {
        return {
            data: {
                default: [],
                parseHTML: (element) => parseJson(element.getAttribute('data-graph-data'), []),
                renderHTML: (attributes) => ({ 'data-graph-data': JSON.stringify(attributes.data ?? []) }),
            },
            type: {
                default: 'bar', // 'line', 'bar', 'stacked-bar', 'area'
                parseHTML: (element) => element.getAttribute('data-graph-type') || 'bar',
                renderHTML: (attributes) => ({ 'data-graph-type': attributes.type || 'bar' }),
            },
            xAxisKey: {
                default: 'name',
                parseHTML: (element) => element.getAttribute('data-graph-x-axis-key') || 'name',
                renderHTML: (attributes) => ({ 'data-graph-x-axis-key': attributes.xAxisKey || 'name' }),
            },
            seriesKeys: {
                default: ['value'], // Array of keys to plot (for multi-table)
                parseHTML: (element) => parseJson(element.getAttribute('data-graph-series-keys'), []),
                renderHTML: (attributes) => ({
                    'data-graph-series-keys': JSON.stringify(attributes.seriesKeys ?? []),
                }),
            },
            xLabel: {
                default: '',
                parseHTML: (element) => element.getAttribute('data-graph-x-label') || '',
                renderHTML: (attributes) => ({ 'data-graph-x-label': attributes.xLabel || '' }),
            },
            yLabel: {
                default: '',
                parseHTML: (element) => element.getAttribute('data-graph-y-label') || '',
                renderHTML: (attributes) => ({ 'data-graph-y-label': attributes.yLabel || '' }),
            },
            tableId: {
                default: null, // Links this graph to its source table (bidirectional flow)
                parseHTML: (element) =>
                    element.getAttribute('data-graph-table-id') || element.getAttribute('tableid') || null,
                renderHTML: (attributes) =>
                    attributes.tableId ? { 'data-graph-table-id': attributes.tableId } : {},
            },
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
