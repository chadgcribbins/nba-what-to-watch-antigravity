'use client';

import { useState, useCallback } from 'react';
import { UserPreferences } from '@/types/schema';
import { ALL_TEAMS, TEAM_STANDINGS_2024 } from '@/lib/data/allTeams';
import { decodePrefs } from '@/lib/safety/share';

const DEFAULT_PREFS: UserPreferences = {
  teamRanks: ALL_TEAMS.sort((a, b) => {
    const winsA = TEAM_STANDINGS_2024[a.id] || 0;
    const winsB = TEAM_STANDINGS_2024[b.id] || 0;
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

export function usePreferences() {
  const [prefs, setPrefs] = useState<UserPreferences>(() => {
    if (typeof window === 'undefined') return DEFAULT_PREFS;
    const saved = localStorage.getItem('nba_prefs_v1');
    if (!saved) return DEFAULT_PREFS;
    try {
      const parsed = JSON.parse(saved) as Partial<UserPreferences>;
      // Migration: ensure stats exist
      if (!parsed.stats) {
        parsed.stats = DEFAULT_PREFS.stats;
      }
      return parsed as UserPreferences;
    } catch (e) {
      console.error('Failed to parse prefs', e);
      return DEFAULT_PREFS;
    }
  });
  const [sharedPrefs, setSharedPrefs] = useState<UserPreferences | null>(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    const sharedBase64 = params.get('p') ?? params.get('tune');
    if (!sharedBase64) return null;
    return decodePrefs(sharedBase64);
  });
  const [isFirstRun, setIsFirstRun] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !localStorage.getItem('nba_prefs_v1');
  });
  const isLoaded = true;

  const savePrefs = useCallback((newPrefs: UserPreferences) => {
    setPrefs(newPrefs);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nba_prefs_v1', JSON.stringify(newPrefs));
      // Clear shared prefs once user saves their own
      setSharedPrefs(null);
      setIsFirstRun(false);
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
