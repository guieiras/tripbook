import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";

export default function Home() {
  return (
    <Box sx={{ minHeight: "100dvh", display: "flex", alignItems: "center", bgcolor: "background.default" }}>
      <Container maxWidth="xs">
        <Stack spacing={3} sx={{ alignItems: "center", textAlign: "center" }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              bgcolor: "primary.main",
              color: "primary.contrastText",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FlightTakeoffIcon />
          </Box>

          <Stack spacing={1}>
            <Typography variant="h1">Tripbook</Typography>
            <Typography variant="body2" color="text.secondary">
              Simple, shareable travel itineraries. Flights, activities, and
              nested stops laid out day by day.
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
