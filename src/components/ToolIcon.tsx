import React, { Suspense } from 'react';
import * as DeveloperIcons from 'developer-icons';
import {
    siConfluence,
    siCursor,
    siGoogleanalytics,
    siJira,
    siLmstudio,
    siMiro,
    siNotion,
    siOllama,
    siTrello,
    siWindsurf,
    type SimpleIcon,
} from 'simple-icons';

type BrandConfig =
    | { kind: 'simple'; icon: SimpleIcon }
    | { kind: 'developer'; key: string }
    | { kind: 'asset'; src: string; alt: string };

const BRAND_ICON_MAP: Record<string, BrandConfig> = {
    'brand-jira': { kind: 'simple', icon: siJira },
    'brand-notion': { kind: 'simple', icon: siNotion },
    'brand-figma': { kind: 'developer', key: 'Figma' },
    'brand-python': { kind: 'developer', key: 'Python' },
    'brand-linux': { kind: 'developer', key: 'Linux' },
    'brand-cursor': { kind: 'simple', icon: siCursor },
    'brand-windsurf': { kind: 'simple', icon: siWindsurf },
    'brand-confluence': { kind: 'simple', icon: siConfluence },
    'brand-ollama': { kind: 'simple', icon: siOllama },
    'brand-trello': { kind: 'simple', icon: siTrello },
    'brand-miro': { kind: 'simple', icon: siMiro },
    'brand-aws': { kind: 'developer', key: 'AWS' },
    'brand-github-copilot': { kind: 'developer', key: 'GitHubCopilot' },
    'brand-google-analytics': { kind: 'simple', icon: siGoogleanalytics },
    'brand-lm-studio': { kind: 'simple', icon: siLmstudio },
    'brand-excel': { kind: 'asset', src: '/brands/microsoft-excel.svg', alt: 'Microsoft Excel' },
    'brand-visio': { kind: 'asset', src: '/brands/microsoft-visio.svg', alt: 'Microsoft Visio' },
    'brand-powerbi': { kind: 'asset', src: '/brands/power-bi.svg', alt: 'Power BI' },
    'brand-stitch': { kind: 'asset', src: '/brands/google-stitch.svg', alt: 'Google Stitch' },
    'brand-bolt': { kind: 'asset', src: '/brands/bolt.svg', alt: 'Bolt' },
};

export const BRAND_ICONS: Record<string, true> = Object.fromEntries(
    Object.keys(BRAND_ICON_MAP).map((key) => [key, true])
);

export const DEVELOPER_ICON_NAMES = Object.keys(DeveloperIcons).filter(
    (key) => key[0] === key[0].toUpperCase() && key !== 'default'
);

const DEVELOPER_ICON_ALIASES: Record<string, string> = {
    GitHub: 'GitHubLight',
    Github: 'GitHubLight',
};

const iconShellClass = (className?: string) =>
    `flex shrink-0 items-center justify-center ${className ?? 'h-10 w-10'} [&_svg]:h-full [&_svg]:w-full [&_img]:h-full [&_img]:w-full [&_img]:object-contain`;

const SimpleBrandLogo: React.FC<{ icon: SimpleIcon }> = ({ icon }) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-label={icon.title}>
        <path d={icon.path} fill={`#${icon.hex}`} />
    </svg>
);

const DeveloperBrandLogo: React.FC<{ name: string }> = ({ name }) => {
    const resolvedName = DEVELOPER_ICON_ALIASES[name] ?? name;
    if (!(resolvedName in DeveloperIcons)) {
        return null;
    }

    const IconComponent = (DeveloperIcons as Record<string, React.ComponentType<{ size?: number }>>)[resolvedName];
    return (
        <Suspense fallback={<span aria-hidden="true">⚙️</span>}>
            <IconComponent size={48} />
        </Suspense>
    );
};

interface ToolIconProps {
    icon: string;
    className?: string;
}

const ToolIcon: React.FC<ToolIconProps> = ({ icon, className }) => {
    const shellClass = iconShellClass(className);

    if (icon.startsWith('brand-')) {
        const brand = BRAND_ICON_MAP[icon];
        if (brand?.kind === 'simple') {
            return (
                <div className={shellClass}>
                    <SimpleBrandLogo icon={brand.icon} />
                </div>
            );
        }

        if (brand?.kind === 'developer') {
            return (
                <div className={shellClass}>
                    <DeveloperBrandLogo name={brand.key} />
                </div>
            );
        }

        if (brand?.kind === 'asset') {
            return (
                <div className={shellClass}>
                    <img src={brand.src} alt={brand.alt} loading="lazy" decoding="async" />
                </div>
            );
        }
    }

    if (icon in DeveloperIcons || icon in DEVELOPER_ICON_ALIASES) {
        return (
            <div className={shellClass}>
                <DeveloperBrandLogo name={icon} />
            </div>
        );
    }

    return (
        <div className={shellClass}>
            <span className="material-symbols-outlined text-[1.75rem] leading-none text-white/80">
                {icon}
            </span>
        </div>
    );
};

export default ToolIcon;
