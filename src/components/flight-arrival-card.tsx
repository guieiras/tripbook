import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import { format } from "date-fns";
import type { TripWithDetails } from "@/lib/itinerary";

/** The "tail" of an overnight flight, shown on its arrival day so travel
 * segments and activities can visually connect from the landing, not just
 * float under the day header. */
export function FlightArrivalCard({ flight }: { flight: TripWithDetails["flights"][number] }) {
  return (
    <Card variant="outlined" sx={{ bgcolor: "primary.main", color: "primary.contrastText" }}>
      <CardContent sx={{ "&:last-child": { pb: 2 } }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <FlightLandIcon fontSize="small" />
          <Typography variant="subtitle1">{flight.toAirport}</Typography>
        </Stack>
        <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
          {format(flight.arrivalAt, "HH:mm")}
        </Typography>
      </CardContent>
    </Card>
  );
}
