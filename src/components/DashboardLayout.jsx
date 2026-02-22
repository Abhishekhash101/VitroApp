import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopNavigation from './TopNavigation';
import QuickAccessGallery from './QuickAccessGallery';
import FilesTable from './FilesTable';
import PropertiesPanel from './PropertiesPanel';
import { FlaskConical } from 'lucide-react';

export default function DashboardLayout() {
    const [activeFile, setActiveFile] = useState(null);

    // Default selection
    React.useEffect(() => {
        setActiveFile({
            name: 'Abstract_Final_v2.docx',
            type: 'doc',
            size: '2.4 MB',
            created: 'Oct 10, 2023',
            modified: 'Oct 24, 2023',
            location: '/Experiments 2023/Thesis',
        });
    }, []);

    return (
        <div className="flex h-screen w-full bg-[#F6EFEA] font-sans text-gray-900 overflow-hidden">

            {/* Left Column */}
            <div className="flex flex-col w-64 h-full shrink-0">
                {/* Logo Area */}
                <div className="h-20 flex items-center px-6 bg-[#F6EFEA]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#734A54] flex items-center justify-center text-white">
                            <FlaskConical size={18} strokeWidth={2.5} />
                        </div>
                        <span className="font-bold text-lg tracking-tight">Vitro Workspace</span>
                    </div>
                </div>

                {/* Sidebar Area */}
                <div className="flex-1 bg-[#734A54]">
                    <Sidebar />
                </div>
            </div>

            {/* Right Column */}
            <div className="flex-1 flex flex-col h-full bg-[#F6EFEA] overflow-hidden rounded-tl-2xl shadow-[-4px_0_24px_-10px_rgba(0,0,0,0.1)] z-10">

                {/* TopNavigation */}
                <TopNavigation />

                {/* Content Area */}
                <div className="flex-1 flex overflow-hidden">

                    {/* Main Content Area */}
                    <div className="flex-1 px-10 py-6 overflow-y-auto">
                        <QuickAccessGallery />
                        <FilesTable onSelectFile={setActiveFile} />
                    </div>

                    {/* Properties Panel */}
                    <div className="w-[320px] bg-[#FAF7F5] border-l border-gray-200 shadow-[-4px_0_24px_-10px_rgba(0,0,0,0.05)] overflow-hidden shrink-0 flex flex-col">
                        <PropertiesPanel file={activeFile} />
                    </div>

                </div>
            </div>

        </div>
    );
}
