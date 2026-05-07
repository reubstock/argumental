"use client";

import { useState } from "react";
import Panel from "@/components/Panel";
import {
  GLOBAL_RANKINGS,
  getChampion,
  getChallengers,
  type Ranked,
} from "@/lib/rankings";

type Scope = "global" | "local";
type Subject = "all" | "politics" | "religion" | "sports";

/** Loose subject → tag matcher. "Religion" pulls in "Faith" too. */
const SUBJECT_MATCHES: Record<Exclude<Subject, "all">, string[]> = {
  politics: ["Politics"],
  religion: ["Religion", "Faith"],
  sports: ["Sports"],
};

function rankedMatches(r: Ranked, subject: Subject): boolean {
  if (subject === "all") return true;
  const tags = SUBJECT_MATCHES[subject];
  return r.subjects.some((s) =>
    tags.some((t) => s.toLowerCase().includes(t.toLowerCase())),
  );
}

const SUBJECT_LABEL: Record<Subject, string> = {
  all: "All",
  politics: "Politics",
  religion: "Religion",
  sports: "Sports",
};

const SUBJECT_OPTIONS: Subject[] = ["all", "politics", "religion", "sports"];

/**
 * RankingsScope — twin toggles (GLOBAL / LOCAL · subject filter) for the
 * Rankings page.
 *
 * Default: scope = "global", subject = "all". When real local data lands
 * the local placeholder will swap in a regional list using the same filter.
 */
export default function RankingsScope() {
  const [scope, setScope] = useState<Scope>("global");
  const [subject, setSubject] = useState<Subject>("all");

  return (
    <div className="flex flex-col gap-5">
      {/* Toggles row */}
      <div className="flex flex-wrap gap-3 items-center">
        <SegmentedToggle
          label="Ranking scope"
          options={[
            { value: "global", label: "Global" },
            { value: "local", label: "Local" },
          ]}
          value={scope}
          onChange={(v) => setScope(v as Scope)}
        />
        <SegmentedToggle
          label="Subject filter"
          options={SUBJECT_OPTIONS.map((s) => ({
            value: s,
            label: SUBJECT_LABEL[s],
          }))}
          value={subject}
          onChange={(v) => setSubject(v as Subject)}
        />
      </div>

      {scope === "global" ? (
        <GlobalBoard subject={subject} />
      ) : (
        <LocalPlaceholder />
      )}
    </div>
  );
}

