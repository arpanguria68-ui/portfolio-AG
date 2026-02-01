```
import React from 'react';

// Brand SVG Paths & Images
export const BRAND_ICONS: Record<string, React.ReactNode> = {
    // Priority / User Uploaded (Images)
    'brand-notion': <img src="/brands/notion.png" alt="Notion" className="w-full h-full object-contain" />,
    'brand-stitch': <img src="/brands/stitch.png" alt="Stitch" className="w-full h-full object-contain" />,
    'brand-cursor': <img src="/brands/cursor.png" alt="Cursor" className="w-full h-full object-contain" />,
    'brand-lm-studio': <img src="/brands/lm-studio.png" alt="LM Studio" className="w-full h-full object-contain" />,
    'brand-confluence': <img src="/brands/confluence.png" alt="Confluence" className="w-full h-full object-contain" />,
    'brand-ollama': <img src="/brands/ollama.png" alt="Ollama" className="w-full h-full object-contain" />,
    'brand-figma': <img src="/brands/figma.png" alt="Figma" className="w-full h-full object-contain" />,
    'brand-jira': <img src="/brands/jira.png" alt="Jira" className="w-full h-full object-contain" />,
    'brand-linux': <img src="/brands/linux.png" alt="Linux" className="w-full h-full object-contain" />,
    'brand-windsurf': <img src="/brands/windsurf.png" alt="Windsurf" className="w-full h-full object-contain" />,

    // Other SVG Brands
    'brand-github-copilot': <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.47 2 2 6.47 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-1.55 1.04-2.14-.11-.26-.45-1.18.1-2.25 0 0 .85-.27 2.78 1.04.81-.23 1.69-.35 2.57-.35.88 0 1.76.12 2.57.35 1.93-1.31 2.78-1.04 2.78-1.04.55 1.07.21 1.99.1 2.25.66.59 1.04 1.03 1.04 2.14 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.17 22 16.42 22 12A10 10 0 0012 2z"/></svg>,
    'brand-python': <svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.75l-.63-.05-.55-.13-.46-.21-.38-.26-.31-.3-.25-.33-.19-.35-.14-.35-.1-.33-.07-.3-.04-.26-.02-.21v-2.43l-.01-.27.04-.2.05-.13.06-.1.08-.07.05-.03.09-.02.32-.01h3.63l.3.06.2.13.08.19v1.64l-.06.21-.13.13-.21.06H9.79l-.16.03-.13.07-.07.13.03.16.06.13.12.08.15.03h4.38l.32-.04.25-.1.19-.18.1-.25.04-.33V4.99l-.02-.38-.1-.31-.19-.23-.27-.15-.35-.06H9.79l-.49.03-.49.09-.45.16-.4.24-.34.3-.26.35-.18.39-.08.42v1.1l.05.54.12.5.19.45.26.39.31.32.35.25.37.18.39.1.4.04h.5l.38-.03.4-.08.4-.14.38-.19.34-.23.29-.27.23-.3.15-.32.07-.34.02-.34V6.26l-.01-.3-.06-.29-.12-.27-.18-.24-.23-.2-.28-.14-.32-.08-.36-.02H4.61l-.36.02-.32.08-.28.14-.23.2-.18.24-.12.27-.06.29V11.2l.06.33.1.28.16.22.21.16.25.1.28.04H8.5l.3-.01.3-.06.28-.11.23-.17.18-.23.12-.28.05-.32V8.5l.02-.21.04-.26.07-.3.1-.33.14-.35.19-.35.25-.33.31-.3.38-.26.46-.21.55-.13.63-.05h5.45l.21.02.26.04.3.07.33.1.35.14.35.19.33.25.31.3.26.38.21.46.13.55.05.63v5.54l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H9.75l-.9-.2-.73-.26-.59-.3-.45-.32-.34-.34-.25-.34-.16-.33-.1-.3-.04-.26-.02-.2.01-.13v-5.25l.05-.63.13-.55.21-.46.26-.38.3-.31.33-.25.35-.19.35-.14.33-.1.3-.07.26-.04.21-.02h4.5l.63.05.55.13.46.21.38.26.31.3.25.33.19.35.14.35.1.33.07.3.04.26.02.21v2.43l.01.27-.04.2-.05.13-.06.1-.08.07-.05.03-.09.02-.32.01h-3.63l-.3-.06-.2-.13-.08-.19v-1.64l.06-.21.13-.13.21-.06h4.21l.16-.03.13-.07.07-.13-.03-.16-.06-.13-.12-.08-.15-.03H9.37l-.32.04-.25.1-.19.18-.1.25-.04.33v3.74l.02.38.1.31.19.23.27.15.35.06h3.96l.49-.03.49-.09.45-.16.4-.24.34-.3.26-.35.18-.39.08-.42v-1.1l-.05-.54-.12-.5-.19-.45-.26-.39-.31-.32-.35-.25-.37-.18-.39-.1-.4-.04h-.5l-.38.03-.4.08-.4.14-.38.19-.34.23-.29.27-.23.3-.15.32-.07.34-.02.34v1.89l.06.33.1.28.16.22.21.16.25.1.28.04h4.15l.3-.01.3-.06.28-.11.23-.17.18-.23.12-.28.05-.32v-2.33l-.02-.21-.04-.26-.07-.3-.1-.33-.14-.35-.19-.35-.25-.33-.31-.3-.38-.26-.46-.21-.55-.13-.63-.05z"/></svg>,
    'brand-powerbi': <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 10h4v10h-4V10zm6-4h4v14h-4V6zM4 14h4v6H4v-6z"/></svg>,
    'brand-trello': <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 4c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V4zm4 2v10h5V6H7zm7 0v6h5V6h-5z"/></svg>,
    'brand-miro': <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.17 14.17L2.12 9.04 7 12.33V17L4.17 14.17zm15.66 0l2.05-5.13-4.88 3.29V17l2.83-2.83zM12 2l-2.9 8.7 2.9 2.1 2.9-2.1L12 2z"/></svg>,
    'brand-excel': <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.5 12l-4-6H10l2.5 4 2.5-4h2.5l-4 6 4 6h-2.5l-2.5-4-2.5 4H7.5l4-6zM3 3v18h18V3H3zm16 16H5V5h14v14z"/></svg>,
    'brand-google-analytics': <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 20h4v-7H4v7zm6 0h4v-11h-4v11zm6 0h4v-16h-4v16 z"/></svg>,
    'brand-aws': <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.924 7.02c.088-.564 1.25-.083 1.28.66.015.385.006.772.006 1.157v3.088c0 .356-.002.712.012 1.066.018.47.168.968.65 1.02.5.053.69-.472.69-.877v-4.13c0-1.74-2.373-2.883-3.832-1.89-1.28.87.165 2.533.914 1.55.335-.44 1.166-.328 1.16-.94-.006-.518-.87-.806-.884.097zm-5.748.15c.677-.732-1.373-1.463-1.638-.53-.59 2.07 1.085 4.366 3.16 4.34 2.28-.027 3.51-2.964 1.623-4.57-1.12-.953-3.155.438-2.636 1.83.21.564.84.975 1.45.86.634-.12.637-1.144-.09-1.5-.233-.113-.71.055-.658.41.028.188.423.41.52.122.15-.436-.62-.733-.8-.323-.19.432.26 1.11.693.995.895-.237.13-2.073-1.01-1.396-.34.202-.577.49-.607.763z"/></svg>,
    'brand-bolt': <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 21L13 14H19L9 3V10H3L11 21Z"/></svg>,
};

interface ToolIconProps {
    icon: string;
    className?: string;
}

const ToolIcon: React.FC<ToolIconProps> = ({ icon, className }) => {
    if (icon.startsWith('brand-') && BRAND_ICONS[icon]) {
        return <div className={className}>{BRAND_ICONS[icon]}</div>;
    }
    
    return <span className={`material - symbols - outlined ${ className } `}>{icon}</span>;
};

export default ToolIcon;
```
