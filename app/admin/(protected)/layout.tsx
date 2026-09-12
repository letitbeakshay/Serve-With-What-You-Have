import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin-session";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }
  // A teammate on the password the owner gave them can't see any data until
  // they've chosen their own. The reset page lives outside this layout.
  if (admin.kind === "user" && admin.user.mustResetPassword) {
    redirect("/admin/reset-password");
  }

  return (
    <div className="flex min-h-dvh flex-col sm:flex-row">
      <AdminSidebar isOwner={admin.kind === "owner"} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
