"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { checkAdminPassword, clearAdminCookie, isAdminAuthed, setAdminCookie } from "@/lib/auth";
import type { ActivityType, TravelMode } from "@/generated/prisma/enums";

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

function addDays(dateStr: string, days: number) {
  const d = new Date(`${dateStr}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function flightDataFromForm(formData: FormData) {
  const fromAirport = String(formData.get("fromAirport") ?? "").trim();
  const toAirport = String(formData.get("toAirport") ?? "").trim();
  const departureDate = String(formData.get("departureDate") ?? "");
  const departureTime = String(formData.get("departureTime") ?? "");
  const arrivalTime = String(formData.get("arrivalTime") ?? "");
  const overnight = formData.get("overnight") === "on";
  if (!fromAirport || !toAirport || !departureDate || !departureTime || !arrivalTime) return null;

  const arrivalDate = overnight ? addDays(departureDate, 1) : departureDate;

  return {
    fromAirport,
    toAirport,
    airline: String(formData.get("airline") ?? "") || null,
    flightNumber: String(formData.get("flightNumber") ?? "") || null,
    confirmation: String(formData.get("confirmation") ?? "") || null,
    departureAt: toDateTime(departureDate, departureTime)!,
    arrivalAt: toDateTime(arrivalDate, arrivalTime)!,
    overnight,
  };
}

export async function createFlight(tripId: string, formData: FormData) {
  await requireAdmin();
  const data = flightDataFromForm(formData);
  if (!data) return;

  await prisma.flight.create({ data: { tripId, ...data } });
  revalidatePath(`/admin/trips/${tripId}`);
}

export async function updateFlight(tripId: string, flightId: string, formData: FormData) {
  await requireAdmin();
  const data = flightDataFromForm(formData);
  if (!data) return;

  await prisma.flight.update({ where: { id: flightId }, data });
  revalidatePath(`/admin/trips/${tripId}`);
}

export async function deleteFlight(tripId: string, flightId: string) {
  await requireAdmin();
  await prisma.flight.delete({ where: { id: flightId } });
  revalidatePath(`/admin/trips/${tripId}`);
}

function activityDataFromForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return null;

  const date = String(formData.get("date") ?? "");
  const startTime = String(formData.get("startTime") ?? "");
  const endTime = String(formData.get("endTime") ?? "");
  const overnight = formData.get("overnight") === "on";
  const recommendedMins = String(formData.get("recommendedMins") ?? "");
  const type = String(formData.get("type") ?? "");
  const travelMode = String(formData.get("travelMode") ?? "");
  const travelMinsFromPrev = String(formData.get("travelMinsFromPrev") ?? "");
  const parentId = String(formData.get("parentId") ?? "") || null;

  const endDate = overnight && date ? addDays(date, 1) : date;

  return {
    parentId,
    title,
    type: type ? (type as ActivityType) : null,
    description: String(formData.get("description") ?? "") || null,
    location: String(formData.get("location") ?? "") || null,
    date: date ? new Date(date) : null,
    startTime: date && startTime ? toDateTime(date, startTime) : null,
    endTime: endDate && endTime ? toDateTime(endDate, endTime) : null,
    overnight,
    recommendedMins: recommendedMins ? Number(recommendedMins) : null,
    travelMode: travelMode ? (travelMode as TravelMode) : null,
    travelMinsFromPrev: travelMinsFromPrev ? Number(travelMinsFromPrev) : null,
  };
}

export async function createActivity(tripId: string, formData: FormData) {
  await requireAdmin();
  const data = activityDataFromForm(formData);
  if (!data) return;

  await prisma.activity.create({ data: { tripId, ...data } });
  revalidatePath(`/admin/trips/${tripId}`);
}

export async function updateActivity(tripId: string, activityId: string, formData: FormData) {
  await requireAdmin();
  const data = activityDataFromForm(formData);
  if (!data) return;

  await prisma.activity.update({ where: { id: activityId }, data });
  revalidatePath(`/admin/trips/${tripId}`);
}

export async function deleteActivity(tripId: string, activityId: string) {
  await requireAdmin();
  await prisma.activity.delete({ where: { id: activityId } });
  revalidatePath(`/admin/trips/${tripId}`);
}
