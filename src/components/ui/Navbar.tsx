'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings, Tv, Share2, UserCircle } from 'lucide-react';
import { usePreferences } from '@/lib/state/usePreferences';
import { getShareUrl } from '@/lib/safety/share';

export default function Navbar() {
    const pathname = usePathname();
    const { prefs } = usePreferences();

    const handleShare = async () => {
        const url = getShareUrl(prefs);
        await navigator.clipboard.writeText(url);
        alert('Share link copied to clipboard!');
    };

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
                    <Link href="/profile" className="p-2 hover:bg-gray-800 rounded-lg transition-colors overflow-hidden">
                        <div className="w-6 h-6 rounded-full bg-arcade-blue border border-black flex items-center justify-center text-[10px] font-black text-white">
                            {prefs.profile?.displayName?.[0] || '?'}
                        </div>
                    </Link>
                </div>
            </div>
        </header>
    );
}
