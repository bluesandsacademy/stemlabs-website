"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Shield } from "lucide-react";

export default function CreateAdminPage() {
  const [form, setForm] = useState({ email: "", password: "", confirm: "", secret: "" });
  const [status, setStatus]   = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/dev/create-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-dev-secret": form.secret,
        },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setStatus("success");
      setMessage(`Admin created: ${data.user.email}`);
      setForm({ email: "", password: "", confirm: "", secret: "" });
    } catch (err) {
      setStatus("error");
      setMessage(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
          <div className="px-8 pt-8 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-1">
              <Shield className="w-5 h-5 text-primary" />
              <h1 className="font-black text-secondary text-xl">Create Admin</h1>
            </div>
            <p className="text-gray-400 text-sm">Blue Sands STEM Labs — Dev Tool</p>
          </div>

          <form onSubmit={submit} className="px-8 py-6 space-y-4">
            {["email","password","confirm","secret"].map((field) => (
              <div key={field}>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  {field === "confirm" ? "Confirm Password" : field === "secret" ? "Dev Secret" : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={field === "email" ? "email" : "password"}
                  value={form[field]}
                  onChange={(e) => set(field, e.target.value)}
                  required
                  placeholder={field === "secret" ? "Value of DEV_ADMIN_SECRET env var" : ""}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-sm"
                />
              </div>
            ))}

            {status === "error" && (
              <p className="text-rose-600 text-sm font-medium bg-rose-50 px-4 py-3 rounded-xl">{message}</p>
            )}

            {status === "success" && (
              <div className="flex items-center gap-2 text-emerald-700 text-sm font-medium bg-emerald-50 px-4 py-3 rounded-xl">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-3.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-secondary transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {status === "loading" ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating…</> : "Create Admin Account"}
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">This page is not linked anywhere. Keep the URL private.</p>
      </div>
    </div>
  );
}
