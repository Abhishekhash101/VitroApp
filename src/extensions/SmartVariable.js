import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import SmartVariableNode from '../components/SmartVariableNode';

/**
 * SmartVariable
 * -------------
 * An inline "chip" node bound to a specific cell in a linked table
 * (tableId + rowIndex + columnName). It is read-only text that updates
 * automatically whenever the linked table cell changes.
 */
export const SmartVariable = Node.create({
    name: 'smartVariable',
    group: 'inline',
    inline: true,
    atom: true,
    selectable: true,
    addAttributes() {
        return {
            tableId: { default: null },
            rowIndex: { default: 0 },
            columnName: { default: '' },
            label: { default: '' },
        };
    },
    parseHTML() {
        return [{ tag: 'span[data-smart-variable]' }];
    },
    renderHTML({ HTMLAttributes }) {
        return ['span', mergeAttributes(HTMLAttributes, { 'data-smart-variable': '' })];
    },
    addNodeView() {
        return ReactNodeViewRenderer(SmartVariableNode);
    },
    addCommands() {
        return {
            insertSmartVariable: (attrs) => ({ commands }) => {
                return commands.insertContent({ type: this.name, attrs });
            },
        };
    },
});
