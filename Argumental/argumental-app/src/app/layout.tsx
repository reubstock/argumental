import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Argumental — The UFC of Ideas",
  description: "Live debates. Real stakes. Audience decides.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-zinc-900">
        <nav className="border-b border-zinc-200 px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Argumental"
              width={280}
              height={90}
              className="h-20 w-auto object-contain"
              priority
            />
          </Link>
          <div className="flex items-center gap-3 text-sm font-medium">
            <Link href="/debates" className="text-zinc-500 hover:text-zinc-900 transition px-3 py-1.5">Debates</Link>
            <Link href="/charities" className="bg-zinc-900 hover:bg-zinc-700 text-white px-4 py-1.5 rounded-lg transition">
              Charities Benefited
            </Link>
            <Link href="/outcomes" className="bg-zinc-900 hover:bg-zinc-700 text-white px-4 py-1.5 rounded-lg transition">
              Understanding Outcomes
            </Link>
            <Link href="/admin" className="text-zinc-400 hover:text-zinc-900 transition px-3 py-1.5">Admin</Link>
          </div>
        </nav>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
