"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { checkAdminPassword, clearAdminCookie, isAdminAuthed, setAdminCookie } from "@/lib/auth";
import type { TravelMode } from "@/generated/prisma/enums";

async function requireAdmin() {
  if (!(await isAdminAuthed())) {
    redirect("/admin");
  }
}

export async function login(_prevState: { error?: string } | undefined, formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!(await checkAdminPassword(password))) {
    return { error: "Wrong password" };
  }
  await setAdminCookie();
  redirect("/admin/trips");
}

export async function logout() {
  await clearAdminCookie();
  redirect("/admin");
}

export async function createTrip(formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const startDate = String(formData.get("startDate") ?? "");
  const endDate = String(formData.get("endDate") ?? "");
  if (!title || !startDate || !endDate) return;

  const trip = await prisma.trip.create({
    data: {
      title,
      slug: slugify(title),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    },
  });

  revalidatePath("/admin/trips");
  redirect(`/admin/trips/${trip.id}`);
}

export async function updateTrip(tripId: string, formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const startDate = String(formData.get("startDate") ?? "");
  const endDate = String(formData.get("endDate") ?? "");
  const slug = String(formData.get("slug") ?? "").trim();
  if (!title || !startDate || !endDate || !slug) return;

  await prisma.trip.update({
    where: { id: tripId },
    data: { title, slug, startDate: new Date(startDate), endDate: new Date(endDate) },
  });

  revalidatePath(`/admin/trips/${tripId}`);
  revalidatePath("/admin/trips");
}

export async function deleteTrip(tripId: string) {
  await requireAdmin();
  await prisma.trip.delete({ where: { id: tripId } });
  revalidatePath("/admin/trips");
  redirect("/admin/trips");
}

function toDateTime(dateStr: string, timeStr: string) {
  if (!timeStr) return null;
  return new Date(`${dateStr}T${timeStr}:00`);
}

export async function createFlight(tripId: string, formData: FormData) {
  await requireAdmin();
  const fromAirport = String(formData.get("fromAirport") ?? "").trim();
  const toAirport = String(formData.get("toAirport") ?? "").trim();
  const departureDate = String(formData.get("departureDate") ?? "");
  const departureTime = String(formData.get("departureTime") ?? "");
  const arrivalTime = String(formData.get("arrivalTime") ?? "");
  if (!fromAirport || !toAirport || !departureDate || !departureTime || !arrivalTime) return;

  await prisma.flight.create({
    data: {
      tripId,
      fromAirport,
      toAirport,
      airline: String(formData.get("airline") ?? "") || null,
      flightNumber: String(formData.get("flightNumber") ?? "") || null,
      confirmation: String(formData.get("confirmation") ?? "") || null,
      departureAt: toDateTime(departureDate, departureTime)!,
      arrivalAt: toDateTime(departureDate, arrivalTime)!,
    },
  });

  revalidatePath(`/admin/trips/${tripId}`);
}

export async function deleteFlight(tripId: string, flightId: string) {
  await requireAdmin();
  await prisma.flight.delete({ where: { id: flightId } });
  revalidatePath(`/admin/trips/${tripId}`);
}

export async function createActivity(tripId: string, formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  const date = String(formData.get("date") ?? "");
  const startTime = String(formData.get("startTime") ?? "");
  const endTime = String(formData.get("endTime") ?? "");
  const recommendedMins = String(formData.get("recommendedMins") ?? "");
  const travelMode = String(formData.get("travelMode") ?? "");
  const travelMinsFromPrev = String(formData.get("travelMinsFromPrev") ?? "");
  const parentId = String(formData.get("parentId") ?? "") || null;

  await prisma.activity.create({
    data: {
      tripId,
      parentId,
      title,
      description: String(formData.get("description") ?? "") || null,
      location: String(formData.get("location") ?? "") || null,
      date: date ? new Date(date) : null,
      startTime: date && startTime ? toDateTime(date, startTime) : null,
      endTime: date && endTime ? toDateTime(date, endTime) : null,
      recommendedMins: recommendedMins ? Number(recommendedMins) : null,
      travelMode: travelMode ? (travelMode as TravelMode) : null,
      travelMinsFromPrev: travelMinsFromPrev ? Number(travelMinsFromPrev) : null,
    },
  });

  revalidatePath(`/admin/trips/${tripId}`);
}

export async function deleteActivity(tripId: string, activityId: string) {
  await requireAdmin();
  await prisma.activity.delete({ where: { id: activityId } });
  revalidatePath(`/admin/trips/${tripId}`);
}
