"use client";

import { useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Collapse from "@mui/material/Collapse";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddIcon from "@mui/icons-material/Add";
import { format } from "date-fns";
import { TravelIcon, TRAVEL_MODE_LABEL } from "@/components/travel-icon";
import type { ActivityModel as Activity } from "@/generated/prisma/models";
import { TravelMode } from "@/generated/prisma/enums";

type CreateActivity = (tripId: string, formData: FormData) => Promise<void>;
type DeleteActivity = (tripId: string, activityId: string) => Promise<void>;

export function ActivitiesSection({
  tripId,
  activities,
  topLevelActivities,
  createActivity,
  deleteActivity,
}: {
  tripId: string;
  activities: Activity[];
  topLevelActivities: Activity[];
  createActivity: CreateActivity;
  deleteActivity: DeleteActivity;
}) {
  const childrenOf = (parentId: string) => activities.filter((a) => a.parentId === parentId);

  return (
    <Stack spacing={2}>
      <Typography variant="h2">Activities</Typography>

      <Stack spacing={1.5}>
        {topLevelActivities.map((activity) => (
          <Card key={activity.id} variant="outlined">
            <CardContent sx={{ "&:last-child": { pb: 2 } }}>
              <ActivityRow activity={activity} tripId={tripId} onDelete={deleteActivity} />

              {childrenOf(activity.id).length > 0 && (
                <Stack spacing={1} sx={{ mt: 1, pl: 2, borderLeft: "2px solid", borderColor: "divider" }}>
                  {childrenOf(activity.id).map((child) => (
                    <ActivityRow key={child.id} activity={child} tripId={tripId} onDelete={deleteActivity} nested />
                  ))}
                </Stack>
              )}

              <AddActivityInline
                tripId={tripId}
                parentId={activity.id}
                parentDate={activity.date}
                createActivity={createActivity}
                label="Add nested item"
              />
            </CardContent>
          </Card>
        ))}
        {topLevelActivities.length === 0 && (
          <Typography color="text.secondary">No activities yet — add one below.</Typography>
        )}
      </Stack>

      <Typography variant="h3">New activity</Typography>
      <ActivityForm tripId={tripId} createActivity={createActivity} topLevelActivities={topLevelActivities} />
    </Stack>
  );
}

function ActivityRow({
  activity,
  tripId,
  onDelete,
  nested,
}: {
  activity: Activity;
  tripId: string;
  onDelete: DeleteActivity;
  nested?: boolean;
}) {
  return (
    <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
      <Stack>
        <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
          {activity.travelMode && <TravelIcon mode={activity.travelMode} sx={{ fontSize: 16, color: "text.secondary" }} />}
          <Typography variant={nested ? "body2" : "subtitle1"} sx={{ fontWeight: nested ? 600 : undefined }}>
            {activity.title}
          </Typography>
        </Stack>
        <Typography variant="caption" color="text.secondary">
          {activity.date ? format(activity.date, "MMM d") : "No date"}
          {activity.startTime ? ` · ${format(activity.startTime, "HH:mm")}` : ""}
          {activity.endTime ? `–${format(activity.endTime, "HH:mm")}` : ""}
          {activity.recommendedMins ? ` · ~${activity.recommendedMins}min` : ""}
        </Typography>
      </Stack>
      <form action={onDelete.bind(null, tripId, activity.id)}>
        <IconButton type="submit" size="small" aria-label="Delete activity">
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </form>
    </Stack>
  );
}

function AddActivityInline({
  tripId,
  parentId,
  parentDate,
  createActivity,
  label,
}: {
  tripId: string;
  parentId: string;
  parentDate: Date | null;
  createActivity: CreateActivity;
  label: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Stack sx={{ mt: 1 }}>
      <Button
        size="small"
        startIcon={<AddIcon />}
        onClick={() => setOpen((v) => !v)}
        sx={{ alignSelf: "flex-start" }}
      >
        {label}
      </Button>
      <Collapse in={open}>
        <Stack sx={{ pt: 1.5 }}>
          <ActivityForm
            tripId={tripId}
            createActivity={createActivity}
            topLevelActivities={[]}
            fixedParentId={parentId}
            defaultDate={parentDate}
            compact
          />
        </Stack>
      </Collapse>
    </Stack>
  );
}

function ActivityForm({
  tripId,
  createActivity,
  topLevelActivities,
  fixedParentId,
  defaultDate,
  compact,
}: {
  tripId: string;
  createActivity: CreateActivity;
  topLevelActivities: Activity[];
  fixedParentId?: string;
  defaultDate?: Date | null;
  compact?: boolean;
}) {
  return (
    <Stack component="form" action={createActivity.bind(null, tripId)} spacing={1.5}>
      <TextField name="title" label="Title" required fullWidth size={compact ? "small" : "medium"} />

      {!fixedParentId && (
        <TextField
          name="parentId"
          label="Nest inside (optional)"
          select
          defaultValue=""
          fullWidth
          size={compact ? "small" : "medium"}
        >
          <MenuItem value="">— Top level —</MenuItem>
          {topLevelActivities.map((a) => (
            <MenuItem key={a.id} value={a.id}>
              {a.title}
            </MenuItem>
          ))}
        </TextField>
      )}
      {fixedParentId && <input type="hidden" name="parentId" value={fixedParentId} />}

      <Stack direction="row" spacing={1.5}>
        <TextField
          name="date"
          label="Date"
          type="date"
          fullWidth
          size={compact ? "small" : "medium"}
          defaultValue={defaultDate ? format(defaultDate, "yyyy-MM-dd") : ""}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          name="recommendedMins"
          label="Recommended (min)"
          type="number"
          fullWidth
          size={compact ? "small" : "medium"}
        />
      </Stack>

      <Stack direction="row" spacing={1.5}>
        <TextField
          name="startTime"
          label="Start"
          type="time"
          fullWidth
          size={compact ? "small" : "medium"}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          name="endTime"
          label="End"
          type="time"
          fullWidth
          size={compact ? "small" : "medium"}
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Stack>

      <TextField name="location" label="Location" fullWidth size={compact ? "small" : "medium"} />
      <TextField name="description" label="Notes" fullWidth multiline minRows={2} size={compact ? "small" : "medium"} />

      <Stack direction="row" spacing={1.5}>
        <TextField
          name="travelMode"
          label="Travel from previous"
          select
          defaultValue=""
          fullWidth
          size={compact ? "small" : "medium"}
        >
          <MenuItem value="">— None —</MenuItem>
          {Object.values(TravelMode).map((mode) => (
            <MenuItem key={mode} value={mode}>
              {TRAVEL_MODE_LABEL[mode]}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          name="travelMinsFromPrev"
          label="Travel time (min)"
          type="number"
          fullWidth
          size={compact ? "small" : "medium"}
        />
      </Stack>

      <Button type="submit" variant="outlined" size={compact ? "small" : "medium"} sx={{ alignSelf: "flex-start" }}>
        Add activity
      </Button>
    </Stack>
  );
}
