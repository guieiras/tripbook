import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { format } from "date-fns";
import { ActivityTypeIcon } from "@/components/activity-type-icon";
import type { ActivityWithChildren } from "@/lib/itinerary";

/** The "tail" of an overnight activity, shown on the day it actually ends
 * so travel segments and later activities can visually connect from it.
 * Rendered as a half-height block with flat top corners, reading as the
 * continuation of the card on the previous day rather than a new one. */
export function ActivityContinuationCard({ activity }: { activity: ActivityWithChildren }) {
  return (
    <Card variant="outlined" sx={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
      <CardContent sx={{ py: 1, "&:last-child": { pb: 1 } }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", justifyContent: "space-between" }}>
          <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
            {activity.type && <ActivityTypeIcon type={activity.type} sx={{ fontSize: 16, color: "text.secondary" }} />}
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {activity.title}
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Until {activity.endTime ? format(activity.endTime, "HH:mm") : ""}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
