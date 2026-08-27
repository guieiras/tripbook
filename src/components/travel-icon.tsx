import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import TrainIcon from "@mui/icons-material/Train";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";
import FlightIcon from "@mui/icons-material/Flight";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { TravelMode } from "@/generated/prisma/enums";

export const TRAVEL_MODE_LABEL: Record<TravelMode, string> = {
  WALK: "Walk",
  CAR: "Car",
  TRAIN: "Train",
  BUS: "Bus",
  BIKE: "Bike",
  BOAT: "Boat",
  PLANE: "Flight",
};

const ICONS: Record<TravelMode, React.ComponentType<SvgIconProps>> = {
  WALK: DirectionsWalkIcon,
  CAR: DirectionsCarIcon,
  TRAIN: TrainIcon,
  BUS: DirectionsBusIcon,
  BIKE: DirectionsBikeIcon,
  BOAT: DirectionsBoatIcon,
  PLANE: FlightIcon,
};

export function TravelIcon({
  mode,
  ...props
}: { mode: TravelMode } & SvgIconProps) {
  const Icon = ICONS[mode];
  return <Icon fontSize="small" {...props} />;
}
