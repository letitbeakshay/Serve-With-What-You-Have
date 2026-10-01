import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { AGE_CATEGORY_LABELS, GENDER_LABELS, type AgeCategory, type Gender } from "@/lib/garment-catalog";
import { groupByGarment } from "@/lib/garment-breakdown";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC", // donatedAt is stored as a plain calendar date at noon UTC
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function washedLabel(washed: boolean | null) {
  return washed === null ? "Don't know" : washed ? "Washed" : "Unwashed";
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

export default async function ViewDonationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const donation = await prisma.clothDonation.findUnique({
    where: { id },
    include: { items: { orderBy: { createdAt: "desc" } } },
  });
  if (!donation) notFound();

  const totalQuantity = donation.items.reduce((sum, item) => sum + item.quantity, 0);

  const garmentOverview = groupByGarment(donation.items);

  return (
    <main className="mx-auto min-h-dvh min-w-0 max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <Link href="/admin/donations" className="text-sm text-muted-foreground hover:text-foreground">
        &larr; Cloth donations
      </Link>

      <div className="mt-3 flex items-center justify-between gap-3">
        <h1 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
          Donor #{donation.donorNumber}
        </h1>
        <Button render={<Link href={`/admin/donations/${donation.id}/edit`} />} variant="outline" size="sm">
          Edit
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-border bg-card p-4 sm:grid-cols-3 sm:p-6">
        <DetailRow label="Name" value={donation.donorName} />
        <DetailRow
          label="Mobile number"
          value={donation.phone || <span className="italic text-muted-foreground">—</span>}
        />
        <DetailRow label="Email" value={donation.email ?? <span className="italic text-muted-foreground">—</span>} />
        <DetailRow label="Donated on" value={dateFormatter.format(donation.donatedAt)} />
        <DetailRow label="Washed" value={washedLabel(donation.washed)} />
        <DetailRow
          label="Collection point"
          value={donation.collectionPoint ?? <span className="italic text-muted-foreground">—</span>}
        />
        <DetailRow
          label="Location"
          value={donation.location ?? <span className="italic text-muted-foreground">—</span>}
        />
      </div>

      {garmentOverview.length > 0 && (
        <div className="mt-8">
          <h2 className="font-heading text-lg font-semibold text-foreground">Overview</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {garmentOverview.map(([garmentType, quantity]) => (
              <span
                key={garmentType}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground"
              >
                {quantity} &times; {garmentType}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold text-foreground">Clothes donated</h2>
        <p className="text-sm text-muted-foreground">
          {donation.items.length} {donation.items.length === 1 ? "entry" : "entries"} &middot; {totalQuantity}{" "}
          {totalQuantity === 1 ? "item" : "items"} total
        </p>
      </div>

      {donation.items.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          No volunteer has logged any clothes against this donor yet.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>Volunteer</TableHead>
                <TableHead>For</TableHead>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Qty</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donation.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-muted-foreground">
                    {dateTimeFormatter.format(item.createdAt)}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{item.volunteerName}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {GENDER_LABELS[item.gender as Gender]}
                    {item.ageCategory ? `, ${AGE_CATEGORY_LABELS[item.ageCategory as AgeCategory]}` : ""}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.garmentType}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{item.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </main>
  );
}
