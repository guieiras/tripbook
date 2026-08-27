"use client";

import CardActionArea, { type CardActionAreaProps } from "@mui/material/CardActionArea";
import Link from "next/link";

export function NavCardActionArea(props: CardActionAreaProps<typeof Link> & { href: string }) {
  return <CardActionArea component={Link} {...props} />;
}
