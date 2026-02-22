import React from 'react';
import { FileText, Grid, Sigma, Image as ImageIcon, MoreVertical, ShieldCheck, Zap } from 'lucide-react';

const cards = [
    { id: 1, title: 'Thesis_Dra...', time: 'Edited 2h ago', icon: FileText, iconColor: 'text-blue-500', bgColor: 'bg-blue-100' },
    { id: 2, title: 'Lab_Data_...', time: 'Edited 5h ago', icon: Grid, iconColor: 'text-purple-500', bgColor: 'bg-purple-100' },
    { id: 3, title: 'Quantum_...', time: 'Edited Yesterday', icon: Sigma, iconColor: 'text-orange-500', bgColor: 'bg-orange-100' },
    { id: 4, title: 'Microscop...', time: 'Edited 2d ago', icon: ImageIcon, iconColor: 'text-emerald-500', bgColor: 'bg-emerald-100' },
];

export default function QuickAccessGallery() {
    return (
        <div className="mb-10">
            <div className="flex items-center gap-2 mb-4 text-gray-800">
                <Zap className="h-5 w-5 text-[#C06C4E]" fill="currentColor" />
                <h2 className="font-bold text-lg">Quick Access</h2>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.id}
                            className="min-w-[180px] bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col justify-between group cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-2.5 rounded-xl ${card.bgColor} ${card.iconColor}`}>
                                    <Icon size={20} strokeWidth={2.5} />
                                </div>
                                <button className="text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                                    <MoreVertical size={18} />
                                </button>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-800 text-sm mb-1">{card.title}</h3>
                                <p className="text-xs text-gray-400 mb-3">{card.time}</p>
                                <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-700 rounded-md text-[10px] font-bold tracking-wide">
                                    <ShieldCheck size={12} />
                                    VERIFIED
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
