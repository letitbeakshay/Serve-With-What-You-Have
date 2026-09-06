"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/admin/(protected)/logout-action";

const NAV_ITEMS = [
  { href: "/admin", label: "Orphanage onboarding" },
  { href: "/admin/referrals", label: "Referrals" },
  { href: "/admin/other-interests", label: "Other Interests" },
  { href: "/admin/stories", label: "Stories" },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname.startsWith(href);
}

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <>
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className={cn(
            "rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
            isActive(pathname, item.href)
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          {item.label}
        </Link>
      ))}
    </>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop: persistent left sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-border bg-card px-3 py-6 sm:flex">
        <p className="px-3 font-heading text-lg font-semibold text-foreground">Admin</p>
        <nav className="mt-6 flex flex-col gap-1">
          <NavLinks pathname={pathname} />
        </nav>
        <form action={logoutAction} className="mt-auto pt-6">
          <Button type="submit" variant="outline" size="sm" className="w-full">
            Log out
          </Button>
        </form>
      </aside>

      {/* Mobile: horizontal nav bar, admin is used mostly on phone */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-border bg-card px-3 py-2 sm:hidden">
        <NavLinks pathname={pathname} />
        <form action={logoutAction} className="ml-auto shrink-0">
          <Button type="submit" variant="outline" size="sm">
            Log out
          </Button>
        </form>
      </div>
    </>
  );
}
