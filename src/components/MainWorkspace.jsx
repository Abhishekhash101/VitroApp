import React, { useState, useEffect, useMemo } from 'react';
import {
    FlaskConical, ChevronDown, ChevronLeft, ChevronRight, Folder, FileText, BarChart2, Option,
    Settings, Download, Trash2, Cloud, CheckCircle2, Save, Upload,
    Clock, Image as ImageIcon, Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    Heading1, Heading2, List, ListOrdered, Quote,
    Subscript as SubscriptIcon, Superscript as SuperscriptIcon,
    MessageSquarePlus
} from 'lucide-react';
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
import Link from '@tiptap/extension-link';
import CharacterCount from '@tiptap/extension-character-count';
import { CommentMark } from './CommentMark';
import EditorBubbleMenu from './EditorBubbleMenu';
import BlockControls from './BlockControls';
import { MathEquation } from '../extensions/MathEquation';
import { SmartVariable } from '../extensions/SmartVariable';
import { Citation } from '../extensions/Citation';
import TableTools from './TableTools';
import Avatar from './Avatar';
import { CustomTable } from '../extensions/CustomTable';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import ResizableImageNode from './ResizableImageNode';
import { SlashCommands } from './SlashCommands';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import SymbolPickerModal from './SymbolPickerModal';
import TablePickerModal from './TablePickerModal';
import GraphExtension from './GraphExtension';
import SmartSummaryExtension from '../extensions/SmartSummaryExtension';
import { SemanticError } from '../extensions/SemanticError';
import SemanticTooltip from './SemanticTooltip';
import { verifySemantics } from '../api/semantic';
import { stampDocument, verifyDocument } from '../api/integrity';
import { saveVersion } from '../api/versions';
import { saveDocument, getDocument } from '../api/documents';
import { ShieldCheck, ShieldAlert, BadgeCheck, History } from 'lucide-react';
import VersionHistoryModal from './VersionHistoryModal';
import SvgImportModal from './SvgImportModal';
import NewProjectModal from './NewProjectModal';
import ConfirmationModal from './ConfirmationModal';
import PdfExtension from './PdfExtension.jsx';
import PdfPreviewModal from './PdfPreviewModal';
import LinkPdfModal from './LinkPdfModal';
import CreateTableModal from './CreateTableModal';
import CompareTablesModal from './CompareTablesModal';

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

