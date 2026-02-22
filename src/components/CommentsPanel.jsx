import React, { useState } from 'react';
import { Edit2, Trash2, CheckCircle, Clock } from 'lucide-react';

export default function CommentsPanel({ comments, setComments, editor, user }) {
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editValue, setEditValue] = useState('');

    const activeComments = comments.filter(c => !c.resolved);
    const archivedComments = comments.filter(c => c.resolved);

    const handleEditStart = (comment) => {
        setEditingCommentId(comment.id);
        setEditValue(comment.text);
    };

    const handleEditSave = (id) => {
        setComments(prev => prev.map(c => c.id === id ? { ...c, text: editValue } : c));
        setEditingCommentId(null);
        setEditValue('');
    };

    const handleDelete = (id) => {
        setComments(prev => prev.filter(c => c.id !== id));
        // No longer need to unset TipTap marks since these are just absolute positioned divs
    };

    const handleResolve = (id) => {
        setComments(prev => prev.map(c => c.id === id ? { ...c, resolved: true } : c));
        // No longer need to unset TipTap marks since these are just absolute positioned divs
    };

    return (
        <div className="flex flex-col h-full bg-[#E5D7CC]/30 font-sans">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeComments.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-60">
                        <div className="w-16 h-16 mb-4 rounded-full bg-[#B7684C]/10 flex items-center justify-center text-[#B7684C] mx-auto">
                            <CheckCircle size={32} />
                        </div>
                        <h3 className="text-[#3E2A2F] font-bold text-lg font-serif">All caught up!</h3>
                        <p className="text-[#3E2A2F]/60 text-sm mt-2">Click the "Comment" button in the top right to drop a spatial pin anywhere on the canvas.</p>
                    </div>
                ) : (
                    activeComments.map(comment => (
                        <div key={comment.id} className="bg-white rounded-xl shadow-sm border border-[#D8C7B9] p-4 flex flex-col">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <img src={comment.author?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author?.name || 'User')}&background=random`} alt={comment.author?.name} className="w-6 h-6 rounded-full" />
                                    <span className="text-sm font-bold text-[#3E2A2F]">{comment.author?.name || 'Unknown'}</span>
                                    <span className="text-[11px] font-medium text-gray-400 flex items-center gap-1">
                                        <Clock size={10} /> {comment.createdAt}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    {comment.author?.name === user?.name && (
                                        <>
                                            <button onClick={() => handleEditStart(comment)} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                                                <Edit2 size={14} />
                                            </button>
                                            <button onClick={() => handleDelete(comment.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                                <Trash2 size={14} />
                                            </button>
                                        </>
                                    )}
                                    <button onClick={() => handleResolve(comment.id)} className="p-1.5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors ml-1" title="Mark as Done">
                                        <CheckCircle size={14} />
                                    </button>
                                </div>
                            </div>

                            {editingCommentId === comment.id ? (
                                <div className="mt-2">
                                    <textarea
                                        className="w-full text-sm p-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none min-h-[60px]"
                                        value={editValue}
                                        onChange={e => setEditValue(e.target.value)}
                                        autoFocus
                                    />
                                    <div className="flex justify-end gap-2 mt-2">
                                        <button onClick={() => setEditingCommentId(null)} className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
                                        <button onClick={() => handleEditSave(comment.id)} className="px-3 py-1.5 text-xs font-bold bg-[#B7684C] text-white rounded-lg hover:bg-[#A45C49]">Save</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-sm text-[#3E2A2F] leading-relaxed whitespace-pre-wrap">{comment.text}</div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {archivedComments.length > 0 && (
                <div className="p-4 border-t border-[#D8C7B9] bg-white mt-auto">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Resolved ({archivedComments.length})</div>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                        {archivedComments.map(comment => (
                            <div key={comment.id} className="text-xs text-gray-500 bg-gray-50 p-2 rounded flex items-center justify-between border border-gray-100 opacity-60">
                                <span className="truncate flex-1">{comment.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
