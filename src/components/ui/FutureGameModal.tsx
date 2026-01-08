'use client';

import { X } from 'lucide-react';

interface FutureGameModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function FutureGameModal({ isOpen, onClose }: FutureGameModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in duration-500"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className="relative w-full max-w-sm bg-black border-4 border-black box-shadow-arcade p-2 overflow-hidden animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    className="absolute top-4 right-4 z-50 p-1 bg-black/50 rounded-full text-white hover:text-arcade-red transition-all box-shadow-arcade-xs"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Animated Image Container */}
                <div className="relative aspect-square w-full bg-gray-900 border-2 border-black overflow-hidden group">
                    <img
                        src="/rejected.png"
                        alt="REJECTED!"
                        className="w-full h-full object-cover animate-pulse"
                    />

                    {/* Scanline Effect */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.1] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />

                    {/* Vignette */}
                    <div className="absolute inset-0 pointer-events-none bg-radial-gradient(circle_at_center,transparent_0%,black_100%) opacity-30" />
                </div>

                {/* Message Section */}
                <div className="p-6 text-center space-y-4">
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter text-shadow-arcade animate-bounce">
                        <span className="text-arcade-yellow">NOT</span> <span className="text-arcade-red">TODAY!</span>
                    </h3>

                    <p className="text-sm font-black uppercase italic tracking-tight text-white/90 leading-relaxed px-4">
                        &quot;Slow down fella, the game hasn&apos;t even happened yet!&quot;
                    </p>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        className="w-full py-3 bg-arcade-blue border-3 border-black box-shadow-arcade-xs text-sm font-black uppercase italic text-white tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        GO BACK IN TIME
                    </button>
                </div>

                {/* Arcade Status Bar */}
                <div className="bg-gray-900 p-2 flex justify-between items-center text-[8px] font-black uppercase tracking-[0.2em] text-gray-500">
                    <span>1P 000000</span>
                    <span className="animate-pulse">CREDIT 00</span>
                </div>
            </div>
        </div>
    );
}
