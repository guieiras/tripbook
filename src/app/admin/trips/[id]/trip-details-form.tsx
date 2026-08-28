"use client";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import type { TripModel as Trip } from "@/generated/prisma/models";
import { formatUTC } from "@/lib/format-utc";

export function TripDetailsForm({
  trip,
  updateTrip,
  deleteTrip,
}: {
  trip: Trip;
  updateTrip: (tripId: string, formData: FormData) => Promise<void>;
  deleteTrip: (tripId: string) => Promise<void>;
}) {
  return (
    <Stack spacing={2} sx={{ mb: 4 }}>
      <Typography variant="h2">Trip details</Typography>
      <Stack component="form" action={updateTrip.bind(null, trip.id)} spacing={2}>
        <TextField name="title" label="Title" defaultValue={trip.title} required fullWidth />
        <TextField name="slug" label="Public slug" defaultValue={trip.slug} required fullWidth />
        <Stack direction="row" spacing={2}>
          <TextField
            name="startDate"
            label="Start date"
            type="date"
            defaultValue={formatUTC(trip.startDate, "yyyy-MM-dd")}
            required
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            name="endDate"
            label="End date"
            type="date"
            defaultValue={formatUTC(trip.endDate, "yyyy-MM-dd")}
            required
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Stack>
        <Stack direction="row" spacing={1.5}>
          <Button type="submit" variant="contained">
            Save
          </Button>
          <Button
            type="button"
            color="error"
            onClick={() => {
              if (confirm("Delete this trip and everything in it?")) {
                deleteTrip(trip.id);
              }
            }}
          >
            Delete trip
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
