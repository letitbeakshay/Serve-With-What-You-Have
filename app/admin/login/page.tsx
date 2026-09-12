import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin-session";
import { LoginForm } from "./login-form";

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin();
  if (admin) {
    redirect(admin.kind === "user" && admin.user.mustResetPassword ? "/admin/reset-password" : "/admin");
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-6 py-16">
      <h1 className="font-heading text-xl font-semibold text-foreground">Serve With What You Have</h1>
      <p className="mt-1 text-muted-foreground">Admin</p>
      <div className="mt-8">
        <LoginForm />
      </div>
    </main>
  );
}
