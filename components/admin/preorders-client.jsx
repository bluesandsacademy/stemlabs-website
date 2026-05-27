"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

const STATUS_COLORS = {
  pending:    "bg-yellow-100 text-yellow-700",
  confirmed:  "bg-blue-100 text-blue-700",
  processing: "bg-indigo-100 text-indigo-700",
  ready:      "bg-purple-100 text-purple-700",
  shipped:    "bg-cyan-100 text-cyan-700",
  delivered:  "bg-emerald-100 text-emerald-700",
  cancelled:  "bg-red-100 text-red-700",
};

const PAYMENT_COLORS = {
  unpaid:       "bg-gray-100 text-gray-600",
  deposit_paid: "bg-amber-100 text-amber-700",
  fully_paid:   "bg-emerald-100 text-emerald-700",
};

const PLAN_LABELS = { family: "Family Pack", school: "School Pack" };

export default function PreordersClient({ initialOrders, total, page, limit, filters }) {
  const router    = useRouter();
  const pathname  = usePathname();
  const [, startTransition] = useTransition();

  const [search,        setSearch]        = useState(filters.search);
  const [orderStatus,   setOrderStatus]   = useState(filters.orderStatus);
  const [paymentStatus, setPaymentStatus] = useState(filters.paymentStatus);

  const totalPages = Math.ceil(total / limit);

  function buildUrl(overrides = {}) {
    const params = new URLSearchParams();
    const merged = { q: search, order_status: orderStatus, payment_status: paymentStatus, page, ...overrides };
    for (const [k, v] of Object.entries(merged)) {
      if (v && v !== "1" || k === "page") params.set(k, v);
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
        <h1 className="text-2xl font-black text-secondary" style={{ fontFamily: "var(--font-jarkata)" }}>Preorders</h1>
        <p className="text-gray-500 text-sm mt-1">{total} total order{total !== 1 ? "s" : ""}</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-wrap gap-3 items-end">
          {/* Search */}
          <div className="flex-1 min-w-48">
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                placeholder="Name, email, phone…"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm"
              />
            </div>
          </div>

          {/* Order status */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Order Status</label>
            <select
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
              className="px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm bg-white"
            >
              <option value="">All statuses</option>
              {["pending","confirmed","processing","ready","shipped","delivered","cancelled"].map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Payment status */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Payment</label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm bg-white"
            >
              <option value="">All payments</option>
              <option value="unpaid">Unpaid</option>
              <option value="deposit_paid">Deposit Paid</option>
              <option value="fully_paid">Fully Paid</option>
            </select>
          </div>

          <button
            onClick={applyFilters}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-secondary transition-colors"
          >
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
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Plan</th>
                <th className="px-6 py-3">Devices</th>
                <th className="px-6 py-3">Payment Opt.</th>
                <th className="px-6 py-3">Order Status</th>
                <th className="px-6 py-3">Payment</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {initialOrders.map((order) => (
                <tr key={order.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-secondary">{order.full_name}</p>
                    <p className="text-xs text-gray-400">{order.email}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{PLAN_LABELS[order.selected_plan] || order.selected_plan || "—"}</td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{order.device_count}</td>
                  <td className="px-6 py-4 text-gray-600 capitalize">{order.payment_option}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[order.order_status] || "bg-gray-100 text-gray-600"}`}>
                      {order.order_status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${PAYMENT_COLORS[order.payment_status] || "bg-gray-100 text-gray-600"}`}>
                      {order.payment_status?.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 whitespace-nowrap text-xs">
                    {new Date(order.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/preorders/${order.id}`}
                      className="inline-flex items-center gap-1 text-primary text-xs font-bold hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      View <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
              {!initialOrders.length && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-400">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages} — {total} results
            </p>
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
