import { notFound } from "next/navigation";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { getTripBySlug, groupByDay } from "@/lib/itinerary";
import { formatDay } from "@/lib/format-day";
import { ActivityCard } from "@/components/activity-card";
import { FlightCard } from "@/components/flight-card";

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
            {formatDay(trip.startDate, "MMM d")} – {formatDay(trip.endDate, "MMM d, yyyy")}
          </Typography>
        </Stack>

        <Stack spacing={3}>
          {days.map((day) => (
            <Box key={day.date.toISOString()}>
              <Typography variant="h2" sx={{ mb: 1.5 }}>
                {formatDay(day.date, "EEEE, MMM d")}
              </Typography>
              <Stack spacing={1.5}>
                {day.flights.map((flight) => (
                  <FlightCard key={flight.id} flight={flight} />
                ))}
                {day.activities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
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
