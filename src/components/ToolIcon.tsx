import React, { Suspense } from 'react';
import * as DeveloperIcons from 'developer-icons';

const iconShellClass = (className?: string) =>
    `flex items-center justify-center ${className ?? 'h-10 w-10'} [&_svg]:h-full [&_svg]:w-full [&_img]:h-full [&_img]:w-full [&_svg]:brightness-0 [&_svg]:invert [&_svg]:opacity-90 group-hover:[&_svg]:opacity-100`;

const MonochromeSvg: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className }) => (
    <div className={iconShellClass(className)}>{children}</div>
);

const BRAND_SVGS: Record<string, React.ReactNode> = {
    'brand-excel': (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M4 3h11l5 5v13H4V3zm11 0v5h5M8 10l2.5 4L8 18h1.8l1-1.8 1 1.8H14l-2.5-4L14 10h-1.8l-1 1.8L10.2 10H8zm7.5 0H20v8h-4.5V10z" />
        </svg>
    ),
    'brand-visio': (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M4 4h16v16H4V4zm3.2 4.5 3.3 7 3.3-7h2.1l-4.4 9.5H9.5L5.1 8.5h2.1zm8.8 0h2.1v9.5h-2.1V8.5z" />
        </svg>
    ),
    'brand-cursor': (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M5.5 3.8 18.2 12 5.5 20.2V3.8zm2.8 5.1v6.2L14.6 12l-6.3-3.1z" />
        </svg>
    ),
    'brand-windsurf': (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M4.5 17.5c2.2-4.2 4.2-6.8 6.8-9.2 1.1 2.4 2.1 4.8 3.6 7.1-1.8.9-3.6 1.6-5.4 2.1-1.8-.5-3.6-1.2-5.4-2.1 1.5-2.3 2.5-4.7 3.6-7.1 2.6 2.4 4.6 5 6.8 9.2H4.5z" />
        </svg>
    ),
    'brand-notion': (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M5 4.2c3.5-.4 7-.4 10.5 0 .8.1 1.4.7 1.5 1.5.4 3.5.4 7 0 10.5-.1.8-.7 1.4-1.5 1.5-3.5.4-7 .4-10.5 0-.8-.1-1.4-.7-1.5-1.5-.4-3.5-.4-7 0-10.5.1-.8.7-1.4 1.5-1.5zM8 7.5h8v1.6H8V7.5zm0 3.4h8v1.6H8v-1.6zm0 3.4h5.5v1.6H8v-1.6z" />
        </svg>
    ),
    'brand-jira': (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M11.53 4.2a.75.75 0 0 1 1.06 0l7.21 7.21a.75.75 0 0 1 0 1.06l-7.21 7.21a.75.75 0 0 1-1.06 0l-3.55-3.55a.75.75 0 0 1 0-1.06l3.55-3.55-3.55-3.55a.75.75 0 0 1 0-1.06l3.55-3.55z" />
        </svg>
    ),
    'brand-figma': (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 4.5a3.5 3.5 0 0 1 7 0 3.5 3.5 0 0 1-3.5 3.5H11V4.5H8zm3.5 3.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5V8zm0 7a3.5 3.5 0 0 1 0 7 3.5 3.5 0 0 1 0-7zm-3.5-3.5A3.5 3.5 0 0 1 4.5 8 3.5 3.5 0 0 1 8 4.5V11z" />
        </svg>
    ),
    'brand-confluence': (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M5.5 16.2c2.2-3.4 4.4-5.1 6.6-5.1 1.2 0 2.2.6 2.9 1.8.7-1.2 1.7-1.8 2.9-1.8 2.2 0 4.4 1.7 6.6 5.1-2.2 3.4-4.4 5.1-6.6 5.1-1.2 0-2.2-.6-2.9-1.8-.7 1.2-1.7 1.8-2.9 1.8-2.2 0-4.4-1.7-6.6-5.1z" />
        </svg>
    ),
    'brand-ollama': (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 4c-3.3 0-6 2.7-6 6v2c0 3.3 2.7 6 6 6s6-2.7 6-6v-2c0-3.3-2.7-6-6-6zm-3.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm7 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM8 15.5h8v2H8v-2z" />
        </svg>
    ),
    'brand-lm-studio': (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M5 6h14v2H5V6zm0 5h10v2H5v-2zm0 5h14v2H5v-2zM17 11h2v6h-2v-6z" />
        </svg>
    ),
    'brand-stitch': (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M6 6h4v4H6V6zm8 0h4v4h-4V6zM6 14h4v4H6v-4zm8 0h4v4h-4v-4z" />
        </svg>
    ),
    'brand-linux': (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 3c-2.8 0-5 2.2-5 5 0 1.2.4 2.3 1.1 3.2-.8.3-1.5.8-2 1.5-.8 1-1.1 2.3-.8 3.6.5 2.2 2.5 3.7 4.7 3.7h3c2.2 0 4.2-1.5 4.7-3.7.3-1.3 0-2.6-.8-3.6-.5-.7-1.2-1.2-2-1.5.7-.9 1.1-2 1.1-3.2 0-2.8-2.2-5-5-5zm-1.8 6.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm3.6 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM9.5 16h5v1.5h-5V16z" />
        </svg>
    ),
    'brand-python': (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 3c-2.5 0-4.6 1.8-4.9 4.2h2.8c.1-.8.8-1.4 1.6-1.4h2.5V3H12zm-4.9 5.2C6.8 8.5 6 9.7 6 11v1.5h3.5V11c0-.6.4-1 1-1h2.5V8.2H12c-2.5 0-4.6 1.8-4.9 4.2zM12 21c2.5 0 4.6-1.8 4.9-4.2h-2.8c-.1.8-.8 1.4-1.6 1.4H12v2.8h2.5c2.5 0 4.6-1.8 4.9-4.2H12zm4.9-5.2c.3-1.3 1.1-2.5 2.1-3.3V11c0-1.3-.8-2.5-2.1-3.3V11c0 .6-.4 1-1 1h-2.5v2.8H12c2.5 0 4.6-1.8 4.9-4.2h2.8z" />
        </svg>
    ),
    'brand-github-copilot': (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.22.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34 2.22.25 4.55 1.11 4.55 4.92 0 1.11-.38 1.55-1.04 2.14.11.26.45 1.18-.1 2.25 0 0-.85.27-2.78 1.04-.81-.23-1.69-.35-2.57-.35-.88 0-1.76.12-2.57.35-1.93-1.31-2.78-1.04-2.78-1.04-.55 1.07-.21 1.99-.1 2.25.66.59 1.04 1.03 1.04 2.14 0 3.82-2.34 4.66-4.57 4.91-.36.31-.69.92-.69 1.85V21c0 .27.16.59.67.5C19.14 20.17 22 16.42 22 12 22 6.48 17.52 2 12 2z" />
        </svg>
    ),
    'brand-powerbi': (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M10 10h4v10h-4V10zm6-4h4v14h-4V6zM4 14h4v6H4v-6z" />
        </svg>
    ),
    'brand-trello': (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M3 4c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V4zm4 2v10h5V6H7zm7 0v6h5V6h-5z" />
        </svg>
    ),
    'brand-miro': (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M4.17 14.17 2.12 9.04 7 12.33V17 4.17 14.17zm15.66 0 2.05-5.13-4.88 3.29V17l2.83-2.83zM12 2 9.1 10.7 12 12.8l2.9-2.1L12 2z" />
        </svg>
    ),
    'brand-google-analytics': (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M4 20h4v-7H4v7zm6 0h4v-11h-4v11zm6 0h4v-16h-4v16z" />
        </svg>
    ),
    'brand-aws': (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M6.5 15.5c3 .8 6.2 1.2 9.5 1.2 1.2 0 2.4-.1 3.5-.3l.6 1.1c-1.2.4-2.5.6-3.8.6-3.8 0-7.4-.6-10.8-1.8l1-1.8zm1.2-4.2 1.1 1.9c2.4 1.2 5.1 1.9 7.9 1.9 1 0 2-.1 2.9-.3l.6 1.1c-1.1.3-2.2.4-3.4.4-3.4 0-6.6-.8-9.5-2.3l-.6-1.7zm2.1-4.1 1.2 2.1c1.8 1 3.9 1.6 6.1 1.6.7 0 1.4-.1 2-.2l.5 1c-.8.2-1.6.3-2.4.3-2.7 0-5.2-.7-7.4-2l-.5-1.5z" />
        </svg>
    ),
    'brand-bolt': (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M11 21 13 14h6L9 3v7H3l8 11z" />
        </svg>
    ),
};

