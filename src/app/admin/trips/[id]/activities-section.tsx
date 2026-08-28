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
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddIcon from "@mui/icons-material/Add";
import { format } from "date-fns";
import PlaceIcon from "@mui/icons-material/PlaceOutlined";
import { TravelIcon, TRAVEL_MODE_LABEL } from "@/components/travel-icon";
import { formatMinutes } from "@/components/time-range";
import { ActivityTypeIcon, ACTIVITY_TYPE_LABEL } from "@/components/activity-type-icon";
import type { ActivityModel as Activity } from "@/generated/prisma/models";
import { ActivityType, TravelMode } from "@/generated/prisma/enums";
import { formatDay } from "@/lib/format-day";
import { dayKey } from "@/lib/day";

type CreateActivity = (tripId: string, formData: FormData) => Promise<void>;
type UpdateActivity = (tripId: string, activityId: string, formData: FormData) => Promise<void>;
type DeleteActivity = (tripId: string, activityId: string) => Promise<void>;

export function ActivitiesSection({
  tripId,
  days,
  activities,
  topLevelActivities,
  createActivity,
  updateActivity,
  deleteActivity,
}: {
  tripId: string;
  days: Date[];
  activities: Activity[];
  topLevelActivities: Activity[];
  createActivity: CreateActivity;
  updateActivity: UpdateActivity;
  deleteActivity: DeleteActivity;
}) {
  const childrenOf = (parentId: string) => activities.filter((a) => a.parentId === parentId);

  const topLevelByDay = new Map<string, Activity[]>();
  const unscheduled: Activity[] = [];
  for (const activity of topLevelActivities) {
    if (!activity.date) {
      unscheduled.push(activity);
      continue;
    }
    const key = dayKey(activity.date);
    if (!topLevelByDay.has(key)) topLevelByDay.set(key, []);
    topLevelByDay.get(key)!.push(activity);
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h2">Activities</Typography>

      <Stack spacing={3}>
        {days.map((day) => {
          const key = dayKey(day);
          return (
            <DaySection
              key={key}
              tripId={tripId}
              day={day}
              activities={topLevelByDay.get(key) ?? []}
              childrenOf={childrenOf}
              topLevelActivities={topLevelActivities}
              createActivity={createActivity}
              updateActivity={updateActivity}
              deleteActivity={deleteActivity}
            />
          );
        })}
      </Stack>

      {unscheduled.length > 0 && (
        <Stack spacing={1.5}>
          <Typography variant="h3">Unscheduled</Typography>
          {unscheduled.map((activity) => (
            <ActivityCardEditable
              key={activity.id}
              tripId={tripId}
              activity={activity}
              childActivities={childrenOf(activity.id)}
              topLevelActivities={topLevelActivities}
              defaultDate={null}
              createActivity={createActivity}
              updateActivity={updateActivity}
              deleteActivity={deleteActivity}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}

function DaySection({
  tripId,
  day,
  activities,
  childrenOf,
  topLevelActivities,
  createActivity,
  updateActivity,
  deleteActivity,
}: {
  tripId: string;
  day: Date;
  activities: Activity[];
  childrenOf: (parentId: string) => Activity[];
  topLevelActivities: Activity[];
  createActivity: CreateActivity;
  updateActivity: UpdateActivity;
  deleteActivity: DeleteActivity;
}) {
  const [adding, setAdding] = useState(false);

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h3">{formatDay(day, "EEEE, MMM d")}</Typography>
        <IconButton size="small" aria-label="Add activity" onClick={() => setAdding((v) => !v)}>
          <AddIcon fontSize="small" />
        </IconButton>
      </Stack>

      <Collapse in={adding}>
        <Card variant="outlined" sx={{ mb: 1 }}>
          <CardContent sx={{ "&:last-child": { pb: 2 } }}>
            <ActivityForm
              action={createActivity.bind(null, tripId)}
              submitLabel="Add activity"
              defaultDate={day}
              topLevelActivities={topLevelActivities}
              compact
              onSaved={() => setAdding(false)}
            />
          </CardContent>
        </Card>
      </Collapse>

      {activities.map((activity) => (
        <ActivityCardEditable
          key={activity.id}
          tripId={tripId}
          activity={activity}
          childActivities={childrenOf(activity.id)}
          topLevelActivities={topLevelActivities}
          defaultDate={day}
          createActivity={createActivity}
          updateActivity={updateActivity}
          deleteActivity={deleteActivity}
        />
      ))}

      {activities.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          Nothing planned yet.
        </Typography>
      )}
    </Stack>
  );
}

function ActivityCardEditable({
  tripId,
  activity,
  childActivities,
  topLevelActivities,
  defaultDate,
  createActivity,
  updateActivity,
  deleteActivity,
}: {
  tripId: string;
  activity: Activity;
  childActivities: Activity[];
  topLevelActivities: Activity[];
  defaultDate: Date | null;
  createActivity: CreateActivity;
  updateActivity: UpdateActivity;
  deleteActivity: DeleteActivity;
}) {
  return (
    <Card variant="outlined">
      <CardContent sx={{ "&:last-child": { pb: 2 } }}>
        <ActivityRow
          tripId={tripId}
          activity={activity}
          topLevelActivities={topLevelActivities}
          updateActivity={updateActivity}
          deleteActivity={deleteActivity}
        />

        {childActivities.length > 0 && (
          <Stack spacing={1.5} sx={{ mt: 1, pl: 2, borderLeft: "2px solid", borderColor: "divider" }}>
            {childActivities.map((child) => (
              <ActivityRow
                key={child.id}
                tripId={tripId}
                activity={child}
                topLevelActivities={topLevelActivities}
                updateActivity={updateActivity}
                deleteActivity={deleteActivity}
                nested
              />
            ))}
          </Stack>
        )}

        <AddActivityInline
          tripId={tripId}
          parentId={activity.id}
          defaultDate={defaultDate}
          createActivity={createActivity}
        />
      </CardContent>
    </Card>
  );
}

function ActivityRow({
  tripId,
  activity,
  topLevelActivities,
  updateActivity,
  deleteActivity,
  nested,
}: {
  tripId: string;
  activity: Activity;
  topLevelActivities: Activity[];
  updateActivity: UpdateActivity;
  deleteActivity: DeleteActivity;
  nested?: boolean;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <Stack spacing={0.5}>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
        <Stack sx={{ minWidth: 0 }}>
          <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
            {activity.type && <ActivityTypeIcon type={activity.type} sx={{ fontSize: 16, color: "text.secondary" }} />}
            <Typography variant={nested ? "body2" : "subtitle1"} sx={{ fontWeight: nested ? 600 : undefined }}>
              {activity.title}
            </Typography>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            {activity.date ? formatDay(activity.date, "MMM d") : "No date"}
            {activity.startTime ? ` · ${format(activity.startTime, "HH:mm")}` : ""}
            {activity.endTime ? `–${format(activity.endTime, "HH:mm")}` : ""}
            {activity.overnight ? " (+1 day)" : ""}
            {activity.recommendedMins ? ` · ~${formatMinutes(activity.recommendedMins)}` : ""}
          </Typography>
          {activity.travelMode && activity.travelMinsFromPrev && (
            <Stack direction="row" spacing={0.4} sx={{ alignItems: "center", color: "text.secondary" }}>
              <TravelIcon mode={activity.travelMode} sx={{ fontSize: 14 }} />
              <Typography variant="caption">
                {TRAVEL_MODE_LABEL[activity.travelMode]} · {formatMinutes(activity.travelMinsFromPrev)} from previous
              </Typography>
            </Stack>
          )}
          {activity.location && (
            <Stack direction="row" spacing={0.4} sx={{ alignItems: "center", color: "text.secondary" }}>
              <PlaceIcon sx={{ fontSize: 14 }} />
              <Typography variant="caption">{activity.location}</Typography>
            </Stack>
          )}
          {activity.description && (
            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: "italic" }}>
              {activity.description}
            </Typography>
          )}
        </Stack>
        <Stack direction="row">
          <IconButton size="small" aria-label="Edit activity" onClick={() => setEditing((v) => !v)}>
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
          <form action={deleteActivity.bind(null, tripId, activity.id)}>
            <IconButton type="submit" size="small" aria-label="Delete activity">
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </form>
        </Stack>
      </Stack>

      <Collapse in={editing}>
        <Stack sx={{ pt: 1 }}>
          <ActivityForm
            // Remount when the saved data actually changes, so
            // uncontrolled fields (defaultValue/defaultChecked) don't go
            // stale after a save — Collapse keeps this mounted, it never
            // remounts on its own.
            key={activity.updatedAt.toISOString()}
            action={updateActivity.bind(null, tripId, activity.id)}
            submitLabel="Save"
            activity={activity}
            defaultDate={activity.date}
            topLevelActivities={topLevelActivities.filter((a) => a.id !== activity.id)}
            compact
            onSaved={() => setEditing(false)}
          />
        </Stack>
      </Collapse>
    </Stack>
  );
}

function AddActivityInline({
  tripId,
  parentId,
  defaultDate,
  createActivity,
}: {
  tripId: string;
  parentId: string;
  defaultDate: Date | null;
  createActivity: CreateActivity;
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
        Add nested item
      </Button>
      <Collapse in={open}>
        <Stack sx={{ pt: 1.5 }}>
          <ActivityForm
            action={createActivity.bind(null, tripId)}
            submitLabel="Add activity"
            fixedParentId={parentId}
            defaultDate={defaultDate}
            topLevelActivities={[]}
            compact
            onSaved={() => setOpen(false)}
          />
        </Stack>
      </Collapse>
    </Stack>
  );
}

function ActivityForm({
  action,
  submitLabel,
  activity,
  topLevelActivities,
  fixedParentId,
  defaultDate,
  compact,
  onSaved,
}: {
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
  activity?: Activity;
  topLevelActivities: Activity[];
  fixedParentId?: string;
  defaultDate?: Date | null;
  compact?: boolean;
  onSaved?: () => void;
}) {
  const size = compact ? "small" : "medium";
  const parentId = fixedParentId ?? activity?.parentId ?? "";

  return (
    <Stack
      component="form"
      action={async (formData: FormData) => {
        await action(formData);
        onSaved?.();
      }}
      spacing={1.5}
    >
      <TextField name="title" label="Title" required fullWidth size={size} defaultValue={activity?.title} />

      <TextField name="type" label="Type" select defaultValue={activity?.type ?? ""} fullWidth size={size}>
        <MenuItem value="">— None —</MenuItem>
        {Object.values(ActivityType).map((type) => (
          <MenuItem key={type} value={type}>
            {ACTIVITY_TYPE_LABEL[type]}
          </MenuItem>
        ))}
      </TextField>

      {!fixedParentId && (
        <TextField
          name="parentId"
          label="Nest inside (optional)"
          select
          defaultValue={parentId}
          fullWidth
          size={size}
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
          size={size}
          defaultValue={defaultDate ? formatDay(defaultDate, "yyyy-MM-dd") : ""}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          name="recommendedMins"
          label="Recommended (min)"
          type="number"
          fullWidth
          size={size}
          defaultValue={activity?.recommendedMins ?? ""}
        />
      </Stack>

      <Stack direction="row" spacing={1.5}>
        <TextField
          name="startTime"
          label="Start"
          type="time"
          fullWidth
          size={size}
          defaultValue={activity?.startTime ? format(activity.startTime, "HH:mm") : ""}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          name="endTime"
          label="End"
          type="time"
          fullWidth
          size={size}
          defaultValue={activity?.endTime ? format(activity.endTime, "HH:mm") : ""}
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Stack>

      <FormControlLabel
        control={<Checkbox name="overnight" defaultChecked={activity?.overnight ?? false} size={size} />}
        label="Ends next day (overnight)"
      />

      <TextField name="location" label="Location" fullWidth size={size} defaultValue={activity?.location ?? ""} />
      <TextField
        name="description"
        label="Notes"
        fullWidth
        multiline
        minRows={2}
        size={size}
        defaultValue={activity?.description ?? ""}
      />

      <Stack direction="row" spacing={1.5}>
        <TextField
          name="travelMode"
          label="Travel from previous"
          select
          defaultValue={activity?.travelMode ?? ""}
          fullWidth
          size={size}
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
          size={size}
          defaultValue={activity?.travelMinsFromPrev ?? ""}
        />
      </Stack>

      <Button type="submit" variant="outlined" size={size} sx={{ alignSelf: "flex-start" }}>
        {submitLabel}
      </Button>
    </Stack>
  );
}
