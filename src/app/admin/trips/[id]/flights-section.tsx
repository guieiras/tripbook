"use client";

import { useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { format } from "date-fns";
import { formatDay } from "@/lib/format-day";
import type { FlightModel as Flight } from "@/generated/prisma/models";

type UpdateFlight = (tripId: string, flightId: string, formData: FormData) => Promise<void>;

export function FlightsSection({
  tripId,
  flights,
  createFlight,
  updateFlight,
  deleteFlight,
}: {
  tripId: string;
  flights: Flight[];
  createFlight: (tripId: string, formData: FormData) => Promise<void>;
  updateFlight: UpdateFlight;
  deleteFlight: (tripId: string, flightId: string) => Promise<void>;
}) {
  return (
    <Stack spacing={2} sx={{ mb: 4 }}>
      <Typography variant="h2">Flights</Typography>

      <Stack spacing={1.5}>
        {flights.map((flight) => (
          <FlightRow key={flight.id} tripId={tripId} flight={flight} updateFlight={updateFlight} deleteFlight={deleteFlight} />
        ))}
      </Stack>

      <Typography variant="h3">New flight</Typography>
      <FlightForm action={createFlight.bind(null, tripId)} submitLabel="Add flight" />
    </Stack>
  );
}

function FlightRow({
  tripId,
  flight,
  updateFlight,
  deleteFlight,
}: {
  tripId: string;
  flight: Flight;
  updateFlight: UpdateFlight;
  deleteFlight: (tripId: string, flightId: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <Card variant="outlined">
      <CardContent sx={{ "&:last-child": { pb: 2 } }}>
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
          <Stack>
            <Typography variant="subtitle1">
              {flight.fromAirport} → {flight.toAirport}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatDay(flight.departureAt, "MMM d")}, {format(flight.departureAt, "HH:mm")} – {format(flight.arrivalAt, "HH:mm")}
              {flight.overnight ? " (+1 day)" : ""}
              {flight.airline ? ` · ${flight.airline} ${flight.flightNumber ?? ""}` : ""}
            </Typography>
          </Stack>
          <Stack direction="row">
            <IconButton size="small" aria-label="Edit flight" onClick={() => setEditing((v) => !v)}>
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
            <form action={deleteFlight.bind(null, tripId, flight.id)}>
              <IconButton type="submit" size="small" aria-label="Delete flight">
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </form>
          </Stack>
        </Stack>

        <Collapse in={editing}>
          <Stack sx={{ pt: 2 }}>
            <FlightForm
              // Remount when the saved data actually changes, so
              // uncontrolled fields (defaultValue/defaultChecked) don't
              // go stale after a save — Collapse keeps this mounted, it
              // never remounts on its own.
              key={JSON.stringify(flight)}
              action={updateFlight.bind(null, tripId, flight.id)}
              submitLabel="Save"
              flight={flight}
              compact
              onSaved={() => setEditing(false)}
            />
          </Stack>
        </Collapse>
      </CardContent>
    </Card>
  );
}

function FlightForm({
  action,
  submitLabel,
  flight,
  compact,
  onSaved,
}: {
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
  flight?: Flight;
  compact?: boolean;
  onSaved?: () => void;
}) {
  const size = compact ? "small" : "medium";

  return (
    <Stack
      component="form"
      action={async (formData: FormData) => {
        await action(formData);
        onSaved?.();
      }}
      spacing={2}
    >
      <Stack direction="row" spacing={2}>
        <TextField name="fromAirport" label="From (e.g. JFK)" required fullWidth size={size} defaultValue={flight?.fromAirport} />
        <TextField name="toAirport" label="To (e.g. LIS)" required fullWidth size={size} defaultValue={flight?.toAirport} />
      </Stack>
      <TextField
        name="departureDate"
        label="Date"
        type="date"
        required
        fullWidth
        size={size}
        defaultValue={flight ? formatDay(flight.departureAt, "yyyy-MM-dd") : ""}
        slotProps={{ inputLabel: { shrink: true } }}
      />
      <Stack direction="row" spacing={2}>
        <TextField
          name="departureTime"
          label="Departs"
          type="time"
          required
          fullWidth
          size={size}
          defaultValue={flight ? format(flight.departureAt, "HH:mm") : ""}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          name="arrivalTime"
          label="Arrives"
          type="time"
          required
          fullWidth
          size={size}
          defaultValue={flight ? format(flight.arrivalAt, "HH:mm") : ""}
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Stack>
      <FormControlLabel
        control={<Checkbox name="overnight" defaultChecked={flight?.overnight ?? false} size={size} />}
        label="Arrives next day (overnight)"
      />
      <Stack direction="row" spacing={2}>
        <TextField name="airline" label="Airline" fullWidth size={size} defaultValue={flight?.airline ?? ""} />
        <TextField name="flightNumber" label="Flight #" fullWidth size={size} defaultValue={flight?.flightNumber ?? ""} />
      </Stack>
      <TextField name="confirmation" label="Confirmation code" fullWidth size={size} defaultValue={flight?.confirmation ?? ""} />
      <Button type="submit" variant="outlined" size={size} sx={{ alignSelf: "flex-start" }}>
        {submitLabel}
      </Button>
    </Stack>
  );
}
