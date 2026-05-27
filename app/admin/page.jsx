import { supabaseAdmin } from "@/lib/supabase-admin";
import Link from "next/link";
import { ShoppingBag, Users2, CreditCard, Clock, TrendingUp, ArrowRight } from "lucide-react";

async function getStats() {
  const [
    { count: totalOrders },
    { count: pendingOrders },
    { count: depositPaid },
    { count: fullyPaid },
    { count: totalApplications },
    { count: pendingApplications },
    { data: recentOrders },
  ] = await Promise.all([
    supabaseAdmin.from("k12_preorders").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("k12_preorders").select("*", { count: "exact", head: true }).eq("order_status", "pending"),
    supabaseAdmin.from("k12_preorders").select("*", { count: "exact", head: true }).eq("payment_status", "deposit_paid"),
    supabaseAdmin.from("k12_preorders").select("*", { count: "exact", head: true }).eq("payment_status", "fully_paid"),
    supabaseAdmin.from("k12_distribution_applications").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("k12_distribution_applications").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabaseAdmin.from("k12_preorders").select("id,full_name,selected_plan,device_count,order_status,payment_status,created_at").order("created_at", { ascending: false }).limit(5),
  ]);

  return { totalOrders, pendingOrders, depositPaid, fullyPaid, totalApplications, pendingApplications, recentOrders };
}

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

export default async function AdminDashboard() {
  const stats = await getStats();

  const statCards = [
    { label: "Total Preorders",  value: stats.totalOrders ?? 0,        Icon: ShoppingBag,  color: "bg-blue-50 text-primary" },
    { label: "Pending Orders",   value: stats.pendingOrders ?? 0,       Icon: Clock,        color: "bg-yellow-50 text-yellow-600" },
    { label: "Deposit Paid",     value: stats.depositPaid ?? 0,         Icon: CreditCard,   color: "bg-amber-50 text-amber-600" },
    { label: "Fully Paid",       value: stats.fullyPaid ?? 0,           Icon: TrendingUp,   color: "bg-emerald-50 text-emerald-600" },
    { label: "Applications",     value: stats.totalApplications ?? 0,   Icon: Users2,       color: "bg-indigo-50 text-indigo-600" },
    { label: "Pending Review",   value: stats.pendingApplications ?? 0, Icon: Clock,        color: "bg-rose-50 text-rose-600" },
  ];

  return (
    <div className="space-y-8">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-black text-secondary" style={{ fontFamily: "var(--font-jarkata)" }}>
          Dashboard
        </h1>
        <p className="text-gray-500 text-sm mt-1">Overview of K12 AR Pedia operations</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map(({ label, value, Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5" strokeWidth={2} />
            </div>
            <p className="text-2xl font-black text-secondary">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5 leading-tight">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-secondary text-base">Recent Preorders</h2>
          <Link href="/admin/preorders" className="flex items-center gap-1 text-primary text-sm font-semibold hover:underline">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Plan</th>
                <th className="px-6 py-3">Devices</th>
                <th className="px-6 py-3">Order Status</th>
                <th className="px-6 py-3">Payment</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(stats.recentOrders || []).map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-secondary">{order.full_name}</td>
                  <td className="px-6 py-4 text-gray-600 capitalize">{order.selected_plan || "—"}</td>
                  <td className="px-6 py-4 text-gray-600">{order.device_count}</td>
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
                  <td className="px-6 py-4 text-gray-400 whitespace-nowrap">
                    {new Date(order.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/preorders/${order.id}`} className="text-primary text-xs font-semibold hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {!stats.recentOrders?.length && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-400 text-sm">
                    No preorders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
