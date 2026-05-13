import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

// PUT — Update lapangan berdasarkan ID
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { data, error } = await supabase
      .from("Court")
      .update({
        name: body.name,
        price: body.price,
        status: body.status || "Tersedia",
      })
      .eq("id", Number(id))
      .select();

    if (error) throw error;
    return NextResponse.json(data?.[0] || {});
  } catch (error) {
    console.error("API ERROR (PUT court):", error);
    return NextResponse.json({ error: "Gagal update data" }, { status: 500 });
  }
}

// DELETE — Hapus lapangan berdasarkan ID
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await supabase
      .from("Court")
      .delete()
      .eq("id", Number(id));

    if (error) throw error;
    return NextResponse.json({ message: "Lapangan berhasil dihapus" });
  } catch (error) {
    console.error("API ERROR (DELETE court):", error);
    return NextResponse.json({ error: "Gagal hapus data" }, { status: 500 });
  }
}

