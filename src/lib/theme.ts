import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: "light",
    primary: { main: "#2E5C4B" },
    secondary: { main: "#C77B4F" },
    background: { default: "#FAF7F2", paper: "#FFFFFF" },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: 'var(--font-geist-sans), "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: "1.75rem", fontWeight: 700 },
    h2: { fontSize: "1.35rem", fontWeight: 700 },
    h3: { fontSize: "1.1rem", fontWeight: 600 },
    subtitle1: { fontSize: "0.95rem", fontWeight: 600 },
    body2: { fontSize: "0.875rem" },
  },
  components: {
    MuiContainer: {
      defaultProps: { maxWidth: "sm" },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { textTransform: "none", borderRadius: 10 } },
    },
    MuiCard: {
      styleOverrides: { root: { borderRadius: 14 } },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 8 } },
    },
  },
});
