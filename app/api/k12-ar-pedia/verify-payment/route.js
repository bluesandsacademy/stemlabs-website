import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { verifyTransaction } from "@/lib/paystack";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ref        = searchParams.get("ref");
  const preorderId = searchParams.get("preorder_id");

  if (!ref) return NextResponse.json({ success: false, error: "Missing reference" }, { status: 400 });

  try {
    const txData = await verifyTransaction(ref);

    if (txData.status !== "success") {
      return NextResponse.json({ success: false, error: "Payment not successful" });
    }

    // Update payment record if not already done (webhook may have beaten us here)
    const { data: payment } = await supabaseAdmin
      .from("order_payments")
      .select("id, payment_type, preorder_id")
      .eq("paystack_ref", ref)
      .single();

    if (payment && payment.paystack_status !== "success") {
      await supabaseAdmin
        .from("order_payments")
        .update({ paystack_status: "success", updated_at: new Date().toISOString() })
        .eq("id", payment.id);

      const newPaymentStatus = payment.payment_type === "deposit" ? "deposit_paid" : "fully_paid";
      await supabaseAdmin
        .from("k12_preorders")
        .update({ payment_status: newPaymentStatus })
        .eq("id", payment.preorder_id);
    }

    return NextResponse.json({
      success:      true,
      payment_type: payment?.payment_type ?? txData.metadata?.payment_type ?? "full",
    });
  } catch (err) {
    console.error("[GET /api/k12-ar-pedia/verify-payment]", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
