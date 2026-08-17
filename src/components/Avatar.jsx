import React from 'react';

/**
 * Avatar
 * ------
 * A fully local avatar that renders the user's initials on a colored circle.
 * No remote image CDN required, so the app works fully offline.
 *
 * Props:
 *   name  - the person's name (initials are derived from it)
 *   size  - pixel size (default 32)
 *   className - extra classes
 */
const PALETTE = ['#8B5F54', '#E07A5F', '#3D405B', '#81B29A', '#F2CC8F', '#62414A', '#B7684C'];

function initials(name) {
    const parts = (name || '?').trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Avatar({ name = 'User', size = 32, className = '' }) {
    const color = PALETTE[(name || '').length % PALETTE.length];
    return (
        <span
            className={`inline-flex items-center justify-center rounded-full font-bold text-white select-none shrink-0 ${className}`}
            style={{ width: size, height: size, backgroundColor: color, fontSize: size * 0.4 }}
            title={name}
        >
            {initials(name)}
        </span>
    );
}
