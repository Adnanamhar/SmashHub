import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ success: false, message: 'Username dan password wajib diisi' }, { status: 400 });
    }

    // Cari user berdasarkan username
    const { data: user, error } = await supabase
      .from('User')
      .select('*')
      .eq('username', username)
      .maybeSingle();

    if (error) {
      console.error('Login query error:', error);
      return NextResponse.json({ success: false, message: 'Terjadi kesalahan server' }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json({ success: false, message: 'Username tidak ditemukan' }, { status: 404 });
    }

    // Bandingkan password dengan hash
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json({ success: false, message: 'Password salah' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      role: user.role,
      username: user.username,
      full_name: user.full_name,
      message: 'Login berhasil'
    }, { status: 200 });
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
