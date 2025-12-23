'use client';

import { useState, useEffect, useCallback } from 'react';
import { Team, UserPreferences } from '@/types/schema';
import { ALL_TEAMS, TEAM_STANDINGS_2024 } from '@/lib/data/allTeams';

const DEFAULT_PREFS: UserPreferences = {
  teamRanks: ALL_TEAMS.sort((a, b) => {
    const winsA = (TEAM_STANDINGS_2024 as any)[a.id] || 0;
    const winsB = (TEAM_STANDINGS_2024 as any)[b.id] || 0;
    return winsB - winsA;
  }).map(t => t.id),
  playerBuckets: {
    mustSee: [],
    villain: [],
    hooper: []
  },
  goatId: null,
  style: {
    pace: 3,
    ballMovement: 3,
    pointsVibe: 3,
    shotProfile: 3,
    vibe: 3,
    bangMeter: 3,
    deskHeat: 3
  },
  powerups: {
    rivalriesMatter: false,
    superstarShowcases: false,
    discoveryMode: true
  },
  picks: {},
  reminders: [],
  profile: {
    displayName: 'Guest Player',
    avatarTemplate: 'goated-jam'
  },
  isSyncingToStandings: true,
  stats: {
    slatesRun: 0,
    watchTimeMinutes: 0,
    picksRecord: {
      correct: 0,
      total: 0
    }
  }
};

import { decodePrefs } from '@/lib/safety/share';

export function usePreferences() {
  const [prefs, setPrefs] = useState<UserPreferences>(DEFAULT_PREFS);
  const [sharedPrefs, setSharedPrefs] = useState<UserPreferences | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFirstRun, setIsFirstRun] = useState(false);

  useEffect(() => {
    // 1. Check for shared settings in URL
    const params = new URLSearchParams(window.location.search);
    const sharedBase64 = params.get('tune');
    if (sharedBase64) {
      const decoded = decodePrefs(sharedBase64);
      if (decoded) {
        setSharedPrefs(decoded);
      }
    }

    // 2. Load from local storage
    const saved = localStorage.getItem('nba_prefs_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migration: ensure stats exist
        if (!parsed.stats) {
          parsed.stats = DEFAULT_PREFS.stats;
        }
        setPrefs(parsed);
        setIsFirstRun(false);
      } catch (e) {
        console.error('Failed to parse prefs', e);
      }
    } else {
      setIsFirstRun(true);
    }
    setIsLoaded(true);
  }, []);

  const savePrefs = useCallback((newPrefs: UserPreferences) => {
    setPrefs(newPrefs);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nba_prefs_v1', JSON.stringify(newPrefs));
      // Clear shared prefs once user saves their own
      setSharedPrefs(null);
    }
  }, []);

  const recordSlateRun = useCallback(() => {
    setPrefs(prev => {
      const updated = {
        ...prev,
        stats: {
          ...prev.stats!,
          slatesRun: (prev.stats?.slatesRun || 0) + 1
        }
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('nba_prefs_v1', JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const updateEmail = useCallback((email: string) => {
    setPrefs(prev => {
      const updated = {
        ...prev,
        profile: {
          ...(prev.profile || { displayName: 'Guest Player', avatarTemplate: 'goated-jam' }),
          email
        }
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('nba_prefs_v1', JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const setWinnerPick = useCallback((gameId: string, teamId: number) => {
    setPrefs(prev => {
      const picks = { ...prev.picks, [gameId]: teamId };
      const updated = {
        ...prev,
        picks,
        stats: {
          ...prev.stats!,
          picksRecord: {
            ...prev.stats?.picksRecord || { correct: 0, total: 0 },
            total: Object.keys(picks).length
          }
        }
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('nba_prefs_v1', JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const toggleReminder = useCallback((gameId: string) => {
    setPrefs(prev => {
      const reminders = [...(prev.reminders || [])];
      const index = reminders.indexOf(gameId);
      if (index > -1) {
        reminders.splice(index, 1);
      } else {
        reminders.push(gameId);
      }
      const updated = { ...prev, reminders };
      if (typeof window !== 'undefined') {
        localStorage.setItem('nba_prefs_v1', JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  return {
    prefs: sharedPrefs || prefs,
    localPrefs: prefs,
    setPrefs: savePrefs,
    recordSlateRun,
    updateEmail,
    setWinnerPick,
    toggleReminder,
    isLoaded,
    isFirstRun,
    isViewingShared: !!sharedPrefs
  };
}
