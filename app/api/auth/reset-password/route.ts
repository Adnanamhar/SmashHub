import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, token, new_password } = await request.json();

    if (!email || !token || !new_password) {
      return NextResponse.json({ success: false, message: 'Semua field wajib diisi' }, { status: 400 });
    }

    if (new_password.length < 6) {
      return NextResponse.json({ success: false, message: 'Password baru minimal 6 karakter' }, { status: 400 });
    }

    // Cari user berdasarkan email
    const { data: user, error } = await supabase
      .from('User')
      .select('id, reset_token, reset_token_expiry')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error('Reset password query error:', error);
      return NextResponse.json({ success: false, message: 'Terjadi kesalahan server' }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json({ success: false, message: 'User tidak ditemukan' }, { status: 404 });
    }

    // Validasi token
    if (user.reset_token !== token) {
      return NextResponse.json({ success: false, message: 'Kode reset tidak valid' }, { status: 400 });
    }

    // Validasi expiry
    if (!user.reset_token_expiry || new Date() > new Date(user.reset_token_expiry)) {
      return NextResponse.json({ success: false, message: 'Kode reset sudah expired' }, { status: 400 });
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(new_password, 10);

    // Update password dan hapus token
    const { error: updateError } = await supabase
      .from('User')
      .update({
        password: hashedPassword,
        reset_token: null,
        reset_token_expiry: null
      })
      .eq('email', email);

    if (updateError) {
      console.error('Update password error:', updateError);
      return NextResponse.json({ success: false, message: 'Gagal mereset password' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Password berhasil direset' }, { status: 200 });
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
