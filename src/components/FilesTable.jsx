import React from 'react';
import { FileText, FileSpreadsheet, FileIcon, Folder, Code, Filter, List } from 'lucide-react';

const files = [
    { id: 1, name: 'Abstract_Final_v2.docx', owner: 'Dr. Sarah Smith', date: 'Oct 24, 2023', size: '2.4 MB', type: 'doc', status: 'green', selected: true },
    { id: 2, name: 'Spectroscopy_Raw.csv', owner: 'Me', date: 'Oct 23, 2023', size: '145 MB', type: 'csv', status: 'green', selected: false },
    { id: 3, name: 'Protocol_Safety_Rev1.pdf', owner: 'Lab Admin', date: 'Oct 20, 2023', size: '890 KB', type: 'pdf', status: 'red', selected: false },
    { id: 4, name: 'Archive_2022', owner: 'Me', date: 'Sep 15, 2023', size: '-', type: 'folder', status: 'green', selected: false },
    { id: 5, name: 'Simulation_Script.py', owner: 'Dr. J. Doe', date: 'Sep 12, 2023', size: '12 KB', type: 'code', status: 'green', selected: false },
];

const getIcon = (type) => {
    switch (type) {
        case 'doc': return <FileText size={18} className="text-blue-400" />;
        case 'csv': return <FileSpreadsheet size={18} className="text-emerald-400" />;
        case 'pdf': return <FileIcon size={18} className="text-rose-400" />;
        case 'folder': return <Folder size={18} className="text-amber-400" />;
        case 'code': return <Code size={18} className="text-purple-400" />;
        default: return <FileIcon size={18} className="text-gray-400" />;
    }
};

export default function FilesTable({ onSelectFile }) {
    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg text-gray-800">All Files</h2>
                <div className="flex bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <button className="px-3 py-1.5 text-gray-500 hover:bg-gray-50 border-r border-gray-100 transition-colors">
                        <Filter size={16} />
                    </button>
                    <button className="px-3 py-1.5 text-gray-500 hover:bg-gray-50 transition-colors">
                        <List size={16} />
                    </button>
                </div>
            </div>

            <div className="w-full">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-bold text-[#A46761] tracking-wider uppercase">
                    <div className="col-span-5">NAME</div>
                    <div className="col-span-3">OWNER</div>
                    <div className="col-span-2">LAST MODIFIED</div>
                    <div className="col-span-1">FILE SIZE</div>
                    <div className="col-span-1 text-right">PROVENANCE</div>
                </div>

                {/* Table Body */}
                <div className="bg-[#734A54] rounded-2xl overflow-hidden shadow-sm">
                    {files.map((file, index) => (
                        <div
                            key={file.id}
                            onClick={() => onSelectFile && onSelectFile(file)}
                            className={`grid grid-cols-12 gap-4 px-6 py-4 items-center text-sm text-white cursor-pointer transition-colors ${file.selected ? 'bg-black/10' : 'hover:bg-white/5'} ${index !== files.length - 1 ? 'border-b border-white/10' : ''}`}
                        >
                            <div className="col-span-5 flex items-center gap-3 font-medium">
                                {getIcon(file.type)}
                                {file.name}
                            </div>

                            <div className="col-span-3 flex items-center gap-2">
                                {file.owner === 'Me' ? (
                                    <div className="h-6 w-6 rounded-full bg-[#C06C4E] flex items-center justify-center text-[10px] font-bold text-white shrink-0">ME</div>
                                ) : (
                                    <div className="h-6 w-6 rounded-full bg-orange-200 overflow-hidden shrink-0">
                                        <img src={`https://ui-avatars.com/api/?name=${file.owner.replace(' ', '+')}&background=random&color=fff`} alt={file.owner} className="h-full w-full object-cover" />
                                    </div>
                                )}
                                <span className="text-white/80 text-xs">{file.owner}</span>
                            </div>

                            <div className="col-span-2 flex flex-col justify-center">
                                {file.date.split(',').map((part, i) => (
                                    <span key={i} className="text-white/80 text-xs leading-tight">{part.trim()}</span>
                                ))}
                            </div>

                            <div className="col-span-1 flex flex-col justify-center">
                                <span className="text-white/80 text-xs leading-tight">{file.size.split(' ')[0]}</span>
                                {file.size.includes(' ') && <span className="text-white/60 text-[10px] leading-tight font-bold">{file.size.split(' ')[1]}</span>}
                            </div>

                            <div className="col-span-1 flex justify-end items-center pr-4">
                                <div className={`h-3 w-3 rounded-full border-2 border-[#734A54] outline outline-2 ${file.status === 'green' ? 'bg-emerald-400 outline-emerald-400/50' : 'bg-rose-400 outline-rose-400/50'}`}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Floating Action Button - Positioned absolutely in parent typically, but placed here for structure */}
            <div className="fixed bottom-6 right-[400px] z-20">
                <button className="bg-[#734A54] hover:bg-[#5E3C44] text-white px-6 py-3 rounded-full shadow-lg font-medium flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
                    <span className="text-xl leading-none font-light">+</span> New Project
                </button>
            </div>

        </div>
    );
}
