
import React from 'react';

interface GlowBorderCardProps extends React.HTMLAttributes<HTMLDivElement> {
    width?: string;
    aspectRatio?: string;
    colorPreset?: string;
    animationDuration?: number;
    children?: React.ReactNode;
}

export const GlowBorderCard = ({
    children,
    width = '100%',
    aspectRatio,
    colorPreset = 'aurora',
    animationDuration = 4,
    className = '',
    ...props
}: GlowBorderCardProps) => {
    return (
        <div
            className={`relative overflow-hidden rounded-3xl group ${className}`}
            style={{ width, aspectRatio }}
            {...props}
        >
            {/* Moving Gradient Border */}
            <div
                className="absolute inset-[-200%] animate-[spin_4s_linear_infinite]"
                style={{
                    background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, #D4FF3F 70deg, transparent 140deg, transparent 360deg)',
                    animationDuration: `${animationDuration}s`,
                }}
            />

            {/* Inner Content Container */}
            <div className="absolute inset-[3px] bg-[#0A0A0A] rounded-[29px] overflow-hidden z-10 w-[calc(100%-6px)] h-[calc(100%-6px)]">
                {children}
            </div>
        </div>
    );
};
