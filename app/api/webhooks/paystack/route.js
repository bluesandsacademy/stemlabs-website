import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendOrderConfirmation } from "@/lib/resend";

export async function POST(request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-paystack-signature");

    // Verify webhook signature
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(rawBody)
      .digest("hex");

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === "charge.success") {
      const { reference, metadata, amount } = event.data;
      const amountNGN = amount / 100;

      // Find the payment record
      const { data: payment } = await supabaseAdmin
        .from("order_payments")
        .select("id, preorder_id, payment_type")
        .eq("paystack_ref", reference)
        .single();

      if (!payment) {
        console.warn(`[paystack webhook] No payment record for ref: ${reference}`);
        return NextResponse.json({ received: true });
      }

      // Update payment record
      await supabaseAdmin
        .from("order_payments")
        .update({ paystack_status: "success", updated_at: new Date().toISOString() })
        .eq("id", payment.id);

      // Update preorder payment_status
      const newPaymentStatus =
        payment.payment_type === "deposit" ? "deposit_paid" : "fully_paid";

      const { data: preorder } = await supabaseAdmin
        .from("k12_preorders")
        .update({ payment_status: newPaymentStatus })
        .eq("id", payment.preorder_id)
        .select("full_name, email, selected_plan, device_count, payment_option")
        .single();

      // Send confirmation email
      if (preorder?.email) {
        await sendOrderConfirmation({
          to:          preorder.email,
          customerName: preorder.full_name,
          plan:        preorder.selected_plan === "family" ? "Smart Family STEM Pack" : "Smart Classroom Starter",
          deviceCount: preorder.device_count,
          amountPaid:  amountNGN,
          paymentType: payment.payment_type,
          orderId:     payment.preorder_id,
        }).catch((err) => console.error("[paystack webhook] Email error:", err));

        await supabaseAdmin.from("email_logs").insert({
          preorder_id: payment.preorder_id,
          recipient:   preorder.email,
          subject:     "Order Confirmed — Blue Sands K12 AR Pedia",
          email_type:  "order_confirmation",
          status:      "sent",
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[POST /api/webhooks/paystack]", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
