import { useState } from 'react';
import { RankedGame } from '@/types/schema';
import clsx from 'clsx';

interface GameCardProps {
    game: RankedGame;
    onClick?: () => void;
    className?: string;
    userPick?: number | null;
    onPick?: (teamId: number) => void;
    isReminded?: boolean;
    onToggleReminder?: () => void;
    userEmail?: string;
}

export function GameCard({
    game,
    onClick,
    className,
    userPick,
    onPick,
    isReminded,
    onToggleReminder,
    userEmail
}: GameCardProps) {
    const isScheduled = game.status === 'Scheduled';
    const isFinal = game.status === 'Final';

    // Determine border color based on suggestion
    const isTopTier = game.suggestion === 'watch 4th quarter full' ||
        game.suggestion === 'full game';

    const [reminded, setReminded] = useState(false);

    const handlePick = (e: React.MouseEvent, teamId: number) => {
        e.stopPropagation();
        if (!isScheduled || !onPick) return;
        onPick(teamId);
    };

    const handleRemind = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!onToggleReminder) return;

        if (!userEmail && !isReminded) {
            alert(`🚨 DROP INTO THE LOCKER ROOM FIRST! You'll need to set your email in your profile so we can send that reminder buzz.`);
            return;
        }

        onToggleReminder();
        if (!isReminded) {
            alert(`🎯 REMINDER SCHEDULED! We'll ping ${userEmail} when it's safe to drop in for ${game.awayTeam.abbreviation} @ ${game.homeTeam.abbreviation}.`);
        }
    };

    return (
        <div
            className={clsx(
                "block relative p-4 mb-4 border-2 border-black rounded-sm box-shadow-arcade transition-transform active:translate-y-1 active:translate-x-1 active:shadow-none cursor-pointer bg-[#0a0f1e] group hover:bg-[#1a2542]",
                !isScheduled && "bg-arcade-card",
                isTopTier ? "border-arcade-yellow" : "border-black",
                className
            )}
            onClick={onClick}
        >
            {/* Stretched Link for Primary Action (NBA.com) */}
            {!isScheduled && game.watchLinks?.primary && (
                <a
                    href={game.watchLinks.primary}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 z-10"
                    aria-label="Watch on NBA.com"
                />
            )}
            <div className="flex justify-between items-start mb-2">
                <div className="flex flex-col">
                    <span className="text-xl font-black text-shadow-arcade uppercase italic leading-none">
                        #{game.rank}
                    </span>
                    <span className="text-[10px] font-bold text-gray-500 mt-1 uppercase tracking-tighter">
                        {isScheduled ? 'HYPE' : 'SCORE'}: {Math.round(game.watchabilityScore)}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {/* Summary / Preview Button */}
                    <a
                        href={game.watchLinks?.espn}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className={clsx(
                            "relative overflow-hidden text-[10px] font-black uppercase px-2 py-1 rounded-sm border border-black tracking-tight transition-all hover:-translate-y-0.5 z-20 min-w-[80px] text-center flex items-center justify-center gap-1",
                            "bg-arcade-blue text-white group/summary" // Use group for internal hover effect
                        )}
                    >
                        <img src="https://a.espncdn.com/favicon.ico" alt="ESPN" className="w-2.5 h-2.5 object-contain" />
                        <span className={clsx("block", !isScheduled && "group-hover/summary:hidden")}>
                            {isScheduled ? "PREVIEW" : "SUMMARY"}
                        </span>
                        {!isScheduled && (
                            <span className="hidden group-hover/summary:block text-arcade-yellow animate-pulse">
                                SPOILER!
                            </span>
                        )}
                    </a>

                    {isScheduled ? (
                        <button
                            onClick={handleRemind}
                            className={clsx(
                                "text-[10px] font-black uppercase px-2 py-1 rounded-sm border border-black tracking-tight transition-colors z-20 relative",
                                isReminded ? "bg-arcade-yellow text-black" : "bg-gray-700 text-gray-300"
                            )}
                        >
                            {isReminded ? '🔔 REMINDED' : '⏰ REMIND ME'}
                        </button>
                    ) : (
                        <span className={clsx(
                            "text-[10px] font-black uppercase px-2 py-1 rounded-sm border border-black tracking-tight",
                            isTopTier ? "bg-arcade-red text-white" : "bg-gray-700 text-gray-300"
                        )}>
                            {game.suggestion}
                        </span>
                    )}
                </div>
            </div>

            {/* Prediction / Status Badges */}
            {userPick && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 animate-in fade-in zoom-in duration-300">
                    <span className={clsx(
                        "text-[9px] font-black uppercase px-2 py-0.5 rounded-full border-2 border-black box-shadow-arcade-xs",
                        isFinal ? "bg-arcade-green text-white" : "bg-arcade-blue text-white"
                    )}>
                        {isFinal ? "🎯 Prediction Correct" : "⚡ Target Locked"}
                    </span>
                </div>
            )}

            {/* Matchup with Logos */}
            <div className="flex items-center justify-between mb-4 px-2">
                <div
                    onClick={(e) => handlePick(e, game.awayTeam.id)}
                    className={clsx(
                        "flex flex-col items-center gap-1 flex-1 p-2 rounded-sm transition-all relative z-20",
                        isScheduled && "hover:bg-arcade-blue/10 cursor-crosshair",
                        userPick === game.awayTeam.id && "bg-arcade-blue/20 ring-1 ring-arcade-blue shadow-[0_0_10px_rgba(0,186,255,0.3)]"
                    )}
                >
                    {game.awayTeam.logoUrl ? (
                        <img src={game.awayTeam.logoUrl} alt={game.awayTeam.abbreviation} className="w-12 h-12 object-contain drop-shadow-sm" />
                    ) : (
                        <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center font-bold text-gray-400">{game.awayTeam.abbreviation}</div>
                    )}
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 leading-none">{game.awayTeam.abbreviation}</span>
                    {userPick === game.awayTeam.id && (
                        <div className="absolute -top-1 -right-1 text-[10px]">🎯</div>
                    )}
                </div>

                <div className="flex flex-col items-center justify-center px-4">
                    <span className="text-arcade-yellow font-black italic text-[11px] tracking-tighter opacity-50">VS</span>
                </div>

                <div
                    onClick={(e) => handlePick(e, game.homeTeam.id)}
                    className={clsx(
                        "flex flex-col items-center gap-1 flex-1 p-2 rounded-sm transition-all relative z-20",
                        isScheduled && "hover:bg-arcade-blue/10 cursor-crosshair",
                        userPick === game.homeTeam.id && "bg-arcade-blue/20 ring-1 ring-arcade-blue shadow-[0_0_10px_rgba(0,186,255,0.3)]"
                    )}
                >
                    {game.homeTeam.logoUrl ? (
                        <img src={game.homeTeam.logoUrl} alt={game.homeTeam.abbreviation} className="w-12 h-12 object-contain drop-shadow-sm" />
                    ) : (
                        <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center font-bold text-gray-400">{game.homeTeam.abbreviation}</div>
                    )}
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 leading-none">{game.homeTeam.abbreviation}</span>
                    {userPick === game.homeTeam.id && (
                        <div className="absolute -top-1 -right-1 text-[10px]">🎯</div>
                    )}
                </div>
            </div>

            {/* Narrative Headline */}
            <div className="mb-4 px-1 text-center">
                <p className={clsx(
                    "text-[11px] font-black uppercase italic leading-tight tracking-tight drop-shadow-sm",
                    isScheduled ? "text-arcade-blue" : "text-arcade-red"
                )}>
                    {game.narrativeHeadline}
                </p>
                {isScheduled && (
                    <p className="text-[8px] font-bold text-arcade-yellow mt-1 animate-pulse">
                        PICK A WINNER TO BOOST HYPE
                    </p>
                )}
            </div>


            {/* Tags and Metadata */}
            <div className="flex flex-wrap gap-2 justify-center mt-4">
                {game.tags.map((tag, i) => (
                    <span key={i} className={clsx(
                        "text-[9px] font-bold uppercase px-2 py-0.5 rounded-sm border tracking-tighter opacity-80",
                        isScheduled ? "bg-arcade-blue/5 text-arcade-blue border-arcade-blue/20" : "bg-gray-800/40 text-arcade-blue border-white/10"
                    )}>
                        {tag}
                    </span>
                ))}
            </div>

            {game.discoveryNote && (
                <div className="mt-3 pt-3 border-t border-white/5">
                    <div className="flex items-center gap-2 text-arcade-yellow">
                        <span className="text-xs">✨</span>
                        <span className="text-[9px] font-black uppercase tracking-widest bg-arcade-yellow/10 px-2 py-0.5 rounded">
                            DISCOVERY: {game.discoveryNote}
                        </span>
                    </div>
                </div>
            )}

            {isTopTier && !isScheduled && (
                <div className="absolute -top-3 -right-3 z-20 flex flex-col items-center animate-arcade-float">
                    <div className="text-3xl drop-shadow-[0_0_8px_rgba(255,165,0,0.8)] z-20 relative top-2">
                        🔥
                    </div>
                    <div className="bg-arcade-red text-white text-[8px] font-black px-2 py-0.5 rounded-sm border-2 border-black box-shadow-arcade-xs uppercase italic tracking-tighter -rotate-12 relative z-10 shadow-[0_4px_10px_rgba(255,0,0,0.4)]">
                        He's on fire!
                    </div>
                </div>
            )}
        </div>
    );
}

