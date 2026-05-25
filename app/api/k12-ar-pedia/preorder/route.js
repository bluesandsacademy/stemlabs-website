import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const NIGERIAN_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo",
  "Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa",
  "Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba",
  "Yobe","Zamfara",
];

const VALID_USER_TYPES    = ["individual", "school", "institution"];
const VALID_PAYMENT_OPT   = ["full", "installment", "discuss"];
const VALID_NEEDS         = ["ar_books", "teacher_training", "school_demo", "installation_support", "lms_access"];

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      user_type, full_name, school_org_name, email, phone, whatsapp,
      state, city, delivery_address, device_count, additional_needs,
      student_count, teacher_count, payment_option, agreed_to_contact,
    } = body;

    // ── Validation ───────────────────────────────────────────────────────────
    if (!user_type || !VALID_USER_TYPES.includes(user_type))
      return NextResponse.json({ error: "Invalid user type." }, { status: 400 });

    if (!full_name?.trim())
      return NextResponse.json({ error: "Full name is required." }, { status: 400 });

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });

    if (!phone?.trim())
      return NextResponse.json({ error: "Phone number is required." }, { status: 400 });

    if (!whatsapp?.trim())
      return NextResponse.json({ error: "WhatsApp number is required." }, { status: 400 });

    if (!state || !NIGERIAN_STATES.includes(state))
      return NextResponse.json({ error: "Please select a valid state." }, { status: 400 });

    const parsedDeviceCount = parseInt(device_count, 10);
    if (!parsedDeviceCount || parsedDeviceCount < 1)
      return NextResponse.json({ error: "At least 1 device is required." }, { status: 400 });

    if (!payment_option || !VALID_PAYMENT_OPT.includes(payment_option))
      return NextResponse.json({ error: "Please select a payment option." }, { status: 400 });

    if (!agreed_to_contact)
      return NextResponse.json({ error: "You must agree to be contacted." }, { status: 400 });

    const sanitizedNeeds = (additional_needs || []).filter((n) => VALID_NEEDS.includes(n));

    // ── Insert ────────────────────────────────────────────────────────────────
    const { data, error } = await supabaseAdmin
      .from("k12_preorders")
      .insert({
        user_type,
        full_name:          full_name.trim(),
        school_org_name:    school_org_name?.trim() || null,
        email:              email.trim().toLowerCase(),
        phone:              phone.trim(),
        whatsapp:           whatsapp.trim(),
        state,
        city:               city?.trim() || null,
        delivery_address:   delivery_address?.trim() || null,
        device_count:       parsedDeviceCount,
        additional_needs:   sanitizedNeeds,
        student_count:      student_count ? parseInt(student_count, 10) : null,
        teacher_count:      teacher_count ? parseInt(teacher_count, 10) : null,
        payment_option,
        agreed_to_contact:  Boolean(agreed_to_contact),
      })
      .select("id")
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      id: data.id,
      message: "Your preorder has been received! We will contact you shortly.",
    });
  } catch (err) {
    console.error("[POST /api/k12-ar-pedia/preorder]", err);
    return NextResponse.json(
      { error: err.message || "Submission failed. Please try again." },
      { status: 500 }
    );
  }
}
