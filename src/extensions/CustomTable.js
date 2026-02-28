import { Table } from '@tiptap/extension-table';
import { mergeAttributes } from '@tiptap/core';

export const CustomTable = Table.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            tableName: {
                default: 'Untitled Table',
                parseHTML: element => element.getAttribute('data-table-name'),
                renderHTML: attributes => ({
                    'data-table-name': attributes.tableName,
                }),
            },
            tableId: {
                default: null,
                parseHTML: element => element.getAttribute('data-table-id'),
                renderHTML: attributes => ({
                    'data-table-id': attributes.tableId,
                }),
            },
        };
    },

    renderHTML({ node, HTMLAttributes }) {
        // Merge the custom data attributes with whatever TipTap's Table provides
        const attrs = mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
            'data-table-name': node.attrs.tableName,
            'data-table-id': node.attrs.tableId,
        });

        return [
            'table',
            attrs,
            ['tbody', 0],
        ];
    },
});
