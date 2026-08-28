import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Path data from @mui/icons-material/FlightTakeoff, so the favicon matches
// the icon used on the landing page.
const FLIGHT_TAKEOFF_PATH =
  "M2.5 19h19v2h-19zm19.57-9.36c-.21-.8-1.04-1.28-1.84-1.06L14.92 10l-6.9-6.43-1.93.51 4.14 7.17-4.97 1.33-1.97-1.54-1.45.39 2.59 4.49s7.12-1.9 16.57-4.43c.81-.23 1.28-1.05 1.07-1.85";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2E5C4B",
        }}
      >
        <svg width="100" height="100" viewBox="0 0 24 24" fill="#FAF7F2">
          <path d={FLIGHT_TAKEOFF_PATH} />
        </svg>
      </div>
    ),
    { ...size },
  );
}
