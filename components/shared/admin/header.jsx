"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { img } from "@/lib/cloudinary";

export default function AdminHeader({ title }) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="max-w-screen-2xl mx-auto flex items-center h-16 px-4 sm:px-6 lg:px-8 gap-4">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src={img("/logo.png")}
            alt="Blue Sands STEM Labs"
            width={120}
            height={36}
            className="h-8 w-auto"
          />
        </Link>

        {/* Divider */}
        <span className="hidden sm:block text-gray-200 text-xl font-thin select-none">|</span>

        {/* Page title */}
        <h1 className="text-sm sm:text-base font-semibold text-gray-700 flex-1 truncate">{title}</h1>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/"
            className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-gray-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
