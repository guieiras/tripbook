"use client";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { format } from "date-fns";
import type { FlightModel as Flight } from "@/generated/prisma/models";

export function FlightsSection({
  tripId,
  flights,
  createFlight,
  deleteFlight,
}: {
  tripId: string;
  flights: Flight[];
  createFlight: (tripId: string, formData: FormData) => Promise<void>;
  deleteFlight: (tripId: string, flightId: string) => Promise<void>;
}) {
  return (
    <Stack spacing={2} sx={{ mb: 4 }}>
      <Typography variant="h2">Flights</Typography>

      <Stack spacing={1.5}>
        {flights.map((flight) => (
          <Card key={flight.id} variant="outlined">
            <CardContent
              sx={{
                "&:last-child": { pb: 2 },
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Stack>
                <Typography variant="subtitle1">
                  {flight.fromAirport} → {flight.toAirport}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {format(flight.departureAt, "MMM d, HH:mm")} – {format(flight.arrivalAt, "HH:mm")}
                  {flight.airline ? ` · ${flight.airline} ${flight.flightNumber ?? ""}` : ""}
                </Typography>
              </Stack>
              <form action={deleteFlight.bind(null, tripId, flight.id)}>
                <IconButton type="submit" size="small" aria-label="Delete flight">
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </form>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Stack component="form" action={createFlight.bind(null, tripId)} spacing={2}>
        <Stack direction="row" spacing={2}>
          <TextField name="fromAirport" label="From (e.g. JFK)" required fullWidth />
          <TextField name="toAirport" label="To (e.g. LIS)" required fullWidth />
        </Stack>
        <TextField
          name="departureDate"
          label="Date"
          type="date"
          required
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <Stack direction="row" spacing={2}>
          <TextField
            name="departureTime"
            label="Departs"
            type="time"
            required
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            name="arrivalTime"
            label="Arrives"
            type="time"
            required
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField name="airline" label="Airline" fullWidth />
          <TextField name="flightNumber" label="Flight #" fullWidth />
        </Stack>
        <TextField name="confirmation" label="Confirmation code" fullWidth />
        <Button type="submit" variant="outlined">
          Add flight
        </Button>
      </Stack>
    </Stack>
  );
}
