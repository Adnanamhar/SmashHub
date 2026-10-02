import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ success: false, message: 'Format email tidak valid' }, { status: 400 });
    }

    // Cari user berdasarkan email
    const { data: user, error } = await supabase
      .from('User')
      .select('id, email')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error('Forgot password query error:', error);
      return NextResponse.json({ success: false, message: 'Terjadi kesalahan server' }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json({ success: false, message: 'Email tidak terdaftar' }, { status: 404 });
    }

    // Generate token 6 digit
    const reset_token = Math.floor(100000 + Math.random() * 900000).toString();
    const reset_token_expiry = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 menit

    // Simpan token ke database
    const { error: updateError } = await supabase
      .from('User')
      .update({
        reset_token,
        reset_token_expiry
      })
      .eq('email', email);

    if (updateError) {
      console.error('Update token error:', updateError);
      return NextResponse.json({ success: false, message: 'Gagal membuat token reset' }, { status: 500 });
    }

    // Simulasi kirim email (log ke console)
    console.log(`[Email Tersimulasi] Ke: ${email} | Token: ${reset_token}`);

    return NextResponse.json({ success: true, message: 'Kode reset password telah dikirim ke email' }, { status: 200 });
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
