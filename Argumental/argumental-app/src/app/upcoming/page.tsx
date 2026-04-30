"use client";

import Link from "next/link";
import { useState } from "react";
import { UPCOMING_BOUTS, type UpcomingBout } from "@/lib/upcomingBouts";

function Field({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full bg-white border border-zinc-300 rounded-lg px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-zinc-200 transition"
      />
    </div>
  );
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })
    .format(d)
    .toUpperCase();
}

function fmtTime(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(d);
}

function BoutRow({ bout }: { bout: UpcomingBout }) {
  const filled = !!bout.topic;
  const date = fmtDate(bout.scheduledAt);
  const time = fmtTime(bout.scheduledAt);

  const ActionLink = () => {
    // Three states: scheduled (debateId) → View · topic only → Nominate · empty → Suggest
    if (filled && bout.debateId) {
      return (
        <Link
          href={`/debates/${bout.debateId}`}
          className="text-center bg-black hover:bg-zinc-800 text-white font-black text-[11px] md:text-xs uppercase tracking-widest px-3 py-1.5 md:py-2 rounded-md transition whitespace-nowrap"
        >
          View →
        </Link>
      );
    }
    const label = filled ? "Nominate →" : "Suggest →";
    const target = filled ? "#nominate" : "#topic";
    return (
      <Link
        href={target}
        className="text-center bg-white hover:bg-zinc-50 border border-zinc-300 hover:border-black text-zinc-800 font-black text-[11px] md:text-xs uppercase tracking-widest px-3 py-1.5 md:py-2 rounded-md transition whitespace-nowrap"
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="border border-zinc-200 rounded-md bg-white overflow-hidden md:grid md:grid-cols-12 md:items-stretch">
      {/* Mobile: compact header (date + action inline) */}
      <div className="md:hidden flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-3 py-2 gap-2">
        <div className="flex items-baseline gap-2 min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 tabular-nums">
            {date}
          </span>
          <span className="text-[11px] text-zinc-700 tabular-nums">
            {time}
          </span>
        </div>
        <ActionLink />
      </div>

      {/* Desktop: date strip column */}
      <div className="hidden md:flex md:col-span-3 md:flex-col md:justify-center border-r border-zinc-200 bg-zinc-50 px-4 py-3 gap-0.5">
        <div className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 tabular-nums">
          {date}
        </div>
        <div className="text-xs text-zinc-700 tabular-nums">{time}</div>
      </div>

      {/* Body — same on both layouts */}
      <div className="md:col-span-7 px-3 md:px-4 py-2.5 md:py-3 flex flex-col justify-center gap-1">
        {filled ? (
          <>
            <div className="text-zinc-900 font-bold text-sm md:text-base leading-snug">
              {bout.topic}
            </div>
            {bout.debaterA && bout.debaterB && (
              <div className="text-xs flex items-center gap-1.5 md:gap-2 flex-wrap">
                <span className="text-brand-red font-semibold">
                  {bout.debaterA.name}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-zinc-400">
                  {bout.debaterA.position}
                </span>
                <span className="text-zinc-400">vs</span>
                <span className="text-brand-blue font-semibold">
                  {bout.debaterB.name}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-zinc-400">
                  {bout.debaterB.position}
                </span>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="text-zinc-400 font-bold text-sm md:text-base leading-snug uppercase tracking-widest">
              Topic — TBD
            </div>
            <div className="text-[11px] md:text-xs text-zinc-500">
              Slot open. Suggest a topic or nominate the debaters.
            </div>
          </>
        )}
      </div>

      {/* Desktop: action column */}
      <div className="hidden md:flex md:col-span-2 border-l border-zinc-200 px-3 py-3 items-center justify-center">
        <ActionLink />
      </div>
    </div>
  );
}

export default function UpcomingPage() {
  const [topicSent, setTopicSent] = useState(false);
  const [nominateSent, setNominateSent] = useState(false);

  const now = Date.now();
  const future = UPCOMING_BOUTS.filter(
    (b) => new Date(b.scheduledAt).getTime() > now,
  );

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="border-b border-zinc-200 px-4 md:px-6 py-6 md:py-8">
        <div className="max-w-5xl mx-auto flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-black text-xs uppercase tracking-widest font-semibold mb-2">
              Schedule
            </p>
            <h1 className="text-3xl font-black text-zinc-900">
              Upcoming Bouts
            </h1>
            <p className="text-zinc-500 text-sm mt-2">
              Every Sunday at 8 PM ET. {future.length} bouts on the board.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="#topic"
              className="bg-white hover:bg-zinc-50 border border-zinc-300 hover:border-black text-zinc-800 font-black text-xs uppercase tracking-widest px-3 py-2 rounded-md transition"
            >
              Suggest topic
            </Link>
            <Link
              href="#nominate"
              className="bg-white hover:bg-zinc-50 border border-zinc-300 hover:border-black text-zinc-800 font-black text-xs uppercase tracking-widest px-3 py-2 rounded-md transition"
            >
              Nominate debater
            </Link>
          </div>
        </div>
      </div>

      {/* Bout list */}
      <div className="px-4 md:px-6 py-6 md:py-8">
        <div className="max-w-5xl mx-auto flex flex-col gap-2">
          {future.length === 0 ? (
            <div className="text-center text-zinc-500 py-12 border border-zinc-200 rounded-md bg-white">
              No upcoming bouts on the board.
            </div>
          ) : (
            future.map((b) => <BoutRow key={b.scheduledAt} bout={b} />)
          )}
        </div>
      </div>

      {/* Forms — kept below the list for the action buttons / hash links */}
      <div className="border-t border-zinc-200 px-4 md:px-6 py-8 md:py-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Topic */}
          <div
            id="topic"
            className="bg-white border border-zinc-200 rounded-md p-6 flex flex-col gap-5"
          >
            <div>
              <span className="text-black text-xs uppercase tracking-widest font-semibold">
                Debate Ideas
              </span>
              <h2 className="text-xl font-black text-zinc-900 mt-1">
                Suggest a Topic
              </h2>
              <p className="text-zinc-500 text-sm mt-1">
                Tell us what debate you want to see.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <Field
                label="Topic"
                placeholder="e.g. Should AI be regulated?"
              />
              <Field
                label="Reference Video"
                placeholder="https://youtube.com/..."
                type="url"
              />
              <Field label="Expert" placeholder="Who should argue this?" />
            </div>

            {topicSent ? (
              <div className="bg-green-50 border border-green-200 rounded-md px-4 py-3 text-green-700 text-sm font-semibold text-center">
                ✓ Topic submitted — thank you!
              </div>
            ) : (
              <button
                onClick={() => setTopicSent(true)}
                className="w-full bg-black hover:bg-zinc-800 text-white font-black text-sm uppercase tracking-widest py-3 rounded-md transition"
              >
                Submit Topic
              </button>
            )}
          </div>

          {/* Nominate */}
          <div
            id="nominate"
            className="bg-white border border-zinc-200 rounded-md p-6 flex flex-col gap-5"
          >
            <div>
              <span className="text-black text-xs uppercase tracking-widest font-semibold">
                Debaters
              </span>
              <h2 className="text-xl font-black text-zinc-900 mt-1">
                Nominate a Debater
              </h2>
              <p className="text-zinc-500 text-sm mt-1">
                Know someone who should argue on Argumental?
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <Field label="Name" placeholder="Full name" />
              <Field
                label="Expertise"
                placeholder="e.g. Economics, Climate Policy"
              />
              <Field
                label="Reference Video"
                placeholder="https://youtube.com/..."
                type="url"
              />
            </div>

            {nominateSent ? (
              <div className="bg-green-50 border border-green-200 rounded-md px-4 py-3 text-green-700 text-sm font-semibold text-center">
                ✓ Nomination submitted — thank you!
              </div>
            ) : (
              <button
                onClick={() => setNominateSent(true)}
                className="w-full bg-black hover:bg-zinc-800 text-white font-black text-sm uppercase tracking-widest py-3 rounded-md transition"
              >
                Submit Nomination
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
