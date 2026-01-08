'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState, Suspense } from 'react';
import { decodePrefs } from '@/lib/safety/share';
import type { Game, UserPreferences } from '@/types/schema';
import { ALL_PLAYERS } from '@/lib/data/allPlayers';
import SlateRanker from '@/components/SlateRanker';
import { fetchESPNGames } from '@/lib/api/espn';
import { subDays } from 'date-fns';
import { Trophy } from 'lucide-react';

function ShareContent() {
    const searchParams = useSearchParams();
    const sharedPrefs: UserPreferences | null = useMemo(() => {
        const p = searchParams.get('p');
        return p ? decodePrefs(p) : null;
    }, [searchParams]);

    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchESPNGames(subDays(new Date(), 1)).then((g) => {
            setGames(g ?? []);
            setLoading(false);
        });
    }, [searchParams]);

    if (!sharedPrefs || loading) {
        return (
            <div className="min-h-screen bg-[#05080f] flex items-center justify-center p-8">
                <div className="animate-pulse text-arcade-yellow font-black uppercase tracking-widest text-sm">
                    Hydrating Snapshot...
                </div>
            </div>
        );
    }

    const goat = ALL_PLAYERS.find(p => p.id === sharedPrefs.goatId);

    return (
        <main className="min-h-screen bg-[#05080f] text-gray-100 p-4 pb-20">
            {/* GOAT Jersey Hero Section */}
            <div className="max-w-md mx-auto mb-12 py-12 px-6 bg-gradient-to-b from-gray-900 to-transparent border-b border-gray-800 text-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-arcade-blue/5 rounded-full blur-3xl -z-10" />

                <div className="relative inline-block mb-6">
                    <div className="w-24 h-24 mx-auto bg-arcade-card border-4 border-black rounded-sm box-shadow-arcade relative overflow-hidden">
                        {goat ? (
                            <img src={goat.headshotUrl} alt="GOAT" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-3xl">🐐</div>
                        )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-arcade-yellow text-black text-[10px] font-black px-2 py-0.5 rounded-sm border-2 border-black rotate-12">
                        GOAT
                    </div>
                </div>

                <h1 className="text-4xl font-black uppercase italic tracking-tighter text-shadow-arcade leading-none mb-2">
                    {sharedPrefs.profile?.displayName || 'Guest Player'}’s <span className="text-arcade-red">Slate</span>
                </h1>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                    <Trophy className="w-3 h-3" /> Powered by The ❤️ of the 🏀 Game!
                </p>
            </div>

            <div className="max-w-md mx-auto space-y-8">
                <div className="px-4 py-3 bg-arcade-blue/10 border border-arcade-blue/30 rounded-sm text-center">
                    <p className="text-[9px] font-black uppercase tracking-widest text-arcade-blue">
                        Personalized Ranking Model Hydrated via PRD v1.0 Universal Link
                    </p>
                </div>

                <SlateRanker initialGames={games} />
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/80 backdrop-blur-md border-t border-gray-800 flex justify-center">
                <a
                    href="/preferences"
                    className="bg-arcade-yellow text-black px-6 py-2 text-xs font-black uppercase border-2 border-black box-shadow-arcade-xs active:translate-y-0.5 active:shadow-none transition-all"
                >
                    Create Your Own Algo
                </a>
            </div>
        </main>
    );
}

export default function SharePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ShareContent />
        </Suspense>
    );
}
