import { format } from "date-fns";

/**
 * Formats any Date using UTC-anchored digits, for any date-fns pattern
 * (day, time, or both). date-fns `format()` reads local getters, which
 * silently reinterprets stored values through whatever timezone the
 * rendering environment happens to be in — a server-rendered page (UTC on
 * Vercel) and a client component hydrated in a visitor's own browser
 * (whatever their local TZ is) can show different clock times for the
 * exact same stored instant. Trip data has no real destination timezone
 * concept — every date/time field is just literal digits the admin typed
 * — so display must always reproduce those literal digits regardless of
 * where the code runs. Shifting by the *current* environment's own UTC
 * offset before formatting cancels out local-getter reinterpretation in
 * both directions (server or browser), landing back on the original
 * UTC-anchored digits every time. See toDateTime() in actions.ts for the
 * matching write-side fix.
 */
export function formatUTC(date: Date, pattern: string) {
  const shifted = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  return format(shifted, pattern);
}
