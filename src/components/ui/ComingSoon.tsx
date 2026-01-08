'use client';

import { X, Lock } from 'lucide-react';

interface ComingSoonProps {
    isOpen: boolean;
    onClose: () => void;
    featureName: string;
}

export default function ComingSoon({ isOpen, onClose, featureName }: ComingSoonProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in duration-500"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-sm bg-black border-4 border-black box-shadow-arcade p-6 overflow-hidden animate-in zoom-in-95 duration-300">
                {/* CRT Effect Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-arcade-red transition-colors z-50"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center text-center space-y-6">
                    <div className="w-16 h-16 bg-gray-800 border-2 border-black flex items-center justify-center box-shadow-arcade-xs animate-pulse">
                        <Lock className="w-8 h-8 text-arcade-yellow" />
                    </div>

                    <div>
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter text-shadow-arcade">
                            <span className="text-arcade-yellow">INSERT</span> <span className="text-arcade-red">COIN</span>
                        </h3>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2">
                            To unlock: {featureName}
                        </p>
                    </div>

                    <div className="bg-gray-900/80 p-4 border-2 border-gray-800 rounded-sm w-full">
                        <p className="text-[11px] font-black uppercase italic tracking-tight text-arcade-blue leading-relaxed">
                            &quot;Coming soon to an arcade cabinet near you! We&apos;re still polishing the pixels for this one.&quot;
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full h-12 bg-arcade-yellow border-3 border-black box-shadow-arcade-xs text-sm font-black uppercase italic text-black tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        CONTINUE GAME
                    </button>
                </div>

                {/* Status Bar */}
                <div className="mt-6 flex justify-between items-center text-[8px] font-black uppercase tracking-[0.2em] text-gray-600 border-t border-gray-800 pt-4">
                    <span>V1.1 PENDING</span>
                    <span className="animate-pulse">WAITING FOR PLAYER 1...</span>
                </div>
            </div>
        </div>
    );
}
