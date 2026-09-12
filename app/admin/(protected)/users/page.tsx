import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/admin-session";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddUserForm } from "./add-user-form";
import { deleteUser } from "./actions";

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export default async function AdminUsersPage() {
  const admin = await getCurrentAdmin();
  if (admin?.kind !== "owner") {
    redirect("/admin");
  }

  const users = await prisma.adminUser.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="mx-auto min-h-dvh min-w-0 max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">Users</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Teammates who can log in to this admin panel with an email and password. They see the same
        data you do, but cannot manage users.
      </p>

      <div className="mt-6">
        <AddUserForm />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold text-foreground">All users</h2>
        <p className="text-sm text-muted-foreground">
          {users.length} {users.length === 1 ? "user" : "users"}
        </p>
      </div>

      {users.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No users yet. Add one above to share access.</p>
      ) : (
        <div className="mt-4 rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Added</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium text-foreground">{user.email}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.mustResetPassword ? "Waiting for first login" : "Active"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{dateFormatter.format(user.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <form action={deleteUser}>
                      <input type="hidden" name="id" value={user.id} />
                      <Button type="submit" variant="outline" size="sm">
                        Remove
                      </Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </main>
  );
}
