import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

// GET — Ambil semua lapangan
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("Court")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error("API ERROR (GET courts):", error);
    return NextResponse.json({ error: "Gagal ambil data" }, { status: 500 });
  }
}

// POST — Simpan lapangan baru
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { data, error } = await supabase.from("Court").insert([
      {
        name: body.name,
        price: body.price,
        status: body.status || "Tersedia",
        ownerId: "owner_1",
      },
    ]).select();

    if (error) throw error;
    return NextResponse.json(data?.[0] || {});
  } catch (error) {
    console.error("API ERROR (POST courts):", error);
    return NextResponse.json({ error: "Gagal simpan data" }, { status: 500 });
  }
}