import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WashedField } from "@/components/cloth-donation/washed-field";
import { updateDonation } from "../../actions";

export default async function EditDonationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const donation = await prisma.clothDonation.findUnique({ where: { id } });
  if (!donation) notFound();

  const boundUpdate = updateDonation.bind(null, donation.id);
  // donatedAt is stored at noon UTC specifically so this slice always gives
  // back the calendar date it was entered as, regardless of server timezone.
  const donatedAtValue = donation.donatedAt.toISOString().slice(0, 10);

  return (
    <main className="mx-auto min-h-dvh max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <Link href="/admin/donations" className="text-sm text-muted-foreground hover:text-foreground">
        &larr; Cloth donations
      </Link>

      <h1 className="mt-3 font-heading text-xl font-semibold text-foreground sm:text-2xl">
        Edit donation #{donation.donorNumber}
      </h1>

      <form action={boundUpdate} className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="donorName">Name</Label>
            <Input id="donorName" name="donorName" required defaultValue={donation.donorName} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Mobile number</Label>
            <Input id="phone" name="phone" type="tel" inputMode="tel" required defaultValue={donation.phone} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email (optional)</Label>
            <Input id="email" name="email" type="email" defaultValue={donation.email ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="donatedAt">Date donated</Label>
            <Input id="donatedAt" name="donatedAt" type="date" required defaultValue={donatedAtValue} />
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
    </main>
  );
}
