import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableTeamItemProps {
    id: number;
    name: string;
    rank: number;
    logoUrl?: string;
}

export function SortableTeamItem({ id, name, rank, logoUrl }: SortableTeamItemProps) {
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
            className={`flex items-center p-3 mb-2 bg-arcade-card border border-gray-600 rounded touch-none select-none ${rank <= 5 ? "border-arcade-yellow" : ""}`}
        >
            {/* Left: Logo & Name */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
                {logoUrl && (
                    <img src={logoUrl} alt={name} className="w-8 h-8 object-contain flex-shrink-0" />
                )}
                <span className="font-bold text-white truncate">{name}</span>
            </div>

            {/* Right: Rank & Handle */}
            <div className="flex items-center gap-3 ml-2 flex-shrink-0">
                <span className={`
                    flex items-center justify-center
                    w-10 h-8 rounded-full
                    border border-gray-600 bg-gray-900
                    font-mono text-sm font-bold text-arcade-yellow
                 `}>
                    #{rank}
                </span>

                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing p-2 text-gray-600 hover:text-white"
                >
                    ☰
                </div>
            </div>
        </li>
    );
}
