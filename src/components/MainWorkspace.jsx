import React, { useState, useEffect } from 'react';
import {
    FlaskConical, ChevronDown, Folder, FileText, BarChart2, Option,
    Settings, Download, Trash2, Cloud, Share, CheckCircle2, Save, Upload,
    Clock, Image as ImageIcon, Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    Heading1, Heading2, List, ListOrdered, Quote,
    Subscript as SubscriptIcon, Superscript as SuperscriptIcon,
    MessageSquarePlus
} from 'lucide-react';
import ShareModal from './ShareModal';
import ExportPdfModal from './ExportPdfModal';
import RightSidebar from './RightSidebar';
import { useAppContext } from '../context/AppContext';
import { useEditor, EditorContent, ReactNodeViewRenderer, Extension } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import Blockquote from '@tiptap/extension-blockquote';
import Image from '@tiptap/extension-image';
import Dropcursor from '@tiptap/extension-dropcursor';
import TextAlign from '@tiptap/extension-text-align';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Underline from '@tiptap/extension-underline';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { FontFamily } from '@tiptap/extension-font-family';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import CharacterCount from '@tiptap/extension-character-count';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import ResizableImageNode from './ResizableImageNode';
import { SlashCommands } from './SlashCommands';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import SymbolPickerModal from './SymbolPickerModal';
import TablePickerModal from './TablePickerModal';

const FontSize = Extension.create({
    name: 'fontSize',
    addOptions() { return { types: ['textStyle'] } },
    addGlobalAttributes() {
        return [{
            types: this.options.types,
            attributes: {
                fontSize: {
                    default: null,
                    parseHTML: element => element.style.fontSize?.replace(/['"]+/g, ''),
                    renderHTML: attributes => {
                        if (!attributes.fontSize) return {};
                        return { style: `font-size: ${attributes.fontSize}` };
                    },
                },
            },
        }];
    },
    addCommands() {
        return {
            setFontSize: fontSize => ({ chain }) => chain().setMark('textStyle', { fontSize }).run(),
            unsetFontSize: () => ({ chain }) => chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run(),
        };
    },
});

const CustomImage = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            width: {
                default: '100%',
                renderHTML: attributes => { return { width: attributes.width }; }
            },
            float: {
                default: 'none',
                renderHTML: attributes => { return { style: `float: ${attributes.float}` }; }
            },
        };
    },
    addNodeView() {
        return ReactNodeViewRenderer(ResizableImageNode);
    }
});
import { useParams, useNavigate } from 'react-router-dom';
import Papa from 'papaparse';

