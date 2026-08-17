import React, { useEffect, useState } from 'react';
import { X, History, RotateCcw, Trash2, Plus, Clock } from 'lucide-react';
import { listVersions, saveVersion, getSnapshot, deleteVersion } from '../api/versions';

/**
 * VersionHistoryModal
 * -------------------
 * Full-snapshot version control UI. Lists saved versions of the current
 * document, lets the user save a new version, restore an old one, or delete
 * one. Restoring loads the entire snapshot (text + tables + graphs) back into
 * the editor via editor.commands.setContent().
 *
 * Props:
 *   isOpen       - whether the modal is visible
 *   onClose      - close handler
 *   documentId   - unique id for the current document (projectId:fileId)
 *   documentName - display name for the current document
 *   editor       - the TipTap editor instance
 *   author       - current user name (optional)
 */
export default function VersionHistoryModal({ isOpen, onClose, documentId, documentName, editor, author }) {
    const [versions, setVersions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [label, setLabel] = useState('');
    const [message, setMessage] = useState('');

    const refresh = async () => {
        if (!documentId) return;
        setLoading(true);
        const result = await listVersions(documentId);
        setVersions(result.versions || []);
        setLoading(false);
    };

    useEffect(() => {
        if (isOpen && documentId) {
            setMessage('');
            refresh();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, documentId]);

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!editor || !documentId) return;
        setSaving(true);
        setMessage('');
        const snapshot = editor.getJSON();
        const result = await saveVersion(documentId, snapshot, label.trim() || undefined, author);
        setSaving(false);
        if (result.version) {
            setLabel('');
            setMessage('Version saved successfully.');
            refresh();
        } else {
            setMessage('Could not save version. Is the backend running?');
        }
    };

    const handleRestore = async (version) => {
        if (!editor || !documentId) return;
        setMessage('');
        const snapshot = await getSnapshot(documentId, version.id);
        if (!snapshot) {
            setMessage('Could not load that version.');
            return;
        }
        editor.commands.setContent(snapshot.snapshot_content, false);
        setMessage(`Restored "${version.label}" (${version.created_at}).`);
    };

    const handleDelete = async (version) => {
        if (!documentId) return;
        const ok = await deleteVersion(documentId, version.id);
        if (ok) {
            setMessage('Version deleted.');
            refresh();
        } else {
            setMessage('Could not delete that version.');
        }
    };

    const formatDate = (iso) => {
        try {
            return new Date(iso).toLocaleString();
        } catch {
            return iso;
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="bg-[#F4EBE1] rounded-2xl shadow-xl max-w-lg w-full flex flex-col pointer-events-auto overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-5 border-b border-[#3E2A2F]/10 bg-[#F4EBE1]">
                    <div className="flex items-center gap-2.5">
                        <History className="text-[#62414A] w-5 h-5" />
                        <div>
                            <h2 className="text-[#3E2A2F] font-bold text-lg tracking-tight">Version History</h2>
                            <p className="text-xs text-gray-500 font-medium truncate max-w-[280px]">{documentName}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 hover:bg-black/5 p-1.5 rounded-full transition-colors focus:outline-none"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-4 overflow-y-auto max-h-[60vh]">
                    {/* Save new version */}
                    <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm space-y-3">
                        <h3 className="text-xs font-bold text-[#3E2A2F] uppercase tracking-wider">Save New Version</h3>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                placeholder="Label (e.g. 'Before analysis')"
                                className="flex-1 bg-white border border-stone-200 text-[#3E2A2F] text-sm font-medium py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#62414A]/30 focus:border-[#62414A]/50"
                            />
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="inline-flex items-center gap-1.5 bg-[#62414A] hover:bg-[#53353D] disabled:bg-[#62414A]/60 text-white text-sm font-bold px-4 py-2 rounded-lg shadow-sm transition-colors focus:outline-none"
                            >
                                <Plus className="w-4 h-4" />
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>

                    {message && (
                        <div className="text-sm font-semibold text-[#62414A] bg-[#62414A]/10 border border-[#62414A]/20 rounded-lg px-3 py-2">
                            {message}
                        </div>
                    )}

                    {/* Version list */}
                    <div>
                        <h3 className="text-xs font-bold text-[#3E2A2F] uppercase tracking-wider mb-2">Saved Versions</h3>
                        {loading ? (
                            <div className="text-sm text-gray-500 py-4 text-center">Loading versions...</div>
                        ) : versions.length === 0 ? (
                            <div className="text-sm text-gray-500 py-4 text-center">
                                No versions saved yet. Save one to start tracking.
                            </div>
                        ) : (
                            <ul className="space-y-2">
                                {versions.map((v, idx) => (
                                    <li key={v.id} className="bg-white rounded-xl border border-stone-200 shadow-sm p-3 flex items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                                <span className="text-sm font-bold text-[#3E2A2F] truncate">{v.label}</span>
                                                {idx === 0 && (
                                                    <span className="text-[10px] font-bold text-[#62414A] bg-[#62414A]/10 px-1.5 py-0.5 rounded-full">Latest</span>
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-0.5">
                                                {formatDate(v.created_at)} · {v.author}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <button
                                                onClick={() => handleRestore(v)}
                                                title="Restore this version"
                                                className="inline-flex items-center gap-1 text-xs font-bold text-[#62414A] hover:bg-[#62414A]/10 px-2 py-1.5 rounded-lg transition-colors focus:outline-none"
                                            >
                                                <RotateCcw className="w-3.5 h-3.5" /> Restore
                                            </button>
                                            <button
                                                onClick={() => handleDelete(v)}
                                                title="Delete this version"
                                                className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors focus:outline-none"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-stone-200 flex items-center justify-between bg-[#F4EBE1]">
                    <span className="text-xs text-gray-500 font-medium">
                        Snapshots store the full document (text, tables, graphs).
                    </span>
                    <button
                        onClick={onClose}
                        className="text-sm font-bold text-gray-500 hover:text-[#3E2A2F] transition-colors focus:outline-none"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
