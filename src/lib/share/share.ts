import { format, subDays } from 'date-fns';
import type { UserPreferences } from '@/types/schema';
import { encodePrefs } from '@/lib/safety/share';

type SharePayload = {
  title: string;
  text?: string;
  url: string;
};

function canWebShare(payload: SharePayload): boolean {
  return (
    typeof navigator !== 'undefined' &&
    typeof navigator.share === 'function' &&
    typeof navigator.canShare === 'function' &&
    navigator.canShare(payload)
  );
}

async function shareOrCopy(payload: SharePayload, fallbackCopiedMessage: string) {
  if (canWebShare(payload)) {
    try {
      await navigator.share(payload);
      return;
    } catch (err) {
      // User cancelled share sheet.
      if ((err as Error).name === 'AbortError') return;
      console.error('Error sharing:', err);
    }
  }

  await navigator.clipboard.writeText(payload.url);
  alert(fallbackCopiedMessage);
}

/**
 * Canonical share behavior:
 * Share the slate (date) + the user’s tuned algo (prefs) in one URL.
 */
export async function shareTunedSlate(prefs: UserPreferences) {
  const origin = window.location.origin;
  const now = new Date();
  const yesterday = subDays(now, 1);

  // Default to "last night", but if you're already on /slate?date=..., preserve it.
  const currentUrl = new URL(window.location.href);
  const dateParam = currentUrl.pathname === '/slate' ? currentUrl.searchParams.get('date') : null;
  const date = dateParam ?? format(yesterday, 'yyyy-MM-dd');

  const url = new URL('/slate', origin);
  url.searchParams.set('date', date);
  url.searchParams.set('p', encodePrefs(prefs));

  const displayName = prefs.profile?.displayName || 'A fan';
  const payload: SharePayload = {
    title: 'Neat-O Slate',
    text: `${displayName} shared a spoiler-free, personalized Neat-O Slate for ${date}.`,
    url: url.toString(),
  };

  await shareOrCopy(payload, 'Tuned slate link copied to clipboard!');
}

