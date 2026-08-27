import { notFound } from "next/navigation";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { prisma } from "@/lib/prisma";
import { NavButton } from "@/components/nav-button";
import {
  createActivity,
  createFlight,
  deleteActivity,
  deleteFlight,
  deleteTrip,
  updateActivity,
  updateFlight,
  updateTrip,
} from "@/app/admin/actions";
import { tripDayRange } from "@/lib/day";
import { TripDetailsForm } from "./trip-details-form";
import { FlightsSection } from "./flights-section";
import { ActivitiesSection } from "./activities-section";

export default async function EditTripPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const trip = await prisma.trip.findUnique({
    where: { id },
    include: {
      flights: { orderBy: { departureAt: "asc" } },
      activities: {
        orderBy: [{ date: "asc" }, { sortOrder: "asc" }],
      },
    },
  });

  if (!trip) notFound();

  const topLevelActivities = trip.activities.filter((a) => a.parentId === null);
  const days = tripDayRange(trip);

  return (
    <Container sx={{ py: 3, pb: 8 }}>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
        <Stack spacing={0.5}>
          <NavButton href="/admin/trips" size="small" sx={{ alignSelf: "flex-start" }}>
            ← All trips
          </NavButton>
          <Typography variant="h1">{trip.title}</Typography>
          <NavButton
            href={`/t/${trip.slug}`}
            target="_blank"
            size="small"
            sx={{ alignSelf: "flex-start" }}
          >
            View public page ↗
          </NavButton>
        </Stack>
      </Stack>

      <TripDetailsForm trip={trip} updateTrip={updateTrip} deleteTrip={deleteTrip} />

      <FlightsSection
        tripId={trip.id}
        flights={trip.flights}
        createFlight={createFlight}
        updateFlight={updateFlight}
        deleteFlight={deleteFlight}
      />

      <ActivitiesSection
        tripId={trip.id}
        days={days}
        activities={trip.activities}
        topLevelActivities={topLevelActivities}
        createActivity={createActivity}
        updateActivity={updateActivity}
        deleteActivity={deleteActivity}
      />
    </Container>
  );
}
