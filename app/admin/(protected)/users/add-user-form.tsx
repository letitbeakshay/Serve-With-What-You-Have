"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createUser, type UserFormState } from "./actions";

const initialState: UserFormState = null;

export function AddUserForm() {
  const [state, formAction, isPending] = useActionState(createUser, initialState);

  return (
    <form action={formAction} className="rounded-xl border border-border bg-card p-4 sm:p-6">
      <h2 className="font-heading text-lg font-semibold text-foreground">Add user</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Set an email and a starting password. They will be asked to choose their own password the first
        time they log in.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="off" required placeholder="name@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Starting password</Label>
          <Input
            id="password"
            name="password"
            type="text"
            autoComplete="off"
            required
            minLength={8}
            placeholder="At least 8 characters"
          />
        </div>
      </div>
      {state?.error && <p className="mt-3 text-sm text-destructive">{state.error}</p>}
      {state?.success && <p className="mt-3 text-sm text-foreground">{state.success}</p>}
      <Button type="submit" disabled={isPending} className="mt-4">
        {isPending ? "Adding…" : "Add user"}
      </Button>
    </form>
  );
}
