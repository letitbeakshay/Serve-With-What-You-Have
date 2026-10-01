import Link from "next/link";
import { prisma } from "@/lib/db";

function StatCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/50 sm:p-6"
    >
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-heading text-3xl font-semibold text-foreground">{value}</p>
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const [donorCount, itemsTotal, volunteerCount, orgResponseCount] = await Promise.all([
    prisma.donor.count(),
    prisma.donationItem.aggregate({ _sum: { quantity: true } }),
    prisma.volunteer.count(),
    prisma.simpleResponse.count(),
  ]);

  return (
    <main className="mx-auto min-h-dvh min-w-0 max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">Dashboard</h1>
      <p className="mt-2 text-sm text-muted-foreground">A quick look at where things stand.</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Donors" value={donorCount} href="/admin/donors" />
        <StatCard label="Clothes donated" value={itemsTotal._sum.quantity ?? 0} href="/admin/donations" />
        <StatCard label="Volunteers" value={volunteerCount} href="/admin/volunteers" />
        <StatCard label="Organisations onboarded" value={orgResponseCount} href="/admin" />
      </div>
    </main>
  );
}
