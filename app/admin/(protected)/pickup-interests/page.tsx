import { prisma } from "@/lib/db";
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
});

export default async function AdminPickupInterestsPage() {
  const responses = await prisma.pickupInterestResponse.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="mx-auto min-h-dvh min-w-0 max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">Pickup Interests</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        People who tapped &quot;Book a free pickup&quot; on the New Life to Old Clothes page and
        left their name and number before being sent to WhatsApp.
      </p>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold text-foreground">Responses</h2>
        <p className="text-sm text-muted-foreground">
          {responses.length} {responses.length === 1 ? "response" : "responses"}
        </p>
      </div>

      {responses.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          No one has booked a pickup yet. Once someone taps &quot;Book a free pickup&quot;, they
          will show up here.
        </p>
      ) : (
        <div className="mt-4 rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Received</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {responses.map((response) => (
                <TableRow key={response.id}>
                  <TableCell className="font-medium text-foreground">{response.name}</TableCell>
                  <TableCell className="text-muted-foreground">{response.phone}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {dateFormatter.format(response.createdAt)}
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
