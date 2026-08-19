import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/db";
import { ORG_TYPE_LABELS } from "@/lib/field-config/v1";
import { logoutAction } from "./logout-action";
import { createForm } from "./actions";
import { CopyLinkButton } from "./copy-link-button";
import type { ResponseStatus } from "@/lib/generated/prisma/client";

const STATUS_BADGE_CLASS: Record<ResponseStatus, string> = {
  NEW: "border-primary/30 bg-primary/10 text-primary",
  CONTACTED: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400",
  ACTIVE: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  PAUSED: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  DECLINED: "border-border bg-muted text-muted-foreground",
};

const STATUS_LABEL: Record<ResponseStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  ACTIVE: "Active",
  PAUSED: "Paused",
  DECLINED: "Declined",
};

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export default async function AdminHomePage() {
  const [forms, responses] = await Promise.all([
    prisma.form.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.response.findMany({
      orderBy: { createdAt: "desc" },
      include: { form: true },
    }),
  ]);

  return (
    <main className="mx-auto min-h-dvh min-w-0 max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">Admin</h1>
        <form action={logoutAction}>
          <Button type="submit" variant="outline" size="sm">
            Log out
          </Button>
        </form>
      </div>

      <section className="mt-6 space-y-2">
        {forms.length === 0 ? (
          <p className="text-sm text-muted-foreground">No forms yet. Create one below.</p>
        ) : (
          forms.map((form) => (
            <div
              key={form.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">{form.name}</p>
                <p className="truncate text-sm text-muted-foreground">/f/{form.slug}</p>
              </div>
              <CopyLinkButton path={`/f/${form.slug}`} />
            </div>
          ))
        )}

        <form action={createForm} className="flex gap-2 pt-1">
          <Input
            name="name"
            placeholder="New form name, e.g. Coimbatore Homes"
            required
            className="flex-1"
          />
          <Button type="submit" variant="outline">
            Create form
          </Button>
        </form>
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
                <TableHead>Organisation</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Received</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {responses.map((response) => (
                <TableRow key={response.id}>
                  <TableCell className="font-medium text-foreground">{response.orgName}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {ORG_TYPE_LABELS[response.orgType] ?? response.orgTypeOther ?? response.orgType}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {response.city}, {response.state}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {response.contactName}
                    <span className="block text-xs">
                      {response.phoneCountryCode} {response.phone}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={STATUS_BADGE_CLASS[response.status]}>
                      {STATUS_LABEL[response.status]}
                    </Badge>
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
