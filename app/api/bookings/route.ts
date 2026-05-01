import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

// GET — Ambil bookings (filter by courtId & date optional)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const courtId = searchParams.get("courtId");
    const date = searchParams.get("date");

    let query = supabase.from("Booking").select("*").order("id", { ascending: true });

    if (courtId) query = query.eq("courtId", Number(courtId));
    if (date) query = query.eq("date", date);

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error("API ERROR (GET bookings):", error);
    return NextResponse.json({ error: "Gagal ambil data bookings" }, { status: 500 });
  }
}

// POST — Buat booking baru
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Cek apakah slot sudah dibooking
    const { data: existing } = await supabase
      .from("Booking")
      .select("id")
      .eq("courtId", body.courtId)
      .eq("date", body.date)
      .eq("time", body.time)
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json({ error: "Slot sudah dibooking!" }, { status: 409 });
    }

    const { data, error } = await supabase.from("Booking").insert([
      {
        courtId: body.courtId,
        date: body.date,
        time: body.time,
        userId: body.userId || "user_1",
        status: "confirmed",
      },
    ]).select();

    if (error) throw error;
    return NextResponse.json(data?.[0] || {});
  } catch (error) {
    console.error("API ERROR (POST bookings):", error);
    return NextResponse.json({ error: "Gagal booking" }, { status: 500 });
  }
}
