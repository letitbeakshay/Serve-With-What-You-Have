"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createDonation, type DonationFormState } from "./actions";

const initialState: DonationFormState = null;

function todayISODate(): string {
  return new Date().toLocaleDateString("en-CA"); // yyyy-mm-dd, in the local timezone
}

export function AddDonationForm() {
  const [state, formAction, isPending] = useActionState(createDonation, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="rounded-xl border border-border bg-card p-4 sm:p-6">
      <h2 className="font-heading text-lg font-semibold text-foreground">Log a donation</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Add this once you have collected clothes from someone.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="donorName">Name</Label>
          <Input id="donorName" name="donorName" required placeholder="Priya Kumar" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Mobile number</Label>
          <Input id="phone" name="phone" type="tel" inputMode="tel" required placeholder="98765 43210" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email (optional)</Label>
          <Input id="email" name="email" type="email" placeholder="name@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="donatedAt">Date donated</Label>
          <Input id="donatedAt" name="donatedAt" type="date" required defaultValue={todayISODate()} />
        </div>
      </div>
      {state?.error && <p className="mt-3 text-sm text-destructive">{state.error}</p>}
      {state?.success && <p className="mt-3 text-sm text-foreground">{state.success}</p>}
      <Button type="submit" disabled={isPending} className="mt-4">
        {isPending ? "Adding…" : "Add donation"}
      </Button>
    </form>
  );
}
