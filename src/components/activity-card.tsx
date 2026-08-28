import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import PlaceIcon from "@mui/icons-material/PlaceOutlined";
import { TimeRange } from "@/components/time-range";
import { TravelSegment } from "@/components/travel-segment";
import { ActivityTypeIcon } from "@/components/activity-type-icon";
import type { ActivityWithChildren } from "@/lib/itinerary";
import type { TravelMode } from "@/generated/prisma/enums";

export function ActivityCard({ activity }: { activity: ActivityWithChildren }) {
  const hasChildren = activity.children.length > 0;

  return (
    <Stack spacing={0.25}>
      {activity.travelMode && activity.travelMinsFromPrev ? (
        <TravelSegment
          mode={activity.travelMode as TravelMode}
          mins={activity.travelMinsFromPrev}
        />
      ) : null}

      <Card variant="outlined">
        <CardContent sx={{ "&:last-child": { pb: 2 } }}>
          <Stack spacing={0.75}>
            <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
              {activity.type && (
                <ActivityTypeIcon type={activity.type} sx={{ fontSize: 18, color: "text.secondary" }} />
              )}
              <Typography variant="subtitle1">{activity.title}</Typography>
            </Stack>

            <TimeRange
              start={activity.startTime}
              end={activity.endTime}
              recommendedMins={activity.recommendedMins}
            />

            {activity.location && (
              <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", color: "text.secondary" }}>
                <PlaceIcon sx={{ fontSize: 15 }} />
                <Typography variant="body2">{activity.location}</Typography>
              </Stack>
            )}

            {activity.description && (
              <Typography variant="body2" color="text.secondary">
                {activity.description}
              </Typography>
            )}
          </Stack>

          {hasChildren && (
            <Stack spacing={1} sx={{ mt: 1.5, pl: 1.5, borderLeft: "2px solid", borderColor: "divider" }}>
              {activity.children.map((child) => (
                <Stack key={child.id} spacing={0.25}>
                  {child.travelMode && child.travelMinsFromPrev ? (
                    <TravelSegment mode={child.travelMode as TravelMode} mins={child.travelMinsFromPrev} />
                  ) : null}
                  <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                    {child.type && (
                      <ActivityTypeIcon type={child.type} sx={{ fontSize: 16, color: "text.secondary" }} />
                    )}
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {child.title}
                    </Typography>
                  </Stack>
                  <TimeRange
                    start={child.startTime}
                    end={child.endTime}
                    recommendedMins={child.recommendedMins}
                  />
                  {child.description && (
                    <Typography variant="caption" color="text.secondary">
                      {child.description}
                    </Typography>
                  )}
                </Stack>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}