export default function MainWorkspace() {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const {
        user,
        projects,
        addFileToProject,
        isShareModalOpen, setIsShareModalOpen,
        isExportModalOpen, setIsExportModalOpen,
        isBidirectionalEnabled,
        setActiveRightPanel,
        updateProjectTitle
    } = useAppContext();

    // Start entirely empty (Phase 3 requirements)
    const [chartData, setChartData] = useState([]);

    // Dynamic CSV States (Phase 5)
    const [tableHeaders, setTableHeaders] = useState([]);
    const [isImporting, setIsImporting] = useState(false);

    // TipTap active native attributes sync
    const [activeFontFamily, setActiveFontFamily] = useState('');
    const [activeFontSize, setActiveFontSize] = useState('');
    const [activeColor, setActiveColor] = useState('#000000');

    const [isSymbolPickerOpen, setIsSymbolPickerOpen] = useState(false);
    const [comments, setComments] = useState([]);

    // Spatial Commenting (Phase 16 - Threaded)
    const [isCommentMode, setIsCommentMode] = useState(false);
    const [activeCommentId, setActiveCommentId] = useState(null);
    const [replyText, setReplyText] = useState("");

    // Contextual Inspector (Phase 17)
    const [selectionType, setSelectionType] = useState('document');

    useEffect(() => {
        const handleOpen = () => setIsSymbolPickerOpen(true);
        window.addEventListener('open-symbol-picker', handleOpen);
        return () => window.removeEventListener('open-symbol-picker', handleOpen);
    }, []);

    // Find the current project meta
    const activeProject = projects.find(p => p.id === (projectId || ''));

    // Editable Title state 
    const [localTitle, setLocalTitle] = useState(activeProject?.name || "Untitled Analysis");

    useEffect(() => {
        if (activeProject?.name) {
            setLocalTitle(activeProject.name);
        }
    }, [activeProject?.name]);

    const handleTableChange = (index, field, value) => {
        const newData = [...chartData];
        newData[index] = { ...newData[index], [field]: field === 'outlier' ? value : (parseFloat(value) || 0) };
        setChartData(newData);
    };

    const handleDotClick = (data, index) => {
        if (!isBidirectionalEnabled) return;
        // Mock Interaction: Increase temp by 2 on click of graph node
        const newData = [...chartData];
        newData[index] = { ...newData[index], temp: newData[index].temp + 2 };
        setChartData(newData);
    };

    const handleCanvasClick = (e) => {
        if (!isCommentMode) return;
        // Get coordinates relative to the nearest bounding parent wrapper
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newId = Date.now().toString();
        setComments(prev => [
            ...prev,
            {
                id: newId,
                x,
                y,
                resolved: false,
                replies: []
            }
        ]);
        setActiveCommentId(newId);
        setReplyText("");
        setIsCommentMode(false); // Turn off mode immediately to allow typing
    };

    const handleAddReply = (commentId, text) => {
        if (!text.trim()) return;
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
        setReplyText("");
    };

    // TipTap Editor Configuration with Custom Extensions
    const editor = useEditor({
        extensions: [
            StarterKit,
            Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
            BulletList,
            ListItem,
            Blockquote,
            CharacterCount,
            Table.configure({
                resizable: true,
                HTMLAttributes: {
                    class: 'custom-scroll-table',
                },
            }),
            TableRow,
            TableHeader,
            TableCell,
            CustomImage.configure({
                inline: true,
                allowBase64: true,
                HTMLAttributes: {
                    style: 'display: inline-block; max-width: 100%; height: auto; transition: width 0.2s ease;',
                },
            }),
            Dropcursor.configure({
                color: '#1A73E8',
                width: 4,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph', 'image'],
            }),
            HorizontalRule,
            Underline,
            SlashCommands,
            TextStyle,
            Color,
            FontFamily,
            FontSize,
            Subscript,
            Superscript,
        ],
        content: '', // Start entirely empty (Phase 3 requirements)
        editorProps: {
            attributes: {
                class: 'prose prose-lg focus:outline-none max-w-none text-[#444] font-serif leading-relaxed min-h-[500px]',
                placeholder: 'Start typing your analysis here...',
            },
        },
    });

    useEffect(() => {
        if (!editor) return;
        const updateSelection = () => {
            if (editor.isActive('image')) {
                setSelectionType('image');
            } else if (!editor.state.selection.empty) {
                setSelectionType('text');
            } else if (editor.isActive('table')) {
                setSelectionType('table');
            } else {
                setSelectionType('document');
            }
        };
        editor.on('selectionUpdate', updateSelection);
        editor.on('transaction', updateSelection);
        return () => {
            editor.off('selectionUpdate', updateSelection);
            editor.off('transaction', updateSelection);
        };
    }, [editor]);

    const handleWorkbenchImport = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length || !activeProject) return;

        files.forEach(file => {
            const isImage = file.type.startsWith('image/');
            const reader = new FileReader();

            reader.onload = () => {
                const fileObject = {
                    id: Date.now().toString() + Math.random().toString(36).substring(7),
                    name: file.name,
                    type: file.type,
                    data: reader.result
                };
                addFileToProject(activeProject.id, fileObject);
            };

            if (isImage) {
                reader.readAsDataURL(file);
            } else {
                reader.readAsText(file);
            }
        });
    };

    const handleDragStart = (e, fileObject) => {
        e.dataTransfer.setData('application/json', JSON.stringify(fileObject));
        e.dataTransfer.effectAllowed = 'copy';
    };

    const injectTableHTML = (fields, data) => {
        if (!editor || !fields || !data.length) return;

        let tableHTML = `<table class="custom-scroll-table"><tbody><tr>`;

        // Generate Headers
        fields.forEach(header => {
            tableHTML += `<th><p>${header}</p></th>`;
        });
        tableHTML += `</tr>`;

        // Limit to 100 rows to prevent DOM crashing
        const displayData = data.slice(0, 100);

        // Generate Rows
        displayData.forEach(row => {
            tableHTML += `<tr>`;
            fields.forEach(header => {
                const val = row[header] !== undefined && row[header] !== null ? String(row[header]) : '';
                tableHTML += `<td><p>${val}</p></td>`;
            });
            tableHTML += `</tr>`;
        });

        tableHTML += `</tbody></table><p></p>`; // Add an empty paragraph after the table

        // Inject into TipTap at the current cursor/drop position
        editor.chain().focus().insertContent(tableHTML).run();
    };

    const handleDrop = (e) => {
        e.preventDefault();

        // Handle OS file drops
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            const isImage = file.type.startsWith('image/');
            const reader = new FileReader();

            reader.onload = () => {
                if (isImage && editor) {
                    editor.chain().focus().setImage({ src: reader.result }).run();
                } else if (file.name.endsWith('.csv') || file.type === 'text/csv' || file.name.endsWith('.txt')) {
                    setIsImporting(true);
                    setTimeout(() => {
                        Papa.parse(reader.result, {
                            header: true,
                            dynamicTyping: true,
                            skipEmptyLines: true,
                            complete: (results) => {
                                if (results.meta && results.meta.fields) {
                                    setTableHeaders(results.meta.fields);
                                }
                                const formattedData = results.data.map((row, index) => ({
                                    id: index,
                                    ...row,
                                    outlier: 'No'
                                }));

                                injectTableHTML(results.meta.fields, results.data);
                                setChartData(formattedData);
                                setIsImporting(false);
                            }
                        });
                    }, 100);
                }
            };
            if (isImage) {
                reader.readAsDataURL(file);
            } else {
                reader.readAsText(file);
            }
            return;
        }

        // Handle internal workbench drop
        try {
            const data = e.dataTransfer.getData('application/json');
            if (!data) return;
            const fileObject = JSON.parse(data);

            if (fileObject.type.startsWith('image/') && editor) {
                editor.chain().focus().setImage({ src: fileObject.data }).run();
            } else if (fileObject.name.endsWith('.csv') || fileObject.type === 'text/csv' || fileObject.name.endsWith('.txt')) {
                setIsImporting(true);
                setTimeout(() => {
                    Papa.parse(fileObject.data, {
                        header: true,
                        dynamicTyping: true,
                        skipEmptyLines: true,
                        complete: (results) => {
                            if (results.meta && results.meta.fields) {
                                setTableHeaders(results.meta.fields);
                            }
                            const formattedData = results.data.map((row, index) => ({
                                id: index,
                                ...row,
                                outlier: 'No'
                            }));

                            injectTableHTML(results.meta.fields, results.data);
                            setChartData(formattedData);
                            setIsImporting(false);
                        }
                    });
                }, 100);
            }
        } catch (err) {
            console.error("Drop error", err);
            setIsImporting(false);
        }
    };

    // Duplicate editor declaration removed

    // Native TipTap Event Listener explicitly binds variables to React state since attributes lag on nested renders
    useEffect(() => {
        if (!editor) return;

        const updateTypographyState = () => {
            const fontFamily = editor.getAttributes('textStyle')?.fontFamily?.replace(/['"]/g, '') || '';
            const fontSize = editor.getAttributes('textStyle')?.fontSize || '';
            const color = editor.getAttributes('textStyle')?.color || '#000000';

            setActiveFontFamily(fontFamily);
            setActiveFontSize(fontSize);
            setActiveColor(color);
        };

        editor.on('transaction', updateTypographyState);
        editor.on('selectionUpdate', updateTypographyState);

        updateTypographyState();

        return () => {
            editor.off('transaction', updateTypographyState);
            editor.off('selectionUpdate', updateTypographyState);
        };
    }, [editor]);

    return (
        <div className="h-screen flex flex-col font-sans w-full bg-[#E5D7CC] overflow-hidden">

            {/* Top Navigation */}
            <div className="h-20 bg-[#F4EBE1] border-b border-[#D8C7B9] px-6 lg:px-10 flex items-center justify-between shrink-0 z-20">

                {/* Left: Logo */}
                <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="w-9 h-9 rounded-xl bg-[#62414A] flex items-center justify-center text-white shadow-sm">
                        <FlaskConical size={20} strokeWidth={2.5} />
                    </div>
                    <span className="font-extrabold text-[#3E2A2F] text-xl tracking-tight">Vitro Workspace</span>
                </a>

                {/* Center-Right: Links */}
                <nav className="hidden md:flex items-center gap-8 text-[#62414A]">
                    <a href="/" className="font-semibold text-[15px] hover:text-[#3E2A2F] transition-colors">Dashboard</a>
                    <a href="/workspace" className="font-bold text-[15px] text-[#3E2A2F]">Projects</a>
                    <a href="#" className="font-semibold text-[15px] hover:text-[#3E2A2F] transition-colors">Templates</a>
                    <a href="#" className="font-semibold text-[15px] hover:text-[#3E2A2F] transition-colors">Help</a>
                </nav>

                {/* Right: Actions & User */}
                <div className="flex items-center gap-5">
                    <button className="hidden sm:block px-6 py-2.5 rounded-full border-2 border-[#B7684C] text-[#B7684C] font-bold text-sm tracking-wide hover:bg-[#B7684C]/5 transition-colors">
                        New Project
                    </button>
                    <a href="/settings" className="h-10 w-10 rounded-full border-2 border-white shadow-sm overflow-hidden shrink-0 block hover:opacity-90 transition-opacity">
                        <img
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt="User Avatar"
                            className="h-full w-full object-cover"
                        />
                    </a>
                </div>

            </div>

            {/* Main Body Wrapper */}
            <div className="flex-1 flex overflow-hidden">

                {/* Column 1: Left Workbench Sidebar */}
                <div className="w-72 hidden md:flex flex-col bg-gradient-to-b from-[#62414A] to-[#B7684C] flex-shrink-0 z-10 m-4 lg:m-6 rounded-3xl overflow-hidden shadow-lg border border-white/10">

                    <div className="p-6">
                        <h2 className="text-[#3E2A2F] font-bold text-lg mb-4">Project Workbench</h2>
                        <div className="w-full h-px bg-[#3E2A2F]/20 mb-6"></div>

                        {/* File Tree */}
                        <div className="space-y-3">

                            <div className="flex justify-between items-center bg-[#F4EBE1]/90 rounded-xl px-4 py-3 shadow-sm cursor-pointer border border-[#D8C7B9]/50">
                                <div className="flex items-center gap-3 text-[#3E2A2F] font-semibold text-sm truncate pr-2">
                                    <Folder size={18} className="text-[#B7684C] shrink-0" fill="currentColor" />
                                    <span className="truncate">{activeProject?.name || 'Untitled Project'}</span>
                                </div>
                                <ChevronDown size={16} className="text-[#3E2A2F] shrink-0" />
                            </div>

                            <div className="pl-4 space-y-3">
                                <div className="flex items-center gap-3 bg-white/95 rounded-xl px-4 py-3 shadow-sm cursor-pointer hover:bg-white transition-colors border-l-4 border-[#B7684C]">
                                    <FileText size={18} className="text-[#B7684C] shrink-0" />
                                    <span className="text-[#3E2A2F] font-bold text-sm truncate">{activeProject?.name || 'Untitled'}.docx</span>
                                </div>

                                {activeProject?.files?.map((f) => (
                                    <div
                                        key={f.id}
                                        draggable="true"
                                        onDragStart={(e) => handleDragStart(e, f)}
                                        className="flex items-center gap-3 bg-white/95 rounded-xl px-4 py-3 shadow-sm cursor-grab hover:bg-white transition-colors border border-transparent hover:border-blue-200/50"
                                    >
                                        {f.type.startsWith('image/') ? <ImageIcon size={18} className="text-blue-400 shrink-0" /> : <BarChart2 size={18} className="text-emerald-500 shrink-0" />}
                                        <span className="text-[#3E2A2F] font-medium text-sm truncate" title={f.name}>{f.name}</span>
                                    </div>
                                ))}

                                <label className="flex items-center justify-center gap-2 bg-transparent border-2 border-dashed border-white/30 rounded-xl px-4 py-3 cursor-pointer hover:bg-white/10 transition-colors text-white/90 font-medium text-sm mt-4">
                                    <Upload size={16} />
                                    + Import File
                                    <input type="file" multiple accept=".csv, .jpg, .png, .pdf, .svg" className="hidden" onChange={handleWorkbenchImport} />
                                </label>
                            </div>

                        </div>
                    </div>

                    <div className="mt-auto p-6 space-y-4 border-t border-white/10">
                        <a href="/settings" className="flex items-center gap-3 text-[#3E2A2F] font-medium text-sm hover:text-white transition-colors">
                            <Settings size={18} />
                            Settings
                        </a>
                        <button
                            onClick={() => setIsExportModalOpen(true)}
                            className="flex w-full items-center gap-3 text-[#3E2A2F] font-medium text-sm hover:text-white transition-colors text-left"
                        >
                            <Download size={18} />
                            Export PDF
                        </button>
                        <a href="#" className="flex items-center gap-3 text-[#3E2A2F]/60 font-medium text-sm hover:text-[#3E2A2F]/80 transition-colors">
                            <Trash2 size={18} />
                            Trash
                        </a>
                    </div>

                </div>

                {/* Column 2: Center Editor */}
                <div
                    className="flex-1 bg-white my-4 lg:my-6 rounded-3xl shadow-lg border border-gray-100 overflow-y-auto z-0 flex flex-col transition-all duration-200"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                >

                    <div className="max-w-[800px] w-full mx-auto px-8 lg:px-12 py-10">

                        {/* Top Bar inside Editor */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-14">
                            <div className="text-[10px] font-bold text-gray-400 tracking-[0.15em] flex items-center gap-2">
                                <button onClick={() => navigate('/dashboard')} className="hover:text-gray-800 transition-colors">MY PROJECTS</button>
                                <span>/</span>
                                <span className="text-[#3E2A2F] font-extrabold uppercase truncate max-w-[200px]">{(activeProject?.name || 'Untitled Document').toUpperCase()}</span>
                            </div>

                            <div className="flex items-center gap-5">
                                <div className="flex items-center gap-2 text-emerald-600 font-medium text-sm">
                                    <Cloud size={16} />
                                    Saved to Cloud
                                </div>

                                <div className="flex items-center">
                                    {activeProject?.collaborators?.length > 0 ? (
                                        <>
                                            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Current User" className="w-8 h-8 rounded-full border-2 border-white relative z-20 object-cover" title="You" />
                                            {activeProject.collaborators.map((collab, i) => (
                                                <img
                                                    key={i}
                                                    src={collab.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(collab.name)}&background=random`}
                                                    alt={collab.name}
                                                    className="w-8 h-8 rounded-full border-2 border-white -ml-3 relative object-cover"
                                                    style={{ zIndex: 10 - i }}
                                                    title={collab.name}
                                                />
                                            ))}
                                        </>
                                    ) : (
                                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Current User" className="w-8 h-8 rounded-full border-2 border-white relative z-20 object-cover" title="You" />
                                    )}
                                </div>

                                <button
                                    onClick={() => setIsCommentMode(!isCommentMode)}
                                    className={`px-5 py-2 rounded-full font-bold text-sm shadow-sm transition-colors border-2 flex items-center gap-2 ${isCommentMode ? 'bg-yellow-100 border-yellow-400 text-yellow-800' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                                    title={isCommentMode ? "Click anywhere on the document to drop a pin" : "Add Comment"}
                                >
                                    <MessageSquarePlus size={16} />
                                    {isCommentMode ? 'Cancel' : 'Comment'}
                                </button>

                                <button
                                    onClick={() => setIsShareModalOpen(true)}
                                    className="bg-[#B7684C] hover:bg-[#A45C49] text-white px-5 py-2 rounded-full font-bold text-sm shadow-sm transition-colors border-2 border-transparent"
                                >
                                    Share
                                </button>
                            </div>
                        </div>

                        {/* Document Content - Spatial Canvas Wrapper */}
                        <div
                            className={`mb-14 relative ${isCommentMode ? 'cursor-crosshair' : ''}`}
                            onClick={handleCanvasClick}
                        >
                            <input
                                type="text"
                                className="text-4xl lg:text-[44px] font-serif text-[#111111] font-bold leading-tight mb-4 tracking-tight bg-transparent border-none outline-none ring-0 w-full placeholder-gray-300 focus:ring-0 p-0 m-0"
                                value={localTitle}
                                onChange={(e) => setLocalTitle(e.target.value)}
                                onBlur={() => updateProjectTitle(activeProject?.id, localTitle || "Untitled Analysis")}
                                onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
                                placeholder="Untitled Analysis"
                            />
                            <div className="flex items-center gap-2 mb-8">
                                <div className="inline-block bg-[#62414A] text-white text-[10px] font-extrabold tracking-widest px-3 py-1.5 rounded uppercase">
                                    {user?.name || 'Unknown Author'}
                                </div>
                                <span className="text-[#3E2A2F]/40 text-sm font-medium flex items-center gap-1">
                                    <Clock size={14} /> Just now
                                </span>
                            </div>

                            {/* Top formatting toolbar was moved to the contextual Properties sidebar */}

                            {/* Editor Area */}
                            <div className="mb-10 min-h-[500px] relative">
                                <EditorContent editor={editor} />
                            </div>

                            {isImporting && (
                                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-3xl">
                                    <div className="flex flex-col items-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B7684C] mb-4"></div>
                                        <p className="text-[#3E2A2F] font-bold text-lg">Processing Data...</p>
                                        <p className="text-[#3E2A2F]/60 text-sm mt-1">Extracting variables and rendering chart</p>
                                    </div>
                                </div>
                            )}

                            {/* Chart Data is now managed entirely within the TipTap Document as native tables */}

                            {/* Spatial Comment Overlay Rendering */}
                            {comments.map((comment) => {
                                if (comment.resolved || comment.x === undefined) return null;
                                const isActive = activeCommentId === comment.id;
                                return (
                                    <div
                                        key={comment.id}
                                        style={{ position: 'absolute', left: comment.x, top: comment.y, transform: 'translate(-50%, -50%)' }}
                                        className="z-50"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveCommentId(isActive ? null : comment.id);
                                            setActiveRightPanel('comments');
                                        }}
                                    >
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white cursor-pointer transition-colors ${isActive ? 'bg-yellow-500' : 'bg-yellow-400 hover:bg-yellow-500'} text-white`}
                                            title={comment.replies?.[0]?.author?.name || 'New Thread'}
                                        >
                                            <MessageSquarePlus size={14} />
                                        </div>

                                        {/* Popover */}
                                        {isActive && (
                                            <div
                                                className="absolute left-10 top-0 bg-white shadow-xl rounded-lg w-72 border border-gray-200 cursor-default animate-in fade-in zoom-in duration-200"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {/* Header */}
                                                <div className="flex justify-between items-center px-3 py-2 border-b border-gray-100 bg-gray-50/50 rounded-t-lg">
                                                    <span className="text-xs font-bold text-gray-700">Thread</span>
                                                    <button onClick={() => {
                                                        setActiveCommentId(null);
                                                        // Cleanup empty threads
                                                        if (!comment.replies || comment.replies.length === 0) {
                                                            setComments(prev => prev.filter(c => c.id !== comment.id));
                                                        }
                                                    }} className="text-gray-400 hover:text-gray-600 text-lg leading-none">&times;</button>
                                                </div>

                                                {/* Replies History */}
                                                <div className="max-h-56 overflow-y-auto p-3 flex flex-col gap-3">
                                                    {comment.replies && comment.replies.length > 0 ? (
                                                        comment.replies.map(reply => (
                                                            <div key={reply.replyId} className="flex gap-2">
                                                                <img src={reply.author?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(reply.author?.name || 'User')}&background=random`} alt="" className="w-6 h-6 rounded-full shrink-0" />
                                                                <div className="flex flex-col flex-1">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-[11px] font-bold text-gray-800">{reply.author?.name}</span>
                                                                        <span className="text-[10px] text-gray-400">{reply.timestamp}</span>
                                                                    </div>
                                                                    <p className="text-xs text-gray-600 mt-0.5 whitespace-pre-wrap leading-relaxed">{reply.text}</p>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="text-center text-xs text-gray-400 italic py-4">No messages yet. Say hi!</div>
                                                    )}
                                                </div>

                                                {/* Input area */}
                                                <div className="p-2 border-t border-gray-100 bg-gray-50 rounded-b-lg">
                                                    <textarea
                                                        className="w-full text-xs p-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-yellow-400/50 resize-none min-h-[50px] text-gray-800 bg-white"
                                                        placeholder="Reply to thread..."
                                                        value={replyText}
                                                        onChange={(e) => setReplyText(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                                e.preventDefault();
                                                                handleAddReply(comment.id, replyText);
                                                            }
                                                        }}
                                                        autoFocus
                                                    />
                                                    <div className="flex justify-between items-center mt-2">
                                                        <span className="text-[10px] text-gray-400">Press Enter to send</span>
                                                        <button
                                                            onClick={() => handleAddReply(comment.id, replyText)}
                                                            className="px-4 py-1.5 text-[11px] font-bold bg-yellow-400 text-white rounded hover:bg-yellow-500 shadow-sm"
                                                        >
                                                            Reply
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                        </div>
                    </div>

                </div>

                {/* Column 3: Dynamic Right Sidebar */}
                <RightSidebar
                    comments={comments}
                    setComments={setComments}
                    editor={editor}
                    user={user}
                    selectionType={selectionType}
                />

            </div>

            {/* Share Modal Overlay */}
            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
            />

            {/* Export PDF Modal Overlay */}
            <ExportPdfModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
            />

            {/* Symbol Picker Modal */}
            <SymbolPickerModal
                isOpen={isSymbolPickerOpen}
                onClose={() => setIsSymbolPickerOpen(false)}
                editor={editor}
            />

            {/* Table Picker Modal */}
            <TablePickerModal editor={editor} />
        </div>
    );
}
