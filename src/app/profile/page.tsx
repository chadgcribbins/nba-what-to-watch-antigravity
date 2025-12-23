'use client';

import { usePreferences } from '@/lib/state/usePreferences';
import { ALL_TEAMS } from '@/lib/data/allTeams';
import { ALL_PLAYERS } from '@/lib/data/allPlayers';
import Jersey from '@/components/ui/Jersey';
import { Trophy, Star, History, Shield } from 'lucide-react';

// Mock map for popular jersey numbers since they aren't in the data
const POPULAR_NUMBERS: Record<string, string> = {
    '1626164': '1',  // Booker
    '201942': '11',  // DeRozan
    '1629027': '11', // Trae
    '201142': '35',  // KD
    '203999': '15',  // Jokic
    '203507': '34',  // Giannis
    '1628366': '2',  // Lonzo (example)
    '2544': '23',    // LeBron
    '201939': '30',  // Steph
};

export default function ProfilePage() {
    const { prefs, isLoaded, updateEmail } = usePreferences();

    if (!isLoaded) return null;

    const favoriteTeam = ALL_TEAMS.find(t => t.id === (prefs.teamRanks?.[0] || 14)); // Default to Lakers if not set
    const goatPlayer = ALL_PLAYERS.find(p => p.id === prefs.goatId);
    const jerseyNumber = goatPlayer ? (POPULAR_NUMBERS[goatPlayer.id] || '00') : '00';

    return (
        <main className="p-4 pb-4 max-w-md mx-auto space-y-8">
            <div className="text-left space-y-2 pt-4">
                <h2 className="text-3xl font-black uppercase italic tracking-tighter text-shadow-arcade">
                    <span className="text-arcade-yellow">@ Locker</span> <span className="text-arcade-red">Room</span>
                </h2>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    Personalized Identity & Statistics.
                </p>
            </div>

            {/* Identity Card */}
            <div className="relative bg-arcade-card border-4 border-black box-shadow-arcade p-6 overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-arcade-blue/5 -rotate-12 translate-x-8 -translate-y-8 group-hover:bg-arcade-blue/10 transition-colors" />

                <div className="flex flex-col space-y-6 relative z-10">
                    <div className="flex items-start justify-between">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-arcade-yellow border-2 border-black flex items-center justify-center text-xl font-black text-black">
                                    {prefs.profile?.displayName?.[0] || 'G'}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none">
                                        {prefs.profile?.displayName || 'Guest Player'}
                                    </h3>
                                    <div className="flex items-center gap-1.5 mt-1 text-arcade-blue">
                                        <Shield className="w-3 h-3 fill-current" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">
                                            {favoriteTeam?.full_name || 'Free Agent'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1 pt-2">
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Franchise GOAT</p>
                                <div className="flex items-center gap-2">
                                    <Star className="w-4 h-4 text-arcade-yellow fill-arcade-yellow" />
                                    <span className="text-sm font-black uppercase italic">{goatPlayer?.name || 'Unassigned'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <Jersey
                                teamName={favoriteTeam?.name || 'Lakers'}
                                number={jerseyNumber}
                                size="md"
                                className="hover:scale-110 transition-transform duration-300"
                            />
                        </div>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2 pt-2 border-t border-gray-800/50">
                        <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Notification Email</p>
                        <input
                            type="email"
                            placeholder="hooper@ball.com"
                            value={prefs.profile?.email || ''}
                            onChange={(e) => updateEmail(e.target.value)}
                            className="w-full bg-black/40 border-2 border-gray-800 p-2 text-xs font-bold text-arcade-blue placeholder:text-gray-700 outline-none focus:border-arcade-blue transition-colors rounded-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Winner Picks Scorecard */}
            <div className="bg-gray-900 border-x-4 border-y-2 border-arcade-red/40 p-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-1 opacity-10">
                    <Trophy className="w-16 h-16 text-arcade-yellow" />
                </div>
                <div className="flex justify-between items-center relative z-10">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-arcade-red uppercase tracking-[0.2em]">Winner Picks</p>
                        <h4 className="text-xl font-black italic uppercase italic tracking-tighter">Score Sheet</h4>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-center">
                            <p className="text-[8px] font-black text-gray-500 uppercase">Right</p>
                            <span className="text-2xl font-black text-arcade-green tabular-nums">
                                {prefs.stats?.picksRecord?.correct || 0}
                            </span>
                        </div>
                        <div className="text-center">
                            <p className="text-[8px] font-black text-gray-500 uppercase">Wrong</p>
                            <span className="text-2xl font-black text-arcade-red tabular-nums opacity-50">
                                {(prefs.stats?.picksRecord?.total || 0) - (prefs.stats?.picksRecord?.correct || 0)}
                            </span>
                        </div>
                        <div className="text-center border-l border-gray-800 pl-4 ml-2">
                            <p className="text-[8px] font-black text-gray-500 uppercase">Rate</p>
                            <span className="text-2xl font-black text-white tabular-nums">
                                {prefs.stats?.picksRecord?.total
                                    ? Math.round((prefs.stats.picksRecord.correct / prefs.stats.picksRecord.total) * 100)
                                    : 0}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats / Trophies Placeholder */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-900 border-2 border-gray-800 p-4 rounded-sm flex flex-col items-center text-center space-y-2">
                    <Trophy className="w-6 h-6 text-arcade-yellow" />
                    <p className="text-[9px] font-black uppercase text-gray-500">Slates Run</p>
                    <span className="text-xl font-black italic">{prefs.stats?.slatesRun || 0}</span>
                </div>
                <div className="bg-gray-900 border-2 border-gray-800 p-4 rounded-sm flex flex-col items-center text-center space-y-2">
                    <History className="w-6 h-6 text-arcade-blue" />
                    <p className="text-[9px] font-black uppercase text-gray-500">Watch Time</p>
                    <span className="text-xl font-black italic">{Math.floor((prefs.stats?.watchTimeMinutes || 0) / 60)}H</span>
                </div>
            </div>

            {/* Action Links */}
            <div className="space-y-4 pt-4">
                <button className="w-full bg-gray-800 border-2 border-black p-3 text-[11px] font-black uppercase italic tracking-widest hover:bg-arcade-yellow hover:text-black transition-colors">
                    View Collection
                </button>
                <button className="w-full bg-gray-800 border-2 border-black p-3 text-[11px] font-black uppercase italic tracking-widest hover:bg-arcade-blue hover:text-white transition-colors">
                    Franchise History
                </button>
            </div>
        </main>
    );
}
