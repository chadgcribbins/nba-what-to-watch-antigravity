'use client';

import { useMemo } from 'react';
import { Game, RankedGame } from '@/types/schema';
import { GameCard } from '@/components/ui/GameCard';
import { usePreferences } from '@/lib/state/usePreferences';
import { rankGames } from '@/lib/ranking/scorer';

interface SlateRankerProps {
    initialGames: Game[];
}

export default function SlateRanker({ initialGames }: SlateRankerProps) {
    const { prefs, setWinnerPick, toggleReminder, isLoaded } = usePreferences();
    const rankedSlate: RankedGame[] = useMemo(() => {
        if (!isLoaded) return [];
        return rankGames(initialGames, prefs);
    }, [initialGames, prefs, isLoaded]);

    if (!isLoaded) {
        return <div className="text-center p-8 animate-pulse text-gray-500">Loading Preferences...</div>;
    }

    if (rankedSlate.length === 0 && initialGames.length > 0) {
        // Should handle the case where initial ranking happens before effect?
        // Actually we initialized state to empty, so this might flash empty.
        // Let's force a ranking with default prefs if isLoaded is false?
        // Better: just wait for effect.
        return <div className="text-center p-8 animate-pulse text-gray-500">Ranking Slate...</div>;
    }

    if (initialGames.length === 0) {
        return (
            <div className="text-center p-8 bg-arcade-card border border-gray-700 rounded">
                <p>No games found for this slate.</p>
            </div>
        );
    }

    const mainSlate = rankedSlate.filter(g => !g.discoveryNote);
    const discoverySlate = rankedSlate.filter(g => !!g.discoveryNote);

    return (
        <div className="space-y-12">
            {/* Main Rankings */}
            <div className="space-y-6">
                {mainSlate.map((game) => {
                    const activePick = prefs.picks?.[game.id] || null;
                    const isReminded = prefs.reminders?.includes(game.id) || false;

                    const cardProps = {
                        game,
                        userPick: activePick,
                        onPick: (teamId: number) => setWinnerPick(game.id, teamId),
                        isReminded,
                        onToggleReminder: () => toggleReminder(game.id),
                        userEmail: prefs.profile?.email
                    };

                    return (
                        <GameCard
                            key={game.id}
                            {...cardProps}
                        />
                    );
                })}
            </div>

            {/* Discovery Section */}
            {discoverySlate.length > 0 && (
                <div className="animate-in slide-in-from-bottom-8 duration-1000">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-arcade-yellow/30" />
                        <h3 className="text-sm font-black italic text-arcade-yellow uppercase tracking-[0.3em] text-shadow-arcade">
                            Discovery
                        </h3>
                        <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-arcade-yellow/30" />
                    </div>

                    <div className="space-y-4">
                        <p className="text-[10px] font-bold text-center text-gray-500 uppercase tracking-widest mb-4">
                            Spotlights on rising rotation pieces & deep roster value
                        </p>
                        {discoverySlate.map((game) => {
                            const activePick = prefs.picks?.[game.id] || null;
                            const isReminded = prefs.reminders?.includes(game.id) || false;

                            const cardProps = {
                                game,
                                userPick: activePick,
                                onPick: (teamId: number) => setWinnerPick(game.id, teamId),
                                isReminded,
                                onToggleReminder: () => toggleReminder(game.id),
                                userEmail: prefs.profile?.email
                            };

                            return (
                                <GameCard
                                    key={game.id}
                                    {...cardProps}
                                />
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
