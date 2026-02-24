import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", isDestructive = false }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            {/* Modal Container */}
            <div className="bg-[#FDF6F0] rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-[#E7D5C9] animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-[#E7D5C9] bg-[#FAF3E0]">
                    <h3 className="text-lg font-serif font-semibold text-[#8B5F54]">
                        {title}
                    </h3>
                </div>

                {/* Body */}
                <div className="px-6 py-6">
                    <p className="text-stone-600 text-sm leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Footer / Actions */}
                <div className="px-6 py-4 bg-[#F5EBE0]/50 flex justify-end gap-3 border-t border-[#E7D5C9]">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-800 hover:bg-stone-200/50 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => { onConfirm(); onClose(); }}
                        className={`
              px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm transition-colors
              ${isDestructive
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-[#8B5F54] hover:bg-[#70483C]'}
            `}
                    >
                        {confirmText}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ConfirmationModal;
