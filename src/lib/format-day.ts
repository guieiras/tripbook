import { format } from "date-fns";

/**
 * Trip.startDate/endDate and Activity.date are stored as UTC midnight
 * (date-only, no real time component). date-fns `format` reads local
 * getters, which shifts the calendar day in non-UTC timezones (e.g. a
 * date stored as 2026-09-28T00:00:00Z renders as Sep 27 in UTC-3). This
 * shifts the instant by the local offset first so local getters land back
 * on the intended UTC calendar date.
 */
export function formatDay(date: Date, pattern: string) {
  const shifted = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  return format(shifted, pattern);
}
