import { prisma } from "@/lib/db";
import { getReferralForm } from "@/lib/referral-form";
import { CopyLinkButton } from "../copy-link-button";
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

export default async function AdminReferralsPage() {
  const form = await getReferralForm();
  const responses = await prisma.referralResponse.findMany({
    where: { formId: form.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto min-h-dvh min-w-0 max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">Referrals</h1>

      <section className="mt-6">
        <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3">
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">{form.name}</p>
            <p className="truncate text-sm text-muted-foreground">/f/{form.slug}</p>
          </div>
          <CopyLinkButton path={`/f/${form.slug}`} />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          One link for the &quot;Know a home? Share it with us&quot; form. Share it with as many people as you like.
        </p>
      </section>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold text-foreground">Responses</h2>
        <p className="text-sm text-muted-foreground">
          {responses.length} {responses.length === 1 ? "response" : "responses"}
        </p>
      </div>

      {responses.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          No referrals yet. Once people tell us about a home, they will show up here.
        </p>
      ) : (
        <div className="mt-4 rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Orphanage</TableHead>
                <TableHead>Contact number</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Referred by</TableHead>
                <TableHead>Received</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {responses.map((response) => (
                <TableRow key={response.id}>
                  <TableCell className="font-medium text-foreground">{response.orgName}</TableCell>
                  <TableCell className="text-muted-foreground">{response.orgPhone}</TableCell>
                  <TableCell className="text-muted-foreground">{response.location}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {response.referrerName ?? <span className="italic">Anonymous</span>}
                  </TableCell>
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
