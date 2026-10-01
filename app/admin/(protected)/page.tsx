import { ConfirmRemoveButton } from "@/components/admin/confirm-remove-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/db";
import { getOnboardingForm } from "@/lib/onboarding-form";
import { CopyLinkButton } from "./copy-link-button";
import { deleteOnboardingResponse } from "./actions";

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export default async function AdminHomePage() {
  const form = await getOnboardingForm();
  const responses = await prisma.simpleResponse.findMany({
    where: { formId: form.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto min-h-dvh min-w-0 max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
        Orphanage onboarding
      </h1>

      <section className="mt-6">
        <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3">
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">{form.name}</p>
            <p className="truncate text-sm text-muted-foreground">/f/{form.slug}</p>
          </div>
          <CopyLinkButton path={`/f/${form.slug}`} />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          One link. Share it with as many organisations as you like.
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
          No responses yet. Once organisations start filling in the form, they will show up here.
        </p>
      ) : (
        <div className="mt-4 rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Association</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>How they heard of us</TableHead>
                <TableHead>Received</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {responses.map((response) => (
                <TableRow key={response.id}>
                  <TableCell className="font-medium text-foreground">{response.orgName}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {response.contactName}
                    <span className="block text-xs">
                      {response.phoneCountryCode} {response.phone}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{response.location}</TableCell>
                  <TableCell className="max-w-64 text-muted-foreground">{response.referralSource}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {dateFormatter.format(response.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <ConfirmRemoveButton
                      action={deleteOnboardingResponse}
                      id={response.id}
                      confirmMessage={`Remove ${response.orgName}'s response? This can't be undone.`}
                    />
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
