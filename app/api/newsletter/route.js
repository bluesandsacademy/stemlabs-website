import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// ── POST /api/newsletter  — subscribe to the newsletter ─────────────────────
export async function POST(request) {
  try {
    const { email, name } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
    }

    // Upsert so re-subscribing an unsubscribed email re-activates it
    const { data, error } = await supabaseAdmin
      .from("newsletter_subscribers")
      .upsert(
        {
          email: email.trim().toLowerCase(),
          name: name?.trim() || null,
          status: "active",
        },
        { onConflict: "email" }
      )
      .select("id, status, confirmed")
      .single();

    if (error) throw error;

    // TODO: Send confirmation email via Resend / SendGrid / etc.
    // The confirmation_token is already in the DB row — pass it in the email link.

    return NextResponse.json({
      success: true,
      message: data.confirmed
        ? "You're already subscribed — welcome back!"
        : "Thanks for subscribing! Check your inbox to confirm.",
    });
  } catch (error) {
    console.error("[POST /api/newsletter]", error);
    return NextResponse.json(
      { error: error.message || "Subscription failed. Please try again." },
      { status: 500 }
    );
  }
}

// ── DELETE /api/newsletter?email=...  — unsubscribe ──────────────────────────
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });

  await supabaseAdmin
    .from("newsletter_subscribers")
    .update({ status: "unsubscribed", unsubscribed_at: new Date().toISOString() })
    .eq("email", email.toLowerCase());

  return NextResponse.json({ success: true, message: "Unsubscribed successfully." });
}
