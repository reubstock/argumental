import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Argumental: Pick the Truth",
  description: "Live debates. Real stakes. Audience decides.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-zinc-900">
        <nav className="border-b border-zinc-200 px-4 md:px-6 py-3 md:py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
            <Link href="/" className="flex items-center gap-2 md:gap-3 shrink-0">
              <img
                src="/logo.png"
                alt=""
                aria-hidden="true"
                className="h-9 md:h-12 w-auto"
              />
              <span className="text-lg md:text-2xl font-black tracking-wide text-zinc-900">
                ARGUMENTAL
              </span>
            </Link>
            <div className="flex items-center font-medium overflow-x-auto">
              <Link href="/upcoming"  className="uppercase tracking-wide text-black hover:bg-zinc-100 transition rounded-lg px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm whitespace-nowrap">Upcoming</Link>
              <Link href="/debates"   className="uppercase tracking-wide text-black hover:bg-zinc-100 transition rounded-lg px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm whitespace-nowrap">Debates</Link>
              <Link href="/charities" className="hidden sm:block uppercase tracking-wide text-black hover:bg-zinc-100 transition rounded-lg px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm whitespace-nowrap">Charities</Link>
              <Link href="/outcomes"  className="hidden sm:block uppercase tracking-wide text-black hover:bg-zinc-100 transition rounded-lg px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm whitespace-nowrap">Outcomes</Link>
              <div className="hidden md:block w-px h-4 bg-zinc-200 mx-2" />
              <Link href="/admin" className="hidden md:block text-black hover:bg-zinc-100 transition rounded-lg px-3 py-1.5 text-xs">Admin</Link>
            </div>
          </div>
        </nav>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
