'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';

interface Toast {
    id: string;
    message: string;
    type?: 'info' | 'success' | 'error' | 'arcade' | 'centered';
    action?: {
        label: string;
        onClick: () => void;
    };
}

interface ToastContextType {
    showToast: (message: string, type?: Toast['type'], action?: Toast['action']) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: Toast['type'] = 'arcade', action?: Toast['action']) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type, action }]);

        // Auto remove after 6 seconds if it has an action, otherwise 4
        const duration = action ? 6000 : 4000;
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Toast Container - Centered in viewport */}
            <div className="fixed inset-0 pointer-events-none z-[200] flex flex-col items-center justify-center gap-4 p-4">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={clsx(
                            "relative pointer-events-auto flex flex-col p-6 border-4 border-black box-shadow-arcade animate-in zoom-in-95 duration-300 max-w-sm w-full",
                            toast.type === 'error' ? "bg-arcade-red text-white" : "bg-arcade-yellow text-black"
                        )}
                    >
                        {/* CRT Effect Overlay */}
                        <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

                        <div className="flex items-start justify-between gap-4">
                            <p className="text-sm font-black uppercase italic tracking-tight leading-tight">
                                {toast.message}
                            </p>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="shrink-0 hover:scale-110 transition-transform"
                            >
                                <X className="w-5 h-5 border-2 border-current rounded-sm p-0.5" />
                            </button>
                        </div>

                        {toast.action && (
                            <button
                                onClick={() => {
                                    toast.action?.onClick();
                                    removeToast(toast.id);
                                }}
                                className="mt-4 w-full bg-black text-white p-3 text-[10px] font-black uppercase italic tracking-widest hover:bg-arcade-blue transition-colors border-2 border-black box-shadow-arcade-xs"
                            >
                                {toast.action.label}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
