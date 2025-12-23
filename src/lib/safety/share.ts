import { UserPreferences } from '@/types/schema';

/**
 * Serializes preferences to a base64 string for URL sharing
 */
export function encodePrefs(prefs: UserPreferences): string {
    try {
        const str = JSON.stringify(prefs);
        if (typeof window !== 'undefined') {
            return btoa(str);
        }
        return Buffer.from(str).toString('base64');
    } catch (e) {
        console.error('Failed to serialize preferences', e);
        return '';
    }
}

/**
 * Deserializes preferences from a base64 string
 */
export function decodePrefs(base64: string): UserPreferences | null {
    try {
        let str = '';
        if (typeof window !== 'undefined') {
            str = b64_to_utf8(base64);
        } else {
            str = Buffer.from(base64, 'base64').toString('utf-8');
        }
        return JSON.parse(str);
    } catch (e) {
        console.error('Failed to deserialize preferences', e);
        return null;
    }
}

function b64_to_utf8(str: string) {
    return decodeURIComponent(escape(window.atob(str)));
}

/**
 * Generates a shareable URL for the current preferences
 */
export function getShareUrl(prefs: UserPreferences): string {
    if (typeof window === 'undefined') return '';
    const serialized = encodePrefs(prefs);
    const url = new URL('/share', window.location.origin);
    url.searchParams.set('p', serialized);
    return url.toString();
}
