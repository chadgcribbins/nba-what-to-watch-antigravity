'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Tv, Settings, Share2, MessageSquare, User } from 'lucide-react';
import { usePreferences } from '@/lib/state/usePreferences';
import { shareTunedSlate } from '@/lib/share/share';
import FeedbackModal from './FeedbackModal';

export default function Footer() {
    const { prefs } = usePreferences();
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    const handleShare = async () => {
        await shareTunedSlate(prefs);
    };

    return (
        <footer className="mt-0 bg-black/40 border-t-2 border-arcade-blue/30 backdrop-blur-md pt-12 pb-16 px-8 rounded-t-3xl overflow-hidden relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-arcade-blue to-transparent" />

            <div className="max-w-md mx-auto space-y-10">
                <div className="flex flex-col items-center gap-4">
                    <Link href="/" className="flex flex-col items-center gap-4 group">
                        <h4 className="text-xl font-black italic text-arcade-yellow tracking-tighter text-shadow-arcade uppercase group-hover:scale-105 transition-transform">
                            Neat-O <span className="text-arcade-red">Slate</span>
                        </h4>
                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.4em] opacity-60 group-hover:opacity-100">The pure fan’s companion</p>
                    </Link>
                </div>

                <div className="grid grid-cols-3 gap-y-8 gap-x-6 sm:gap-x-12">
                    <div className="space-y-3">
                        <p className="text-[10px] font-black text-arcade-blue uppercase tracking-widest border-b border-arcade-blue/20 pb-1">Court</p>
                        <div className="flex flex-col gap-3">
                            <Link href="/slate" className="flex items-center gap-2 text-[11px] font-bold text-gray-400 hover:text-white transition-colors uppercase italic group">
                                <Tv className="w-3.5 h-3.5 group-hover:text-arcade-yellow transition-colors" />
                                The Slate
                            </Link>
                            <Link href="/preferences" className="flex items-center gap-2 text-[11px] font-bold text-gray-400 hover:text-white transition-colors uppercase italic group">
                                <Settings className="w-3.5 h-3.5 group-hover:text-arcade-yellow transition-colors" />
                                The Algo
                            </Link>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-[10px] font-black text-arcade-green uppercase tracking-widest border-b border-arcade-green/20 pb-1">Social</p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleShare}
                                className="flex items-center gap-2 text-[11px] font-bold text-gray-400 hover:text-white transition-colors uppercase italic text-left group"
                            >
                                <Share2 className="w-3.5 h-3.5 group-hover:text-arcade-blue transition-colors" />
                                Share
                            </button>
                            <button
                                onClick={() => setIsFeedbackOpen(true)}
                                className="flex items-center gap-2 text-[11px] font-bold text-gray-400 hover:text-white transition-colors uppercase italic text-left group"
                            >
                                <MessageSquare className="w-3.5 h-3.5 group-hover:text-arcade-green transition-colors" />
                                Feedback
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-[10px] font-black text-arcade-red uppercase tracking-widest border-b border-arcade-red/20 pb-1">Locker Room</p>
                        <div className="flex flex-col gap-3">
                            <Link href="/profile" className="flex items-center gap-2 text-[11px] font-bold text-gray-400 hover:text-white transition-colors uppercase italic group">
                                <User className="w-3.5 h-3.5 group-hover:text-arcade-yellow transition-colors" />
                                Profile
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="pt-8 flex flex-col items-center gap-6">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-arcade-blue/60 italic text-center">
                        Powered by The ❤️ of the 🏀 Game!
                    </p>
                    <div className="flex gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-arcade-red animate-pulse" />
                        <div className="w-1.5 h-1.5 rounded-full bg-arcade-yellow animate-pulse delay-75" />
                        <div className="w-1.5 h-1.5 rounded-full bg-arcade-blue animate-pulse delay-150" />
                    </div>
                </div>
            </div>

            <FeedbackModal
                isOpen={isFeedbackOpen}
                onClose={() => setIsFeedbackOpen(false)}
            />
        </footer>
    );
}
