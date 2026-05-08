"use client";

import { useState } from "react";

interface Props {
  debateId: string;
  hasStream: boolean;
}

interface CreatedStream {
  streamId: string;
  playbackId: string;
  streamKey: string;
  rtmpUrl: string;
}

/**
 * CreateStreamButton — admin-only control that POSTs to /api/admin/streams
 * to spin up a Mux live stream for a debate. On success, reveals the
 * RTMP URL + stream key for the operator to paste into OBS / studio
 * software. The stream key is shown ONCE — it's not persisted on the
 * debate. If lost, roll a new one in the Mux dashboard.
 */
export default function CreateStreamButton({ debateId, hasStream }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<CreatedStream | null>(null);

  if (hasStream && !created) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-emerald-200 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Stream ready
      </span>
    );
  }

  async function createStream() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/streams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ debateId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`);
      }
      setCreated(data as CreatedStream);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create stream");
    } finally {
      setSubmitting(false);
    }
  }

  if (created) {
    return <StreamCredsPanel data={created} onClose={() => setCreated(null)} />;
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={createStream}
        disabled={submitting}
        className="text-xs font-black uppercase tracking-widest text-white bg-brand-red hover:bg-red-700 disabled:opacity-50 px-3 py-2 rounded-md transition whitespace-nowrap"
      >
        {submitting ? "Creating…" : "Create stream"}
      </button>
      {error && (
        <p className="text-brand-red text-[10px] font-semibold max-w-[200px] text-right">
          {error}
        </p>
      )}
    </div>
  );
}

function StreamCredsPanel({
  data,
  onClose,
}: {
  data: CreatedStream;
  onClose: () => void;
}) {
  return (
    <div className="w-full mt-3 border border-amber-300 bg-amber-50 rounded-md p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-amber-900 text-[10px] font-black uppercase tracking-widest">
            Stream key — shown once
          </p>
          <p className="text-amber-800 text-xs mt-1">
            Copy these into OBS / studio software now. Once you dismiss
            this panel, the key is gone — roll a new one in the Mux
            dashboard if you need it again.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-xs font-black uppercase tracking-widest text-amber-900 hover:text-black px-2 py-1"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
      <div className="grid grid-cols-1 gap-2">
        <CopyRow label="RTMP URL" value={data.rtmpUrl} />
        <CopyRow label="Stream key" value={data.streamKey} mono />
        <CopyRow label="Playback ID" value={data.playbackId} mono />
      </div>
    </div>
  );
}

function CopyRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API can fail in some browsers — silently no-op.
    }
  }

  return (
    <div className="flex items-stretch border border-amber-200 rounded-md bg-white overflow-hidden">
      <div className="px-3 py-2 bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-widest flex items-center whitespace-nowrap">
        {label}
      </div>
      <div
        className={`flex-1 px-3 py-2 min-w-0 truncate text-zinc-900 text-xs ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </div>
      <button
        type="button"
        onClick={copy}
        className="px-3 text-[10px] font-black uppercase tracking-widest text-amber-900 hover:bg-amber-100 transition border-l border-amber-200"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
