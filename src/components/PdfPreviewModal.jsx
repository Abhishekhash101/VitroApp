import React from 'react';

const PdfPreviewModal = ({ isOpen, onClose, pdfData }) => {
    if (!isOpen || !pdfData) return null;

    const { src, fileName } = pdfData;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            {/* Modal Container */}
            <div className="bg-[#FDF6F0] rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden border border-[#E7D5C9]">

                {/* Header */}
                <div className="px-6 py-4 border-b border-[#E7D5C9] bg-[#FAF3E0] flex justify-between items-center shrink-0">
                    <h3 className="text-lg font-serif font-bold text-[#8B5F54] flex items-center gap-3">
                        <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-sans uppercase tracking-widest">PDF Viewer</span>
                        {fileName}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-[#8B5F54]/60 hover:text-[#8B5F54] text-2xl leading-none transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#E7D5C9]/50"
                        title="Close Viewer"
                    >
                        &times;
                    </button>
                </div>

                {/* Body (iFrame) */}
                <div className="flex-1 bg-gray-100 w-full relative">
                    <iframe
                        src={src}
                        className="absolute inset-0 w-full h-full border-none"
                        title={`PDF Preview: ${fileName}`}
                    />
                </div>

            </div>
        </div>
    );
};

export default PdfPreviewModal;
