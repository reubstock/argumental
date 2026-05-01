"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  onClose: () => void;
}

const initial = {
  name: "",
  url: "",
  focus: "",
  mission: "",
  metric: "",
  heroImage: "",
};

/**
 * AddCharityDialog — modal form that POSTs to /api/charities.
 *
 * On success, refreshes the route so the new entry appears in the grid.
 * Closes on backdrop click, Escape key, or Cancel button.
 */
export default function AddCharityDialog({ open, onClose }: Props) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when dialog re-opens
  useEffect(() => {
    if (open) {
      setForm(initial);
      setError(null);
      setSubmitting(false);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const update =
    (key: keyof typeof initial) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/charities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed (${res.status})`);
      }
      onClose();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-charity-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <form
        onSubmit={submit}
        className="relative bg-white border border-zinc-200 rounded-md w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-2.5 flex items-center justify-between">
          <span
            id="add-charity-title"
            className="text-[10px] font-bold uppercase tracking-widest text-zinc-500"
          >
            Add Charity
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-zinc-400 hover:text-zinc-700 transition"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          <Field label="Name" required>
            <input
              required
              value={form.name}
              onChange={update("name")}
              placeholder="e.g. Doctors Without Borders"
              className={inputCls}
            />
          </Field>

          <Field label="Homepage URL" required>
            <input
              required
              type="url"
              value={form.url}
              onChange={update("url")}
              placeholder="https://..."
              className={inputCls}
            />
          </Field>

          <Field label="Focus" required hint="Short tag — separate parts with ·">
            <input
              required
              value={form.focus}
              onChange={update("focus")}
              placeholder="Global health · Crisis response"
              className={inputCls}
            />
          </Field>

          <Field label="Mission" required hint="2–3 sentences from their About page">
            <textarea
              required
              rows={4}
              value={form.mission}
              onChange={update("mission")}
              placeholder="What the charity does and why it exists."
              className={`${inputCls} resize-none`}
            />
          </Field>

          <Field label="Metric" hint="Optional small footer line">
            <input
              value={form.metric}
              onChange={update("metric")}
              placeholder="Est. 1971"
              className={inputCls}
            />
          </Field>

          <Field label="Hero image URL" hint="Optional · 2:1 ratio looks best">
            <input
              type="url"
              value={form.heroImage}
              onChange={update("heroImage")}
              placeholder="https://example.org/hero.jpg"
              className={inputCls}
            />
          </Field>

          {error && (
            <p className="text-brand-red text-sm font-semibold">{error}</p>
          )}
        </div>

        <div className="border-t border-zinc-200 px-5 py-3 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-800 font-black uppercase tracking-widest text-[11px] px-3 py-2 rounded-md transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="bg-black hover:bg-zinc-800 disabled:opacity-50 text-white font-black uppercase tracking-widest text-[11px] px-3 py-2 rounded-md transition"
          >
            {submitting ? "Adding…" : "Add Charity"}
          </button>
        </div>
      </form>
    </div>
  );
}

/**
 * Drop-in trigger: a button that opens the dialog. Owns its own open state so
 * it can be embedded inside a server component (the dialog itself is client).
 */
export function AddCharityButton({
  className,
  label = "Add Charity",
}: {
  className?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ??
          "bg-black hover:bg-zinc-800 text-white font-black uppercase tracking-widest text-[11px] px-3 py-2 rounded-md transition"
        }
      >
        {label}
      </button>
      <AddCharityDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}

const inputCls =
  "w-full bg-white border border-zinc-300 rounded-md px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-zinc-200 transition";

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between gap-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          {label}
          {required && <span className="text-brand-red ml-1">*</span>}
        </label>
        {hint && (
          <span className="text-[10px] text-zinc-400">{hint}</span>
        )}
      </div>
      {children}
    </div>
  );
}
