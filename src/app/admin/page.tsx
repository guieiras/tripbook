import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/auth";
import { LoginForm } from "./login-form";

export default async function AdminLoginPage() {
  if (await isAdminAuthed()) {
    redirect("/admin/trips");
  }

  return <LoginForm />;
}
