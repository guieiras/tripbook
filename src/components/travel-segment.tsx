import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { TravelIcon, TRAVEL_MODE_LABEL } from "@/components/travel-icon";
import { formatMinutes } from "@/components/time-range";
import type { TravelMode } from "@/generated/prisma/enums";

const connectorLine = {
  width: "2px",
  height: 10,
  bgcolor: "divider",
  borderRadius: 1,
};

/** A small vertical connector between two stacked cards, with the travel
 * icon + time centered on the line, rather than a wide horizontal bar. */
export function TravelSegment({ mode, mins }: { mode: TravelMode; mins: number }) {
  return (
    <Stack spacing={0.25} sx={{ alignItems: "center", py: 0.25 }}>
      <Box sx={connectorLine} />
      <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", color: "text.secondary" }}>
        <TravelIcon mode={mode} sx={{ fontSize: 14 }} />
        <Typography variant="caption">
          {TRAVEL_MODE_LABEL[mode]} · {formatMinutes(mins)}
        </Typography>
      </Stack>
      <Box sx={connectorLine} />
    </Stack>
  );
}
