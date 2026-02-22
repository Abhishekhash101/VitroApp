import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';

const CommandList = forwardRef((props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index) => {
        const item = props.items[index];
        if (item) {
            props.command(item);
        }
    };

    const upHandler = () => {
        setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
    };

    const downHandler = () => {
        setSelectedIndex((selectedIndex + 1) % props.items.length);
    };

    const enterHandler = () => {
        selectItem(selectedIndex);
    };

    useEffect(() => {
        // eslint-disable-next-line
        setSelectedIndex(0);
    }, [props.items]);

    useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }) => {
            if (event.key === 'ArrowUp') {
                upHandler();
                return true;
            }
            if (event.key === 'ArrowDown') {
                downHandler();
                return true;
            }
            if (event.key === 'Enter') {
                enterHandler();
                return true;
            }
            return false;
        },
    }));

    if (!props.items || props.items.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-md shadow-xl border border-gray-200 overflow-hidden w-64 p-2 text-sm font-sans flex flex-col gap-1 max-h-80 overflow-y-auto z-50">
            {props.items.map((item, index) => (
                <button
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-colors w-full cursor-pointer
                        ${index === selectedIndex ? 'bg-gray-100 text-[#1A73E8] font-bold' : 'hover:bg-gray-50 text-gray-700 font-medium'}
                    `}
                    key={index}
                    onClick={() => selectItem(index)}
                >
                    <div className={`p-1.5 rounded ${index === selectedIndex ? 'bg-blue-50' : 'bg-gray-50'}`}>
                        {item.icon}
                    </div>
                    <div>
                        <div className="leading-tight">{item.title}</div>
                        <div className={`text-xs mt-0.5 leading-tight ${index === selectedIndex ? 'text-[#1A73E8]/70' : 'text-gray-400'}`}>{item.description}</div>
                    </div>
                </button>
            ))}
        </div>
    );
});

CommandList.displayName = 'CommandList';
export default CommandList;
