import { prisma } from "@/lib/db";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminVolunteersPage() {
  const volunteers = await prisma.volunteer.findMany({
    orderBy: { volunteerNumber: "asc" },
    include: { _count: { select: { items: true } }, items: { select: { quantity: true } } },
  });

  return (
    <main className="mx-auto min-h-dvh min-w-0 max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">Volunteers</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        One row per person, matched by mobile number, across every garment they&apos;ve logged at
        /donation-entry.
      </p>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold text-foreground">All volunteers</h2>
        <p className="text-sm text-muted-foreground">
          {volunteers.length} {volunteers.length === 1 ? "volunteer" : "volunteers"}
        </p>
      </div>

      {volunteers.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          No volunteers yet. Once someone logs their first item at /donation-entry, they&apos;ll
          show up here.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Volunteer ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Mobile number</TableHead>
                <TableHead>Entries logged</TableHead>
                <TableHead className="text-right">Items logged</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {volunteers.map((volunteer) => (
                <TableRow key={volunteer.id}>
                  <TableCell className="text-muted-foreground">#{volunteer.volunteerNumber}</TableCell>
                  <TableCell className="font-medium text-foreground">{volunteer.name}</TableCell>
                  <TableCell className="text-muted-foreground">{volunteer.phone}</TableCell>
                  <TableCell className="text-muted-foreground">{volunteer._count.items}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {volunteer.items.reduce((sum, item) => sum + item.quantity, 0)}
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
