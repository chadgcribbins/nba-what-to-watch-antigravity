'use client';

import { useState } from 'react';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePreferences } from '@/lib/state/usePreferences';
import { format, addDays, subDays, isSameDay } from 'date-fns';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const { isLoaded } = usePreferences();

  const handleRunSlate = () => {
    setLoading(true);
    const dateParam = format(viewDate, 'yyyy-MM-dd');
    // Simulation delay before navigation to /slate
    setTimeout(() => {
      window.location.href = `/slate?date=${dateParam}`;
    }, 1500);
  };

  const formatDisplayDate = (date: Date) => {
    // Expected format: "Tue 23rd DEC 2025"
    const dayName = format(date, 'EEE');
    const dayNumber = format(date, 'do');
    const monthYear = format(date, 'MMM yyyy').toUpperCase();
    return `${dayName} ${dayNumber} ${monthYear}`;
  };

  const isLastNight = (date: Date) => {
    return isSameDay(date, subDays(new Date(), 1));
  };

  if (!isLoaded) return null;

  return (
    <main className="p-0 pb-16 w-full">
      <div className="pt-8 flex flex-col items-center space-y-12 animate-in slide-in-from-bottom-4 duration-700 w-full">
        {/* Hero Narrative */}
        <div className="space-y-6 w-full max-w-md mx-auto px-8 flex flex-col items-start text-left">
          <div className="space-y-4 w-full">
            <div className="space-y-2">
              <h2 className="text-5xl font-black uppercase italic tracking-tighter text-shadow-arcade leading-[0.9]">
                <span className="text-arcade-yellow">Welcome</span><br />
                <span className="text-arcade-red">Hooper!!!</span>
              </h2>
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 max-w-[280px] leading-tight">
                Spoiler-free watchability rankings from the previous night’s action.
              </p>
            </div>

            {/* Horizontal Rule */}
            <div className="w-[280px] h-1.5 bg-gradient-to-r from-arcade-yellow via-arcade-red to-arcade-blue rounded-full shadow-[0_0_10px_rgba(255,75,75,0.3)]" />
          </div>

          <p className="text-[11px] text-gray-400 leading-relaxed font-bold uppercase italic tracking-wide text-center w-full">
            How many times have you opened the NBA App and had a classic spoiled by a score? We did too. Sure they have a no-spoiler flag, but when there are 12 games and you've only got an hour, what should you prioritize? WhatsApp groups have suggestions, but there's nothing reliable to find the games you actually want to see. So we built the ultimate spoiler-free rubric. <strong>The Algo</strong> scores and ranks every game based on intensity, style, and your personal tastes—so you only drop into the action that matters.
          </p>
        </div>

        {/* Date Hook / Navigation Row */}
        <div className="w-full space-y-6 flex flex-col items-center max-w-md mx-auto px-8">
          <div className="space-y-4 flex flex-col items-center text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-arcade-blue italic">What to watch for:</p>

            <div className="flex items-center justify-between w-full max-w-[300px] group">
              <button
                onClick={() => setViewDate(prev => subDays(prev, 1))}
                className="p-2 text-gray-500 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white text-shadow-arcade min-w-[200px]">
                {formatDisplayDate(viewDate)}
              </h3>

              <button
                onClick={() => setViewDate(prev => addDays(prev, 1))}
                className="p-2 text-gray-500 hover:text-white transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Back to last night link */}
            {!isLastNight(viewDate) && (
              <button
                onClick={() => setViewDate(subDays(new Date(), 1))}
                className="text-[10px] font-black uppercase tracking-widest text-arcade-yellow hover:text-white transition-colors border-b border-arcade-yellow/30 hover:border-white animate-in fade-in slide-in-from-top-1 duration-300"
              >
                Take me back to last night
              </button>
            )}
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="w-full space-y-4 flex flex-col items-center max-w-md mx-auto px-8">
          <button
            onClick={handleRunSlate}
            disabled={loading}
            className="group relative w-full h-16 bg-arcade-red border-4 border-black box-shadow-arcade active:translate-y-1 active:translate-x-1 active:shadow-none transition-all overflow-hidden hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
            <span className="relative z-10 text-xl font-black italic text-white uppercase tracking-tighter flex items-center justify-center gap-3">
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Fetching...
                </>
              ) : (
                <>
                  <span className="animate-bounce">🏀</span>
                  Drop Into The Action
                  <span className="animate-bounce delay-100">👀</span>
                </>
              )}
            </span>
            <div className="absolute bottom-0 left-0 h-1 bg-white/30 w-full animate-loading-bar" />
          </button>
          <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest text-center">Curated final results of unmissable NBA action</p>
        </div>

        {/* Tune Your Rubric Row */}
        <div className="w-full space-y-6 flex flex-col items-center max-w-md mx-auto px-8">
          <div className="space-y-4 flex flex-col items-center text-center w-full">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-arcade-yellow italic">Wanna tune your own Rubric?</p>

            <button
              onClick={() => window.location.href = '/preferences'}
              className="group relative w-full h-14 bg-arcade-blue border-4 border-black box-shadow-arcade active:translate-y-1 active:translate-x-1 active:shadow-none transition-all overflow-hidden hover:scale-[1.02] active:scale-[0.98] px-8"
            >
              <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent" />
              <span className="relative z-10 text-base font-black italic text-white uppercase tracking-tighter flex items-center justify-center gap-3">
                ⚙️ Let's Twiddle The Knobs 🤓
              </span>
            </button>

            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Set your preferences up to be unique to you.</p>
          </div>
        </div>

        {/* Visual Teaser Section (Sneak Peek) */}
        <div className="w-full space-y-6 pt-12 flex flex-col items-center border-t border-gray-800/50">
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Unlocking for you:</p>
            <h4 className="text-lg font-black uppercase italic text-arcade-blue tracking-tighter text-shadow-arcade opacity-80">
              The "Neat-O" Rubric
            </h4>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-8 w-full no-scrollbar scroll-smooth snap-x">
            <div className="min-w-[280px] aspect-video bg-gray-900 border-2 border-gray-800 rounded-sm overflow-hidden box-shadow-arcade-xs snap-center relative group">
              <img src="/images/v1/hero_card.png" alt="Intensity Ranked" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 flex flex-col justify-end">
                <span className="text-[10px] font-black uppercase text-arcade-yellow italic text-left">Feature 01</span>
                <span className="text-sm font-black uppercase italic text-white tracking-tighter text-left">Intensity Ranked</span>
              </div>
            </div>

            <div className="min-w-[280px] aspect-video bg-gray-900 border-2 border-gray-800 rounded-sm overflow-hidden box-shadow-arcade-xs snap-center relative group">
              <img src="/images/v1/action_sliders.png" alt="Custom Tuning" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 flex flex-col justify-end">
                <span className="text-[10px] font-black uppercase text-arcade-blue italic text-left">Feature 02</span>
                <span className="text-sm font-black uppercase italic text-white tracking-tighter text-left">Custom Tuning</span>
              </div>
            </div>

            <div className="min-w-[280px] aspect-video bg-gray-900 border-2 border-gray-800 rounded-sm overflow-hidden box-shadow-arcade-xs snap-center relative group">
              <img src="/images/v1/leaders_tray.png" alt="Stat Trays" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 flex flex-col justify-end">
                <span className="text-[10px] font-black uppercase text-arcade-red italic text-left">Feature 03</span>
                <span className="text-sm font-black uppercase italic text-white tracking-tighter text-left">Stat Trays</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
