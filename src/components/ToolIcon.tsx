import React from 'react';

// Brand SVG Paths (Simplified/Standardized)
export const BRAND_ICONS: Record<string, React.ReactNode> = {
    // AI & Dev
    'brand-google-stitch': <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" /></svg>, // Placeholder (Generic)
    'brand-cursor': <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.6 2.4C13.2 2 12.8 2 12.4 2.4L4.4 10.4C4 10.8 4 11.2 4.4 11.6L12.4 19.6C12.8 20 13.2 20 13.6 19.6L21.6 11.6C22 11.2 22 10.8 21.6 10.4L13.6 2.4ZM13 17.2L6.8 11L13 4.8L19.2 11L13 17.2Z" /></svg>, // Generic Cursor
    'brand-bolt': <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 21L13 14H19L9 3V10H3L11 21Z" /></svg>,
    'brand-windsurf': <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.5 3C17.2 3 21 6.8 21 11.5C21 16.2 17.2 20 12.5 20C7.8 20 4 16.2 4 11.5C4 6.8 7.8 3 12.5 3ZM12.5 5C8.9 5 6 7.9 6 11.5C6 15.1 8.9 18 12.5 18C16.1 18 19 15.1 19 11.5C19 7.9 16.1 5 12.5 5Z" /></svg>,
    'brand-github-copilot': <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.47 2 2 6.47 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-1.55 1.04-2.14-.11-.26-.45-1.18.1-2.25 0 0 .85-.27 2.78 1.04.81-.23 1.69-.35 2.57-.35.88 0 1.76.12 2.57.35 1.93-1.31 2.78-1.04 2.78-1.04.55 1.07.21 1.99.1 2.25.66.59 1.04 1.03 1.04 2.14 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.17 22 16.42 22 12A10 10 0 0012 2z" /></svg>,
    'brand-figma': <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-4 0-4 4-4 4s0 4 4 4h4c4 0 4-4 4-4s0-4-4-4h-4zm0 8c-4 0-4 4-4 4s0 4 4 4h2v4c0 4 4 4 4-4v-4h-2c-4 0-4-4-4-4z" /></svg>, // Rough Approx

    // Local AI
    'brand-ollama': <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" /></svg>, // Placeholder
    'brand-lm-studio': <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14h-2v-4h2v4zm4-4h-2v-2h2v2zm-8-2H6V9h2v2zm4-6h-2V7h2v2z" /></svg>,

    // Data
    'brand-powerbi': <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 8H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zm-6 6H2c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-2c0-1.1-.9-2-2-2z" /></svg>, // Approx bar chart
    'brand-python': <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-2.5 0-4.5 2-4.5 4.5v2.5h-4C1.5 7 0 8.5 0 10.5v8C0 20.5 1.5 22 3.5 22h8c2 0 3.5-1.5 3.5-3.5v-2.5h4c2 0 3.5-1.5 3.5-3.5v-8C22.5 2 21 0.5 19 0.5h-7zm-1.5 2h3c.8 0 1.5.7 1.5 1.5V6H9V3.5c0-.8.7-1.5 1.5-1.5z" /></svg>, // Rough
    'brand-sql': <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 4.48 2 8v8c0 3.52 4.48 6 10 6s10-2.48 10-6V8c0-3.52-4.48-6-10-6zm0 10c-3.14 0-6-1.23-6-3s2.86-3 6-3 6 1.23 6 3-2.86 3-6 3zm0 4c-3.14 0-6-1.23-6-3v-1c1.28 1.05 3.49 1.8 6 1.8s4.72-.75 6-1.8v1c0 1.77-2.86 3-6 3zm0 4c-3.14 0-6-1.23-6-3v-1c1.28 1.05 3.49 1.8 6 1.8s4.72-.75 6-1.8v1c0 1.77-2.86 3-6 3z" /></svg>,

    // Agile & Enterprise
    'brand-jira': <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l-9 9 9 9 9-9-9-9zm0 16l-7-7 7-7 7 7-7 7z" /></svg>, // Diamond
    'brand-confluence': <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16v16H4z" /></svg>, // Square
    'brand-notion': <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.5 4L2 20h18l2.5-16H4.5zM17 17h-2V7h2v10z" /></svg>,
    'brand-linux': <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" /></svg>,
};

interface ToolIconProps {
    icon: string;
    className?: string;
}

const ToolIcon: React.FC<ToolIconProps> = ({ icon, className }) => {
    if (icon.startsWith('brand-') && BRAND_ICONS[icon]) {
        return <div className={className}>{BRAND_ICONS[icon]}</div>;
    }

    return <span className={`material-symbols-outlined ${className}`}>{icon}</span>;
};

export default ToolIcon;
