"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WashedField } from "@/components/cloth-donation/washed-field";
import { AnonymousToggle } from "@/components/cloth-donation/anonymous-toggle";

type DonationFields = {
  donorName: string;
  phone: string;
  email: string | null;
  donatedAtValue: string;
  washed: boolean | null;
  collectionPoint: string | null;
  location: string | null;
  isAnonymous: boolean;
};

export function EditDonationForm({
  donation,
  action,
}: {
  donation: DonationFields;
  action: (formData: FormData) => void | Promise<void>;
}) {
  const [isAnonymous, setIsAnonymous] = useState(donation.isAnonymous);

  return (
    <form action={action} className="mt-6 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <AnonymousToggle idPrefix="edit-" checked={isAnonymous} onChange={setIsAnonymous} />
        <div className="space-y-2">
          <Label htmlFor="donorName">Name</Label>
          <Input
            id="donorName"
            name="donorName"
            required={!isAnonymous}
            disabled={isAnonymous}
            defaultValue={donation.donorName}
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
            defaultValue={donation.phone}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email (optional)</Label>
          <Input id="email" name="email" type="email" disabled={isAnonymous} defaultValue={donation.email ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="donatedAt">Date donated</Label>
          <Input id="donatedAt" name="donatedAt" type="date" required defaultValue={donation.donatedAtValue} />
        </div>
        <WashedField idPrefix="edit-" defaultWashed={donation.washed} />
        <div className="space-y-2">
          <Label htmlFor="collectionPoint">Collection point (optional)</Label>
          <Input id="collectionPoint" name="collectionPoint" defaultValue={donation.collectionPoint ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location (optional)</Label>
          <Input id="location" name="location" defaultValue={donation.location ?? ""} />
        </div>
      </div>

      <Button type="submit">Save changes</Button>
    </form>
  );
}
