
'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableGroupItemProps {
    id: string;
    label: string;
    rank: number;
}

export function SortableGroupItem({ id, label, rank }: SortableGroupItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <li
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`flex items-center p-3 mb-2 bg-gray-900 border border-gray-600 rounded cursor-grab active:cursor-grabbing hover:bg-gray-800 touch-none select-none h-12`}
        >
            <span className="font-mono text-gray-500 mr-4 w-6 text-right text-xs">#{rank}</span>
            <span className="font-bold text-white uppercase text-sm">{label}</span>
            <div className="ml-auto text-gray-600">
                ☰
            </div>
        </li>
    );
}
