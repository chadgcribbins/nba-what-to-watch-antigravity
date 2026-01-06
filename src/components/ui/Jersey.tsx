'use client';

interface JerseyProps {
    teamName?: string;
    number?: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    view?: 'front' | 'back';
    name?: string; // Player Last Name for back view
}
import { ALL_TEAMS } from '@/lib/data/allTeams';

export default function Jersey({ teamName = 'Lakers', number = '23', className = '', size = 'md', view = 'front', name = 'PLAYER' }: JerseyProps) {
    const team = ALL_TEAMS.find(t => t.name === teamName);
    const colors = team?.colors || { primary: '#1D428A', secondary: '#FFC72C' };

    const sizeClasses = {
        sm: 'w-12 h-16',
        md: 'w-24 h-32',
        lg: 'w-48 h-64',
        xl: 'w-64 h-80'
    };

    return (
        <div className={`relative ${sizeClasses[size]} ${className} animate-arcade-float`}>
            <svg viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
                {/* Shadow/Outline */}
                <path d="M20 10 L80 10 L90 30 L90 120 L10 120 L10 30 L20 10 Z" fill="black" />

                {/* Main Body */}
                <path
                    d="M22 12 L78 12 L87 31 L87 118 L13 118 L13 31 L22 12 Z"
                    fill={colors.primary}
                    stroke="black"
                    strokeWidth="2"
                />

                {/* Trim */}
                <path d="M22 12 L40 12 Q50 25 60 12 L78 12 L87 31 L75 31 L65 18 L35 18 L25 31 L13 31 L22 12 Z" fill={colors.secondary} />

                {/* Side Panels */}
                <rect x="13" y="40" width="4" height="60" fill={colors.secondary} opacity="0.5" />
                <rect x="83" y="40" width="4" height="60" fill={colors.secondary} opacity="0.5" />

                {/* Number */}
                <text
                    x="50"
                    y="85"
                    textAnchor="middle"
                    fill="white"
                    fontFamily="system-ui"
                    fontWeight="900"
                    fontSize="45"
                    className="italic text-shadow-arcade"
                    style={{ filter: 'drop-shadow(2px 2px 0px black)' }}
                >
                    {number}
                </text>

                {/* VIEW SPECIFIC CONTENT */}
                {view === 'front' ? (
                    /* Team Name Mini */
                    <text
                        x="50"
                        y="35"
                        textAnchor="middle"
                        fill="white"
                        fontFamily="system-ui"
                        fontWeight="900"
                        fontSize="8"
                        className="uppercase tracking-tighter"
                    >
                        {teamName}
                    </text>
                ) : (
                    /* Player Name (Back) */
                    <text
                        x="50"
                        y="35"
                        textAnchor="middle"
                        fill="white"
                        fontFamily="system-ui"
                        fontWeight="900"
                        fontSize={name.length > 8 ? "8" : "10"}
                        className="uppercase tracking-tighter"
                    >
                        {name}
                    </text>
                )}
            </svg>
        </div>
    );
}
