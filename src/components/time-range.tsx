import { formatUTC } from "@/lib/format-utc";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import ScheduleIcon from "@mui/icons-material/Schedule";

export function TimeRange({
  start,
  end,
  recommendedMins,
}: {
  start?: Date | null;
  end?: Date | null;
  recommendedMins?: number | null;
}) {
  if (!start && !recommendedMins) return null;

  return (
    <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", flexWrap: "wrap" }}>
      {start && (
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
          {formatUTC(start, "HH:mm")}
          {end ? ` – ${formatUTC(end, "HH:mm")}` : ""}
        </Typography>
      )}
      {recommendedMins ? (
        <Stack direction="row" spacing={0.4} sx={{ alignItems: "center", color: "text.secondary" }}>
          <ScheduleIcon sx={{ fontSize: 15 }} />
          <Typography variant="caption">{formatMinutes(recommendedMins)}</Typography>
        </Stack>
      ) : null}
    </Stack>
  );
}

export function formatMinutes(mins: number) {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h${m}` : `${h}h`;
}
