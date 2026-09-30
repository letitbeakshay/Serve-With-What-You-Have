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
import { AddDonationForm } from "./add-donation-form";
import { deleteDonation } from "./actions";

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC", // donatedAt is stored as a plain calendar date at noon UTC
});

export default async function AdminDonationsPage() {
  const donations = await prisma.clothDonation.findMany({ orderBy: { donatedAt: "desc" } });

  return (
    <main className="mx-auto min-h-dvh min-w-0 max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
        Cloth donations
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        People who have donated clothes, logged by hand after each pickup or drop-off.
      </p>

      <div className="mt-6">
        <AddDonationForm />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold text-foreground">All donations</h2>
        <p className="text-sm text-muted-foreground">
          {donations.length} {donations.length === 1 ? "donation" : "donations"}
        </p>
      </div>

      {donations.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          No donations logged yet. Add one above once you have collected clothes from someone.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Mobile number</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Donated on</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell className="text-muted-foreground">#{donation.donorNumber}</TableCell>
                  <TableCell className="font-medium text-foreground">{donation.donorName}</TableCell>
                  <TableCell className="text-muted-foreground">{donation.phone}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {donation.email ?? <span className="italic">—</span>}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {dateFormatter.format(donation.donatedAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <form action={deleteDonation}>
                      <input type="hidden" name="id" value={donation.id} />
                      <Button type="submit" variant="outline" size="sm">
                        Remove
                      </Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </main>
  );
}
