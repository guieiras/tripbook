import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { prisma } from "@/lib/prisma";
import { createTrip, logout } from "@/app/admin/actions";
import { NavCardActionArea } from "@/components/nav-card-action-area";
import { formatDay } from "@/lib/format-day";

// Always cookie-authenticated and reads live data — never prerender this
// as a static page (which would require a DB connection at build time).
export const dynamic = "force-dynamic";

export default async function TripsListPage() {
  const trips = await prisma.trip.findMany({ orderBy: { startDate: "desc" } });

  return (
    <Container sx={{ py: 3, pb: 6 }}>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h1">Your trips</Typography>
        <form action={logout}>
          <Button type="submit" size="small" color="inherit">
            Log out
          </Button>
        </form>
      </Stack>

      <Stack spacing={1.5} sx={{ mb: 4 }}>
        {trips.map((trip) => (
          <Card key={trip.id} variant="outlined">
            <NavCardActionArea href={`/admin/trips/${trip.id}`}>
              <CardContent>
                <Typography variant="subtitle1">{trip.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDay(trip.startDate, "MMM d")} – {formatDay(trip.endDate, "MMM d, yyyy")}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  /t/{trip.slug}
                </Typography>
              </CardContent>
            </NavCardActionArea>
          </Card>
        ))}
        {trips.length === 0 && (
          <Typography color="text.secondary">No trips yet — create one below.</Typography>
        )}
      </Stack>

      <Typography variant="h2" sx={{ mb: 1.5 }}>
        New trip
      </Typography>
      <Stack component="form" action={createTrip} spacing={2}>
        <TextField name="title" label="Title" required fullWidth />
        <Stack direction="row" spacing={2}>
          <TextField
            name="startDate"
            label="Start date"
            type="date"
            required
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            name="endDate"
            label="End date"
            type="date"
            required
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Stack>
        <Button type="submit" variant="contained" size="large">
          Create trip
        </Button>
      </Stack>
    </Container>
  );
}
