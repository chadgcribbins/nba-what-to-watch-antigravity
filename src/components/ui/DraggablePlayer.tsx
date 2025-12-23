import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface DraggablePlayerProps {
    id: string;
    name: string;
    headshotUrl: string;
    isOverlay?: boolean;
    statValue?: string | number;
    onRemove?: () => void;
    highlightColor?: string; // For bucket highlighting
}

export function DraggablePlayer({ id, name, headshotUrl, isOverlay, statValue, onRemove, highlightColor }: DraggablePlayerProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: id,
        data: {
            type: 'PLAYER',
            name,
            headshotUrl
        }
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`
                group relative flex flex-col items-center justify-center p-2
                w-24 h-32
                cursor-grab active:cursor-grabbing touch-none
                ${isOverlay ? 'scale-105 z-50' : ''}
                ${highlightColor ? 'opacity-40' : ''}
            `}
        >
            {/* Removal Button */}
            {onRemove && !isDragging && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="absolute top-1 right-2 w-5 h-5 bg-[#ff4b4b] text-white flex items-center justify-center rounded-full text-[10px] font-black z-10 border border-black hover:scale-110 transition-all shadow-lg opacity-0 group-hover:opacity-100"
                >
                    ✕
                </button>
            )}

            <div className={`
                relative w-16 h-16 rounded-full overflow-hidden border-2 
                ${isDragging ? 'border-arcade-yellow shadow-[0_0_15px_rgba(255,255,0,0.5)]' :
                    highlightColor ? `border-${highlightColor}` : 'border-gray-600 bg-gray-800'}
            `}
                style={{ borderColor: highlightColor }}
            >
                <img src={headshotUrl} alt={name} className="w-full h-full object-cover" />

                {/* Stat Badge */}
                {statValue !== undefined && (
                    <div className="absolute bottom-0 inset-x-0 bg-black/80 text-[10px] font-black text-arcade-yellow text-center py-0.5 leading-none">
                        {statValue}
                    </div>
                )}
            </div>
            <span className="mt-2 text-[10px] text-center font-bold text-white leading-tight px-1">
                {name}
            </span>
        </div>
    );
}
