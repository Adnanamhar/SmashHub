import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

// POST — Join event
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const userId = body.userId || "user_1";
    const eventId = Number(id);

    // Cek apakah event ada dan kuota tersedia
    const { data: event } = await supabase
      .from("Event")
      .select("*")
      .eq("id", eventId)
      .single();

    if (!event) {
      return NextResponse.json({ error: "Event tidak ditemukan" }, { status: 404 });
    }

    // Hitung peserta saat ini
    const { count } = await supabase
      .from("EventJoin")
      .select("*", { count: "exact", head: true })
      .eq("eventId", eventId);

    if ((count || 0) >= (event.quota || 12)) {
      return NextResponse.json({ error: "Kuota event sudah penuh!" }, { status: 409 });
    }

    // Cek apakah user sudah join
    const { data: existing } = await supabase
      .from("EventJoin")
      .select("id")
      .eq("eventId", eventId)
      .eq("userId", userId)
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json({ error: "Kamu sudah join event ini!" }, { status: 409 });
    }

    // Insert join
    const { data, error } = await supabase.from("EventJoin").insert([
      { eventId, userId },
    ]).select();

    if (error) throw error;
    return NextResponse.json(data?.[0] || {});
  } catch (error) {
    console.error("API ERROR (POST event join):", error);
    return NextResponse.json({ error: "Gagal join event" }, { status: 500 });
  }
}

// GET — Ambil daftar peserta event
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from("EventJoin")
      .select("*")
      .eq("eventId", Number(id))
      .order("joinedAt", { ascending: true });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error("API ERROR (GET event joins):", error);
    return NextResponse.json({ error: "Gagal ambil peserta" }, { status: 500 });
  }
}
