import { Mark, mergeAttributes } from '@tiptap/core';

export const CommentMark = Mark.create({
    name: 'comment',

    addOptions() {
        return {
            HTMLAttributes: {
                class: 'bg-yellow-200/50 border-b-2 border-yellow-400 cursor-pointer',
            },
        };
    },

    addAttributes() {
        return {
            commentId: {
                default: null,
                parseHTML: element => element.getAttribute('data-comment-id'),
                renderHTML: attributes => {
                    if (!attributes.commentId) {
                        return {};
                    }
                    return {
                        'data-comment-id': attributes.commentId,
                    };
                },
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'span[data-comment-id]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
    },

    addCommands() {
        return {
            setComment: (commentId) => ({ commands }) => {
                return commands.setMark(this.name, { commentId });
            },
            unsetComment: (commentId) => ({ tr, dispatch }) => {
                let hasRemoved = false;

                if (dispatch) {
                    const { doc } = tr;
                    doc.descendants((node, pos) => {
                        const marks = node.marks;
                        marks.forEach((mark) => {
                            if (mark.type.name === this.name && mark.attrs.commentId === commentId) {
                                tr.removeMark(pos, pos + node.nodeSize, mark.type);
                                hasRemoved = true;
                            }
                        });
                    });
                }

                return hasRemoved;
            },
        };
    },
});
