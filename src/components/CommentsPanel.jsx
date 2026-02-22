import React, { useState } from 'react';
import { Edit2, Trash2, CheckCircle, Clock } from 'lucide-react';

export default function CommentsPanel({ comments, setComments, editor, user }) {
    const [editingReplyId, setEditingReplyId] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [sidebarReplyText, setSidebarReplyText] = useState({});

    // Filter out unresolved comments that have at least one reply to avoid showing empty shell comments
    const activeComments = comments.filter(c => !c.resolved && c.replies && c.replies.length > 0);
    const archivedComments = comments.filter(c => c.resolved);

    const handleEditStart = (reply) => {
        setEditingReplyId(reply.replyId);
        setEditValue(reply.text);
    };

    const handleEditSave = (commentId, replyId) => {
        setComments(prev => prev.map(c => {
            if (c.id === commentId) {
                return {
                    ...c,
                    replies: c.replies.map(r => r.replyId === replyId ? { ...r, text: editValue } : r)
                };
            }
            return c;
        }));
        setEditingReplyId(null);
        setEditValue('');
    };

    const handleDeleteReply = (commentId, replyId) => {
        setComments(prev => {
            const newComments = prev.map(c => {
                if (c.id === commentId) {
                    return { ...c, replies: c.replies.filter(r => r.replyId !== replyId) };
                }
                return c;
            });
            // Auto-clean threads that have 0 replies left
            return newComments.filter(c => c.replies && c.replies.length > 0);
        });
    };

    const handleResolve = (id) => {
        setComments(prev => prev.map(c => c.id === id ? { ...c, resolved: true } : c));
    };

    const handleSidebarReply = (commentId) => {
        const text = sidebarReplyText[commentId];
        if (!text || !text.trim()) return;

        const newReply = {
            replyId: Date.now().toString(),
            author: { name: user?.name, avatarUrl: user?.avatarUrl },
            text: text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setComments(prev => prev.map(c => {
            if (c.id === commentId) {
                return { ...c, replies: [...(c.replies || []), newReply] };
            }
            return c;
        }));

        setSidebarReplyText(prev => ({ ...prev, [commentId]: '' }));
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
                            {/* Header */}
                            <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Thread</span>
                                <button onClick={() => handleResolve(comment.id)} className="p-1 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded transition-colors" title="Mark Thread as Done">
                                    <CheckCircle size={14} />
                                </button>
                            </div>

                            {/* Replies */}
                            <div className="flex flex-col gap-3">
                                {comment.replies.map((reply, index) => {
                                    const isOriginalPost = index === 0;
                                    return (
                                        <div key={reply.replyId} className={`flex flex-col ${!isOriginalPost ? 'ml-3 pl-3 border-l-2 border-gray-100' : ''} group/reply`}>
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-2">
                                                    <img src={reply.author?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(reply.author?.name || 'User')}&background=random`} alt={reply.author?.name} className="w-5 h-5 rounded-full" />
                                                    <span className="text-xs font-bold text-[#3E2A2F]">{reply.author?.name || 'Unknown'} {isOriginalPost && <span className="text-[#B7684C] font-normal text-[10px]">(OP)</span>}</span>
                                                    <span className="text-[10px] font-medium text-gray-400 flex items-center gap-1">
                                                        <Clock size={10} /> {reply.timestamp}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 opacity-0 group-hover/reply:opacity-100 transition-opacity">
                                                    {reply.author?.name === user?.name && (
                                                        <>
                                                            <button onClick={() => handleEditStart(reply)} className="p-1 text-gray-400 hover:text-blue-500 rounded" title="Edit">
                                                                <Edit2 size={12} />
                                                            </button>
                                                            <button onClick={() => handleDeleteReply(comment.id, reply.replyId)} className="p-1 text-gray-400 hover:text-red-500 rounded" title="Delete">
                                                                <Trash2 size={12} />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {editingReplyId === reply.replyId ? (
                                                <div className="mt-1">
                                                    <textarea
                                                        className="w-full text-xs p-2 border border-blue-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500/30 resize-none min-h-[50px] bg-white"
                                                        value={editValue}
                                                        onChange={e => setEditValue(e.target.value)}
                                                        autoFocus
                                                    />
                                                    <div className="flex justify-end gap-2 mt-1">
                                                        <button onClick={() => setEditingReplyId(null)} className="px-2 py-1 text-[10px] font-bold text-gray-500 hover:bg-gray-100 rounded">Cancel</button>
                                                        <button onClick={() => handleEditSave(comment.id, reply.replyId)} className="px-2 py-1 text-[10px] font-bold bg-[#B7684C] text-white rounded hover:bg-[#A45C49]">Save</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-xs text-[#3E2A2F] leading-relaxed whitespace-pre-wrap">{reply.text}</div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Add Reply Input */}
                            <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Reply inline..."
                                    value={sidebarReplyText[comment.id] || ''}
                                    onChange={(e) => setSidebarReplyText(prev => ({ ...prev, [comment.id]: e.target.value }))}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSidebarReply(comment.id)}
                                    className="flex-1 text-xs px-2 py-1.5 border border-gray-200 rounded focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/50 bg-gray-50"
                                />
                                <button
                                    onClick={() => handleSidebarReply(comment.id)}
                                    className="px-3 py-1.5 text-[10px] font-bold bg-[#B7684C]/10 text-[#B7684C] hover:bg-[#B7684C] hover:text-white rounded transition-colors"
                                >
                                    Reply
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {archivedComments.length > 0 && (
                <div className="p-4 border-t border-[#D8C7B9] bg-white mt-auto">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Resolved ({archivedComments.length})</div>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                        {archivedComments.map(comment => (
                            <div key={comment.id} className="text-xs text-gray-500 bg-gray-50 p-2 rounded flex flex-col gap-1 border border-gray-100 opacity-60">
                                <span className="font-bold text-gray-600">Thread ({comment.replies?.length} messages)</span>
                                <span className="truncate italic">"{comment.replies?.[0]?.text}"</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
