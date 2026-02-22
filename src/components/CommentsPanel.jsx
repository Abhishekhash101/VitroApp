import React from 'react';

export default function CommentsPanel() {
    const comments = [
        {
            id: 1,
            name: "Alice",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            text: "Add table and generate the graphs"
        },
        {
            id: 2,
            name: "Jack",
            avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            text: "All thing look good"
        }
    ];

    return (
        <div className="flex flex-col gap-4 py-4 w-full">
            {comments.map((comment) => (
                <div key={comment.id} className="bg-[#F4EBE1] rounded-xl p-4 shadow-sm flex flex-col gap-3">

                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-emerald-400 bg-white shrink-0 p-0.5 shadow-sm">
                            <img src={comment.avatar} alt={comment.name} className="w-full h-full object-cover rounded-full" />
                        </div>
                        <div className="font-extrabold text-[#3E2A2F] text-sm">{comment.name}</div>
                    </div>

                    <div className="text-[11px] font-semibold text-[#3E2A2F]/80 pl-1 leading-relaxed">
                        {comment.text}
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                        <button className="flex-1 bg-gradient-to-r from-[#7B545A] to-[#62414A] text-white text-[11px] font-bold py-2 rounded-full shadow-md hover:shadow-lg hover:from-[#62414A] hover:to-[#53353D] transition-all border border-white/10">
                            Marks as done
                        </button>
                        <button className="flex-1 bg-gradient-to-r from-[#7B545A] to-[#62414A] text-white text-[11px] font-bold py-2 rounded-full shadow-md hover:shadow-lg hover:from-[#62414A] hover:to-[#53353D] transition-all border border-white/10">
                            Delete
                        </button>
                    </div>

                </div>
            ))}
        </div>
    );
}
