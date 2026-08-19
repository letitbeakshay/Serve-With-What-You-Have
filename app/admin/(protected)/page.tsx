import { Button } from "@/components/ui/button";
import { logoutAction } from "./logout-action";

export default function AdminHomePage() {
  return (
    <main className="mx-auto min-h-dvh max-w-md px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-xl font-semibold text-foreground">Admin</h1>
        <form action={logoutAction}>
          <Button type="submit" variant="outline" size="sm">
            Log out
          </Button>
        </form>
      </div>
      <p className="mt-6 text-muted-foreground">
        You are signed in. The list of responses will show up here next.
      </p>
    </main>
  );
}
