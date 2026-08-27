import { prisma } from "@/lib/prisma";
import { dayKey, dateFromKey } from "@/lib/day";

export async function getTripBySlug(slug: string) {
  const trip = await prisma.trip.findUnique({
    where: { slug },
    include: {
      flights: { orderBy: { departureAt: "asc" } },
      activities: {
        where: { parentId: null },
        orderBy: [{ date: "asc" }, { sortOrder: "asc" }],
        include: {
          children: { orderBy: { sortOrder: "asc" } },
        },
      },
    },
  });
  return trip;
}

export type TripWithDetails = NonNullable<Awaited<ReturnType<typeof getTripBySlug>>>;
export type ActivityWithChildren = TripWithDetails["activities"][number];

type DayGroup = {
  date: Date;
  activities: ActivityWithChildren[];
  flights: TripWithDetails["flights"];
  /** Overnight flights that land this day — a "tail" card so travel/activities can visually connect from the arrival. */
  flightContinuations: TripWithDetails["flights"];
  /** Overnight activities that end this day — same idea, for an activity spanning midnight. */
  activityContinuations: ActivityWithChildren[];
};

/** Groups top-level activities and flights by calendar day (yyyy-mm-dd), sorted chronologically. */
export function groupByDay(trip: TripWithDetails) {
  const days = new Map<string, DayGroup>();

  function ensure(key: string) {
    if (!days.has(key)) {
      days.set(key, { date: dateFromKey(key), activities: [], flights: [], flightContinuations: [], activityContinuations: [] });
    }
    return days.get(key)!;
  }

  for (const activity of trip.activities) {
    const date = activity.date ?? trip.startDate;
    ensure(dayKey(date)).activities.push(activity);

    if (activity.overnight && activity.endTime) {
      ensure(dayKey(activity.endTime)).activityContinuations.push(activity);
    }
  }

  for (const flight of trip.flights) {
    ensure(dayKey(flight.departureAt)).flights.push(flight);

    if (flight.overnight) {
      ensure(dayKey(flight.arrivalAt)).flightContinuations.push(flight);
    }
  }

  return [...days.values()].sort((a, b) => a.date.getTime() - b.date.getTime());
}
