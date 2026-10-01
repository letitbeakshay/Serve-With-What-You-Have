"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WashedField } from "@/components/cloth-donation/washed-field";
import { AnonymousToggle } from "@/components/cloth-donation/anonymous-toggle";
import { createDonation, type DonationFormState } from "./actions";

const initialState: DonationFormState = null;

function todayISODate(): string {
  return new Date().toLocaleDateString("en-CA"); // yyyy-mm-dd, in the local timezone
}

// Isolated so its isAnonymous state can be reset by remounting (via the key
// on this component in the parent) rather than by calling setState from an
// effect, which React's own guidance steers away from.
function DonationFields({ idPrefix }: { idPrefix: string }) {
  const [isAnonymous, setIsAnonymous] = useState(false);
  return (
    <>
      <AnonymousToggle idPrefix={idPrefix} checked={isAnonymous} onChange={setIsAnonymous} />
      <div className="space-y-2">
        <Label htmlFor="donorName">Name</Label>
        <Input
          id="donorName"
          name="donorName"
          required={!isAnonymous}
          disabled={isAnonymous}
          placeholder="Priya Kumar"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Mobile number</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          required={!isAnonymous}
          disabled={isAnonymous}
          placeholder="98765 43210"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email (optional)</Label>
        <Input id="email" name="email" type="email" disabled={isAnonymous} placeholder="name@example.com" />
      </div>
    </>
  );
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
        <DonationFields key={state?.success ?? "initial"} idPrefix="admin-" />
        <div className="space-y-2">
          <Label htmlFor="donatedAt">Date donated</Label>
          <Input id="donatedAt" name="donatedAt" type="date" required defaultValue={todayISODate()} />
        </div>
        <WashedField idPrefix="admin-" />
        <div className="space-y-2">
          <Label htmlFor="collectionPoint">Collection point (optional)</Label>
          <Input id="collectionPoint" name="collectionPoint" placeholder="Coimbatore drop-off" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location (optional)</Label>
          <Input id="location" name="location" placeholder="RS Puram, Coimbatore" />
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
