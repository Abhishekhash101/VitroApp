import React from 'react';
import CommentsPanel from './CommentsPanel';
import GraphSettingsPanel from './GraphSettingsPanel';
import PropertiesPanel from './PropertiesPanel';
import { useAppContext } from '../context/AppContext';

export default function RightSidebar({ comments, setComments, editor, user, selectionType }) {
    const { activeRightPanel, setActiveRightPanel } = useAppContext();

    return (
        <div className="w-72 hidden xl:flex flex-col bg-gradient-to-b from-[#62414A] to-[#B7684C] flex-shrink-0 z-10 m-4 lg:m-6 rounded-3xl overflow-hidden shadow-lg border border-white/10">

            {/* Top Navigation / Tabs */}
            <div className="flex justify-between px-6 pt-6 mb-2 border-b border-white/30">
                <button
                    onClick={() => setActiveRightPanel('settings')}
                    className={`text-[10px] font-bold tracking-widest uppercase pb-2 transition-colors relative flex-1 text-center ${activeRightPanel === 'settings' ? 'text-[#3E2A2F]' : 'text-[#3E2A2F]/60 hover:text-[#3E2A2F]/80'}`}
                >
                    <span className="whitespace-pre-line leading-tight block">Graph<br />Settings</span>
                    {activeRightPanel === 'settings' && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#8B6ACB] rounded-t-full"></div>}
                </button>
                <button
                    onClick={() => setActiveRightPanel('properties')}
                    className={`text-[10px] font-bold tracking-widest uppercase pb-2 transition-colors relative flex-1 text-center flex items-end justify-center ${activeRightPanel === 'properties' ? 'text-[#3E2A2F]' : 'text-[#3E2A2F]/60 hover:text-[#3E2A2F]/80'}`}
                >
                    <span>Properties</span>
                    {activeRightPanel === 'properties' && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#3E2A2F] rounded-t-full"></div>}
                </button>
                <button
                    onClick={() => setActiveRightPanel('comments')}
                    className={`text-[10px] font-bold tracking-widest uppercase pb-2 transition-colors relative flex-1 text-center flex items-end justify-center ${activeRightPanel === 'comments' ? 'text-[#3E2A2F]' : 'text-[#3E2A2F]/60 hover:text-[#3E2A2F]/80'}`}
                >
                    <span>Comments</span>
                    {activeRightPanel === 'comments' && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#3E2A2F] rounded-t-full"></div>}
                </button>
            </div>

            <div className="px-6 pb-6 pt-0 overflow-y-auto flex-1 w-full">
                {activeRightPanel === 'settings' && <GraphSettingsPanel />}
                {activeRightPanel === 'properties' && <PropertiesPanel editor={editor} selectionType={selectionType} />}
                {activeRightPanel === 'comments' && <CommentsPanel comments={comments} setComments={setComments} editor={editor} user={user} />}
            </div>

        </div>
    );
}
