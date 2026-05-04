import Link from "next/link";

/**
 * Footer — small strip pinned to the bottom of every page. Houses the
 * low-priority links that used to clutter the nav (currently just the
 * operator Admin link).
 */
export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 mt-auto">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-4 flex-wrap text-[10px] font-bold uppercase tracking-widest text-zinc-400">
        <span>
          © {new Date().getFullYear()} Argumental
        </span>
        <Link
          href="/admin"
          className="hover:text-zinc-700 transition"
        >
          Admin
        </Link>
      </div>
    </footer>
  );
}
