import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import { formatUTC } from "@/lib/format-utc";
import type { TripWithDetails } from "@/lib/itinerary";

/** The "tail" of an overnight flight, shown on its arrival day so travel
 * segments and activities can visually connect from the landing, not just
 * float under the day header. Rendered as a half-height block with flat
 * top corners, reading as the continuation of the card on the previous
 * day rather than a new one. */
export function FlightArrivalCard({ flight }: { flight: TripWithDetails["flights"][number] }) {
  return (
    <Card
      variant="outlined"
      sx={{
        bgcolor: "primary.main",
        color: "primary.contrastText",
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
      }}
    >
      <CardContent sx={{ py: 1, "&:last-child": { pb: 1 } }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", justifyContent: "space-between" }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <FlightLandIcon sx={{ fontSize: 18 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {flight.toAirport}
            </Typography>
          </Stack>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {formatUTC(flight.arrivalAt, "HH:mm")}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
