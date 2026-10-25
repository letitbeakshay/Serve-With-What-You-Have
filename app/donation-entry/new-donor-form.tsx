"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WashedField } from "@/components/cloth-donation/washed-field";
import { AnonymousToggle } from "@/components/cloth-donation/anonymous-toggle";

export type NewDonor = { id: string; donorNumber: number; donorName: string; phone: string; donatedAt: string };

function todayISODate(): string {
  return new Date().toLocaleDateString("en-CA"); // yyyy-mm-dd, in the local timezone
}

export function NewDonorForm({
  onCreated,
  onBack,
}: {
  onCreated: (donor: NewDonor) => void;
  onBack: () => void;
}) {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/donation-entry/create-donor", {
        method: "POST",
        body: new FormData(e.currentTarget),
      });
      const json = await res.json();
      if (json.ok) {
        onCreated(json.donor);
      } else {
        setError(json.error ?? "Something went wrong.");
      }
    } catch {
      setError("Could not reach the server. Check your connection.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="mb-5 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-card active:bg-muted"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="font-heading text-xl font-semibold text-foreground">Add new donor</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <AnonymousToggle idPrefix="new-" checked={isAnonymous} onChange={setIsAnonymous} />
        <div className="space-y-2">
          <Label htmlFor="newDonorName">Name</Label>
          <Input
            id="newDonorName"
            name="donorName"
            required={!isAnonymous}
            disabled={isAnonymous}
            className="h-12 text-base"
            placeholder="Priya Kumar"
            autoFocus
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="newDonorPhone">Mobile number</Label>
          <Input
            id="newDonorPhone"
            name="phone"
            type="tel"
            inputMode="tel"
            required={!isAnonymous}
            disabled={isAnonymous}
            className="h-12 text-base"
            placeholder="98765 43210"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="newDonorDate">Date donated</Label>
          <Input
            id="newDonorDate"
            name="donatedAt"
            type="date"
            required
            defaultValue={todayISODate()}
            className="h-12 text-base"
          />
        </div>
        <WashedField idPrefix="new-" />
        <div className="space-y-2">
          <Label htmlFor="newDonorCollectionPoint">Collection point (optional)</Label>
          <Input id="newDonorCollectionPoint" name="collectionPoint" className="h-12 text-base" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="newDonorLocation">Location (optional)</Label>
          <Input id="newDonorLocation" name="location" className="h-12 text-base" />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={submitting} className="h-12 w-full text-base">
          {submitting ? "Adding…" : "Add donor"}
        </Button>
      </form>
    </>
  );
}
