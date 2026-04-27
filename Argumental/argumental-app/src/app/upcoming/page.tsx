"use client";

import { useState } from "react";

function Field({ label, placeholder, type = "text" }: { label: string; placeholder: string; type?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full bg-white border border-zinc-300 rounded-lg px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition"
      />
    </div>
  );
}

export default function UpcomingPage() {
  const [topicSent, setTopicSent] = useState(false);
  const [nominateSent, setNominateSent] = useState(false);

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="border-b border-zinc-200 px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-yellow-600 text-xs uppercase tracking-widest font-semibold mb-2">Community</p>
          <h1 className="text-3xl font-black text-zinc-900">Upcoming</h1>
          <p className="text-zinc-500 text-sm mt-2">
            Shape the next debates — suggest a topic or nominate a debater.
          </p>
        </div>
      </div>

      {/* Forms */}
      <div className="flex-1 px-6 py-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* ── Topic form ── */}
          <div id="topic" className="bg-zinc-50 border border-zinc-200 rounded-2xl p-8 flex flex-col gap-6">
            <div>
              <span className="text-yellow-600 text-xs uppercase tracking-widest font-semibold">Debate Ideas</span>
              <h2 className="text-xl font-black text-zinc-900 mt-1">Suggest a Topic</h2>
              <p className="text-zinc-500 text-sm mt-1">Tell us what debate you want to see.</p>
            </div>

            <div className="flex flex-col gap-4">
              <Field label="Topic" placeholder="e.g. Should AI be regulated?" />
              <Field label="Reference Video" placeholder="https://youtube.com/..." type="url" />
              <Field label="Expert" placeholder="Who should argue this?" />
            </div>

            {topicSent ? (
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-green-700 text-sm font-semibold text-center">
                ✓ Topic submitted — thank you!
              </div>
            ) : (
              <button
                onClick={() => setTopicSent(true)}
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black text-sm uppercase tracking-widest py-3 rounded-xl transition"
              >
                Submit Topic
              </button>
            )}
          </div>

          {/* ── Nominate form ── */}
          <div id="nominate" className="bg-zinc-50 border border-zinc-200 rounded-2xl p-8 flex flex-col gap-6">
            <div>
              <span className="text-yellow-600 text-xs uppercase tracking-widest font-semibold">Debaters</span>
              <h2 className="text-xl font-black text-zinc-900 mt-1">Nominate a Debater</h2>
              <p className="text-zinc-500 text-sm mt-1">Know someone who should be on WordBattle?</p>
            </div>

            <div className="flex flex-col gap-4">
              <Field label="Name" placeholder="Full name" />
              <Field label="Expertise" placeholder="e.g. Economics, Climate Policy" />
              <Field label="Reference Video" placeholder="https://youtube.com/..." type="url" />
            </div>

            {nominateSent ? (
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-green-700 text-sm font-semibold text-center">
                ✓ Nomination submitted — thank you!
              </div>
            ) : (
              <button
                onClick={() => setNominateSent(true)}
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black text-sm uppercase tracking-widest py-3 rounded-xl transition"
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
