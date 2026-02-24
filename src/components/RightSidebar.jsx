import React from 'react';
import { ChevronRight, ChevronLeft, BarChart2, Settings, MessageSquare } from 'lucide-react';
import CommentsPanel from './CommentsPanel';
import GraphSettingsPanel from './GraphSettingsPanel';
import PropertiesPanel from './PropertiesPanel';
import { useAppContext } from '../context/AppContext';

export default function RightSidebar({ comments, setComments, editor, user, selectionType, chartData, isCollapsed, toggleSidebar }) {
    const { activeRightPanel, setActiveRightPanel } = useAppContext();

    return (
        <div className={`hidden xl:flex flex-col bg-gradient-to-b from-[#62414A] to-[#B7684C] flex-shrink-0 z-10 m-4 lg:m-6 rounded-3xl overflow-hidden whitespace-nowrap shadow-lg border border-white/10 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-72'}`}>

            {/* Header / Toggle */}
            <div className={`flex ${isCollapsed ? 'justify-center p-4 pb-0' : 'justify-start px-6 pt-4 pb-0'}`}>
                <button
                    onClick={toggleSidebar}
                    className="text-[#3E2A2F] hover:bg-white/10 p-1.5 rounded-lg transition-colors"
                >
                    {isCollapsed ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>
            </div>

            {/* Top Navigation / Tabs */}
            {/* Top Navigation / Tabs */}
            <div className={`flex ${isCollapsed ? 'flex-col items-center gap-6 py-6 border-b border-white/30' : 'justify-between px-6 pt-4 mb-2 border-b border-white/30'}`}>
                <button
                    onClick={() => setActiveRightPanel('settings')}
                    className={`text-[10px] font-bold tracking-widest uppercase pb-2 transition-all relative flex-1 text-center justify-center flex ${isCollapsed ? 'items-center py-4' : 'items-end'} ${activeRightPanel === 'settings' ? 'text-[#3E2A2F]' : 'text-[#3E2A2F]/60 hover:text-[#3E2A2F]/80'}`}
                    title="Graph Settings"
                >
                    {isCollapsed ? <BarChart2 size={24} /> : <span className={`whitespace-pre-line leading-tight block transition-opacity duration-200 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>Graph<br />Settings</span>}
                    {activeRightPanel === 'settings' && !isCollapsed && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#8B6ACB] rounded-t-full"></div>}
                </button>
                <button
                    onClick={() => setActiveRightPanel('properties')}
                    className={`text-[10px] font-bold tracking-widest uppercase pb-2 transition-all relative flex-1 text-center flex justify-center ${isCollapsed ? 'items-center py-4' : 'items-end'} ${activeRightPanel === 'properties' ? 'text-[#3E2A2F]' : 'text-[#3E2A2F]/60 hover:text-[#3E2A2F]/80'}`}
                    title="Properties"
                >
                    {isCollapsed ? <Settings size={24} /> : <span className={`transition-opacity duration-200 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>Properties</span>}
                    {activeRightPanel === 'properties' && !isCollapsed && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#3E2A2F] rounded-t-full"></div>}
                </button>
                <button
                    onClick={() => setActiveRightPanel('comments')}
                    className={`text-[10px] font-bold tracking-widest uppercase pb-2 transition-all relative flex-1 text-center flex justify-center ${isCollapsed ? 'items-center py-4' : 'items-end'} ${activeRightPanel === 'comments' ? 'text-[#3E2A2F]' : 'text-[#3E2A2F]/60 hover:text-[#3E2A2F]/80'}`}
                    title="Comments"
                >
                    {isCollapsed ? <MessageSquare size={24} /> : <span className={`transition-opacity duration-200 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>Comments</span>}
                    {activeRightPanel === 'comments' && !isCollapsed && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#3E2A2F] rounded-t-full"></div>}
                </button>
            </div>

            {!isCollapsed && (
                <div className="px-6 pb-6 pt-0 overflow-y-auto flex-1 w-full">
                    {activeRightPanel === 'settings' && <GraphSettingsPanel />}
                    {activeRightPanel === 'properties' && <PropertiesPanel editor={editor} selectionType={selectionType} chartData={chartData} />}
                    {activeRightPanel === 'comments' && <CommentsPanel comments={comments} setComments={setComments} editor={editor} user={user} />}
                </div>
            )}

        </div>
    );
}
