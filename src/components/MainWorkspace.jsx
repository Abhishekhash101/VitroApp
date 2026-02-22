import React, { useState } from 'react';
import {
    FlaskConical, ChevronDown, Folder, FileText, BarChart2, Option,
    Settings, Download, Trash2, Cloud, Share, CheckCircle2, Save, Upload,
    Clock, Image as ImageIcon
} from 'lucide-react';
import ShareModal from './ShareModal';
import ExportPdfModal from './ExportPdfModal';
import RightSidebar from './RightSidebar';
import { useAppContext } from '../context/AppContext';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useParams, useNavigate } from 'react-router-dom';
import Papa from 'papaparse';

export default function MainWorkspace() {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const {
        projects,
        addFileToProject,
        isShareModalOpen, setIsShareModalOpen,
        isExportModalOpen, setIsExportModalOpen,
        isBidirectionalEnabled
    } = useAppContext();

    // Start entirely empty (Phase 3 requirements)
    const [chartData, setChartData] = useState([]);

    // Find the current project meta
    const activeProject = projects.find(p => p.id === (projectId || ''));

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

    // CSV Parsing Logic
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: (results) => {
                const formattedData = results.data.map((row, index) => ({
                    id: index,
                    time: parseFloat(row.time || row.Time || index || 0),
                    temp: parseFloat(row.temp || row.temperature || row.Temperature || row.Temp || 0),
                    pressure: parseFloat(row.pressure || row.Pressure || 100.0),
                    outlier: 'No'
                }));
                setChartData(formattedData);
            }
        });
    };

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
                    Papa.parse(reader.result, {
                        header: true,
                        dynamicTyping: true,
                        skipEmptyLines: true,
                        complete: (results) => {
                            const formattedData = results.data.map((row, index) => ({
                                id: index,
                                time: parseFloat(row.time || row.Time || index || 0),
                                temp: parseFloat(row.temp || row.temperature || row.Temperature || row.Temp || 0),
                                pressure: parseFloat(row.pressure || row.Pressure || 100.0),
                                outlier: 'No'
                            }));
                            setChartData(formattedData);
                        }
                    });
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
                Papa.parse(fileObject.data, {
                    header: true,
                    dynamicTyping: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        const formattedData = results.data.map((row, index) => ({
                            id: index,
                            time: parseFloat(row.time || row.Time || index || 0),
                            temp: parseFloat(row.temp || row.temperature || row.Temperature || row.Temp || 0),
                            pressure: parseFloat(row.pressure || row.Pressure || 100.0),
                            outlier: 'No'
                        }));
                        setChartData(formattedData);
                    }
                });
            }
        } catch (err) {
            console.error("Drop error", err);
        }
    };

    // TipTap Editor Configuration with Image Extension
    const editor = useEditor({
        extensions: [StarterKit, Image],
        content: '', // Start entirely empty (Phase 3 requirements)
        editorProps: {
            attributes: {
                class: 'prose prose-lg focus:outline-none max-w-none text-[#444] font-serif leading-relaxed min-h-[120px]',
                placeholder: 'Start typing your analysis here...',
            },
        },
    });

    // Image Upload Logic for TipTap
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file || !editor) return;

        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result;
            editor.chain().focus().setImage({ src: base64 }).run();
        };
        reader.readAsDataURL(file);
    };

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
                                <span className="text-[#3E2A2F] font-extrabold uppercase truncate max-w-[200px]">{activeProject?.name || 'Untitled Document'}</span>
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
                                    onClick={() => setIsShareModalOpen(true)}
                                    className="bg-[#B7684C] hover:bg-[#A45C49] text-white px-5 py-2 rounded-full font-bold text-sm shadow-sm transition-colors"
                                >
                                    Share
                                </button>
                            </div>
                        </div>

                        {/* Document Content */}
                        <div className="mb-14">
                            <h1 className="text-4xl lg:text-[44px] font-serif text-[#111111] font-bold leading-tight mb-4 tracking-tight">
                                {activeProject?.name || 'Untitled Analysis'}
                            </h1>
                            <div className="inline-block bg-[#62414A] text-white text-[10px] font-extrabold tracking-widest px-3 py-1.5 rounded uppercase mb-8">
                                {activeProject?.owner || 'Owner'}
                            </div>

                            {/* TipTap Image Upload Toolbar */}
                            <div className="flex items-center gap-2 mb-4 bg-gray-50 border border-gray-200 rounded-lg p-2 max-w-max text-gray-600">
                                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-gray-200 px-3 py-1.5 rounded transition-colors">
                                    <ImageIcon size={16} />
                                    Insert Image
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                </label>
                            </div>

                            {/* Editor Area */}
                            <div className="mb-10 min-h-[120px]">
                                <EditorContent editor={editor} />
                            </div>

                            {/* Action Bar for Tables & Data */}
                            <div className="flex justify-between flex-wrap gap-4 items-center mb-6">
                                <h3 className="text-[#3E2A2F] font-bold text-lg font-serif">Experimental Data</h3>
                                <label className="flex items-center gap-2 bg-[#62414A] hover:bg-[#53353D] text-white px-4 py-2 rounded-full font-bold text-sm shadow-sm transition-colors cursor-pointer">
                                    <Upload size={16} />
                                    Import CSV
                                    <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
                                </label>
                            </div>

                            {chartData.length === 0 ? (
                                /* Empty State for Graph & Table Content */
                                <div className="border border-dashed border-[#D8C7B9] bg-[#F4EBE1]/50 rounded-2xl p-16 flex flex-col items-center justify-center text-center">
                                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 text-[#B7684C]">
                                        <BarChart2 size={32} />
                                    </div>
                                    <h3 className="text-[#3E2A2F] font-bold text-lg mb-2">No Data Available</h3>
                                    <p className="text-[#3E2A2F]/60 text-sm max-w-sm font-medium mb-6">
                                        Import a CSV file to automatically generate a data table and dynamic chart visualization.
                                    </p>
                                    <label className="bg-white border border-[#D8C7B9] text-[#62414A] hover:bg-gray-50 px-6 py-2.5 rounded-full font-bold text-sm shadow-sm transition-colors cursor-pointer inline-flex items-center gap-2">
                                        <Upload size={16} />
                                        Upload CSV Configuration
                                        <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
                                    </label>
                                </div>
                            ) : (
                                <>
                                    {/* Data Table */}
                                    <div className="border border-[#E5D7CC] rounded-xl overflow-hidden mb-12 shadow-sm font-sans">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-[#DFC0A3] text-[#3E2A2F] text-xs uppercase tracking-wider font-bold">
                                                <tr>
                                                    <th className="px-6 py-4">Time (S)</th>
                                                    <th className="px-6 py-4">Temp (C)</th>
                                                    <th className="px-6 py-4">Pressure (KPA)</th>
                                                    <th className="px-6 py-4">Outlier?</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {chartData.map((row, index) => (
                                                    <tr key={row.id} className={row.outlier === 'Yes' ? 'bg-[#9B594D] text-white font-bold' : 'bg-white hover:bg-gray-50/50'}>
                                                        <td className="px-6 py-4">
                                                            <input
                                                                type="number"
                                                                value={row.time}
                                                                onChange={(e) => handleTableChange(index, 'time', e.target.value)}
                                                                className={`w-full bg-transparent border-none focus:ring-2 focus:ring-[#864A3D]/40 rounded px-1 outline-none ${row.outlier === 'Yes' ? 'text-white' : 'text-gray-600'}`}
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <input
                                                                type="number"
                                                                value={row.temp}
                                                                onChange={(e) => handleTableChange(index, 'temp', e.target.value)}
                                                                className={`w-full bg-transparent border-none focus:ring-2 focus:ring-[#864A3D]/40 rounded px-1 outline-none ${row.outlier === 'Yes' ? 'text-white' : 'text-gray-600'}`}
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <input
                                                                type="number"
                                                                value={row.pressure}
                                                                onChange={(e) => handleTableChange(index, 'pressure', e.target.value)}
                                                                className={`w-full bg-transparent border-none focus:ring-2 focus:ring-[#864A3D]/40 rounded px-1 outline-none ${row.outlier === 'Yes' ? 'text-white' : 'text-gray-600'}`}
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <select
                                                                value={row.outlier}
                                                                onChange={(e) => handleTableChange(index, 'outlier', e.target.value)}
                                                                className={`bg-transparent border-none focus:ring-2 focus:ring-[#864A3D]/40 rounded outline-none cursor-pointer ${row.outlier === 'Yes' ? 'text-white' : 'text-gray-600'}`}
                                                            >
                                                                <option value="No" className="text-gray-800">No</option>
                                                                <option value="Yes" className="text-gray-800">Yes</option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Chart Section */}
                                    <div className="bg-[#EAD4C7] rounded-xl p-8 shadow-inner border border-[#D8C7B9] font-sans">
                                        <h3 className="text-[#3E2A2F] font-bold text-lg mb-8 font-serif">Time vs. Temperature Analysis</h3>

                                        {/* Dynamic Recharts Component */}
                                        <div className="w-full h-56 pt-4">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3E2A2F20" />
                                                    <XAxis dataKey="time" axisLine={{ stroke: '#3E2A2F40' }} tickLine={false} tick={{ fontSize: 10, fill: '#3E2A2F80' }} dy={10} />
                                                    <YAxis axisLine={{ stroke: '#3E2A2F40' }} tickLine={false} tick={{ fontSize: 10, fill: '#3E2A2F80' }} />
                                                    <Tooltip
                                                        contentStyle={{ backgroundColor: '#62414A', color: 'white', borderRadius: '8px', border: 'none', fontSize: '12px' }}
                                                        itemStyle={{ color: 'white' }}
                                                    />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="temp"
                                                        stroke="#3E2A2F"
                                                        strokeWidth={2.5}
                                                        dot={{ r: 4, fill: '#3E2A2F', strokeWidth: 0 }}
                                                        activeDot={{
                                                            r: 7,
                                                            fill: '#B7684C',
                                                            stroke: 'white',
                                                            strokeWidth: 2,
                                                            onClick: isBidirectionalEnabled ? (e, payload) => handleDotClick(e, payload.index) : undefined,
                                                            cursor: isBidirectionalEnabled ? 'pointer' : 'default'
                                                        }}
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="text-center text-[10px] text-gray-400 font-medium italic mt-2">
                                            {isBidirectionalEnabled ? "Click on a data point to mock a bi-directional drag/edit (+2 Temp)" : "Bi-directional editing is currently disabled in formatting settings."}
                                        </div>

                                    </div>
                                </>
                            )}

                        </div>
                    </div>

                </div>

                {/* Column 3: Dynamic Right Sidebar */}
                <RightSidebar />

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
        </div>
    );
}
