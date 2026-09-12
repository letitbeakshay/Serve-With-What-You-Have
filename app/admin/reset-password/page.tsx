import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin-session";
import { logoutAction } from "@/app/admin/(protected)/logout-action";
import { Button } from "@/components/ui/button";
import { ResetPasswordForm } from "./reset-password-form";

// Lives outside the (protected) layout so the forced first-login reset
// doesn't loop through that layout's own redirect.
export default async function ResetPasswordPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  if (admin.kind !== "user") redirect("/admin");

  const firstLogin = admin.user.mustResetPassword;

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-6 py-16">
      <h1 className="font-heading text-xl font-semibold text-foreground">
        {firstLogin ? "Set your password" : "Change password"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {firstLogin
          ? `You are logged in as ${admin.user.email}. Choose a new password to replace the one you were given, then you can get to the admin panel.`
          : `Logged in as ${admin.user.email}.`}
      </p>
      <div className="mt-8">
        <ResetPasswordForm />
      </div>
      <div className="mt-6 flex items-center justify-between">
        {!firstLogin && (
          <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground">
            &larr; Back to admin
          </Link>
        )}
        <form action={logoutAction} className="ml-auto">
          <Button type="submit" variant="ghost" size="sm">
            Log out
          </Button>
        </form>
      </div>
    </main>
  );
}
