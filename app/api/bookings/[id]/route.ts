import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

// DELETE — Batalkan booking berdasarkan ID
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await supabase
      .from("Booking")
      .delete()
      .eq("id", Number(id));

    if (error) throw error;
    return NextResponse.json({ message: "Booking berhasil dibatalkan" });
  } catch (error) {
    console.error("API ERROR (DELETE booking):", error);
    return NextResponse.json({ error: "Gagal membatalkan booking" }, { status: 500 });
  }
}
