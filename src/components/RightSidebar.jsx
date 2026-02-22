import React, { useState } from 'react';
import CommentsPanel from './CommentsPanel';
import GraphSettingsPanel from './GraphSettingsPanel';
import { CheckCircle2, Option, Save, Upload } from 'lucide-react';

function HistoryPanel() {
    return (
        <div className="py-4 space-y-4 w-full">
            {/* Card 1 */}
            <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-emerald-500 cursor-pointer">
                <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-bold text-[#3E2A2F]">Current Version</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">Now</p>
                    </div>
                </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white/95 rounded-xl p-4 shadow-sm cursor-pointer hover:bg-white transition-colors">
                <div className="flex items-start gap-3">
                    <Option size={18} className="text-gray-400 shrink-0 mt-0.5" />
                    <div className="w-full">
                        <div className="flex justify-between items-center w-full">
                            <h4 className="text-sm font-bold text-[#3E2A2F]">Snapshot: Pre-...</h4>
                            <span className="text-[10px] text-gray-400 font-bold">10 mins ago</span>
                        </div>
                        <div className="h-6 w-16 bg-gray-50 rounded mt-2 border border-gray-100 hidden sm:block"></div>
                    </div>
                </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white/95 rounded-xl p-4 shadow-sm cursor-pointer hover:bg-white transition-colors">
                <div className="flex items-start gap-3">
                    <Save size={18} className="text-gray-400 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-bold text-[#3E2A2F]">Auto-Save</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">1 hour ago</p>
                    </div>
                </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white/95 rounded-xl p-4 shadow-sm cursor-pointer hover:bg-white transition-colors">
                <div className="flex items-start gap-3">
                    <Upload size={18} className="text-gray-400 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-bold text-[#3E2A2F]">Original Import</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">Yesterday</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function RightSidebar() {
    const [activeTab, setActiveTab] = useState('History');

    return (
        <div className="w-72 hidden xl:flex flex-col bg-gradient-to-b from-[#62414A] to-[#B7684C] flex-shrink-0 z-10 m-4 lg:m-6 rounded-3xl overflow-hidden shadow-lg border border-white/10">

            {/* Top Navigation / Tabs */}
            <div className="flex justify-between px-6 pt-6 mb-2 border-b border-white/30">
                <button
                    onClick={() => setActiveTab('Graph Settings')}
                    className={`text-[10px] font-bold tracking-widest uppercase pb-2 transition-colors relative flex-1 text-center ${activeTab === 'Graph Settings' ? 'text-[#3E2A2F]' : 'text-[#3E2A2F]/60 hover:text-[#3E2A2F]/80'}`}
                >
                    <span className="whitespace-pre-line leading-tight block">Graph<br />Settings</span>
                    {activeTab === 'Graph Settings' && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#8B6ACB] rounded-t-full"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('History')}
                    className={`text-[10px] font-bold tracking-widest uppercase pb-2 transition-colors relative flex-1 text-center flex items-end justify-center ${activeTab === 'History' ? 'text-[#3E2A2F]' : 'text-[#3E2A2F]/60 hover:text-[#3E2A2F]/80'}`}
                >
                    <span>History</span>
                    {activeTab === 'History' && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#3E2A2F] rounded-t-full"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('Comments')}
                    className={`text-[10px] font-bold tracking-widest uppercase pb-2 transition-colors relative flex-1 text-center flex items-end justify-center ${activeTab === 'Comments' ? 'text-[#3E2A2F]' : 'text-[#3E2A2F]/60 hover:text-[#3E2A2F]/80'}`}
                >
                    <span>Comments</span>
                    {activeTab === 'Comments' && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#3E2A2F] rounded-t-full"></div>}
                </button>
            </div>

            <div className="px-6 pb-6 pt-0 overflow-y-auto flex-1 w-full">
                {activeTab === 'Graph Settings' && <GraphSettingsPanel />}
                {activeTab === 'History' && <HistoryPanel />}
                {activeTab === 'Comments' && <CommentsPanel />}
            </div>

        </div>
    );
}
