import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { format } from "date-fns";
import { ActivityTypeIcon } from "@/components/activity-type-icon";
import type { ActivityWithChildren } from "@/lib/itinerary";

/** The "tail" of an overnight activity, shown on the day it actually ends
 * so travel segments and later activities can visually connect from it. */
export function ActivityContinuationCard({ activity }: { activity: ActivityWithChildren }) {
  return (
    <Card variant="outlined">
      <CardContent sx={{ "&:last-child": { pb: 2 } }}>
        <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
          {activity.type && <ActivityTypeIcon type={activity.type} sx={{ fontSize: 18, color: "text.secondary" }} />}
          <Typography variant="subtitle1">{activity.title}</Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          Until {activity.endTime ? format(activity.endTime, "HH:mm") : ""}
        </Typography>
      </CardContent>
    </Card>
  );
}
