import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { TravelIcon, TRAVEL_MODE_LABEL } from "@/components/travel-icon";
import { formatMinutes } from "@/components/time-range";
import type { TravelMode } from "@/generated/prisma/enums";

export function TravelSegment({ mode, mins }: { mode: TravelMode; mins: number }) {
  return (
    <Stack
      direction="row"
      spacing={0.75}
      sx={{
        alignItems: "center",
        color: "text.secondary",
        pl: 2,
        py: 0.5,
        "&::before": {
          content: '""',
          display: "block",
          width: 1,
          height: 16,
          bgcolor: "divider",
        },
      }}
    >
      <TravelIcon mode={mode} sx={{ fontSize: 16 }} />
      <Typography variant="caption">
        {TRAVEL_MODE_LABEL[mode]} · {formatMinutes(mins)}
      </Typography>
    </Stack>
  );
}
