"use client";

import Button, { type ButtonProps } from "@mui/material/Button";
import Link from "next/link";

export function NavButton(props: ButtonProps<typeof Link> & { href: string }) {
  return <Button component={Link} {...props} />;
}
