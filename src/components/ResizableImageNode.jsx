import React, { useState, useRef, useEffect } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

export default function ResizableImageNode(props) {
    const { src, alt, title, width: initialWidth, float: initialFloat } = props.node.attrs;
    const [width, setWidth] = useState(initialWidth || '100%');
    const [float, setFloat] = useState(initialFloat || 'none');
    const [isResizing, setIsResizing] = useState(false);
    const imageRef = useRef(null);
    const startX = useRef(0);
    const startWidth = useRef(0);

    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsResizing(true);
        startX.current = e.clientX;
        startWidth.current = imageRef.current.offsetWidth;
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isResizing) return;
            const delta = e.clientX - startX.current;
            const newWidth = Math.max(50, startWidth.current + delta); // Min width 50px
            setWidth(`${newWidth}px`);
        };

        const handleMouseUp = () => {
            if (isResizing) {
                setIsResizing(false);
                props.updateAttributes({ width: width });
            }
        };

        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing, width, props]);

    const handleFloat = (newFloat) => {
        setFloat(newFloat);
        props.updateAttributes({ float: newFloat });
    };

    return (
        <NodeViewWrapper
            className="tiptap-image-wrapper relative group"
            style={{
                float: float,
                clear: float === 'none' ? 'both' : 'none',
                width: width === '100%' ? '100%' : 'fit-content',
                margin: float === 'none' ? '0 auto' : float === 'left' ? '0 1rem 1rem 0' : '0 0 1rem 1rem'
            }}
        >
            <div className="relative inline-block" style={{ width: width === '100%' ? '100%' : width }}>
                <img
                    ref={imageRef}
                    src={src}
                    alt={alt}
                    title={title}
                    className="max-w-full rounded"
                    style={{ width: '100%' }}
                />

                {/* Formatting Toolbar */}
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-gray-200 shadow-lg rounded p-1 flex items-center gap-1 z-50">
                    <button onClick={() => handleFloat('left')} className={`p-1 hover:bg-gray-100 rounded ${float === 'left' ? 'bg-gray-100 text-[#1A73E8]' : 'text-gray-600'}`}>
                        <AlignLeft size={16} />
                    </button>
                    <button onClick={() => handleFloat('none')} className={`p-1 hover:bg-gray-100 rounded ${float === 'none' ? 'bg-gray-100 text-[#1A73E8]' : 'text-gray-600'}`}>
                        <AlignCenter size={16} />
                    </button>
                    <button onClick={() => handleFloat('right')} className={`p-1 hover:bg-gray-100 rounded ${float === 'right' ? 'bg-gray-100 text-[#1A73E8]' : 'text-gray-600'}`}>
                        <AlignRight size={16} />
                    </button>
                </div>

                {/* Resize Handles */}
                {props.selected && (
                    <>
                        <div onMouseDown={handleMouseDown} className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-[#1A73E8] border border-white rounded-full cursor-nwse-resize drop-shadow-sm"></div>
                        <div onMouseDown={handleMouseDown} className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-[#1A73E8] border border-white rounded-full cursor-nesw-resize drop-shadow-sm"></div>
                        <div onMouseDown={handleMouseDown} className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-[#1A73E8] border border-white rounded-full cursor-nesw-resize drop-shadow-sm"></div>
                        <div onMouseDown={handleMouseDown} className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-[#1A73E8] border border-white rounded-full cursor-nwse-resize drop-shadow-sm"></div>
                    </>
                )}
            </div>
        </NodeViewWrapper>
    );
}
