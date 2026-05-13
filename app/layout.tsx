import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SmashHub — Platform Penyewaan Lapangan Badminton Online",
  description:
    "Sewa lapangan badminton real-time, join event Mabar, dan kelola GOR Anda di satu platform. Booking cepat, aman, dan terpercaya.",
  keywords: [
    "sewa lapangan badminton",
    "booking badminton",
    "mabar badminton",
    "GOR online",
    "SmashHub",
  ],
  openGraph: {
    title: "SmashHub — Smash Like A Legend",
    description:
      "Platform penyewaan lapangan badminton tercanggih di Indonesia.",
    type: "website",
    url: "https://smash-hub-gamma.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
