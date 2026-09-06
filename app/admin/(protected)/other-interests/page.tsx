import { prisma } from "@/lib/db";
import { INTEREST_CATEGORY_LABELS, isInterestCategory } from "@/lib/field-config/interest";
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

export default async function AdminOtherInterestsPage() {
  const responses = await prisma.interestResponse.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="mx-auto min-h-dvh min-w-0 max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">Other Interests</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        People who showed interest in the ways to serve that aren&apos;t live yet (skills, time,
        knowing someone who needs help).
      </p>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold text-foreground">Responses</h2>
        <p className="text-sm text-muted-foreground">
          {responses.length} {responses.length === 1 ? "response" : "responses"}
        </p>
      </div>

      {responses.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          No interest shown yet. Once people click &quot;Show Interest&quot; on the homepage, they
          will show up here.
        </p>
      ) : (
        <div className="mt-4 rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Interested in</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Received</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {responses.map((response) => (
                <TableRow key={response.id}>
                  <TableCell className="font-medium text-foreground">{response.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {response.phone}
                    <span className="block text-xs">{response.email}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {isInterestCategory(response.category)
                      ? INTEREST_CATEGORY_LABELS[response.category]
                      : response.category}
                  </TableCell>
                  <TableCell className="max-w-64 text-muted-foreground">{response.message}</TableCell>
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
