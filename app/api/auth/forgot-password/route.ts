import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ success: false, message: 'Format email tidak valid' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'Email tidak terdaftar' }, { status: 404 });
    }

    // Generate token
    const reset_token = Math.floor(100000 + Math.random() * 900000).toString();
    const reset_token_expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await prisma.user.update({
      where: { email },
      data: {
        reset_token,
        reset_token_expiry
      }
    });

    // Simulasi kirim email
    console.log(`[Email Tersimulasi] Ke: ${email} | Token: ${reset_token}`);

    return NextResponse.json({ success: true, message: 'Kode reset password telah dikirim ke email' }, { status: 200 });
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
