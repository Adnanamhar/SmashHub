import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { username, email, password, full_name, phone, role } = await request.json();

    // 1. Validasi input
    if (!username || username.length < 3 || username.length > 20 || !/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json({ success: false, message: 'Username tidak valid (3-20 karakter, alfanumerik/underscore)' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ success: false, message: 'Format email tidak valid' }, { status: 400 });
    }

    if (!password || password.length < 6 || password.length > 50) {
      return NextResponse.json({ success: false, message: 'Password minimal 6 karakter, maksimal 50' }, { status: 400 });
    }

    if (!full_name || full_name.trim() === '') {
      return NextResponse.json({ success: false, message: 'Nama lengkap wajib diisi' }, { status: 400 });
    }

    if (role !== 'user' && role !== 'owner') {
      return NextResponse.json({ success: false, message: 'Role tidak valid. Pilih "user" atau "owner"' }, { status: 400 });
    }

    // 2. Cek duplikat username atau email
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return NextResponse.json({ success: false, message: 'Username sudah digunakan' }, { status: 409 });
      }
      return NextResponse.json({ success: false, message: 'Email sudah terdaftar' }, { status: 409 });
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Simpan ke database
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        full_name: full_name.trim(),
        phone: phone || '',
        role
      }
    });

    return NextResponse.json({ success: true, message: `Registrasi sebagai ${role === 'owner' ? 'Owner Lapangan' : 'Player'} berhasil!` }, { status: 201 });
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
