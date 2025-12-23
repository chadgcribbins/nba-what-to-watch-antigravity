import { useDroppable } from '@dnd-kit/core';
import { ReactNode } from 'react';

interface DroppableBucketProps {
    id: string;
    label: string;
    description: string;
    color: 'yellow' | 'red' | 'blue';
    children: ReactNode;
    darkText?: boolean;
}

export function DroppableBucket({ id, label, description, color, children, darkText }: DroppableBucketProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: id,
        data: { type: 'BUCKET' }
    });

    const colorClasses = {
        yellow: 'border-arcade-yellow bg-yellow-900/20 text-arcade-yellow',
        red: 'border-arcade-red bg-red-900/20 text-arcade-red',
        blue: 'border-arcade-blue bg-blue-900/20 text-arcade-blue'
    };

    return (
        <div
            ref={setNodeRef}
            className={`
                flex-1 min-w-[200px] min-h-[160px] p-4 rounded-xl border-2 border-dashed
                transition-colors duration-200
                ${colorClasses[color]}
                ${isOver ? 'bg-opacity-40 border-solid scale-[1.02]' : 'border-opacity-40'}
                ${darkText ? 'text-black' : ''}
            `}
        >
            <div className={`flex flex-col items-center mb-2 ${darkText ? 'text-black' : ''}`}>
                <span className="font-black uppercase text-sm tracking-wider">{label}</span>
                <span className={`text-[10px] ${darkText ? 'text-black/80' : 'opacity-70'} font-mono text-center`}>{description}</span>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
                {children}
            </div>

            {/* Empty State placeholder if no children */}
            {!children && !isOver && (
                <div className="h-full flex items-center justify-center opacity-20 text-2xl font-bold">
                    +
                </div>
            )}
        </div>
    );
}
