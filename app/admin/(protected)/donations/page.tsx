import Link from "next/link";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RANGE_OPTIONS, resolveDateRange } from "@/lib/date-range";
import { summarizeGarments } from "@/lib/garment-breakdown";
import { ConfirmRemoveButton } from "@/components/admin/confirm-remove-button";
import { CopyLinkButton } from "../copy-link-button";
import { AddDonationForm } from "./add-donation-form";
import { deleteDonation } from "./actions";

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC", // donatedAt is stored as a plain calendar date at noon UTC
});

export default async function AdminDonationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const { range, from, to, gte, lt } = resolveDateRange(params);
  const donatedAtFilter = gte || lt ? { ...(gte && { gte }), ...(lt && { lt }) } : undefined;

  // The export link carries the same filter currently on screen, so
  // downloading "Last 30 days" actually downloads last 30 days.
  const exportQuery = new URLSearchParams({ range });
  if (range === "custom") {
    if (from) exportQuery.set("from", from);
    if (to) exportQuery.set("to", to);
  }

  const [donations, itemsTotal] = await Promise.all([
    prisma.clothDonation.findMany({
      where: donatedAtFilter ? { donatedAt: donatedAtFilter } : undefined,
      orderBy: { donatedAt: "desc" },
      include: { items: true },
    }),
    prisma.donationItem.aggregate({
      where: donatedAtFilter ? { donation: { donatedAt: donatedAtFilter } } : undefined,
      _sum: { quantity: true },
    }),
  ]);
  const totalClothes = itemsTotal._sum.quantity ?? 0;

  return (
    <main className="mx-auto min-h-dvh min-w-0 max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
        Cloth donations
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        People who have donated clothes, logged by hand after each pickup or drop-off.
      </p>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4 rounded-xl border border-border bg-card p-4 sm:p-6">
        <div>
          <p className="text-xs text-muted-foreground">
            Clothes donated{range !== "all" ? " in this period" : ""}
          </p>
          <p className="mt-1 font-heading text-3xl font-semibold text-foreground">{totalClothes}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            from {donations.length} {donations.length === 1 ? "donor" : "donors"}
          </p>
        </div>
        <Button render={<a href={`/admin/donations/export?${exportQuery}`} />} variant="outline" size="sm">
          Download Excel
        </Button>
      </div>

      <section className="mt-6">
        <p className="text-sm font-medium text-foreground">Filter by duration</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {RANGE_OPTIONS.map((opt) => (
            <Link
              key={opt.value}
              href={opt.value === "all" ? "/admin/donations" : `/admin/donations?range=${opt.value}`}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                range === opt.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {opt.label}
            </Link>
          ))}
        </div>
        <form method="get" className="mt-3 flex flex-wrap items-end gap-3">
          <input type="hidden" name="range" value="custom" />
          <div className="space-y-1.5">
            <Label htmlFor="from" className="text-xs">
              From
            </Label>
            <Input id="from" name="from" type="date" defaultValue={range === "custom" ? from : ""} className="h-9" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="to" className="text-xs">
              To
            </Label>
            <Input id="to" name="to" type="date" defaultValue={range === "custom" ? to : ""} className="h-9" />
          </div>
          <Button type="submit" variant="outline" size="sm">
            Apply
          </Button>
        </form>
      </section>

      <section className="mt-6">
        <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3">
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">Add a donor link</p>
            <p className="truncate text-sm text-muted-foreground">/add-donor</p>
          </div>
          <CopyLinkButton path="/add-donor" />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Open this on your phone when someone donates, or share it, to log a donation without
          going into the admin panel.
        </p>
      </section>

      <div className="mt-6">
        <AddDonationForm />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          {range === "all" ? "All donations" : "Donations"}
        </h2>
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
                <TableHead>Washed</TableHead>
                <TableHead>Collection point</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Clothes donated</TableHead>
                <TableHead className="w-48" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell className="text-muted-foreground">#{donation.donorNumber}</TableCell>
                  <TableCell className="font-medium text-foreground">{donation.donorName}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {donation.phone || <span className="italic">—</span>}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {donation.email ?? <span className="italic">—</span>}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {dateFormatter.format(donation.donatedAt)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {donation.washed === null ? "Don't know" : donation.washed ? "Washed" : "Unwashed"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {donation.collectionPoint ?? <span className="italic">—</span>}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {donation.location ?? <span className="italic">—</span>}
                  </TableCell>
                  <TableCell className="max-w-64 min-w-48 whitespace-normal break-words text-muted-foreground">
                    {summarizeGarments(donation.items) || <span className="italic">—</span>}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button render={<Link href={`/admin/donations/${donation.id}/view`} />} variant="outline" size="sm">
                        View
                      </Button>
                      <Button render={<Link href={`/admin/donations/${donation.id}/edit`} />} variant="outline" size="sm">
                        Edit
                      </Button>
                      <ConfirmRemoveButton
                        action={deleteDonation}
                        id={donation.id}
                        confirmMessage={`Remove donor #${donation.donorNumber} (${donation.donorName})? This can't be undone.`}
                      />
                    </div>
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
