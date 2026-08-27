import HotelIcon from "@mui/icons-material/Hotel";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import ParkIcon from "@mui/icons-material/Park";
import MuseumIcon from "@mui/icons-material/Museum";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import AttractionsIcon from "@mui/icons-material/Attractions";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import ForestIcon from "@mui/icons-material/Forest";
import CelebrationIcon from "@mui/icons-material/Celebration";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import type { ActivityType } from "@/generated/prisma/enums";

export const ACTIVITY_TYPE_LABEL: Record<ActivityType, string> = {
  HOTEL: "Hotel",
  SHOPPING: "Shopping",
  FREE_TIME: "Free time",
  PARK: "Park",
  MUSEUM: "Museum",
  FOOD: "Food",
  SIGHTSEEING: "Sightseeing",
  NIGHTLIFE: "Nightlife",
  BEACH: "Beach",
  NATURE: "Nature",
  EVENT: "Event",
  OTHER: "Other",
};

const ICONS: Record<ActivityType, React.ComponentType<SvgIconProps>> = {
  HOTEL: HotelIcon,
  SHOPPING: ShoppingBagIcon,
  FREE_TIME: SelfImprovementIcon,
  PARK: ParkIcon,
  MUSEUM: MuseumIcon,
  FOOD: RestaurantIcon,
  SIGHTSEEING: AttractionsIcon,
  NIGHTLIFE: LocalBarIcon,
  BEACH: BeachAccessIcon,
  NATURE: ForestIcon,
  EVENT: CelebrationIcon,
  OTHER: MoreHorizIcon,
};

export function ActivityTypeIcon({
  type,
  ...props
}: { type: ActivityType } & SvgIconProps) {
  const Icon = ICONS[type];
  return <Icon fontSize="small" {...props} />;
}
