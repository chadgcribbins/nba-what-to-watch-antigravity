import { useRef, useEffect, useState } from 'react';

interface ArcadeSliderProps {
    label: string;
    leftLabel: string;
    rightLabel: string;
    value: number;
    onChange: (val: number) => void;
    color?: 'blue' | 'red' | 'yellow' | 'purple';
}

export function ArcadeSlider({ label, leftLabel, rightLabel, value, onChange, color = 'blue' }: ArcadeSliderProps) {
    // Calculate fill percentage
    const percentage = value;

    // Color mapping
    const colorMap = {
        blue: 'accent-arcade-blue',
        red: 'accent-arcade-red',
        yellow: 'accent-arcade-yellow',
        purple: 'accent-purple-500' // Custom
    };

    const bgMap = {
        blue: 'bg-arcade-blue',
        red: 'bg-arcade-red',
        yellow: 'bg-arcade-yellow',
        purple: 'bg-purple-500'
    };

    return (
        <div className="relative mb-6 group">
            <div className="flex justify-between mb-3 align-bottom">
                <span className="text-white font-black uppercase text-sm tracking-wider">{label}</span>
                <span className={`font-mono font-bold text-lg ${color === 'blue' ? 'text-arcade-blue' : color === 'red' ? 'text-arcade-red' : 'text-arcade-yellow'}`}>
                    {value}
                </span>
            </div>

            <div className="relative h-6 flex items-center">
                {/* Track Background */}
                <div className="absolute w-full h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                    {/* Center Marker */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-600"></div>

                    {/* Fill Bar (Optional: if we want custom fill instead of browser default) */}
                    <div
                        className={`absolute left-0 top-0 bottom-0 ${bgMap[color]} opacity-50 transition-all duration-75 ease-out`}
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>

                {/* Range Input */}
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                    className={`
                        w-full absolute z-10 opacity-0 cursor-pointer h-full
                    `}
                />

                {/* Custom Thumb (Visual Only, follows value) */}
                <div
                    className={`
                        absolute h-5 w-5 rounded-full shadow-lg border-2 border-white
                        ${bgMap[color]}
                        pointer-events-none transition-all duration-75 ease-out
                        hover:scale-110 group-hover:shadow-[0_0_10px_rgba(255,255,255,0.3)]
                    `}
                    style={{ left: `calc(${percentage}% - 10px)` }}
                />
            </div>

            <div className="flex justify-between text-[10px] font-bold text-gray-500 mt-2 uppercase tracking-wide">
                <span>{leftLabel}</span>
                <span>{rightLabel}</span>
            </div>
        </div>
    );
}
