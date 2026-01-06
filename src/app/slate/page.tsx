'use client';

import { useRef, useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { subDays, addDays, format, isSameDay } from 'date-fns';
import { Loader2, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import SlateRanker from '@/components/SlateRanker';
import { fetchESPNGames } from '@/lib/api/espn';
import { usePreferences } from '@/lib/state/usePreferences';
import type { Game } from '@/types/schema';

function SlateContent() {
    const searchParams = useSearchParams();
    const dateParam = searchParams.get('date');
    const yesterday = subDays(new Date(), 1);

    const [selectedDate, setSelectedDate] = useState(() => {
        if (dateParam) {
            // "yyyy-MM-dd" -> parsed as local time roughly
            const [y, m, d] = dateParam.split('-').map(Number);
            // new Date(y, m-1, d) is safer for local matching
            if (y && m && d) {
                return new Date(y, m - 1, d);
            }
        }
        return yesterday;
    });
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const { isLoaded, recordSlateRun } = usePreferences();
    const lastFetchedRef = useRef<string | null>(null);


    // Update state if URL changes significantly, OR keep in sync
    // For now, initialization is enough, clicking internal nav updates state only.

    // 1. Fetch Games when date changes
    useEffect(() => {
        const dateKey = format(selectedDate, 'yyyy-MM-dd');

        async function loadGames() {
            // Prevent redundant fetches if we're already loading this date
            if (lastFetchedRef.current === dateKey && !loading) return;

            setLoading(true);
            try {
                const data = await fetchESPNGames(selectedDate);
                setGames(data);
                lastFetchedRef.current = dateKey;
            } catch (err) {
                console.error('Failed to fetch games:', err);
                setGames([]);
            } finally {
                setLoading(false);
            }
        }

        if (isLoaded) {
            loadGames();
        }
    }, [selectedDate, isLoaded, loading]);

    // 2. Track Slate Run in a separate effect once games are loaded
    useEffect(() => {
        if (!loading && games.length > 0) {
            recordSlateRun();
        }
    }, [loading, games.length, recordSlateRun]);

    const isYesterday = isSameDay(selectedDate, yesterday);

    if (!isLoaded) return null;

    return (
        <main className="p-4 pb-4 max-w-md mx-auto">
            <div className="mb-8 space-y-4">
                <div className="flex flex-col items-start text-left space-y-1">
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter text-shadow-arcade">
                        <span className="text-arcade-yellow">Unmi$$able</span> <span className="text-arcade-red">Slate</span>
                    </h2>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        Your personalized rankings from last night&apos;s slate of games.
                    </p>
                </div>

                {/* Custom Arcade Date Navigator */}
                <div className="flex flex-col items-center gap-4 py-2">
                    <div className="flex items-center justify-between w-full max-w-[320px] group">
                        <button
                            onClick={() => setSelectedDate(prev => subDays(prev, 1))}
                            className="p-2 text-gray-500 hover:text-arcade-blue transition-colors"
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </button>

                        <div className="flex-1 px-4">
                            <div className="bg-gray-900/80 border-2 border-gray-800 rounded-lg p-3 box-shadow-arcade-xs flex items-center justify-center min-w-[180px]">
                                <span className="text-base font-black italic tracking-tighter text-white uppercase">
                                    {format(selectedDate, 'eee MMM do yyyy')}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => setSelectedDate(prev => addDays(prev, 1))}
                            className="p-2 text-gray-500 hover:text-arcade-blue transition-colors"
                        >
                            <ChevronRight className="w-8 h-8" />
                        </button>
                    </div>

                    {!isYesterday && (
                        <button
                            onClick={() => setSelectedDate(yesterday)}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-arcade-blue hover:text-white transition-all animate-in fade-in slide-in-from-top-1"
                        >
                            <RotateCcw className="w-3 h-3" />
                            Show me last night
                        </button>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                    <Loader2 className="w-12 h-12 text-arcade-yellow animate-spin mb-4" />
                    <p className="text-arcade-yellow font-black uppercase tracking-widest text-sm italic">
                        Hydrating The Slate...
                    </p>
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <SlateRanker initialGames={games} />
                </div>
            )}
        </main>
    );
}

export default function SlatePage() {
    return (
        <Suspense fallback={<div className="p-10 text-center text-arcade-yellow">Loading Slate...</div>}>
            <SlateContent />
        </Suspense>
    );
}
