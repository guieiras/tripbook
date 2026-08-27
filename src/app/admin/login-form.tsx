"use client";

import { useActionState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { login } from "./actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <Box sx={{ minHeight: "100dvh", display: "flex", alignItems: "center" }}>
      <Container maxWidth="xs">
        <Stack component="form" action={formAction} spacing={2}>
          <Typography variant="h1">Tripbook admin</Typography>
          {state?.error && <Alert severity="error">{state.error}</Alert>}
          <TextField
            name="password"
            label="Password"
            type="password"
            autoFocus
            required
            fullWidth
          />
          <Button type="submit" variant="contained" size="large" disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
