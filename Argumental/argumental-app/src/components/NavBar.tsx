"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * NavBar — top bar with logo + wordmark.
 *
 * Mobile (< md): hamburger button on the right; tap to drop down a panel
 * with all nav links. Desktop (md+): inline links exactly as before.
 *
 * Lives in a client component so the menu can toggle locally without
 * hoisting state up into the (server) RootLayout.
 */
export default function NavBar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const desktopLink =
    "uppercase tracking-wide text-black hover:bg-zinc-100 transition rounded-md px-2 md:px-3 py-1 md:py-1.5 text-[11px] md:text-sm whitespace-nowrap";
  const mobileLink =
    "block px-4 py-3 uppercase tracking-wide text-sm font-medium text-zinc-900 hover:bg-zinc-50";

  return (
    <nav className="border-b border-zinc-200 px-3 md:px-6 py-2.5 md:py-4 relative">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        <Link
          href="/"
          onClick={close}
          className="flex items-center gap-2 md:gap-3 shrink-0"
        >
          <img
            src="/logo.png"
            alt="Argumental"
            className="h-8 md:h-12 w-auto"
          />
          <span className="text-base md:text-2xl font-black tracking-wide text-zinc-900">
            ARGUMENTAL
          </span>
        </Link>

        {/* Desktop nav — inline links (md+) */}
        <div className="hidden md:flex items-center font-medium">
          <Link href="/debates" className={desktopLink}>
            All Debates
          </Link>
          <Link href="/upcoming" className={desktopLink}>
            Upcoming
          </Link>
          <Link href="/charities" className={desktopLink}>
            Charities
          </Link>
          <Link href="/outcomes" className={desktopLink}>
            Outcomes
          </Link>
          <div className="w-px h-4 bg-zinc-200 mx-2" />
          <Link
            href="/deck"
            className="bg-black hover:bg-zinc-800 text-white font-black uppercase tracking-widest text-[11px] px-3 py-1.5 rounded-md transition whitespace-nowrap"
          >
            Deck
          </Link>
        </div>

        {/* Mobile — Deck button + hamburger */}
        <div className="flex items-center gap-1.5 md:hidden">
          <Link
            href="/deck"
            onClick={close}
            className="bg-black hover:bg-zinc-800 text-white font-black uppercase tracking-widest text-[11px] px-3 py-1.5 rounded-md transition whitespace-nowrap"
          >
            Deck
          </Link>
          <button
            onClick={() => setOpen((o) => !o)}
            className="p-2 -mr-1 text-zinc-900 hover:bg-zinc-100 rounded-md transition"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            {open ? (
              <>
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </>
            ) : (
              <>
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </>
            )}
          </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown panel */}
      {open && (
        <>
          {/* Click-outside backdrop */}
          <div
            className="md:hidden fixed inset-0 z-40"
            onClick={close}
            aria-hidden="true"
          />
          <div className="md:hidden absolute top-full left-0 right-0 z-50 bg-white border-b border-zinc-200 shadow-lg">
            <div className="flex flex-col py-1">
              <Link href="/debates" onClick={close} className={mobileLink}>
                All Debates
              </Link>
              <Link href="/upcoming" onClick={close} className={mobileLink}>
                Upcoming
              </Link>
              <Link href="/charities" onClick={close} className={mobileLink}>
                Charities
              </Link>
              <Link href="/outcomes" onClick={close} className={mobileLink}>
                Outcomes
              </Link>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
