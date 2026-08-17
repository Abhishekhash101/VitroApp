import { Mark, mergeAttributes } from '@tiptap/core';

/**
 * SemanticError mark
 * ------------------
 * Renders a red wavy underline under the offending text and stores the
 * reviewer's message in a data attribute so a tooltip can read it on hover.
 */
export const SemanticError = Mark.create({
    name: 'semanticError',

    addAttributes() {
        return {
            message: {
                default: null,
                parseHTML: element => element.getAttribute('data-message'),
                renderHTML: attributes => {
                    if (!attributes.message) return {};
                    return { 'data-message': attributes.message };
                },
            },
        };
    },

    parseHTML() {
        return [{ tag: 'span[data-semantic-error]' }];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'span',
            mergeAttributes(HTMLAttributes, {
                class: 'semantic-error',
                'data-semantic-error': '',
            }),
        ];
    },

    addCommands() {
        return {
            setSemanticError: message => ({ commands }) =>
                commands.setMark(this.name, { message }),
            unsetSemanticError: () => ({ commands }) =>
                commands.unsetMark(this.name),
        };
    },
});
