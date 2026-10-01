import Link from "next/link";
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
import { summarizeGarments } from "@/lib/garment-breakdown";

export default async function AdminDonorsPage() {
  const donors = await prisma.donor.findMany({
    orderBy: { donorNumber: "asc" },
    include: { clothDonations: { include: { items: true } } },
  });

  return (
    <main className="mx-auto min-h-dvh min-w-0 max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">Donors</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        One row per person, matched by phone number, across every donation they&apos;ve made --
        whatever kind of serving this grows to cover, not just clothes.
      </p>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold text-foreground">All donors</h2>
        <p className="text-sm text-muted-foreground">
          {donors.length} {donors.length === 1 ? "donor" : "donors"}
        </p>
      </div>

      {donors.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          No donors yet. Once someone&apos;s first donation is logged, they&apos;ll show up here.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Donor ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Mobile number</TableHead>
                <TableHead>Donations made</TableHead>
                <TableHead>Clothes donated</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {donors.map((donor) => {
                const allItems = donor.clothDonations.flatMap((d) => d.items);
                return (
                  <TableRow key={donor.id}>
                    <TableCell className="text-muted-foreground">#{donor.donorNumber}</TableCell>
                    <TableCell className="font-medium text-foreground">{donor.name}</TableCell>
                    <TableCell className="text-muted-foreground">{donor.phone}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {donor.clothDonations.length}{" "}
                      {donor.clothDonations.length === 1 ? "cloth donation" : "cloth donations"}
                    </TableCell>
                    <TableCell className="max-w-64 whitespace-normal break-words text-muted-foreground">
                      {summarizeGarments(allItems) || <span className="italic">—</span>}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button render={<Link href={`/admin/donors/${donor.id}`} />} variant="outline" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </main>
  );
}
