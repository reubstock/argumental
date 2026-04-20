import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Argumental — The UFC of Ideas",
  description: "Live debates. Real stakes. Audience decides.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-black text-white">
        <nav className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-yellow-400 font-black text-2xl tracking-tight">
            ARGUMENTAL
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium text-zinc-400">
            <Link href="/debates" className="hover:text-white transition">Debates</Link>
            <Link href="/admin" className="hover:text-white transition">Admin</Link>
          </div>
        </nav>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
