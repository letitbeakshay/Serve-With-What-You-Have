import { prisma } from "@/lib/db";
import { AGE_CATEGORY_LABELS, GENDER_LABELS, type AgeCategory, type Gender } from "@/lib/garment-catalog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CopyLinkButton } from "../copy-link-button";
import { deleteVolunteerEntry } from "./actions";

const dateTimeFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export default async function AdminVolunteerEntriesPage() {
  const [items, byVolunteer] = await Promise.all([
    prisma.donationItem.findMany({
      orderBy: { createdAt: "desc" },
      include: { donation: { select: { donorNumber: true, donorName: true, phone: true } } },
    }),
    prisma.donationItem.groupBy({
      by: ["volunteerName"],
      _count: { _all: true },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
    }),
  ]);

  return (
    <main className="mx-auto min-h-dvh min-w-0 max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
        Volunteer entries
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Every garment logged through the /donation-entry mobile flow, and how much each volunteer
        has entered.
      </p>

      <section className="mt-6">
        <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3">
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">Volunteer entry link</p>
            <p className="truncate text-sm text-muted-foreground">/donation-entry</p>
          </div>
          <CopyLinkButton path="/donation-entry" />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Send this to volunteers. They enter their name and the code, then log garments against a
          donor -- everything they submit shows up below.
        </p>
      </section>

      {byVolunteer.length > 0 && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {byVolunteer.map((row) => (
            <div key={row.volunteerName} className="rounded-xl border border-border bg-card p-4">
              <p className="truncate font-medium text-foreground">{row.volunteerName}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {row._count._all} {row._count._all === 1 ? "entry" : "entries"} &middot;{" "}
                {row._sum.quantity ?? 0} items
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold text-foreground">All entries</h2>
        <p className="text-sm text-muted-foreground">
          {items.length} {items.length === 1 ? "entry" : "entries"}
        </p>
      </div>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          No entries yet. Once a volunteer logs an item at /donation-entry, it will show up here.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>Volunteer</TableHead>
                <TableHead>Donor ID</TableHead>
                <TableHead>Donor</TableHead>
                <TableHead>For</TableHead>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-muted-foreground">
                    {dateTimeFormatter.format(item.createdAt)}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{item.volunteerName}</TableCell>
                  <TableCell className="text-muted-foreground">#{item.donation.donorNumber}</TableCell>
                  <TableCell className="text-muted-foreground">{item.donation.donorName}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {GENDER_LABELS[item.gender as Gender]}
                    {item.ageCategory ? `, ${AGE_CATEGORY_LABELS[item.ageCategory as AgeCategory]}` : ""}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.garmentType}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    <form action={deleteVolunteerEntry}>
                      <input type="hidden" name="id" value={item.id} />
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
