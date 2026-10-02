import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, token, new_password } = await request.json();

    if (!email || !token || !new_password) {
      return NextResponse.json({ success: false, message: 'Semua field wajib diisi' }, { status: 400 });
    }

    if (new_password.length < 6) {
      return NextResponse.json({ success: false, message: 'Password baru minimal 6 karakter' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User tidak ditemukan' }, { status: 404 });
    }

    if (user.reset_token !== token) {
      return NextResponse.json({ success: false, message: 'Kode reset tidak valid' }, { status: 400 });
    }

    if (!user.reset_token_expiry || new Date() > user.reset_token_expiry) {
      return NextResponse.json({ success: false, message: 'Kode reset sudah expired' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);

    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        reset_token: null,
        reset_token_expiry: null
      }
    });

    return NextResponse.json({ success: true, message: 'Password berhasil direset' }, { status: 200 });
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
