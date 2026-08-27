import { prisma } from "@/lib/prisma";

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

/** Groups top-level activities and flights by calendar day (yyyy-mm-dd), sorted chronologically. */
export function groupByDay(trip: TripWithDetails) {
  const days = new Map<
    string,
    { date: Date; activities: ActivityWithChildren[]; flights: TripWithDetails["flights"] }
  >();

  const dayKey = (d: Date) => d.toISOString().slice(0, 10);

  for (const activity of trip.activities) {
    const date = activity.date ?? trip.startDate;
    const key = dayKey(date);
    if (!days.has(key)) days.set(key, { date, activities: [], flights: [] });
    days.get(key)!.activities.push(activity);
  }

  for (const flight of trip.flights) {
    const key = dayKey(flight.departureAt);
    if (!days.has(key)) days.set(key, { date: flight.departureAt, activities: [], flights: [] });
    days.get(key)!.flights.push(flight);
  }

  return [...days.values()].sort((a, b) => a.date.getTime() - b.date.getTime());
}
