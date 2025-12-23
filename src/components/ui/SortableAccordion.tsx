'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ReactNode } from 'react';

interface SortableAccordionProps {
    id: string;
    label: string;
    rank: number;
    children: ReactNode;
    isOpen: boolean;
    onToggle: () => void;
    logoUrl?: string; // For Images (Conferences)
    icon?: ReactNode; // For Emojis/Icons (Divisions)
}

export function SortableAccordion({ id, label, rank, children, isOpen, onToggle, logoUrl, icon }: SortableAccordionProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id,
        data: { type: 'GROUP' }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        position: 'relative' as const,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="mb-4 bg-gray-900 border border-gray-700 rounded overflow-hidden"
        >
            {/* Header - Draggable Handle for Group */}
            <div
                className="flex items-center p-3 bg-gray-800 border-b border-gray-700 cursor-pointer hover:bg-gray-750"
                onClick={onToggle}
            >
                {/* Left: Logo/Icon & Label */}
                <div className="flex items-center gap-3 flex-1">
                    {logoUrl ? (
                        <img src={logoUrl} alt={label} className="w-8 h-8 object-contain" />
                    ) : icon ? (
                        <span className="text-2xl">{icon}</span>
                    ) : null}
                    <span className="font-black uppercase text-white tracking-wide">{label}</span>
                </div>

                {/* Right: Rank, Handle, Toggle */}
                <div className="flex items-center gap-3">
                    <span className={`
                        flex items-center justify-center
                        w-10 h-8 rounded-full
                        border border-gray-600 bg-gray-900
                        font-mono text-sm font-bold text-arcade-yellow
                     `}>
                        #{rank}
                    </span>

                    {/* Drag Handle moved to right */}
                    <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-2 text-gray-500 hover:text-white">
                        ☰
                    </div>

                    <div className="text-gray-500 text-xs w-4 text-center">
                        {isOpen ? '▲' : '▼'}
                    </div>
                </div>
            </div>

            {/* Content - Team List */}
            {isOpen && (
                <div className="p-2 space-y-2 bg-black/50">
                    {children}
                </div>
            )}
        </div>
    );
}
