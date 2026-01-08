'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings, Tv, Share2 } from 'lucide-react';
import { usePreferences } from '@/lib/state/usePreferences';
import { shareTunedSlate } from '@/lib/share/share';
import Jersey from '@/components/ui/Jersey';
import { ALL_TEAMS } from '@/lib/data/allTeams';
import { ALL_PLAYERS } from '@/lib/data/allPlayers';


export default function Navbar() {
    const pathname = usePathname();
    const { prefs } = usePreferences();

    const handleShare = async () => {
        await shareTunedSlate(prefs);
    };

    const favoriteTeam = ALL_TEAMS.find(t => t.id === (prefs.teamRanks?.[0] || 14));
    const goatPlayer = ALL_PLAYERS.find(p => p.id === prefs.goatId);
    const jerseyNumber = goatPlayer?.jerseyNumber || '00';

    // Dynamic Icon logic
    const leftIcon = pathname === '/' ? (
        <Link href="/slate" className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <Tv className="w-6 h-6 text-gray-400" />
        </Link>
    ) : pathname === '/slate' ? (
        <Link href="/preferences" className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <Settings className="w-6 h-6 text-gray-400" />
        </Link>
    ) : pathname === '/preferences' ? (
        <Link href="/slate" className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <Tv className="w-6 h-6 text-gray-400" />
        </Link>
    ) : pathname === '/profile' ? (
        <Link href="/preferences" className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <Settings className="w-6 h-6 text-gray-400" />
        </Link>
    ) : (
        <Link href="/slate" className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <Tv className="w-6 h-6 text-gray-400" />
        </Link>
    );

    return (
        <header className="fixed top-0 left-0 right-0 z-[110] bg-black/60 backdrop-blur-md border-b border-gray-800">
            <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
                {leftIcon}

                <Link href="/" className="text-center group">
                    <h1 className="text-xl font-black uppercase text-arcade-yellow text-shadow-arcade italic leading-tight group-hover:scale-105 transition-transform">
                        Neat-O <span className="text-arcade-red">Slate</span>
                    </h1>
                    <p className="text-[7px] font-black uppercase tracking-[0.3em] text-gray-500 mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                        Unsullied by sponsorship.
                    </p>
                </Link>

                <div className="flex items-center gap-1">
                    <button onClick={handleShare} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                        <Share2 className="w-5 h-5 text-gray-400" />
                    </button>
                    <Link href="/profile" className="ml-1 rounded-full hover:scale-105 transition-transform">
                        <div className="w-10 h-10 rounded-full bg-arcade-blue border-2 border-black flex items-center justify-center overflow-hidden box-shadow-arcade-sm relative isolate">
                            <Jersey
                                teamName={favoriteTeam?.name || 'Lakers'}
                                number={jerseyNumber}
                                name={prefs.profile?.displayName || 'PLAYER'}
                                view="back"
                                size="sm"
                                className="scale-[0.85] origin-center mt-2 z-10"
                            />
                        </div>
                    </Link>
                </div>
            </div>
        </header>
    );
}
