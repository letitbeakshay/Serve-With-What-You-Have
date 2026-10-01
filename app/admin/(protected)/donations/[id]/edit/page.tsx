import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { updateDonation } from "../../actions";
import { EditDonationForm } from "./edit-donation-form";

export default async function EditDonationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const donation = await prisma.clothDonation.findUnique({ where: { id }, include: { donor: true } });
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

      <EditDonationForm
        action={boundUpdate}
        donation={{
          donorName: donation.donorName,
          phone: donation.phone,
          email: donation.email,
          donatedAtValue,
          washed: donation.washed,
          collectionPoint: donation.collectionPoint,
          location: donation.location,
          isAnonymous: donation.donor?.isAnonymous ?? false,
        }}
      />
    </main>
  );
}