// Extract a flat array of row objects from a TipTap table node.
// Used by the bidirectional flow to re-sync graph data from its source table.
// NOTE: ProseMirror Fragments are not arrays — `fragment.forEach` yields
// (node, offset, index) and `fragment[0]` is undefined. Always read cells via
// `fragment.content` and take their text with `textContent`.
async function toDurableDataUrl(source) {
    if (!source) return null;
    if (typeof source === 'string' && source.startsWith('data:')) return source;
    const blob = source instanceof Blob ? source : await fetch(source).then(r => r.blob());
    return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

function extractTableData(tableNode) {
    const rows = tableNode.content?.content || [];
    if (rows.length === 0) return [];

    const cellsOf = (row) => row?.content?.content || [];
    const headers = cellsOf(rows[0]).map((cell, index) => {
        const text = cell.textContent.trim();
        return text || `col${index}`;
    });

    const data = [];
    for (let i = 1; i < rows.length; i++) {
        const rowData = {};
        cellsOf(rows[i]).forEach((cell, cellIndex) => {
            const text = cell.textContent.trim();
            const header = headers[cellIndex] || `col${cellIndex}`;
            const num = Number(text);
            rowData[header] = text !== '' && !isNaN(num) ? num : text;
        });
        data.push(rowData);
    }
    return data;
}

import { useParams, useNavigate } from 'react-router-dom';
import Papa from 'papaparse';

export default function MainWorkspace() {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const {
        user,
        projects,
        addFileToProject,
        isExportModalOpen, setIsExportModalOpen,
        isBidirectionalEnabled,
        setActiveRightPanel,
        updateProjectTitle,
        chartData,
        setChartData,
        deleteProject,
        createNewProject,
        setIsNewProjectModalOpen,
        updateProjectContent,
        updateFileInProject,
        setProjectStamp,
        setFileStamp
    } = useAppContext();

    const [activeFileId, setActiveFileId] = useState(null);

    // Integrity / Data Provenance state
    const [integrityStatus, setIntegrityStatus] = useState('unstamped'); // 'unstamped' | 'checking' | 'verified' | 'tampered' | 'error'
    const [integrityMessage, setIntegrityMessage] = useState('');
    const [isPublishing, setIsPublishing] = useState(false);

    // Version Control (Full Snapshot Strategy)
    const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
    const [lastAutoSaveRef] = React.useState({ current: Date.now() });

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

    // SVG Drag & Drop Data Extraction
    const [pendingSvg, setPendingSvg] = useState(null);
    const [isSvgModalOpen, setIsSvgModalOpen] = useState(false);

    // Sidebar Collapsed States
    const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);
    const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);

    // Calculate Fluid Mode
    const isFluidMode = isLeftSidebarCollapsed || isRightSidebarCollapsed;

    // Smart Table Modal
    const [isTableModalOpen, setIsTableModalOpen] = useState(false);

    // Compare Tables Modal
    const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

    // Semantic Validator (Real-Time Peer Review)
    const semanticDebounceRef = React.useRef(null);
    const semanticSeqRef = React.useRef(0);

    useEffect(() => {
        const handleOpenTableModal = () => setIsTableModalOpen(true);
        const handleOpenCompareModal = () => setIsCompareModalOpen(true);

        window.addEventListener('open-table-modal', handleOpenTableModal);
        window.addEventListener('open-compare-modal', handleOpenCompareModal);

        return () => {
            window.removeEventListener('open-table-modal', handleOpenTableModal);
            window.removeEventListener('open-compare-modal', handleOpenCompareModal);
        };
    }, []);

    useEffect(() => {
        const handleOpen = () => setIsSymbolPickerOpen(true);
        window.addEventListener('open-symbol-picker', handleOpen);
        return () => window.removeEventListener('open-symbol-picker', handleOpen);
    }, []);

    // Find the current project meta
    const activeProject = projects.find(p => p.id === (projectId || ''));
    const activeFile = activeFileId ? activeProject?.files?.find(f => f.id === activeFileId) : null;


    const handleDeleteProject = () => {
        if (!activeProject?.id) return;
        setIsDeleteModalOpen(true);
    };

    const handleCreateNewProject = () => {
        setIsNewProjectModalOpen(true);
    };

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [previewPdf, setPreviewPdf] = useState(null); // { src, fileName } or null

    // PDF Link Modal state
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

    const handleInsertPdf = (pdfItem) => {
        editor.chain().focus().insertContent({
            type: 'pdfSmartChip',
            attrs: { src: pdfItem.url, fileName: pdfItem.name }
        }).run();
        setIsLinkModalOpen(false);
    };

    const handleInsertSmartTable = ({ name, rows, cols }) => {
        const tableId = `tbl_${Date.now()}`;

        const tableContent = [];
        for (let r = 0; r < rows; r++) {
            const rowContent = [];
            for (let c = 0; c < cols; c++) {
                rowContent.push({
                    type: r === 0 ? 'tableHeader' : 'tableCell',
                    content: [{ type: 'paragraph' }]
                });
            }
            tableContent.push({
                type: 'tableRow',
                content: rowContent
            });
        }

        editor.chain()
            .focus()
            .insertContent({
                type: 'table',
                attrs: { tableId, tableName: name },
                content: tableContent
            })
            .run();

        // Force-sync data attributes to DOM after insertion
        // (TipTap's Table NodeView bypasses renderHTML)
        setTimeout(() => {
            const domTables = editor.view.dom.querySelectorAll('table');
            let idx = 0;
            editor.state.doc.descendants((node) => {
                if (node.type.name === 'table') {
                    const domTable = domTables[idx];
                    if (domTable) {
                        if (node.attrs.tableName) domTable.setAttribute('data-table-name', node.attrs.tableName);
                        if (node.attrs.tableId) domTable.setAttribute('data-table-id', node.attrs.tableId);
                    }
                    idx++;
                }
            });
        }, 50);

        setIsTableModalOpen(false); // Ensure modal closes
    };

    const handleInsertComparisonGraph = ({ data, type, seriesKeys, xLabel, yLabel }) => {
        editor.chain().focus().insertContent({
            type: 'graphBlock',
            attrs: { data, type, xAxisKey: 'name', seriesKeys, xLabel, yLabel }
        }).run();
    };

    // Workbench file import handler — generates Blob URLs for all files
    const handleWorkbenchImport = (event) => {
        const importedFiles = Array.from(event.target.files);
        if (!importedFiles.length || !activeProject?.id) return;

        importedFiles.forEach(file => {
            const fileUrl = URL.createObjectURL(file);
            const fileObject = {
                id: Date.now().toString() + Math.random(),
                name: file.name,
                type: file.type || 'application/octet-stream',
                url: fileUrl,        // CRITICAL: Blob URL for previewing
                file: file,          // Keep original File reference
                data: fileUrl,       // Compat with existing drag-start logic
                date: new Date().toLocaleDateString()
            };
            addFileToProject(activeProject.id, fileObject);
        });
        event.target.value = ''; // Reset so same file can be re-imported
    };

    // PDF source: get linkable PDFs from the main Project Workbench
    const allLinkablePdfs = useMemo(() => {
        return (activeProject?.files || [])
            .filter(f => f.name.toLowerCase().endsWith('.pdf'))
            .map(f => ({
                ...f,
                source: 'Project Files',
                url: f.url || (f.file ? URL.createObjectURL(f.file) : null)
            }))
            .filter(f => f.url !== null);
    }, [activeProject?.files]);

    // Listen for custom PDF click events
    useEffect(() => {
        const handleOpenPdf = (e) => {
            setPreviewPdf(e.detail);
        };
        window.addEventListener('open-pdf-preview', handleOpenPdf);
        return () => window.removeEventListener('open-pdf-preview', handleOpenPdf);
    }, []);

    // Listen for /link slash command event
    useEffect(() => {
        const handleOpenLinkModal = () => setIsLinkModalOpen(true);
        window.addEventListener('open-pdf-link-modal', handleOpenLinkModal);
        return () => window.removeEventListener('open-pdf-link-modal', handleOpenLinkModal);
    }, []);

    // Editable Title state 
    const [localTitle, setLocalTitle] = useState(activeFile ? activeFile.name : (activeProject?.name || "Untitled Analysis"));

    useEffect(() => {
        setLocalTitle(activeFile ? activeFile.name : (activeProject?.name || "Untitled Analysis"));
    }, [activeFile?.name, activeProject?.name, activeFileId]);

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

    const activeProjectRef = React.useRef(activeProject);
    const activeFileIdRef = React.useRef(activeFileId);
    useEffect(() => { activeProjectRef.current = activeProject; }, [activeProject]);
    useEffect(() => { activeFileIdRef.current = activeFileId; }, [activeFileId]);

    // TipTap Editor Configuration with Custom Extensions
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3, 4, 5, 6] },
                dropcursor: { color: '#1A73E8', width: 4 },
                bulletList: true,
                orderedList: true,
                listItem: true,
                blockquote: true,
                horizontalRule: true,
                link: false, // configured separately below
                underline: false, // configured separately below
            }),
            PdfExtension,
            CharacterCount,
            CustomTable.configure({
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
            TextAlign.configure({
                types: ['heading', 'paragraph', 'image'],
            }),
            Underline,
            SlashCommands,
            TextStyle,
            Color,
            FontFamily,
            FontSize,
            Subscript,
            Superscript,
            Link.configure({
                openOnClick: false,
                autolink: true,
                HTMLAttributes: { class: 'text-[#1A73E8] underline' },
            }),
            CommentMark,
            MathEquation,
            SmartVariable,
            Citation,
            GraphExtension,
            SmartSummaryExtension,
            SemanticError,
        ],
        content: '', // Start entirely empty (Phase 3 requirements)
        onUpdate: ({ editor }) => {
            const json = editor.getJSON();
            const documentChartData = [];

            const parseNodes = (node) => {
                if (node.type === 'table') {
                    const headers = [];

                    if (node.content && node.content.length > 0) {
                        const headerRow = node.content[0];
                        if (headerRow.content) {
                            headerRow.content.forEach(cell => {
                                const text = cell.content && cell.content[0] && cell.content[0].content
                                    ? cell.content[0].content.map(t => t.text).join('')
                                    : '';
                                headers.push(text);
                            });
                        }

                        for (let i = 1; i < node.content.length; i++) {
                            const row = node.content[i];
                            const rowData = { id: i - 1 };
                            if (row.content) {
                                row.content.forEach((cell, cellIndex) => {
                                    const text = cell.content && cell.content[0] && cell.content[0].content
                                        ? cell.content[0].content.map(t => t.text).join('')
                                        : '';
                                    const header = headers[cellIndex] || `col${cellIndex}`;
                                    const num = Number(text);
                                    rowData[header] = !isNaN(num) && text !== '' ? num : text;
                                });
                            }
                            documentChartData.push(rowData);
                        }
                    }
                } else if (node.content) {
                    node.content.forEach(parseNodes);
                }
            };

            parseNodes(json);
            if (documentChartData.length > 0) {
                setChartData(documentChartData);
            }

            // Sync table attrs from TipTap model to DOM
            // (TipTap's Table uses NodeView which bypasses renderHTML)
            const domTables = editor.view.dom.querySelectorAll('table');
            let tableIndex = 0;
            editor.state.doc.descendants((node) => {
                if (node.type.name === 'table') {
                    const domTable = domTables[tableIndex];
                    if (domTable) {
                        if (node.attrs.tableName) {
                            domTable.setAttribute('data-table-name', node.attrs.tableName);
                        }
                        if (node.attrs.tableId) {
                            domTable.setAttribute('data-table-id', node.attrs.tableId);
                        }
                    }
                    tableIndex++;
                }
            });

            // ---- Bidirectional Flow: Table -> Graph ------------------------
            // 1. Ensure every table has a stable tableId so graphs can link to it.
            // 2. Re-sync each graphBlock's data from its linked source table.
            const { tr } = editor.state;
            let tableIdChanged = false;
            const tablesById = {};

            editor.state.doc.descendants((node, pos) => {
                if (node.type.name === 'table') {
                    let id = node.attrs.tableId;
                    if (!id) {
                        id = `tbl_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
                        tr.setNodeMarkup(pos, undefined, { ...node.attrs, tableId: id });
                        tableIdChanged = true;
                    }
                    tablesById[id] = extractTableData(node);
                }
            });

            if (tableIdChanged) {
                editor.view.dispatch(tr);
            }

            // Re-sync graph data from linked tables (only when it actually differs).
            const graphUpdates = [];
            editor.state.doc.descendants((node, pos) => {
                if (node.type.name === 'graphBlock' && node.attrs.tableId) {
                    const sourceData = tablesById[node.attrs.tableId];
                    if (sourceData && JSON.stringify(sourceData) !== JSON.stringify(node.attrs.data)) {
                        graphUpdates.push({ pos, data: sourceData });
                    }
                }
            });

            if (graphUpdates.length > 0) {
                const gtr = editor.state.tr;
                graphUpdates.forEach(({ pos, data }) => {
                    gtr.setNodeMarkup(pos, undefined, { ...editor.state.doc.nodeAt(pos).attrs, data });
                });
                editor.view.dispatch(gtr);
            }

            // Sync with Global Persistence
            const currProj = activeProjectRef.current;
            const currFileId = activeFileIdRef.current;
            if (currProj?.id) {
                if (currFileId) {
                    updateFileInProject(currProj.id, currFileId, { content: editor.getHTML() });
                } else {
                    updateProjectContent(currProj.id, editor.getHTML());
                }
            }
        },
        editorProps: {
            attributes: {
                class: 'prose prose-lg focus:outline-none max-w-none text-[#444] font-serif leading-relaxed min-h-[500px]',
                placeholder: 'Start typing your analysis here...',
            },
        },
    });

    // ---- Semantic Validator (Real-Time Peer Review) -----------------------
    const extractTablesForValidation = React.useCallback((ed) => {
        const tables = [];
        ed.state.doc.descendants((node) => {
            if (node.type.name === 'table') {
                const headers = [];
                const rows = [];
                const content = node.content?.content || [];
                if (content.length > 0) {
                    const headerRow = content[0].content?.content || [];
                    headerRow.forEach(cell => {
                        headers.push(cell.textContent.trim());
                    });
                    for (let i = 1; i < content.length; i++) {
                        const row = {};
                        const cells = content[i].content?.content || [];
                        cells.forEach((cell, idx) => {
                            const header = headers[idx] || `col${idx}`;
                            const text = cell.textContent.trim();
                            const num = Number(text);
                            row[header] = !isNaN(num) && text !== '' ? num : text;
                        });
                        rows.push(row);
                    }
                }
                tables.push({
                    tableId: node.attrs.tableId || null,
                    tableName: node.attrs.tableName || 'Table',
                    headers,
                    rows,
                });
            }
        });
        return tables;
    }, []);

    const clearSemanticErrors = React.useCallback((ed) => {
        const markType = ed.schema.marks.semanticError;
        if (!markType) return;
        const { tr } = ed.state;
        ed.state.doc.descendants((node, pos) => {
            if (node.isText && node.marks.some(m => m.type === markType)) {
                tr.removeMark(pos, pos + node.nodeSize, markType);
            }
        });
        if (tr.docChanged) ed.view.dispatch(tr);
    }, []);

    const applySemanticError = React.useCallback((ed, match, message) => {
        const markType = ed.schema.marks.semanticError;
        if (!markType) return;
        const { state } = ed;
        const { from } = state.selection;

        let paraFrom = null, paraTo = null;
        state.doc.descendants((node, pos) => {
            if (node.type.name === 'paragraph') {
                const start = pos + 1;
                const end = pos + node.nodeSize - 1;
                if (from >= start && from <= end) {
                    paraFrom = start;
                    paraTo = end;
                }
            }
        });
        if (paraFrom === null) return;

        const paraText = state.doc.textBetween(paraFrom, paraTo, '');
        const idx = match ? paraText.indexOf(match) : -1;
        const { tr } = state;
        if (idx >= 0) {
            tr.addMark(paraFrom + idx, paraFrom + idx + match.length, markType.create({ message }));
        } else {
            tr.addMark(paraFrom, paraTo, markType.create({ message }));
        }
        ed.view.dispatch(tr);
    }, []);

    const computeSignature = React.useCallback((ed) => {
        const { state } = ed;
        const { from } = state.selection;
        let paraText = '';
        state.doc.descendants((node, pos) => {
            if (node.type.name === 'paragraph') {
                const start = pos + 1;
                const end = pos + node.nodeSize - 1;
                if (from >= start && from <= end) paraText = node.textContent;
            }
        });
        return paraText + '|' + JSON.stringify(extractTablesForValidation(ed));
    }, [extractTablesForValidation]);

    const lastSigRef = React.useRef('');

    useEffect(() => {
        if (!editor) return;

        const runValidation = () => {
            const seq = ++semanticSeqRef.current;
            const { state } = editor;
            const { from } = state.selection;
            let paraText = '';
            state.doc.descendants((node, pos) => {
                if (node.type.name === 'paragraph') {
                    const start = pos + 1;
                    const end = pos + node.nodeSize - 1;
                    if (from >= start && from <= end) paraText = node.textContent;
                }
            });
            if (!paraText.trim()) return;

            const tables = extractTablesForValidation(editor);
            verifySemantics(paraText, tables).then((result) => {
                if (seq !== semanticSeqRef.current) return; // stale response
                clearSemanticErrors(editor);
                if (result.hasError) {
                    applySemanticError(editor, result.match, result.errorMessage);
                }
            });
        };

        const schedule = () => {
            const sig = computeSignature(editor);
            if (sig === lastSigRef.current) return; // only a mark changed
            if (semanticDebounceRef.current) clearTimeout(semanticDebounceRef.current);
            semanticDebounceRef.current = setTimeout(() => {
                lastSigRef.current = computeSignature(editor);
                runValidation();
            }, 1000);
        };

        editor.on('update', schedule);
        return () => {
            editor.off('update', schedule);
            if (semanticDebounceRef.current) clearTimeout(semanticDebounceRef.current);
        };
    }, [editor, extractTablesForValidation, computeSignature, clearSemanticErrors, applySemanticError]);

    const handleSwitchFile = React.useCallback((targetFileId) => {
        if (targetFileId === activeFileId) return;

        if (editor && activeProject?.id) {
            const currentHtml = editor.getHTML();
            if (activeFileId) {
                updateFileInProject(activeProject.id, activeFileId, { content: currentHtml });
            } else {
                updateProjectContent(activeProject.id, currentHtml);
            }
        }

        setActiveFileId(targetFileId);
    }, [activeFileId, activeProject?.id, editor, updateFileInProject, updateProjectContent]);

    // Sync Editor Content when Project Changes
    useEffect(() => {
        if (!editor || !activeProject) return;

        let cancelled = false;
        const targetContent = activeFileId ? (activeProject.files?.find(f => f.id === activeFileId)?.content || "") : (activeProject.content || "");

        if (targetContent) {
            // Only update if the editor content is different from the target content
            // (This prevents cursor jumping loops)
            const currentContent = editor.getHTML();
            if (currentContent !== targetContent) {
                editor.commands.setContent(targetContent, false);
                editor.commands.focus('end');
            }
        } else {
            // If the local project cache has no content, try to restore the
            // latest saved document from the backend document store.
            const documentId = activeFileId
                ? `${activeProject.id}:${activeFileId}`
                : `${activeProject.id}:main`;
            getDocument(documentId).then((doc) => {
                if (!doc || cancelled) return;
                const savedContent = doc.content;
                if (savedContent) {
                    editor.commands.setContent(savedContent, false);
                    editor.commands.focus('end');
                }
            });
        }

        return () => {
            cancelled = true;
        };
    }, [activeProject?.id, activeFileId, editor, activeProject?.files]); // Dependency on ID is crucial!

    // ---- Integrity / Data Provenance -------------------------------------
    const extractDocumentPayload = React.useCallback((ed) => {
        return {
            document_text: ed.getText(),
            raw_dataset: extractTablesForValidation(ed),
        };
    }, [extractTablesForValidation]);

    const handlePublish = React.useCallback(async () => {
        if (!editor || !activeProject?.id) return;
        setIsPublishing(true);
        const payload = extractDocumentPayload(editor);
        const result = await stampDocument(payload.document_text, payload.raw_dataset);
        if (result.stamp) {
            if (activeFileId) {
                setFileStamp(activeProject.id, activeFileId, result.stamp);
            } else {
                setProjectStamp(activeProject.id, result.stamp);
            }
            setIntegrityStatus('verified');
            setIntegrityMessage('Verified Snapshot: document and dataset stamped at publication.');
        } else {
            setIntegrityStatus('error');
            setIntegrityMessage('Could not reach the integrity service. Is the backend running?');
        }
        setIsPublishing(false);
    }, [editor, activeProject?.id, activeFileId, extractDocumentPayload, setFileStamp, setProjectStamp]);

    // Verify the stored stamp against the current data whenever a document loads.
    useEffect(() => {
        if (!editor || !activeProject?.id) return;

        const storedStamp = activeFileId
            ? (activeProject.files?.find(f => f.id === activeFileId)?.stamp || null)
            : (activeProject.stamp || null);

        if (!storedStamp) {
            setIntegrityStatus('unstamped');
            setIntegrityMessage('');
            return;
        }

        setIntegrityStatus('checking');
        // Wait a tick so the editor content from the load effect is in place.
        const t = setTimeout(async () => {
            const payload = extractDocumentPayload(editor);
            const result = await verifyDocument(payload.document_text, payload.raw_dataset, storedStamp);
            if (result.valid) {
                setIntegrityStatus('verified');
                setIntegrityMessage(result.message);
            } else {
                setIntegrityStatus('tampered');
                setIntegrityMessage(result.message);
            }
        }, 50);

        return () => clearTimeout(t);
    }, [activeProject?.id, activeFileId, editor, activeProject?.files, extractDocumentPayload]);

    // ---- Version Control (Full Snapshot Strategy) -------------------------
    const currentDocumentId = activeProject?.id
        ? `${activeProject.id}:${activeFileId || 'main'}`
        : null;

    const handleSaveVersion = React.useCallback(async (label) => {
        if (!editor || !currentDocumentId) return;
        const snapshot = editor.getJSON();
        const result = await saveVersion(
            currentDocumentId,
            snapshot,
            label,
            user?.name || 'Researcher'
        );
        return result.version;
    }, [editor, currentDocumentId, user?.name]);

    // Idle auto-save: save a snapshot after 10 minutes of no typing.
    useEffect(() => {
        if (!editor || !currentDocumentId) return;

        let idleTimer = null;
        const resetIdle = () => {
            if (idleTimer) clearTimeout(idleTimer);
            idleTimer = setTimeout(() => {
                const now = Date.now();
                if (now - lastAutoSaveRef.current >= 10 * 60 * 1000) {
                    lastAutoSaveRef.current = now;
                    handleSaveVersion('Auto-save (idle)');
                }
            }, 10 * 60 * 1000);
        };

        editor.on('update', resetIdle);
        resetIdle();
        return () => {
            if (idleTimer) clearTimeout(idleTimer);
            editor.off('update', resetIdle);
        };
    }, [editor, currentDocumentId, handleSaveVersion, lastAutoSaveRef]);

    // Close-tab save: persist a snapshot when the tab is closed/hidden.
    useEffect(() => {
        if (!editor || !currentDocumentId) return;

        const handleBeforeUnload = () => {
            const snapshot = editor.getJSON();
            // Use sendBeacon for a fire-and-forget save on tab close.
            const payload = JSON.stringify({
                document_id: currentDocumentId,
                snapshot_content: snapshot,
                label: 'Auto-save (tab close)',
                author: user?.name || 'Researcher',
            });
            if (navigator.sendBeacon) {
                navigator.sendBeacon('/api/versions', new Blob([payload], { type: 'application/json' }));
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [editor, currentDocumentId, user?.name]);

    // Auto-save: PUT the document every 5 seconds (or after typing stops).
    useEffect(() => {
        if (!editor || !currentDocumentId) return;

        let interval = null;
        let debounce = null;

        const doSave = () => {
            saveDocument(currentDocumentId, editor.getJSON());
        };

        // Save every 5 seconds.
        interval = setInterval(doSave, 5000);

        // Also save shortly after the user stops typing.
        const onUpdate = () => {
            if (debounce) clearTimeout(debounce);
            debounce = setTimeout(doSave, 2000);
        };
        editor.on('update', onUpdate);

        return () => {
            if (interval) clearInterval(interval);
            if (debounce) clearTimeout(debounce);
            editor.off('update', onUpdate);
        };
    }, [editor, currentDocumentId]);

    useEffect(() => {
        if (!editor) return;
        const updateSelection = () => {
            if (editor.isActive('image')) {
                setSelectionType('image');
            } else if (editor.isActive('graphBlock')) {
                setSelectionType('graph');
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

    // Safety net: any image that still ends up with a session-only blob URL is
    // rewritten to a data URL while that URL is still readable, so saved
    // documents and version snapshots always carry the image bytes.
    useEffect(() => {
        if (!editor) return;

        const embedBlobImages = () => {
            const pending = [];
            editor.state.doc.descendants((node, pos) => {
                if (node.type.name === 'image' && node.attrs.src?.startsWith('blob:')) {
                    pending.push({ pos, src: node.attrs.src });
                }
            });
            pending.forEach(({ pos, src }) => {
                toDurableDataUrl(src)
                    .then((dataUrl) => {
                        if (!dataUrl) return;
                        const node = editor.state.doc.nodeAt(pos);
                        if (!node || node.type.name !== 'image' || node.attrs.src !== src) return;
                        editor.view.dispatch(
                            editor.state.tr.setNodeMarkup(pos, undefined, { ...node.attrs, src: dataUrl })
                        );
                    })
                    .catch(() => { /* blob already revoked; nothing recoverable */ });
            });
        };

        embedBlobImages();
        editor.on('update', embedBlobImages);
        return () => editor.off('update', embedBlobImages);
    }, [editor]);

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

    // 1. Mandatory DragOver handler to allow dropping
    const handleDragOver = (e) => {
        e.preventDefault(); // Crucial: This tells the browser "It's okay to drop here"
        e.stopPropagation();
    };

    // 2. The Master Drop Handler (Container Interception pattern)
    const handleDrop = (e) => {
        // Only intercept if files are being dropped from the OS
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];

            // Check for PDF specifically
            if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
                e.preventDefault();  // Stop the browser from opening the PDF in a new tab
                e.stopPropagation(); // Stop ProseMirror from also seeing this event

                const url = URL.createObjectURL(file);

                // Insert the Smart Chip at the current selection
                editor.chain().focus().insertContent({
                    type: 'pdfSmartChip',
                    attrs: { src: url, fileName: file.name }
                }).run();

                return; // We handled it, exit.
            }

            // Check for SVG
            if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
                e.preventDefault();
                e.stopPropagation();
                const reader = new FileReader();
                reader.onload = () => {
                    const svgText = reader.result;
                    const dataUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgText)));
                    setPendingSvg({ url: dataUrl, name: file.name, rawSvg: svgText });
                    setIsSvgModalOpen(true);
                };
                reader.readAsText(file);
                return;
            }

            // Check for images
            if (file.type.startsWith('image/')) {
                e.preventDefault();
                e.stopPropagation();
                const reader = new FileReader();
                reader.onload = () => {
                    if (editor) {
                        editor.chain().focus().setImage({ src: reader.result }).run();
                    }
                };
                reader.readAsDataURL(file);
                return;
            }

            // Check for CSV/TXT
            if (file.name.endsWith('.csv') || file.type === 'text/csv' || file.name.endsWith('.txt')) {
                e.preventDefault();
                e.stopPropagation();
                const reader = new FileReader();
                reader.onload = () => {
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
                };
                reader.readAsText(file);
                return;
            }
        }

        // Handle internal workbench drop
        try {
            const data = e.dataTransfer.getData('application/json');
            if (!data) return;
            const fileObject = JSON.parse(data);

            if (fileObject.type === 'image/svg+xml') {
                // fileObject.data may be a data URL, a session-only blob URL, or raw text
                const source = fileObject.data || fileObject.url;
                const isBlobUrl = typeof source === 'string' && source.startsWith('blob:');
                if (isBlobUrl) {
                    toDurableDataUrl(source).then((dataUrl) => {
                        if (!dataUrl) return;
                        setPendingSvg({
                            url: dataUrl,
                            name: fileObject.name,
                            rawSvg: atob(dataUrl.split(',')[1] || ''),
                        });
                        setIsSvgModalOpen(true);
                    }).catch(() => setIsImporting(false));
                } else {
                    const isDataUrl = source?.startsWith('data:');
                    const rawSvg = isDataUrl ? atob(source.split(',')[1] || '') : source;
                    const url = isDataUrl ? source : 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(source)));
                    setPendingSvg({ url, name: fileObject.name, rawSvg });
                    setIsSvgModalOpen(true);
                }
            } else if (fileObject.type.startsWith('image/') && editor) {
                // Never insert a blob URL: it dies with the page session and the
                // image would be missing after a reload or a version restore.
                toDurableDataUrl(fileObject.data || fileObject.url)
                    .then((dataUrl) => {
                        if (dataUrl && editor) {
                            editor.chain().focus().setImage({ src: dataUrl }).run();
                        }
                    })
                    .catch((err) => console.error('Could not embed dropped image', err));
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
            <div className="h-14 bg-[#F4EBE1] border-b border-[#D8C7B9] px-6 lg:px-10 flex items-center justify-between shrink-0 z-20">

                {/* Left: Logo */}
                <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="w-7 h-7 rounded-lg bg-[#62414A] flex items-center justify-center text-white shadow-sm">
                        <FlaskConical size={16} strokeWidth={2.5} />
                    </div>
                    <span className="font-extrabold text-[#3E2A2F] text-lg tracking-tight">Vitro Workspace</span>
                </a>

                {/* Center: Dashboard Link */}
                <div className="flex-1 flex items-center justify-center gap-6 md:gap-8 z-10 hidden md:flex">
                    <button onClick={() => navigate('/dashboard')} className="text-sm font-bold text-[#3E2A2F]/70 hover:text-[#3E2A2F] transition-colors">Dashboard</button>
                </div>

                <div className="flex items-center gap-3 z-10 shrink-0 bg-white/40 p-1 pr-1.5 rounded-full border border-white/40 shadow-sm backdrop-blur-md hidden sm:flex">
                    <button
                        onClick={handleCreateNewProject}
                        className="text-[11px] font-bold px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-[#B7684C] text-[#B7684C] hover:bg-[#B7684C] hover:text-white transition-all shadow-sm"
                    >
                        New Project
                    </button>
                    <a href="/settings" className="h-8 w-8 rounded-full border-2 border-white shadow-sm overflow-hidden shrink-0 block hover:opacity-90 transition-opacity">
                        <Avatar name={user?.name || 'User'} size={32} />
                    </a>
                </div>

            </div>

            {/* Main Body Wrapper */}
            <div className="flex-1 flex overflow-hidden bg-[#FDF6F0] gap-0">

                {/* Column 1: Left Workbench Sidebar */}
                <div className={`hidden md:flex flex-col bg-gradient-to-b from-[#62414A] to-[#B7684C] flex-shrink-0 z-10 m-0 rounded-none overflow-hidden shadow-lg border-r border-[#D8C7B9] transition-all duration-300 ${isLeftSidebarCollapsed ? 'w-20' : 'w-72'}`}>
                    <div className={`p-6 pb-2 flex items-center ${isLeftSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
                        {!isLeftSidebarCollapsed && <h2 className="text-[#3E2A2F] font-bold text-lg whitespace-nowrap">Project Workbench</h2>}
                        <button
                            onClick={() => setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed)}
                            className="text-[#3E2A2F] hover:bg-white/10 p-1 rounded-md transition-colors"
                        >
                            {isLeftSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                        </button>
                    </div>

                    {!isLeftSidebarCollapsed && <div className="w-full h-px bg-[#3E2A2F]/20 mb-4 px-6"></div>}

                    {/* File Tree */}
                    <div className={`space-y-3 pb-6 overflow-y-auto overflow-x-hidden flex-1 ${isLeftSidebarCollapsed ? 'px-2 items-center flex flex-col' : 'px-6'}`}>
                        <div className={`flex items-center bg-[#F4EBE1]/90 rounded-xl shadow-sm cursor-pointer border border-[#D8C7B9]/50 ${isLeftSidebarCollapsed ? 'p-3 justify-center w-12 h-12 shrink-0' : 'justify-between px-4 py-3'}`}>
                            <div className={`flex items-center text-[#3E2A2F] font-semibold text-sm truncate ${isLeftSidebarCollapsed ? '' : 'gap-3 pr-2'}`}>
                                <Folder size={isLeftSidebarCollapsed ? 20 : 18} className="text-[#B7684C] shrink-0" fill="currentColor" />
                                {!isLeftSidebarCollapsed && <span className="truncate">{activeProject?.name || 'Untitled Project'}</span>}
                            </div>
                            {!isLeftSidebarCollapsed && <ChevronDown size={16} className="text-[#3E2A2F] shrink-0" />}
                        </div>

                        <div className={`${isLeftSidebarCollapsed ? 'space-y-4 pt-4 flex flex-col items-center w-full' : 'pl-4 space-y-3'}`}>
                            <div
                                onClick={() => handleSwitchFile(null)}
                                className={`flex items-center bg-white/95 rounded-xl shadow-sm cursor-pointer hover:bg-white transition-colors border-l-4 ${!activeFileId ? 'border-[#B7684C]' : 'border-transparent'} ${isLeftSidebarCollapsed ? 'justify-center w-12 h-12 shrink-0' : 'gap-3 px-4 py-3'}`}
                            >
                                <FileText size={isLeftSidebarCollapsed ? 20 : 18} className="text-[#B7684C] shrink-0" />
                                {!isLeftSidebarCollapsed && <span className="text-[#3E2A2F] font-bold text-sm truncate">{activeProject?.name || 'Untitled'}.docx</span>}
                            </div>

                            {activeProject?.files?.map((f) => (
                                <div
                                    key={f.id}
                                    draggable="true"
                                    onDragStart={(e) => handleDragStart(e, f)}
                                    onClick={() => handleSwitchFile(f.id)}
                                    className={`flex items-center bg-white/95 rounded-xl shadow-sm cursor-grab hover:bg-white transition-colors border-l-4 ${activeFileId === f.id ? 'border-[#B7684C]' : 'border-transparent'} hover:border-blue-200/50 ${isLeftSidebarCollapsed ? 'justify-center w-12 h-12 shrink-0' : 'gap-3 px-4 py-3'}`}
                                >
                                    {f.type.startsWith('image/') ? <ImageIcon size={isLeftSidebarCollapsed ? 20 : 18} className="text-blue-400 shrink-0" /> : f.type === 'page' ? <FileText size={isLeftSidebarCollapsed ? 20 : 18} className="text-stone-500 shrink-0" /> : <BarChart2 size={isLeftSidebarCollapsed ? 20 : 18} className="text-emerald-500 shrink-0" />}
                                    {!isLeftSidebarCollapsed && <span className="text-[#3E2A2F] font-medium text-sm truncate" title={f.name}>{f.name}</span>}
                                </div>
                            ))}

                            <label className={`flex items-center justify-center bg-transparent border-2 border-dashed border-white/30 rounded-xl cursor-pointer hover:bg-white/10 transition-colors text-white/90 font-medium ${isLeftSidebarCollapsed ? 'w-12 h-12 mt-2 shrink-0' : 'gap-2 px-4 py-3 text-sm mt-4'}`}>
                                <Upload size={isLeftSidebarCollapsed ? 20 : 16} />
                                {!isLeftSidebarCollapsed && <span>+ Import File</span>}
                                <input type="file" multiple accept=".csv, .jpg, .png, .pdf, .svg" className="hidden" onChange={handleWorkbenchImport} />
                            </label>
                        </div>
                    </div>



                    <div className={`mt-auto space-y-4 border-t border-white/10 py-6 ${isLeftSidebarCollapsed ? 'px-2 flex flex-col items-center' : 'px-6'}`}>
                        <a href="/settings" className={`flex items-center gap-3 text-[#3E2A2F] font-medium text-sm hover:text-white transition-colors ${isLeftSidebarCollapsed ? 'justify-center p-2' : ''}`}>
                            <Settings size={isLeftSidebarCollapsed ? 20 : 18} />
                            {!isLeftSidebarCollapsed && 'Settings'}
                        </a>
                        <button
                            onClick={() => setIsExportModalOpen(true)}
                            className={`flex w-full items-center gap-3 text-[#3E2A2F] font-medium text-sm hover:text-white transition-colors ${isLeftSidebarCollapsed ? 'justify-center p-2' : 'text-left'}`}
                        >
                            <Download size={isLeftSidebarCollapsed ? 20 : 18} />
                            {!isLeftSidebarCollapsed && 'Export PDF'}
                        </button>
                        <button
                            onClick={handleDeleteProject}
                            className={`flex w-full items-center gap-3 text-[#3E2A2F]/60 font-medium text-sm hover:text-[#3E2A2F]/80 transition-colors ${isLeftSidebarCollapsed ? 'justify-center p-2' : 'text-left'}`}
                            title="Delete active project"
                        >
                            <Trash2 size={isLeftSidebarCollapsed ? 20 : 18} />
                            {!isLeftSidebarCollapsed && 'Trash'}
                        </button>
                    </div>
                </div>

                {/* Column 2: Center Editor */}
                <div
                    className={`flex-1 flex flex-col bg-white shadow-sm border-x border-stone-200 h-full overflow-y-auto m-0 rounded-none z-0 relative`}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >

                    <div className={`w-full py-10 px-8 lg:px-12 transition-all duration-300 ease-in-out h-full min-h-full`}>

                        {/* Top Bar inside Editor */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-14">
                            <div className="text-[10px] font-bold text-gray-400 tracking-[0.15em] flex items-center gap-2">
                                <button onClick={() => navigate('/dashboard')} className="hover:text-gray-800 transition-colors">MY PROJECTS</button>
                                <span>/</span>
                                <button onClick={() => handleSwitchFile(null)} className={`font-extrabold uppercase truncate max-w-[200px] hover:text-[#3E2A2F] transition-colors ${!activeFileId ? 'text-[#3E2A2F]' : ''}`}>
                                    {(activeProject?.name || 'Untitled Document').toUpperCase()}
                                </button>
                                {activeFileId && (
                                    <>
                                        <span>/</span>
                                        <span className="text-[#3E2A2F] font-extrabold uppercase truncate max-w-[200px]">{activeFile?.name?.toUpperCase() || 'UNTITLED PAGE'}</span>
                                    </>
                                )}
                            </div>

                            <div className="flex items-center gap-5">
                                <div className="flex items-center gap-2 text-emerald-600 font-medium text-sm">
                                    <Cloud size={16} />
                                    Saved to Cloud
                                </div>

                                <div className="flex items-center">
                                    {activeProject?.collaborators?.length > 0 ? (
                                        <>
                                            <Avatar name={user?.name || 'You'} size={32} className="border-2 border-white relative z-20" />
                                            {activeProject.collaborators.map((collab, i) => (
                                                <span key={i} className="-ml-3 relative" style={{ zIndex: 10 - i }}>
                                                    <Avatar name={collab.name} size={32} className="border-2 border-white" />
                                                </span>
                                            ))}
                                        </>
                                    ) : (
                                        <Avatar name={user?.name || 'You'} size={32} className="border-2 border-white relative z-20" />
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
                                onBlur={() => {
                                    if (activeFileId) {
                                        updateFileInProject(activeProject.id, activeFileId, { name: localTitle || "Untitled Page" });
                                    } else {
                                        updateProjectTitle(activeProject?.id, localTitle || "Untitled Analysis");
                                    }
                                }}
                                onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
                                placeholder={activeFileId ? "Untitled Page" : "Untitled Analysis"}
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

                            {/* Integrity / Provenance toolbar */}
                            <div className="flex items-center justify-between gap-3 mb-4 px-1">
                                <div className="flex items-center gap-2">
                                    {integrityStatus === 'verified' && (
                                        <span className="inline-flex items-center gap-2 bg-green-50 border border-green-300 text-green-800 text-xs font-bold px-3 py-1.5 rounded-full" title={integrityMessage}>
                                            <ShieldCheck className="w-4 h-4" /> Verified Snapshot
                                        </span>
                                    )}
                                    {integrityStatus === 'tampered' && (
                                        <span className="inline-flex items-center gap-2 bg-red-50 border border-red-300 text-red-700 text-xs font-bold px-3 py-1.5 rounded-full" title={integrityMessage}>
                                            <ShieldAlert className="w-4 h-4" /> DATA PROVENANCE FAILED
                                        </span>
                                    )}
                                    {integrityStatus === 'checking' && (
                                        <span className="inline-flex items-center gap-2 bg-amber-50 border border-amber-300 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full">
                                            <span className="animate-spin rounded-full h-3 w-3 border-2 border-amber-600 border-t-transparent" /> Verifying...
                                        </span>
                                    )}
                                    {integrityStatus === 'error' && (
                                        <span className="inline-flex items-center gap-2 bg-amber-50 border border-amber-300 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full" title={integrityMessage}>
                                            <ShieldAlert className="w-4 h-4" /> Integrity service unavailable
                                        </span>
                                    )}
                                    {integrityStatus === 'unstamped' && (
                                        <span className="inline-flex items-center gap-2 bg-stone-100 border border-stone-300 text-stone-500 text-xs font-bold px-3 py-1.5 rounded-full">
                                            <ShieldCheck className="w-4 h-4" /> Not published
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setIsVersionModalOpen(true)}
                                        className="inline-flex items-center gap-2 bg-white border border-[#62414A]/30 text-[#62414A] hover:bg-[#62414A]/10 text-sm font-bold px-4 py-2 rounded-full shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#62414A]/30"
                                        title="View version history and save snapshots"
                                    >
                                        <History className="w-4 h-4" />
                                        Version History
                                    </button>
                                    <button
                                        onClick={handlePublish}
                                        disabled={isPublishing}
                                        className="inline-flex items-center gap-2 bg-[#62414A] hover:bg-[#53353D] disabled:bg-[#62414A]/60 text-white text-sm font-bold px-4 py-2 rounded-full shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#62414A]/50"
                                    >
                                        <BadgeCheck className="w-4 h-4" />
                                        {isPublishing ? 'Stamping...' : 'Finalize / Publish'}
                                    </button>
                                </div>
                            </div>

                            {/* Editor Area */}
                            <div className="mb-10 min-h-[500px] h-full relative cursor-text text-lg" onClick={() => editor?.chain()?.focus()?.run()}>
                                <BlockControls editor={editor} />
                                <EditorContent editor={editor} key={activeFileId || 'main'} className="h-full" />
                                <EditorBubbleMenu editor={editor} />
                                <TableTools editor={editor} />
                                <SemanticTooltip editor={editor} />
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
                                                                <Avatar name={reply.author?.name || 'User'} size={24} />
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
                    chartData={chartData}
                    isCollapsed={isRightSidebarCollapsed}
                    toggleSidebar={() => setIsRightSidebarCollapsed(!isRightSidebarCollapsed)}
                    activeProjectId={activeProject?.id}
                />

            </div>

            {/* Export PDF Modal Overlay */}
            <ExportPdfModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                editor={editor}
                documentName={activeFileId
                    ? (activeProject?.files?.find(f => f.id === activeFileId)?.name || activeProject?.name || 'Untitled Document')
                    : (activeProject?.name || 'Untitled Document')}
            />

            {/* Version History Modal Overlay */}
            <VersionHistoryModal
                isOpen={isVersionModalOpen}
                onClose={() => setIsVersionModalOpen(false)}
                documentId={currentDocumentId}
                documentName={activeFileId
                    ? (activeProject?.files?.find(f => f.id === activeFileId)?.name || activeProject?.name || 'Untitled Document')
                    : (activeProject?.name || 'Untitled Document')}
                editor={editor}
                author={user?.name || 'Researcher'}
            />

            {/* Symbol Picker Modal */}
            <SymbolPickerModal
                isOpen={isSymbolPickerOpen}
                onClose={() => setIsSymbolPickerOpen(false)}
                editor={editor}
            />

            {/* Table Picker Modal */}
            <TablePickerModal editor={editor} />

            {/* SVG Import Modal */}
            <SvgImportModal
                isOpen={isSvgModalOpen}
                onClose={() => {
                    setIsSvgModalOpen(false);
                    setPendingSvg(null);
                }}
                svgData={pendingSvg}
                editor={editor}
            />

            {/* PDF Preview Modal */}
            <PdfPreviewModal
                isOpen={!!previewPdf}
                onClose={() => setPreviewPdf(null)}
                pdfData={previewPdf}
            />

            {/* New Project Modal */}
            <NewProjectModal />

            {/* Smart Table Modal */}
            <CreateTableModal
                isOpen={isTableModalOpen}
                onClose={() => setIsTableModalOpen(false)}
                onSubmit={handleInsertSmartTable}
            />

            {/* Compare Tables Modal */}
            <CompareTablesModal
                isOpen={isCompareModalOpen}
                onClose={() => setIsCompareModalOpen(false)}
                editor={editor}
                onCompare={handleInsertComparisonGraph}
            />

            {/* PDF Link Citation Picker Modal */}
            <LinkPdfModal
                isOpen={isLinkModalOpen}
                onClose={() => setIsLinkModalOpen(false)}
                pdfs={allLinkablePdfs}
                onSelect={handleInsertPdf}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Project"
                message="Are you sure you want to delete this project? This action cannot be undone and the data will be lost."
                confirmText="Delete Project"
                isDestructive={true}
                onConfirm={() => {
                    deleteProject(activeProject?.id);
                    navigate('/dashboard');
                }}
            />
        </div>
    );
}
