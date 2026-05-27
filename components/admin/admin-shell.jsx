"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import {
  LayoutDashboard, ShoppingBag, Users2, FileText,
  LogOut, Menu, X, ChevronRight,
} from "lucide-react";

const NAV = [
  { href: "/admin",              label: "Dashboard",     Icon: LayoutDashboard },
  { href: "/admin/preorders",    label: "Preorders",     Icon: ShoppingBag },
  { href: "/admin/applications", label: "Applications",  Icon: Users2 },
  { href: "/admin/blog",         label: "Blog",          Icon: FileText },
];

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [open, setOpen]     = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // Don't render sidebar on login page
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (isLogin) return;
    const sb = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    sb.auth.getUser().then(({ data }) => {
      if (data?.user) setUserEmail(data.user.email);
    });
  }, [isLogin]);

  const signOut = async () => {
    const sb = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    await sb.auth.signOut();
    router.push("/admin/login");
  };

  if (isLogin) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ── Mobile overlay ── */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 flex flex-col z-40 transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:flex`}
        style={{ background: "#02345a" }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div>
            <p className="text-white font-black text-base leading-tight">Blue Sands</p>
            <p className="text-white/50 text-xs font-medium">STEM Labs Admin</p>
          </div>
          <button onClick={() => setOpen(false)} className="text-white/50 hover:text-white lg:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map(({ href, label, Icon }) => {
            const active = href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                  ${active
                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                    : "text-white/60 hover:text-white hover:bg-white/8"}`}
              >
                <Icon className="w-4.5 h-4.5 shrink-0" strokeWidth={active ? 2.5 : 2} />
                {label}
                {active && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
              {userEmail?.[0]?.toUpperCase() || "A"}
            </div>
            <p className="text-white/70 text-xs truncate flex-1">{userEmail || "Admin"}</p>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-white/50 hover:text-white hover:bg-white/8 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <header className="lg:hidden flex items-center gap-4 px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-20">
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg text-secondary hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <p className="font-bold text-secondary text-sm">Blue Sands Admin</p>
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
