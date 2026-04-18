import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const { data } = await supabaseAdmin
    .from("categories")
    .select("id, name, slug")
    .order("display_order", { ascending: true });
  return NextResponse.json(data || []);
}
