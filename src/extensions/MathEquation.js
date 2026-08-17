import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import MathEquationNode from '../components/MathEquationNode';

/**
 * MathEquation
 * ------------
 * A block node where the user types LaTeX (e.g. "E=mc^2") and it renders
 * instantly via KaTeX.
 */
export const MathEquation = Node.create({
    name: 'mathEquation',
    group: 'block',
    atom: true,
    addAttributes() {
        return {
            latex: { default: '' },
        };
    },
    parseHTML() {
        return [{ tag: 'div[data-math-equation]' }];
    },
    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-math-equation': '' })];
    },
    addNodeView() {
        return ReactNodeViewRenderer(MathEquationNode);
    },
    addCommands() {
        return {
            insertMathEquation: (latex = '') => ({ commands }) => {
                return commands.insertContent({ type: this.name, attrs: { latex } });
            },
        };
    },
});
