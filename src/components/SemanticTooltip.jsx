import React, { useEffect, useRef, useState } from 'react';

/**
 * SemanticTooltip
 * ---------------
 * A lightweight hover tooltip that reads the reviewer message stored on any
 * `.semantic-error` span inside the editor and shows it near the cursor.
 */
export default function SemanticTooltip({ editor }) {
    const [tip, setTip] = useState(null); // { x, y, message }
    const containerRef = useRef(null);

    useEffect(() => {
        if (!editor) return;

        const show = (e) => {
            const el = e.target.closest('.semantic-error');
            if (!el) return;
            const message = el.getAttribute('data-message');
            if (!message) return;
            const rect = el.getBoundingClientRect();
            setTip({
                x: rect.left + rect.width / 2,
                y: rect.top,
                message,
            });
        };

        const hide = (e) => {
            if (e.target.closest('.semantic-error')) return;
            setTip(null);
        };

        const dom = editor.view.dom;
        dom.addEventListener('mouseover', show);
        dom.addEventListener('mouseout', hide);
        return () => {
            dom.removeEventListener('mouseover', show);
            dom.removeEventListener('mouseout', hide);
        };
    }, [editor]);

    if (!tip) return null;

    return (
        <div
            ref={containerRef}
            className="semantic-tooltip"
            style={{ left: tip.x, top: tip.y }}
            role="tooltip"
        >
            <span className="semantic-tooltip__icon">⚠</span>
            <span className="semantic-tooltip__text">{tip.message}</span>
        </div>
    );
}
