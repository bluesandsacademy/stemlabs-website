"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

const STATUS_COLORS = {
  pending:  "bg-yellow-100 text-yellow-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
};

export default function ApplicationsClient({ initialApplications, total, page, limit, filters }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const [search,     setSearch]     = useState(filters.search);
  const [status,     setStatus]     = useState(filters.status);
  const [state,      setState]      = useState(filters.state);
  const [occupation, setOccupation] = useState(filters.occupation);

  const totalPages = Math.ceil(total / limit);

  function buildUrl(overrides = {}) {
    const params = new URLSearchParams();
    const merged = { q: search, status, state, occupation, page, ...overrides };
    for (const [k, v] of Object.entries(merged)) {
      if (v) params.set(k, v);
    }
    if (overrides.page === 1) params.delete("page");
    return `${pathname}?${params.toString()}`;
  }

  function applyFilters() {
    startTransition(() => router.push(buildUrl({ page: 1 })));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-secondary" style={{ fontFamily: "var(--font-jarkata)" }}>Applications</h1>
        <p className="text-gray-500 text-sm mt-1">{total} distribution officer application{total !== 1 ? "s" : ""}</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-48">
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                placeholder="Name, email…"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm bg-white">
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Occupation</label>
            <select value={occupation} onChange={(e) => setOccupation(e.target.value)}
              className="px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm bg-white">
              <option value="">All</option>
              {["educator","ict_professional","sales_professional","school_consultant","entrepreneur","other"].map((o) => (
                <option key={o} value={o}>{o.replace("_", " ")}</option>
              ))}
            </select>
          </div>
          <button onClick={applyFilters}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-secondary transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-3">Applicant</th>
                <th className="px-6 py-3">State</th>
                <th className="px-6 py-3">Occupation</th>
                <th className="px-6 py-3">School Network</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Applied</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {initialApplications.map((app) => (
                <tr key={app.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-secondary">{app.full_name}</p>
                    <p className="text-xs text-gray-400">{app.email}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{app.state}</td>
                  <td className="px-6 py-4 text-gray-600 capitalize">{app.occupation?.replace("_", " ")}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${app.has_school_connections ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                      {app.has_school_connections ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[app.status] || "bg-gray-100 text-gray-600"}`}>
                      {app.status || "pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs whitespace-nowrap">
                    {new Date(app.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/applications/${app.id}`}
                      className="inline-flex items-center gap-1 text-primary text-xs font-bold hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                      View <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
              {!initialApplications.length && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">No applications found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link href={buildUrl({ page: page - 1 })} className="flex items-center gap-1 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                  <ChevronLeft className="w-4 h-4" /> Prev
                </Link>
              )}
              {page < totalPages && (
                <Link href={buildUrl({ page: page + 1 })} className="flex items-center gap-1 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                  Next <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
