import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, isValidSessionToken } from "@/lib/admin-auth";
import { LoginForm } from "./login-form";

export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  if (isValidSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)) {
    redirect("/admin");
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-6 py-16">
      <h1 className="text-xl font-semibold text-foreground">Serve With What You Have</h1>
      <p className="mt-1 text-muted-foreground">Admin</p>
      <div className="mt-8">
        <LoginForm />
      </div>
    </main>
  );
}
