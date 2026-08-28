import { notFound } from "next/navigation";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { getTripBySlug, groupByDay } from "@/lib/itinerary";
import { formatUTC } from "@/lib/format-utc";
import { ActivityCard } from "@/components/activity-card";
import { FlightCard } from "@/components/flight-card";
import { FlightArrivalCard } from "@/components/flight-arrival-card";
import { ActivityContinuationCard } from "@/components/activity-continuation-card";

export default async function TripPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);
  if (!trip) notFound();

  const days = groupByDay(trip);

  return (
    <Box sx={{ minHeight: "100dvh", bgcolor: "background.default" }}>
      <Container sx={{ py: 3, pb: 6 }}>
        <Stack spacing={0.5} sx={{ mb: 3 }}>
          <Typography variant="h1">{trip.title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {formatUTC(trip.startDate, "MMM d")} – {formatUTC(trip.endDate, "MMM d, yyyy")}
          </Typography>
        </Stack>

        <Stack spacing={3}>
          {days.map((day) => (
            <Box key={day.date.toISOString()}>
              <Typography variant="h2" sx={{ mb: 1.5 }}>
                {formatUTC(day.date, "EEEE, MMM d")}
              </Typography>
              <Stack spacing={0.5}>
                {day.items.map((item) => {
                  switch (item.kind) {
                    case "flight":
                      return <FlightCard key={item.flight.id} flight={item.flight} />;
                    case "flightContinuation":
                      return <FlightArrivalCard key={`${item.flight.id}-arrival`} flight={item.flight} />;
                    case "activity":
                      return <ActivityCard key={item.activity.id} activity={item.activity} />;
                    case "activityContinuation":
                      return <ActivityContinuationCard key={`${item.activity.id}-continuation`} activity={item.activity} />;
                  }
                })}
              </Stack>
            </Box>
          ))}
        </Stack>

        {days.length === 0 && (
          <Typography color="text.secondary">No activities yet.</Typography>
        )}

        <Divider sx={{ mt: 5, mb: 2 }} />
        <Typography variant="caption" color="text.secondary">
          tripbook
        </Typography>
      </Container>
    </Box>
  );
}