export const BRAND_ICONS: Record<string, React.ReactNode> = BRAND_SVGS;

export const DEVELOPER_ICON_NAMES = Object.keys(DeveloperIcons).filter(
    (key) => key[0] === key[0].toUpperCase() && key !== 'default'
);

const BRAND_TO_DEVELOPER_ICON: Record<string, keyof typeof DeveloperIcons> = {};

interface ToolIconProps {
    icon: string;
    className?: string;
}

const ToolIcon: React.FC<ToolIconProps> = ({ icon, className }) => {
    const shellClass = iconShellClass(className);

    if (icon.startsWith('brand-')) {
        if (BRAND_SVGS[icon]) {
            return <MonochromeSvg className={className}>{BRAND_SVGS[icon]}</MonochromeSvg>;
        }

        const developerIconName = BRAND_TO_DEVELOPER_ICON[icon];
        if (developerIconName && developerIconName in DeveloperIcons) {
            const IconComponent = (DeveloperIcons as Record<string, React.ComponentType<{ className?: string }>>)[developerIconName];
            return (
                <div className={shellClass}>
                    <Suspense fallback={<span aria-label="Loading icon">⚙️</span>}>
                        <IconComponent />
                    </Suspense>
                </div>
            );
        }
    }

    if (icon in DeveloperIcons) {
        const IconComponent = (DeveloperIcons as Record<string, React.ComponentType<{ className?: string }>>)[icon];
        return (
            <div className={shellClass}>
                <Suspense fallback={<span aria-label="Loading icon">⚙️</span>}>
                    <IconComponent />
                </Suspense>
            </div>
        );
    }

    return (
        <div className={shellClass}>
            <span className="material-symbols-outlined text-[1.75rem] leading-none opacity-90">
                {icon}
            </span>
        </div>
    );
};

export default ToolIcon;
