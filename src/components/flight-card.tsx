import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import { format } from "date-fns";
import type { TripWithDetails } from "@/lib/itinerary";

export function FlightCard({ flight }: { flight: TripWithDetails["flights"][number] }) {
  return (
    <Card variant="outlined" sx={{ bgcolor: "primary.main", color: "primary.contrastText" }}>
      <CardContent sx={{ "&:last-child": { pb: 2 } }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <FlightTakeoffIcon fontSize="small" />
          <Typography variant="subtitle1">
            {flight.fromAirport} → {flight.toAirport}
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
          {format(flight.departureAt, "HH:mm")} – {format(flight.arrivalAt, "HH:mm")}
          {flight.overnight && (
            <Typography component="span" variant="caption" sx={{ verticalAlign: "super", ml: 0.25 }}>
              +1
            </Typography>
          )}
          {flight.airline ? ` · ${flight.airline}` : ""}
          {flight.flightNumber ? ` ${flight.flightNumber}` : ""}
        </Typography>
        {flight.confirmation && (
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            Confirmation: {flight.confirmation}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
