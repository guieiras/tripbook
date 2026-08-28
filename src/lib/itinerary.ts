import { prisma } from "@/lib/prisma";
import { dayKey, dateFromKey } from "@/lib/day";

export async function getTripBySlug(slug: string) {
  const trip = await prisma.trip.findUnique({
    where: { slug },
    include: {
      flights: { orderBy: { departureAt: "asc" } },
      activities: {
        where: { parentId: null },
        orderBy: [{ date: "asc" }, { startTime: { sort: "asc", nulls: "last" } }, { createdAt: "asc" }],
        include: {
          children: {
            orderBy: [{ startTime: { sort: "asc", nulls: "last" } }, { createdAt: "asc" }],
          },
        },
      },
    },
  });
  return trip;
}

export type TripWithDetails = NonNullable<Awaited<ReturnType<typeof getTripBySlug>>>;
export type ActivityWithChildren = TripWithDetails["activities"][number];

export type DayItem =
  | { kind: "flight"; sortKey: number; flight: TripWithDetails["flights"][number] }
  /** The "tail" of an overnight flight, landing this day. */
  | { kind: "flightContinuation"; sortKey: number; flight: TripWithDetails["flights"][number] }
  | { kind: "activity"; sortKey: number; activity: ActivityWithChildren }
  /** The "tail" of an overnight activity, ending this day. */
  | { kind: "activityContinuation"; sortKey: number; activity: ActivityWithChildren };

type DayGroup = { date: Date; items: DayItem[] };

/** Groups top-level activities and flights by calendar day (yyyy-mm-dd),
 * with every item on a day sorted into one true chronological sequence —
 * flights, activities, and overnight continuations interleaved by actual
 * time, not rendered as separate fixed blocks. Undated/untimed activities
 * sort to the end of their day. */
export function groupByDay(trip: TripWithDetails) {
  const days = new Map<string, DayGroup>();

  function ensure(key: string) {
    if (!days.has(key)) days.set(key, { date: dateFromKey(key), items: [] });
    return days.get(key)!;
  }

  for (const activity of trip.activities) {
    const date = activity.date ?? trip.startDate;
    const sortKey = activity.startTime ? activity.startTime.getTime() : Number.POSITIVE_INFINITY;
    ensure(dayKey(date)).items.push({ kind: "activity", sortKey, activity });

    if (activity.overnight && activity.endTime) {
      ensure(dayKey(activity.endTime)).items.push({
        kind: "activityContinuation",
        sortKey: activity.endTime.getTime(),
        activity,
      });
    }
  }

  for (const flight of trip.flights) {
    ensure(dayKey(flight.departureAt)).items.push({
      kind: "flight",
      sortKey: flight.departureAt.getTime(),
      flight,
    });

    if (flight.overnight) {
      ensure(dayKey(flight.arrivalAt)).items.push({
        kind: "flightContinuation",
        sortKey: flight.arrivalAt.getTime(),
        flight,
      });
    }
  }

  for (const day of days.values()) {
    day.items.sort((a, b) => a.sortKey - b.sortKey);
  }

  return [...days.values()].sort((a, b) => a.date.getTime() - b.date.getTime());
}
