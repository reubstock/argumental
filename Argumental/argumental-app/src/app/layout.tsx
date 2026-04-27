import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WordBattle — Combat Thinking for Peace",
  description: "Live debates. Real stakes. Audience decides.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-zinc-900">
        <nav className="border-b border-zinc-200 px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img
              src="/logo.svg"
              alt="Argumental"
              className="h-10 w-auto"
            />
          </Link>
          <div className="flex items-center text-sm font-medium">
            <Link href="/debates"   className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition rounded-lg px-3 py-1.5">Debates</Link>
            <Link href="/charities" className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition rounded-lg px-3 py-1.5">Charities</Link>
            <Link href="/outcomes"  className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition rounded-lg px-3 py-1.5">Outcomes</Link>
            <div className="w-px h-4 bg-zinc-200 mx-2" />
            <Link href="/admin" className="text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition rounded-lg px-3 py-1.5 text-xs">Admin</Link>
          </div>
        </nav>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
