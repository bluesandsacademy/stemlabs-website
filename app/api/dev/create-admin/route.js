import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// Only available in development
export async function POST(request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    // Use admin API — creates user with email_confirmed = true, no confirmation email sent
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) throw error;

    return NextResponse.json({ success: true, user: { id: data.user.id, email: data.user.email } });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
