import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

// GET — Ambil semua events dengan jumlah peserta
export async function GET() {
  try {
    const { data: events, error } = await supabase
      .from("Event")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;

    // Hitung jumlah joined per event
    const eventsWithJoined = await Promise.all(
      (events || []).map(async (event) => {
        const { count } = await supabase
          .from("EventJoin")
          .select("*", { count: "exact", head: true })
          .eq("eventId", event.id);
        return { ...event, joined: count || 0 };
      })
    );

    return NextResponse.json(eventsWithJoined);
  } catch (error) {
    console.error("API ERROR (GET events):", error);
    return NextResponse.json({ error: "Gagal ambil data events" }, { status: 500 });
  }
}

// POST — Simpan event baru
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { data, error } = await supabase.from("Event").insert([
      {
        title: body.title,
        level: body.level || "Beginner",
        date: new Date().toISOString(),
        courtId: body.courtId || 1,
        time: body.time || "",
        quota: Number(body.quota) || 12,
        owner: "GOR SmashHub",
      },
    ]).select();

    if (error) throw error;
    return NextResponse.json(data?.[0] || {});
  } catch (error) {
    console.error("API ERROR (POST events):", error);
    return NextResponse.json({ error: "Gagal simpan event" }, { status: 500 });
  }
}
