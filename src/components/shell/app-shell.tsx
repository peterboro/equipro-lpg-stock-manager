"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Boxes,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  RefreshCcw,
  Truck,
  Users
} from "lucide-react";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/inventory", label: "Inventory", icon: Boxes },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/transactions", label: "Sales & Deliveries", icon: Truck },
  { href: "/returns-refills", label: "Returns & Refills", icon: RefreshCcw },
  { href: "/reports", label: "Reports", icon: BarChart3 }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(isSupabaseConfigured());
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) {
      setCheckingAuth(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setCheckingAuth(false);
      if (!data.session && pathname !== "/login") {
        router.replace("/login");
      }
      if (data.session && pathname === "/login") {
        router.replace("/");
      }
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session && pathname !== "/login") router.replace("/login");
      if (session && pathname === "/login") router.replace("/");
    });

    return () => data.subscription.unsubscribe();
  }, [pathname, router]);

  if (pathname === "/login") {
    return <div className="min-h-screen bg-paper text-ink">{children}</div>;
  }

  if (checkingAuth || (isSupabaseConfigured() && !user)) {
    return (
      <div className="grid min-h-screen place-items-center bg-paper text-ink">
        <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm font-semibold shadow-soft">Checking staff access...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-md bg-flame text-lg font-black text-white">E</div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Equipro Investments (K) Ltd</p>
                <h1 className="text-lg font-bold">LPG Stock Manager</h1>
              </div>
            </div>
          </div>
          <nav className="grid gap-1 p-4">
            {nav.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-ink",
                    active && "bg-petrol text-white hover:bg-petrol hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto border-t border-slate-200 p-4">
            <button
              className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"
              onClick={async () => {
                await supabase?.auth.signOut();
                router.replace("/login");
              }}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </aside>
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between">
          <Link href="/" className="font-bold">Equipro LPG</Link>
          <ClipboardList className="h-5 w-5 text-petrol" />
        </div>
        <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200",
                pathname === item.href && "bg-petrol text-white ring-petrol"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="lg:pl-72">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
