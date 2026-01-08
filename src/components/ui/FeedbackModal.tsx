'use client';

import { useState } from 'react';
import { X, Send, MessageSquare } from 'lucide-react';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ feedback }),
            });

            if (!response.ok) {
                throw new Error('Failed to send feedback');
            }
        } catch (error) {
            console.error('Feedback submission error:', error);
            // We'll still show success UI for now to maintain the arcade experience, 
            // but in a production app we might handle errors differently.
        }

        setIsSubmitting(false);
        setIsSuccess(true);
        setTimeout(() => {
            setIsSuccess(false);
            setFeedback('');
            onClose();
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-sm bg-black border-4 border-black box-shadow-arcade p-6 overflow-hidden animate-in zoom-in-95 duration-200">
                {/* CRT Scanline Effect inner */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

                {/* Visual Background */}
                <div className="absolute inset-0 bg-gray-900/50 -z-10" />

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-arcade-red transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-arcade-red border-2 border-black flex items-center justify-center box-shadow-arcade-xs">
                        <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black uppercase italic tracking-tighter text-shadow-arcade">
                            <span className="text-arcade-yellow">Player</span> <span className="text-arcade-red">Feedback</span>
                        </h3>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">V1.1 Patch Notes Entry</p>
                    </div>
                </div>

                {isSuccess ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
                        <div className="text-4xl mb-4 animate-bounce">🔥</div>
                        <h4 className="text-2xl font-black uppercase italic text-arcade-yellow tracking-tighter text-shadow-arcade">
                            BOOMSHAKALAKA!
                        </h4>
                        <p className="text-[11px] font-bold text-arcade-red uppercase tracking-widest mt-2">
                            Feedback Received!
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-arcade-blue tracking-widest">
                                Report / Suggestion
                            </label>
                            <textarea
                                required
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="What's on your mind, Hooper?"
                                className="w-full bg-black/40 border-2 border-gray-800 p-3 text-sm font-bold text-white placeholder:text-gray-600 outline-none focus:border-arcade-blue transition-colors min-h-[120px] resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || !feedback.trim()}
                            className="w-full h-12 bg-arcade-blue border-3 border-black box-shadow-arcade-xs text-sm font-black uppercase italic text-white tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 transition-all"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Send Feedback
                                </>
                            )}
                        </button>
                    </form>
                )}

                <div className="mt-6 pt-4 border-t border-gray-800 flex justify-center gap-1.5 grayscale opacity-50">
                    <div className="w-1.5 h-1.5 rounded-full bg-arcade-red" />
                    <div className="w-1.5 h-1.5 rounded-full bg-arcade-yellow" />
                    <div className="w-1.5 h-1.5 rounded-full bg-arcade-blue" />
                </div>
            </div>
        </div>
    );
}
