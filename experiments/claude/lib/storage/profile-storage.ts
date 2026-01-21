/**
 * Profile Storage
 *
 * Persists user profile to localStorage (MVP)
 * Will migrate to IndexedDB or server storage in V1
 */

import { UserProfile, createDefaultProfile } from '../schemas/profile';

const PROFILE_STORAGE_KEY = 'nba-watchability-profile';

/**
 * Load user profile from localStorage
 * Returns default profile if none exists
 */
export function loadProfile(): UserProfile {
  if (typeof window === 'undefined') {
    return createDefaultProfile();
  }

  try {
    const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!stored) {
      return createDefaultProfile();
    }

    const parsed = JSON.parse(stored);
    
    // Convert date strings back to Date objects
    return {
      ...parsed,
      createdAt: new Date(parsed.createdAt),
      lastModified: new Date(parsed.lastModified),
      players: parsed.players?.map((p: any) => ({
        ...p,
        addedAt: new Date(p.addedAt),
      })) || [],
    };
  } catch (error) {
    console.error('Failed to load profile:', error);
    return createDefaultProfile();
  }
}

/**
 * Save user profile to localStorage
 */
export function saveProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const updated = {
      ...profile,
      lastModified: new Date(),
    };
    
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save profile:', error);
    throw new Error('Failed to save profile');
  }
}

/**
 * Clear profile (reset to default)
 */
export function clearProfile(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear profile:', error);
  }
}

/**
 * Export profile as JSON for backup
 */
export function exportProfile(): string {
  const profile = loadProfile();
  return JSON.stringify(profile, null, 2);
}

/**
 * Import profile from JSON backup
 */
export function importProfile(jsonString: string): void {
  try {
    const parsed = JSON.parse(jsonString);
    
    // Basic validation
    if (!parsed.id || !parsed.version) {
      throw new Error('Invalid profile format');
    }

    saveProfile(parsed);
  } catch (error) {
    console.error('Failed to import profile:', error);
    throw new Error('Invalid profile data');
  }
}





