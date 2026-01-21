type ZonedDateParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

const getZonedParts = (date: Date, timeZone: string): ZonedDateParts => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const map = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  ) as Record<string, string>;

  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour),
    minute: Number(map.minute),
  };
};

const partsToUtcMs = (parts: ZonedDateParts): number =>
  Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute);

const toUtcFromZonedParts = (
  parts: ZonedDateParts,
  timeZone: string,
): Date => {
  const utcGuess = new Date(partsToUtcMs(parts));
  const guessParts = getZonedParts(utcGuess, timeZone);
  const diffMinutes = (partsToUtcMs(parts) - partsToUtcMs(guessParts)) / 60000;
  return new Date(utcGuess.getTime() + diffMinutes * 60000);
};

const parseDateInput = (value: string): { year: number; month: number; day: number } | null => {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return null;
  }

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
};

export type SlateWindow = {
  start: Date;
  end: Date;
  label: string;
  timeZone: string;
};

export const getSlateWindow = ({
  date,
  timeZone,
  now = new Date(),
}: {
  date?: string | null;
  timeZone: string;
  now?: Date;
}): SlateWindow => {
  const cutoffHour = 7;
  const cutoffMinute = 30;

  let endParts: ZonedDateParts;

  if (date) {
    const parsed = parseDateInput(date);
    if (!parsed) {
      throw new Error("Invalid date format. Use YYYY-MM-DD.");
    }
    endParts = {
      year: parsed.year,
      month: parsed.month,
      day: parsed.day,
      hour: cutoffHour,
      minute: cutoffMinute,
    };
  } else {
    const nowParts = getZonedParts(now, timeZone);
    const beforeCutoff =
      nowParts.hour < cutoffHour ||
      (nowParts.hour === cutoffHour && nowParts.minute < cutoffMinute);
    const endDate = new Date(
      Date.UTC(nowParts.year, nowParts.month - 1, nowParts.day),
    );
    if (beforeCutoff) {
      endDate.setUTCDate(endDate.getUTCDate() - 1);
    }
    endParts = {
      year: endDate.getUTCFullYear(),
      month: endDate.getUTCMonth() + 1,
      day: endDate.getUTCDate(),
      hour: cutoffHour,
      minute: cutoffMinute,
    };
  }

  const end = toUtcFromZonedParts(endParts, timeZone);
  const start = new Date(end.getTime() - 24 * 60 * 60 * 1000);

  return {
    start,
    end,
    label: "Previous slate",
    timeZone,
  };
};

export const formatDateKey = (date: Date, timeZone: string): string => {
  const parts = getZonedParts(date, timeZone);
  return `${parts.year}${String(parts.month).padStart(2, "0")}${String(
    parts.day,
  ).padStart(2, "0")}`;
};
