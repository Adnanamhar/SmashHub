import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

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
