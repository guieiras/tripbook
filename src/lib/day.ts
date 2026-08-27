/** yyyy-mm-dd, computed from the UTC calendar date — the shared key basis
 * for grouping/comparing date-only fields (Trip.startDate/endDate,
 * Activity.date) and timestamps (Flight.departureAt) alike. */
export function dayKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

/** Reconstructs a date purely from its yyyy-mm-dd key, as UTC midnight —
 * so it always has the same date-only semantics regardless of what kind
 * of value (a date-only field vs. a real timestamp) produced the key. */
export function dateFromKey(key: string) {
  return new Date(`${key}T00:00:00.000Z`);
}

/** Every calendar day from a trip's start to end date, inclusive. */
export function tripDayRange(trip: { startDate: Date; endDate: Date }) {
  const days: Date[] = [];
  let cursor = dateFromKey(dayKey(trip.startDate));
  const last = dateFromKey(dayKey(trip.endDate));
  while (cursor.getTime() <= last.getTime()) {
    days.push(cursor);
    cursor = new Date(cursor.getTime() + 24 * 60 * 60 * 1000);
  }
  return days;
}
