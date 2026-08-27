import { compare } from "bcryptjs";
import { cookies } from "next/headers";

const COOKIE_NAME = "tripbook_admin";

export async function isAdminAuthed() {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value === "1";
}

export async function setAdminCookie() {
  const store = await cookies();
  store.set(COOKIE_NAME, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearAdminCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function checkAdminPassword(password: string) {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) return false;
  return compare(password, hash);
}