function GlobalBoard({ subject }: { subject: Subject }) {
  const champion = getChampion();
  const challengers = getChallengers();

  const champShown =
    champion && rankedMatches(champion, subject) ? champion : null;
  const challengersShown = challengers.filter((r) => rankedMatches(r, subject));

  const filtered = subject !== "all";
  const empty = !champShown && challengersShown.length === 0;

  if (empty) {
    return (
      <Panel>
        <div className="p-10 md:p-16 text-center flex flex-col items-center gap-2">
          <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">
            No matches
          </span>
          <p className="text-zinc-500 text-sm max-w-md">
            No ranked debater currently lists {SUBJECT_LABEL[subject]} as a
            subject. Try a different filter or browse all.
          </p>
        </div>
      </Panel>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {champShown && <ChampionCard r={champShown} />}
      {challengersShown.length > 0 && (
        <div className="flex flex-col">
          {challengersShown.map((r, i) => (
            <ChallengerRow
              key={r.rank}
              r={r}
              isFirst={i === 0}
              isLast={i === challengersShown.length - 1}
            />
          ))}
        </div>
      )}
      <p className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold mt-1">
        {filtered
          ? `${champShown ? challengersShown.length + 1 : challengersShown.length} debater${
              (champShown ? challengersShown.length + 1 : challengersShown.length) === 1
                ? ""
                : "s"
            } in ${SUBJECT_LABEL[subject]} · global ranks shown`
          : `Top ${GLOBAL_RANKINGS.length - 1} contenders shown · refreshed weekly`}
      </p>
    </div>
  );
}

function ChampionCard({ r }: { r: Ranked }) {
  return (
    <Panel className="overflow-hidden">
      <div className="p-4 md:p-5 flex items-center gap-3 md:gap-5">
        <Avatar name={r.name} photo={r.photo} side="A" size="lg" />
        <div className="flex-1 min-w-0">
          <p className="text-brand-red text-[10px] md:text-xs uppercase tracking-widest font-black mb-1">
            World Champion
          </p>
          <h2 className="text-zinc-900 font-black text-lg md:text-2xl leading-tight">
            {r.name}
          </h2>
          <p className="text-zinc-600 text-xs md:text-base mt-1">
            {r.subjects.join(" · ")}
          </p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/argumental-belt.png"
          alt="Argumental Tier 1 championship belt"
          className="h-14 sm:h-20 md:h-24 w-auto shrink-0"
          loading="lazy"
        />
      </div>
    </Panel>
  );
}

function ChallengerRow({
  r,
  isFirst,
  isLast,
}: {
  r: Ranked;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 md:gap-4 px-3 md:px-4 py-3 md:py-3.5 bg-white border border-zinc-200 ${
        isFirst ? "rounded-t-md" : "border-t-0"
      } ${isLast ? "rounded-b-md" : ""}`}
    >
      <span className="text-zinc-400 font-black tabular-nums text-base md:text-lg w-7 md:w-8 shrink-0 text-right">
        {String(r.rank).padStart(2, "0")}
      </span>
      <Avatar
        name={r.name}
        photo={r.photo}
        side={r.rank % 2 === 1 ? "A" : "B"}
        size="sm"
      />
      <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-baseline md:justify-between md:gap-4">
        <p className="text-zinc-900 font-bold text-sm md:text-base leading-snug">
          {r.name}
        </p>
        <p className="text-zinc-500 text-xs md:text-sm md:text-right">
          {r.subjects.join(" · ")}
        </p>
      </div>
    </div>
  );
}

function Avatar({
  name,
  photo,
  side,
  size,
}: {
  name: string;
  photo: string | null;
  side: "A" | "B";
  size: "sm" | "lg";
}) {
  const border = side === "A" ? "border-brand-red" : "border-brand-blue";
  const dim =
    size === "lg"
      ? "w-16 h-16 md:w-20 md:h-20"
      : "w-10 h-10 md:w-12 md:h-12";
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (photo) {
    return (
      <div
        className={`${dim} rounded-full overflow-hidden border-2 ${border} shrink-0`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo}
          alt={name}
          className="w-full h-full object-cover object-top"
        />
      </div>
    );
  }
  return (
    <div
      className={`${dim} rounded-full border-2 ${border} bg-zinc-50 flex items-center justify-center shrink-0`}
      aria-label={name}
    >
      <span className="text-zinc-700 font-black text-xs md:text-sm tracking-wider">
        {initials}
      </span>
    </div>
  );
}

function LocalPlaceholder() {
  return (
    <Panel>
      <div className="p-10 md:p-16 text-center flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#a1a1aa"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" y1="20" x2="20" y2="20" />
            <rect x="6" y="12" width="3" height="8" />
            <rect x="11" y="6" width="3" height="14" />
            <rect x="16" y="9" width="3" height="11" />
          </svg>
        </div>
        <p className="text-zinc-900 font-bold text-base md:text-lg">
          Top debaters in your region.
        </p>
        <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">
          Coming soon
        </span>
        <p className="text-zinc-500 text-sm max-w-md">
          Once the first regional bouts run, your local leaderboard populates
          here automatically — top 25 debaters in your region across every
          knowledge class.
        </p>
      </div>
    </Panel>
  );
}

function SegmentedToggle({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="inline-flex border border-zinc-300 rounded-md bg-white p-0.5"
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={`px-3 md:px-4 py-2 rounded-md text-[11px] font-black uppercase tracking-widest transition whitespace-nowrap ${
              active
                ? "bg-black text-white"
                : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
