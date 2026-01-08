
import React from 'react';

interface ArcadeTickSliderProps {
    label: string;
    leftLabel: string;
    rightLabel: string;
    value: number; // 1-5
    onChange: (val: number) => void;
    microcopy: string[]; // 5 strings
    tickLabels?: string[]; // 5 strings
    color?: 'blue' | 'red' | 'yellow' | 'purple';
}

export function ArcadeTickSlider({
    label,
    leftLabel,
    rightLabel,
    value,
    onChange,
    microcopy,
    tickLabels,
    color = 'blue'
}: ArcadeTickSliderProps) {

    // Color styles
    const tickColorMap = {
        blue: { active: 'bg-arcade-blue shadow-[0_0_10px_#4f93ff]', inactive: 'bg-gray-800 border-gray-700' },
        red: { active: 'bg-arcade-red shadow-[0_0_10px_#ff4b4b]', inactive: 'bg-gray-800 border-gray-700' },
        yellow: { active: 'bg-arcade-yellow shadow-[0_0_10px_#ffe600] text-black', inactive: 'bg-gray-800 border-gray-700' },
        purple: { active: 'bg-purple-500 shadow-[0_0_10px_#a855f7]', inactive: 'bg-gray-800 border-gray-700' }
    };

    const styles = tickColorMap[color];

    return (
        <div className="mb-8">
            <div className="flex justify-between items-end mb-2">
                <span className="text-gray-100 font-black uppercase text-xs tracking-wider">{label}</span>
                <span className={`text-[10px] uppercase font-black tracking-widest text-shadow-arcade animate-pulse-neon
                    ${color === 'blue' ? 'text-arcade-blue' :
                        color === 'red' ? 'text-arcade-red' :
                            color === 'purple' ? 'text-purple-400' : 'text-arcade-yellow'}
                `}>
                    {tickLabels ? tickLabels[value - 1] : (value === 3 ? "Neutral" : value < 3 ? leftLabel : rightLabel)}
                </span>
            </div>

            <style jsx>{`
                @keyframes pulse-neon {
                    0% { opacity: 0.8; filter: brightness(1); }
                    50% { opacity: 1; filter: brightness(1.5) drop-shadow(0 0 5px currentColor); }
                    100% { opacity: 0.8; filter: brightness(1); }
                }
                .animate-pulse-neon {
                    animation: pulse-neon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>

            {/* Ticks Container */}
            <div className="flex gap-2 h-10 mb-2">
                {[1, 2, 3, 4, 5].map((tick) => (
                    <button
                        key={tick}
                        onClick={() => onChange(tick)}
                        className={`
                            flex-1 rounded-sm border-2 transition-all duration-150 flex flex-col items-center justify-center p-1
                            ${tick === value
                                ? `${styles.active} border-transparent -translate-y-1`
                                : `${styles.inactive} hover:bg-gray-700 hover:border-gray-500 text-gray-600`
                            }
                        `}
                    >
                        <span className={`font-black text-xs ${tick === value ? (color === 'yellow' ? 'text-black' : 'text-white') : ''}`}>
                            {tick}
                        </span>
                    </button>
                ))}
            </div>

            {/* Microcopy & Anchors */}
            <div className="relative h-6">
                <p className="text-[11px] text-gray-400 font-medium italic text-center absolute w-full transition-all top-0">
                    &ldquo;{microcopy[value - 1]}&rdquo;
                </p>

                {/* Visual Anchors (Faded) */}
                <div className="flex justify-between text-[9px] font-bold text-gray-600 uppercase mt-5 opacity-40">
                    <span>{leftLabel}</span>
                    <span>{rightLabel}</span>
                </div>
            </div>
        </div>
    );
}
