import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { groupByGarment } from "@/lib/garment-breakdown";

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC", // donatedAt is stored as a plain calendar date at noon UTC
});

function washedLabel(washed: boolean | null) {
  return washed === null ? "Don't know" : washed ? "Washed" : "Unwashed";
}

export default async function DonorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const donor = await prisma.donor.findUnique({
    where: { id },
    include: {
      clothDonations: {
        orderBy: { donatedAt: "desc" },
        include: { items: true },
      },
    },
  });
  if (!donor) notFound();

  const allItems = donor.clothDonations.flatMap((d) => d.items);
  const garmentOverview = groupByGarment(allItems);
  const totalQuantity = allItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="mx-auto min-h-dvh min-w-0 max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <Link href="/admin/donors" className="text-sm text-muted-foreground hover:text-foreground">
        &larr; Donors
      </Link>

      <h1 className="mt-3 font-heading text-xl font-semibold text-foreground sm:text-2xl">
        Donor #{donor.donorNumber}
      </h1>

      <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-border bg-card p-4 sm:grid-cols-3 sm:p-6">
        <div>
          <p className="text-xs text-muted-foreground">Name</p>
          <p className="mt-0.5 text-sm font-medium text-foreground">{donor.name}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Mobile number</p>
          <p className="mt-0.5 text-sm font-medium text-foreground">{donor.phone}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Email</p>
          <p className="mt-0.5 text-sm font-medium text-foreground">
            {donor.email ?? <span className="italic text-muted-foreground">—</span>}
          </p>
        </div>
      </div>

      {garmentOverview.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold text-foreground">
              Clothes donated overall
            </h2>
            <p className="text-sm text-muted-foreground">
              {totalQuantity} {totalQuantity === 1 ? "item" : "items"} across{" "}
              {donor.clothDonations.length}{" "}
              {donor.clothDonations.length === 1 ? "donation" : "donations"}
            </p>
          </div>
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

      <div className="mt-8">
        <h2 className="font-heading text-lg font-semibold text-foreground">Cloth donations</h2>
        {donor.clothDonations.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No cloth donations logged yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donated on</TableHead>
                  <TableHead>Washed</TableHead>
                  <TableHead>Collection point</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Items</TableHead>
                  <TableHead className="w-20" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {donor.clothDonations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell className="text-muted-foreground">
                      {dateFormatter.format(donation.donatedAt)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{washedLabel(donation.washed)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {donation.collectionPoint ?? <span className="italic">—</span>}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {donation.location ?? <span className="italic">—</span>}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {donation.items.reduce((sum, item) => sum + item.quantity, 0)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button render={<Link href={`/admin/donations/${donation.id}/view`} />} variant="outline" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </main>
  );
}
