"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { WashedField } from "@/components/cloth-donation/washed-field";
import { AnonymousToggle } from "@/components/cloth-donation/anonymous-toggle";
import { createPublicDonation, type AddDonorState } from "./actions";

const initialState: AddDonorState = null;

function todayISODate(): string {
  return new Date().toLocaleDateString("en-CA"); // yyyy-mm-dd, in the local timezone
}

// Isolated so its isAnonymous state can be reset by remounting (via the key
// on this component in the parent) rather than by calling setState from an
// effect, which React's own guidance steers away from.
function DonationFields() {
  const [isAnonymous, setIsAnonymous] = useState(false);
  return (
    <>
      <AnonymousToggle checked={isAnonymous} onChange={setIsAnonymous} />
      <div className="space-y-2">
        <Label htmlFor="donorName">Name</Label>
        <Input
          id="donorName"
          name="donorName"
          required={!isAnonymous}
          disabled={isAnonymous}
          placeholder="Priya Kumar"
          autoFocus
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

export function AddDonorForm() {
  const [state, formAction, isPending] = useActionState(createPublicDonation, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-12 sm:px-6">
      <Card className="w-full max-w-lg rounded-3xl border-none py-10 shadow-md ring-1 ring-border sm:py-12">
        <CardContent className="px-6 sm:px-10">
          <h1 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
            Log a cloth donation
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Serve With What You Have &mdash; use this whenever someone donates clothes.
          </p>

          <form ref={formRef} action={formAction} className="mt-6 space-y-4">
            <DonationFields key={state?.success ?? "initial"} />
            <div className="space-y-2">
              <Label htmlFor="donatedAt">Date donated</Label>
              <Input id="donatedAt" name="donatedAt" type="date" required defaultValue={todayISODate()} />
            </div>
            <WashedField />
            <div className="space-y-2">
              <Label htmlFor="collectionPoint">Collection point (optional)</Label>
              <Input id="collectionPoint" name="collectionPoint" placeholder="Coimbatore drop-off" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location (optional)</Label>
              <Input id="location" name="location" placeholder="RS Puram, Coimbatore" />
            </div>
            {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
            {state?.success && <p className="text-sm text-foreground">{state.success}</p>}
            <Button type="submit" disabled={isPending} className="h-12 w-full text-base">
              {isPending ? "Saving…" : "Log donation"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
