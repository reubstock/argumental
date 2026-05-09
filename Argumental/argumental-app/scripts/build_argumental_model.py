"""Build the Argumental investor financial model spreadsheet.

Reads inputs from ../src/lib/financialModelInputs.json (the same file the
TypeScript /deck and /model pages consume) and writes a 5-tab xlsx to
../public/argumental-financial-model.xlsx.

Run:
    python3 argumental-app/scripts/build_argumental_model.py

Tabs produced:
    1. Read Me            — orientation + how to use
    2. Assumptions        — knobs the investor can twist (rates, ramps, costs)
    3. Bouts & Audience   — viewer ramp, replay reach, votes
    4. P&L (3-Year)       — revenue, COGS, gross margin, opex, EBITDA
    5. Unit Economics     — per-bout contribution margin at three audience scales

All downstream numbers reference the Assumptions tab, so investors can
stress-test the case by changing one cell in Excel.
"""

from __future__ import annotations

import json
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.worksheet.worksheet import Worksheet

# ── Paths ─────────────────────────────────────────────────────────────────
HERE = Path(__file__).resolve().parent
APP_ROOT = HERE.parent
INPUTS_PATH = APP_ROOT / "src" / "lib" / "financialModelInputs.json"
OUT_PATH = APP_ROOT / "public" / "argumental-financial-model.xlsx"

# ── Read inputs ───────────────────────────────────────────────────────────
with INPUTS_PATH.open("r") as f:
    DATA = json.load(f)

A = DATA["audience"]
V = DATA["variableCosts"]
FX = DATA["fixedCosts"]
B = DATA["audienceBehavior"]

# ── Style ─────────────────────────────────────────────────────────────────
RED = "EB2C35"
BLUE = "1165C6"
INK = "18181B"
GREY = "71717A"
PALE = "F4F4F5"
PALE_BLUE = "EAF1FB"

THIN = Side(border_style="thin", color="E4E4E7")

H1 = Font(name="Helvetica Neue", size=22, bold=True, color=INK)
H2 = Font(name="Helvetica Neue", size=12, bold=True, color="FFFFFF")
KICKER = Font(name="Helvetica Neue", size=9, bold=True, color=GREY)
LABEL = Font(name="Helvetica Neue", size=11, bold=True, color=INK)
ROW = Font(name="Helvetica Neue", size=11, color=INK)
NOTE = Font(name="Helvetica Neue", size=9, italic=True, color=GREY)
INPUT = Font(name="Helvetica Neue", size=11, bold=True, color=BLUE)
CALC = Font(name="Helvetica Neue", size=11, color=INK)
TOTAL = Font(name="Helvetica Neue", size=11, bold=True, color=INK)

FILL_INPUT = PatternFill("solid", fgColor=PALE_BLUE)
FILL_TOTAL = PatternFill("solid", fgColor=PALE)


def section_header(ws, row, text, color=INK):
    ws.cell(row=row, column=1, value=text).font = H2
    ws.cell(row=row, column=1).fill = PatternFill("solid", fgColor=color)
    ws.cell(row=row, column=1).alignment = Alignment(
        horizontal="left", vertical="center", indent=1
    )
    ws.row_dimensions[row].height = 22
    last_col = ws.max_column or 6
    for c in range(2, last_col + 1):
        ws.cell(row=row, column=c).fill = PatternFill("solid", fgColor=color)


def kicker(ws, row, text):
    ws.cell(row=row, column=1, value=text).font = KICKER
    ws.cell(row=row, column=1).alignment = Alignment(horizontal="left")


def title(ws, row, text):
    ws.cell(row=row, column=1, value=text).font = H1
    ws.cell(row=row, column=1).alignment = Alignment(horizontal="left")
    ws.row_dimensions[row].height = 32


def labeled_row(ws, row, label, *, is_total=False):
    cell = ws.cell(row=row, column=1, value=label)
    cell.font = TOTAL if is_total else LABEL
    cell.alignment = Alignment(horizontal="left", indent=1, vertical="center")


def input_cell(ws, row, col, value, fmt=None):
    c = ws.cell(row=row, column=col, value=value)
    c.font = INPUT
    c.fill = FILL_INPUT
    c.alignment = Alignment(horizontal="right")
    if fmt:
        c.number_format = fmt
    c.border = Border(top=THIN, bottom=THIN, left=THIN, right=THIN)
    return c


def calc_cell(ws, row, col, value, fmt=None, *, total=False):
    c = ws.cell(row=row, column=col, value=value)
    c.font = TOTAL if total else CALC
    c.alignment = Alignment(horizontal="right")
    if fmt:
        c.number_format = fmt
    if total:
        c.fill = FILL_TOTAL
    return c


# ──────────────────────────────────────────────────────────────────────────
# Workbook
# ──────────────────────────────────────────────────────────────────────────

wb = Workbook()

# ── Tab 1 — Read Me ───────────────────────────────────────────────────────
ws = wb.active
ws.title = "Read Me"
ws.sheet_view.showGridLines = False
ws.column_dimensions["A"].width = 110

kicker(ws, 1, "ARGUMENTAL · INVESTOR MODEL · 3-YEAR")
title(ws, 2, "How this model works")

readme_lines = [
    "",
    "This workbook is the working financial model behind the Argumental seed deck.",
    "Inputs are loaded from src/lib/financialModelInputs.json — the same file that",
    "drives /deck and /model on the website. Edit the JSON, re-run the build",
    "script, and all three views stay in lockstep.",
    "",
    "Tabs",
    "  1. Read Me — this page.",
    "  2. Assumptions — every input the model uses, in one place. Cells with a",
    "     pale-blue fill are inputs; everything else is a formula.",
    "  3. Bouts & Audience — viewer ramp, replay reach, votes per year.",
    "  4. P&L (3-Year) — revenue, variable costs, gross margin, fixed opex,",
    "     EBITDA. Year-over-year columns plus a running 3-year total.",
    "  5. Unit Economics — contribution margin per bout at three audience scales.",
    "",
    "Conventions",
    "  · Pale-blue cells = inputs.  All other cells are formulas — don't overwrite.",
    "  · Red headers = revenue.  Blue headers = costs.  Black headers = totals.",
    "  · Bouts cadence is one per Sunday — 4 / month, 48 / year.",
    "  · All dollar figures are in USD.  Years labeled 2026 / 2027 / 2028.",
    "",
    "Year 1 stated goal",
    "  · 100,000 live viewers per bout by end of Year 1. The Y1 average of",
    "    30,000 reflects a back-weighted ramp toward that target.",
    "",
    "Reach assumption — the 41× multiplier",
    "  · Live + post-live replay = 41× total impressions per bout. Each",
    "    archived bout earns ~40× the live-viewer count over its first 24 hours",
    "    via clips, embeds, and on-demand replay. Replay viewers don't vote",
    "    (the bout is over) but they DO drive Mux delivery cost and sponsor",
    "    package value.  The model accounts for both.",
    "",
    "What this model is honest about",
    "  · Voting revenue is gated by live viewer reach, not by price.",
    "  · Mux delivery cost scales with viewers (live + replay); included as a",
    "    real per-bout COGS.",
    "  · Charity payout is 18% of gross voting revenue, accounted as COGS.",
    "  · Debater honorariums capped at $25K / bout (covers both debaters).",
    "",
    "What this model deliberately omits",
    "  · Sponsorship revenue. Title slots, category exclusives, and brand",
    "    integrations are real revenue lines for the league but treated as",
    "    upside here — the conservative case is voting revenue only.",
    "  · IP / licensing revenue (international territories, format licensing).",
    "  · On-demand archive monetization, white-label league, ticketing, merch.",
    "  · Working-capital and payment-processor float.",
    "  · Tax — model is pre-tax EBITDA only.",
]

for i, line in enumerate(readme_lines, start=3):
    cell = ws.cell(row=i, column=1, value=line)
    if line.endswith("Conventions") or line.endswith("Tabs") or line.startswith("What") \
       or line.startswith("Year 1") or line.startswith("Reach"):
        cell.font = LABEL
    else:
        cell.font = ROW

# ── Tab 2 — Assumptions ───────────────────────────────────────────────────
ws = wb.create_sheet("Assumptions")
ws.sheet_view.showGridLines = False
ws.column_dimensions["A"].width = 50
for col in "BCDE":
    ws.column_dimensions[col].width = 18

kicker(ws, 1, "INPUTS — EDIT THESE TO STRESS-TEST")
title(ws, 2, "Assumptions")

hdr_row = 4
ws.cell(row=hdr_row, column=1, value="Driver").font = H2
ws.cell(row=hdr_row, column=2, value="2026 (Y1)").font = H2
ws.cell(row=hdr_row, column=3, value="2027 (Y2)").font = H2
ws.cell(row=hdr_row, column=4, value="2028 (Y3)").font = H2
ws.cell(row=hdr_row, column=5, value="Notes").font = H2
for c in range(1, 6):
    ws.cell(row=hdr_row, column=c).fill = PatternFill("solid", fgColor=INK)
    ws.cell(row=hdr_row, column=c).alignment = Alignment(
        horizontal="left", vertical="center", indent=1
    )
ws.row_dimensions[hdr_row].height = 22


def write_input_block(ws, header_text, header_row, header_color, rows):
    """Write a section header + a list of input rows.

    `rows` is a list of dicts: {row, label, values: [y1,y2,y3], fmt, note}.
    """
    section_header(ws, header_row, header_text, color=header_color)
    for r in rows:
        labeled_row(ws, r["row"], r["label"])
        input_cell(ws, r["row"], 2, r["values"][0], r["fmt"])
        input_cell(ws, r["row"], 3, r["values"][1], r["fmt"])
        input_cell(ws, r["row"], 4, r["values"][2], r["fmt"])
        ws.cell(row=r["row"], column=5, value=r["note"]).font = NOTE


# AUDIENCE & ENGAGEMENT
write_input_block(
    ws, "AUDIENCE & ENGAGEMENT", 6, INK,
    [
        {"row": 7, "label": "Bouts per year",
         "values": A["boutsPerYear"], "fmt": "#,##0", "note": "1 / Sunday"},
        {"row": 8, "label": "Avg concurrent live viewers / bout",
         "values": A["liveViewers"], "fmt": "#,##0",
         "note": "Y1 ramp targets 100K EOY"},
        {"row": 9, "label": "% of viewers who vote",
         "values": A["voterConversion"], "fmt": "0.0%",
         "note": "Single $5 vote"},
        {"row": 10, "label": "Avg vote price (USD)",
         "values": A["votePrice"], "fmt": '"$"#,##0', "note": "Fixed"},
    ],
)

# VARIABLE COSTS
# (rows 12-15 intentionally left blank — sponsorship was here, now upside)
write_input_block(
    ws, "VARIABLE COSTS  ·  PER BOUT", 16, INK,
    [
        {"row": 17, "label": "Mux delivery $/viewer-hour",
         "values": V["muxDeliveryRate"], "fmt": '"$"#,##0.00',
         "note": "Negotiated at scale"},
        {"row": 18, "label": "Mux ingest $/bout (2 streams)",
         "values": V["muxIngestPerBout"], "fmt": '"$"#,##0',
         "note": "24m × 2 streams"},
        {"row": 19, "label": "Stripe rate (% of vote rev)",
         "values": V["stripePct"], "fmt": "0.0%", "note": "+ $0.30/vote"},
        {"row": 20, "label": "Stripe per-vote fee",
         "values": V["stripePerVote"], "fmt": '"$"0.00', "note": "Flat"},
        {"row": 21, "label": "Charity payout (% of vote rev)",
         "values": V["charityPct"], "fmt": "0%",
         "note": "18% donor model"},
        {"row": 22, "label": "Debater honorarium / bout",
         "values": V["honorariumPerBout"], "fmt": '"$"#,##0',
         "note": "Capped at $25K (both)"},
        {"row": 23, "label": "Production / bout",
         "values": V["productionPerBout"], "fmt": '"$"#,##0',
         "note": "Studio + crew"},
    ],
)

# FIXED COSTS
write_input_block(
    ws, "FIXED COSTS  ·  PER YEAR", 25, INK,
    [
        {"row": 26, "label": "Headcount (FTE)",
         "values": FX["headcount"], "fmt": "#,##0",
         "note": "Avg loaded $180K"},
        {"row": 27, "label": "Loaded cost per FTE",
         "values": FX["loadedCostPerFTE"], "fmt": '"$"#,##0',
         "note": "Salary + benefits"},
        {"row": 28, "label": "Paid search & acquisition",
         "values": FX["paidSearch"], "fmt": '"$"#,##0',
         "note": "$10K/mo Y1"},
        {"row": 29, "label": "Brand & creator marketing",
         "values": FX["brandMarketing"], "fmt": '"$"#,##0',
         "note": "Sponsored clips"},
        {"row": 30, "label": "G&A, tooling, infra",
         "values": FX["gAndA"], "fmt": '"$"#,##0',
         "note": "Office, software"},
        {"row": 31, "label": "Legal, accounting, insurance",
         "values": FX["legalAccounting"], "fmt": '"$"#,##0',
         "note": "Outside counsel"},
    ],
)

# AUDIENCE BEHAVIOR
write_input_block(
    ws, "AUDIENCE BEHAVIOR", 33, INK,
    [
        {"row": 34, "label": "Avg minutes watched / live viewer",
         "values": B["avgLiveMins"], "fmt": "#,##0",
         "note": "Drives live Mux delivery cost"},
        {"row": 35, "label": "Post-live replay multiplier",
         "values": B["replayMultiplier"], "fmt": '#,##0"x"',
         "note": "Replay views = live × this"},
        {"row": 36, "label": "Avg minutes watched / replay viewer",
         "values": B["avgReplayMins"], "fmt": "#,##0",
         "note": "Highlights & clips"},
    ],
)

# ── Tab 3 — Bouts & Audience ──────────────────────────────────────────────
ws = wb.create_sheet("Bouts & Audience")
ws.sheet_view.showGridLines = False
ws.column_dimensions["A"].width = 32
for col in "BCDE":
    ws.column_dimensions[col].width = 20

kicker(ws, 1, "VOLUME")
title(ws, 2, "Bouts and viewers, by year")

hdr = 4
ws.cell(row=hdr, column=1, value="Metric").font = H2
ws.cell(row=hdr, column=2, value="2026").font = H2
ws.cell(row=hdr, column=3, value="2027").font = H2
ws.cell(row=hdr, column=4, value="2028").font = H2
ws.cell(row=hdr, column=5, value="3-Yr Total").font = H2
for c in range(1, 6):
    ws.cell(row=hdr, column=c).fill = PatternFill("solid", fgColor=INK)
    ws.cell(row=hdr, column=c).alignment = Alignment(
        horizontal="left" if c == 1 else "right",
        vertical="center",
        indent=1 if c == 1 else 0,
    )
ws.row_dimensions[hdr].height = 22

labeled_row(ws, 6, "Bouts per year")
calc_cell(ws, 6, 2, "=Assumptions!B7", "#,##0")
calc_cell(ws, 6, 3, "=Assumptions!C7", "#,##0")
calc_cell(ws, 6, 4, "=Assumptions!D7", "#,##0")
calc_cell(ws, 6, 5, "=SUM(B6:D6)", "#,##0", total=True)

labeled_row(ws, 7, "Avg concurrent viewers / bout")
calc_cell(ws, 7, 2, "=Assumptions!B8", "#,##0")
calc_cell(ws, 7, 3, "=Assumptions!C8", "#,##0")
calc_cell(ws, 7, 4, "=Assumptions!D8", "#,##0")

labeled_row(ws, 8, "Annual viewer-bouts")
calc_cell(ws, 8, 2, "=B6*B7", "#,##0")
calc_cell(ws, 8, 3, "=C6*C7", "#,##0")
calc_cell(ws, 8, 4, "=D6*D7", "#,##0")
calc_cell(ws, 8, 5, "=SUM(B8:D8)", "#,##0", total=True)

labeled_row(ws, 9, "Voter conversion rate")
calc_cell(ws, 9, 2, "=Assumptions!B9", "0.0%")
calc_cell(ws, 9, 3, "=Assumptions!C9", "0.0%")
calc_cell(ws, 9, 4, "=Assumptions!D9", "0.0%")

labeled_row(ws, 10, "Votes per bout")
calc_cell(ws, 10, 2, "=B7*B9", "#,##0")
calc_cell(ws, 10, 3, "=C7*C9", "#,##0")
calc_cell(ws, 10, 4, "=D7*D9", "#,##0")

labeled_row(ws, 11, "Annual votes", is_total=True)
calc_cell(ws, 11, 2, "=B6*B10", "#,##0", total=True)
calc_cell(ws, 11, 3, "=C6*C10", "#,##0", total=True)
calc_cell(ws, 11, 4, "=D6*D10", "#,##0", total=True)
calc_cell(ws, 11, 5, "=SUM(B11:D11)", "#,##0", total=True)

labeled_row(ws, 13, "Avg minutes watched / live viewer")
calc_cell(ws, 13, 2, "=Assumptions!B34", "#,##0")
calc_cell(ws, 13, 3, "=Assumptions!C34", "#,##0")
calc_cell(ws, 13, 4, "=Assumptions!D34", "#,##0")

labeled_row(ws, 14, "Annual viewer-hours delivered (Mux)", is_total=True)
calc_cell(ws, 14, 2,
          "=B8*(B13+Assumptions!B35*Assumptions!B36)/60",
          "#,##0", total=True)
calc_cell(ws, 14, 3,
          "=C8*(C13+Assumptions!C35*Assumptions!C36)/60",
          "#,##0", total=True)
calc_cell(ws, 14, 4,
          "=D8*(D13+Assumptions!D35*Assumptions!D36)/60",
          "#,##0", total=True)
calc_cell(ws, 14, 5, "=SUM(B14:D14)", "#,##0", total=True)

section_header(ws, 16, "REACH BEYOND LIVE", color=BLUE)

labeled_row(ws, 17, "Post-live replay multiplier")
calc_cell(ws, 17, 2, "=Assumptions!B35", '#,##0"x"')
calc_cell(ws, 17, 3, "=Assumptions!C35", '#,##0"x"')
calc_cell(ws, 17, 4, "=Assumptions!D35", '#,##0"x"')

labeled_row(ws, 18, "Replay viewers / bout")
calc_cell(ws, 18, 2, "=B7*B17", "#,##0")
calc_cell(ws, 18, 3, "=C7*C17", "#,##0")
calc_cell(ws, 18, 4, "=D7*D17", "#,##0")

labeled_row(ws, 19, "Total reach / bout (live + replay)")
calc_cell(ws, 19, 2, "=B7+B18", "#,##0")
calc_cell(ws, 19, 3, "=C7+C18", "#,##0")
calc_cell(ws, 19, 4, "=D7+D18", "#,##0")

labeled_row(ws, 20, "Annual total impressions", is_total=True)
calc_cell(ws, 20, 2, "=B6*B19", "#,##0", total=True)
calc_cell(ws, 20, 3, "=C6*C19", "#,##0", total=True)
calc_cell(ws, 20, 4, "=D6*D19", "#,##0", total=True)
calc_cell(ws, 20, 5, "=SUM(B20:D20)", "#,##0", total=True)

# ── Tab 4 — P&L (3-Year) ──────────────────────────────────────────────────
ws = wb.create_sheet("P&L (3-Year)")
ws.sheet_view.showGridLines = False
ws.column_dimensions["A"].width = 38
for col in "BCDE":
    ws.column_dimensions[col].width = 18

kicker(ws, 1, "REVENUE  ·  VARIABLE COSTS  ·  GROSS MARGIN  ·  OPEX  ·  EBITDA")
title(ws, 2, "P&L — 3-Year View")

hdr = 4
ws.cell(row=hdr, column=1, value="").font = H2
ws.cell(row=hdr, column=2, value="2026").font = H2
ws.cell(row=hdr, column=3, value="2027").font = H2
ws.cell(row=hdr, column=4, value="2028").font = H2
ws.cell(row=hdr, column=5, value="3-Yr Total").font = H2
for c in range(1, 6):
    ws.cell(row=hdr, column=c).fill = PatternFill("solid", fgColor=INK)
    ws.cell(row=hdr, column=c).alignment = Alignment(
        horizontal="left" if c == 1 else "right",
        vertical="center",
        indent=1 if c == 1 else 0,
    )
ws.row_dimensions[hdr].height = 22

USD = '"$"#,##0;[Red]("$"#,##0)'
PCT = "0.0%"

section_header(ws, 6, "REVENUE", color=RED)

labeled_row(ws, 7, "Voting revenue")
calc_cell(ws, 7, 2, "='Bouts & Audience'!B11*Assumptions!B10", USD)
calc_cell(ws, 7, 3, "='Bouts & Audience'!C11*Assumptions!C10", USD)
calc_cell(ws, 7, 4, "='Bouts & Audience'!D11*Assumptions!D10", USD)
calc_cell(ws, 7, 5, "=SUM(B7:D7)", USD)

# Sponsor revenue intentionally omitted — treated as upside, not modeled.

labeled_row(ws, 9, "Total revenue", is_total=True)
calc_cell(ws, 9, 2, "=B7", USD, total=True)
calc_cell(ws, 9, 3, "=C7", USD, total=True)
calc_cell(ws, 9, 4, "=D7", USD, total=True)
calc_cell(ws, 9, 5, "=SUM(B9:D9)", USD, total=True)

section_header(ws, 11, "VARIABLE COSTS  ·  COGS", color=BLUE)

labeled_row(ws, 12, "Mux delivery (CDN)")
calc_cell(ws, 12, 2, "='Bouts & Audience'!B14*Assumptions!B17", USD)
calc_cell(ws, 12, 3, "='Bouts & Audience'!C14*Assumptions!C17", USD)
calc_cell(ws, 12, 4, "='Bouts & Audience'!D14*Assumptions!D17", USD)

labeled_row(ws, 13, "Mux ingest")
calc_cell(ws, 13, 2, "=Assumptions!B7*Assumptions!B18", USD)
calc_cell(ws, 13, 3, "=Assumptions!C7*Assumptions!C18", USD)
calc_cell(ws, 13, 4, "=Assumptions!D7*Assumptions!D18", USD)

labeled_row(ws, 14, "Stripe processing")
calc_cell(ws, 14, 2,
          "=B7*Assumptions!B19+'Bouts & Audience'!B11*Assumptions!B20", USD)
calc_cell(ws, 14, 3,
          "=C7*Assumptions!C19+'Bouts & Audience'!C11*Assumptions!C20", USD)
calc_cell(ws, 14, 4,
          "=D7*Assumptions!D19+'Bouts & Audience'!D11*Assumptions!D20", USD)

labeled_row(ws, 15, "Charity payout (18% of vote rev)")
calc_cell(ws, 15, 2, "=B7*Assumptions!B21", USD)
calc_cell(ws, 15, 3, "=C7*Assumptions!C21", USD)
calc_cell(ws, 15, 4, "=D7*Assumptions!D21", USD)

labeled_row(ws, 16, "Debater honorariums")
calc_cell(ws, 16, 2, "=Assumptions!B7*Assumptions!B22", USD)
calc_cell(ws, 16, 3, "=Assumptions!C7*Assumptions!C22", USD)
calc_cell(ws, 16, 4, "=Assumptions!D7*Assumptions!D22", USD)

labeled_row(ws, 17, "Production")
calc_cell(ws, 17, 2, "=Assumptions!B7*Assumptions!B23", USD)
calc_cell(ws, 17, 3, "=Assumptions!C7*Assumptions!C23", USD)
calc_cell(ws, 17, 4, "=Assumptions!D7*Assumptions!D23", USD)

labeled_row(ws, 18, "Total variable cost", is_total=True)
calc_cell(ws, 18, 2, "=SUM(B12:B17)", USD, total=True)
calc_cell(ws, 18, 3, "=SUM(C12:C17)", USD, total=True)
calc_cell(ws, 18, 4, "=SUM(D12:D17)", USD, total=True)
calc_cell(ws, 18, 5, "=SUM(B18:D18)", USD, total=True)

section_header(ws, 20, "GROSS MARGIN", color=INK)

labeled_row(ws, 21, "Gross profit", is_total=True)
calc_cell(ws, 21, 2, "=B9-B18", USD, total=True)
calc_cell(ws, 21, 3, "=C9-C18", USD, total=True)
calc_cell(ws, 21, 4, "=D9-D18", USD, total=True)
calc_cell(ws, 21, 5, "=SUM(B21:D21)", USD, total=True)

labeled_row(ws, 22, "Gross margin %")
calc_cell(ws, 22, 2, "=IFERROR(B21/B9,0)", PCT)
calc_cell(ws, 22, 3, "=IFERROR(C21/C9,0)", PCT)
calc_cell(ws, 22, 4, "=IFERROR(D21/D9,0)", PCT)

section_header(ws, 24, "FIXED OPEX", color=BLUE)

labeled_row(ws, 25, "Headcount cost")
calc_cell(ws, 25, 2, "=Assumptions!B26*Assumptions!B27", USD)
calc_cell(ws, 25, 3, "=Assumptions!C26*Assumptions!C27", USD)
calc_cell(ws, 25, 4, "=Assumptions!D26*Assumptions!D27", USD)

labeled_row(ws, 26, "Paid search & acquisition")
calc_cell(ws, 26, 2, "=Assumptions!B28", USD)
calc_cell(ws, 26, 3, "=Assumptions!C28", USD)
calc_cell(ws, 26, 4, "=Assumptions!D28", USD)

labeled_row(ws, 27, "Brand & creator marketing")
calc_cell(ws, 27, 2, "=Assumptions!B29", USD)
calc_cell(ws, 27, 3, "=Assumptions!C29", USD)
calc_cell(ws, 27, 4, "=Assumptions!D29", USD)

labeled_row(ws, 28, "G&A, tooling, infra")
calc_cell(ws, 28, 2, "=Assumptions!B30", USD)
calc_cell(ws, 28, 3, "=Assumptions!C30", USD)
calc_cell(ws, 28, 4, "=Assumptions!D30", USD)

labeled_row(ws, 29, "Legal, accounting, insurance")
calc_cell(ws, 29, 2, "=Assumptions!B31", USD)
calc_cell(ws, 29, 3, "=Assumptions!C31", USD)
calc_cell(ws, 29, 4, "=Assumptions!D31", USD)

labeled_row(ws, 30, "Total fixed opex", is_total=True)
calc_cell(ws, 30, 2, "=SUM(B25:B29)", USD, total=True)
calc_cell(ws, 30, 3, "=SUM(C25:C29)", USD, total=True)
calc_cell(ws, 30, 4, "=SUM(D25:D29)", USD, total=True)
calc_cell(ws, 30, 5, "=SUM(B30:D30)", USD, total=True)

section_header(ws, 32, "EBITDA", color=INK)

labeled_row(ws, 33, "EBITDA", is_total=True)
calc_cell(ws, 33, 2, "=B21-B30", USD, total=True)
calc_cell(ws, 33, 3, "=C21-C30", USD, total=True)
calc_cell(ws, 33, 4, "=D21-D30", USD, total=True)
calc_cell(ws, 33, 5, "=SUM(B33:D33)", USD, total=True)

labeled_row(ws, 34, "EBITDA margin %")
calc_cell(ws, 34, 2, "=IFERROR(B33/B9,0)", PCT)
calc_cell(ws, 34, 3, "=IFERROR(C33/C9,0)", PCT)
calc_cell(ws, 34, 4, "=IFERROR(D33/D9,0)", PCT)

ws.cell(row=37, column=1, value="Pre-tax. Excludes IP/licensing upside.").font = NOTE

# ── Tab 5 — Unit Economics ────────────────────────────────────────────────
ws = wb.create_sheet("Unit Economics")
ws.sheet_view.showGridLines = False
ws.column_dimensions["A"].width = 38
for col in "BCDE":
    ws.column_dimensions[col].width = 18

kicker(ws, 1, "PER-BOUT CONTRIBUTION MARGIN AT THREE AUDIENCE SCALES")
title(ws, 2, "Unit Economics — per bout")

hdr = 4
ws.cell(row=hdr, column=1, value="").font = H2
ws.cell(row=hdr, column=2, value="Year 1 scale").font = H2
ws.cell(row=hdr, column=3, value="Year 2 scale").font = H2
ws.cell(row=hdr, column=4, value="Year 3 scale").font = H2
for c in range(1, 5):
    ws.cell(row=hdr, column=c).fill = PatternFill("solid", fgColor=INK)
    ws.cell(row=hdr, column=c).alignment = Alignment(
        horizontal="left" if c == 1 else "right",
        vertical="center",
        indent=1 if c == 1 else 0,
    )
ws.row_dimensions[hdr].height = 22

labeled_row(ws, 6, "Avg viewers / bout")
calc_cell(ws, 6, 2, "=Assumptions!B8", "#,##0")
calc_cell(ws, 6, 3, "=Assumptions!C8", "#,##0")
calc_cell(ws, 6, 4, "=Assumptions!D8", "#,##0")

labeled_row(ws, 7, "Voters / bout")
calc_cell(ws, 7, 2, "=B6*Assumptions!B9", "#,##0")
calc_cell(ws, 7, 3, "=C6*Assumptions!C9", "#,##0")
calc_cell(ws, 7, 4, "=D6*Assumptions!D9", "#,##0")

section_header(ws, 9, "REVENUE / BOUT", color=RED)

labeled_row(ws, 10, "Voting")
calc_cell(ws, 10, 2, "=B7*Assumptions!B10", USD)
calc_cell(ws, 10, 3, "=C7*Assumptions!C10", USD)
calc_cell(ws, 10, 4, "=D7*Assumptions!D10", USD)

# Sponsor share intentionally omitted — treated as upside, not modeled.

labeled_row(ws, 12, "Total revenue / bout", is_total=True)
calc_cell(ws, 12, 2, "=B10", USD, total=True)
calc_cell(ws, 12, 3, "=C10", USD, total=True)
calc_cell(ws, 12, 4, "=D10", USD, total=True)

section_header(ws, 14, "VARIABLE COST / BOUT", color=BLUE)

labeled_row(ws, 15, "Mux delivery (live + replay)")
calc_cell(ws, 15, 2,
          "=B6*(Assumptions!B34+Assumptions!B35*Assumptions!B36)/60*Assumptions!B17", USD)
calc_cell(ws, 15, 3,
          "=C6*(Assumptions!C34+Assumptions!C35*Assumptions!C36)/60*Assumptions!C17", USD)
calc_cell(ws, 15, 4,
          "=D6*(Assumptions!D34+Assumptions!D35*Assumptions!D36)/60*Assumptions!D17", USD)

labeled_row(ws, 16, "Mux ingest")
calc_cell(ws, 16, 2, "=Assumptions!B18", USD)
calc_cell(ws, 16, 3, "=Assumptions!C18", USD)
calc_cell(ws, 16, 4, "=Assumptions!D18", USD)

labeled_row(ws, 17, "Stripe processing")
calc_cell(ws, 17, 2, "=B10*Assumptions!B19+B7*Assumptions!B20", USD)
calc_cell(ws, 17, 3, "=C10*Assumptions!C19+C7*Assumptions!C20", USD)
calc_cell(ws, 17, 4, "=D10*Assumptions!D19+D7*Assumptions!D20", USD)

labeled_row(ws, 18, "Charity payout")
calc_cell(ws, 18, 2, "=B10*Assumptions!B21", USD)
calc_cell(ws, 18, 3, "=C10*Assumptions!C21", USD)
calc_cell(ws, 18, 4, "=D10*Assumptions!D21", USD)

labeled_row(ws, 19, "Debater honorariums")
calc_cell(ws, 19, 2, "=Assumptions!B22", USD)
calc_cell(ws, 19, 3, "=Assumptions!C22", USD)
calc_cell(ws, 19, 4, "=Assumptions!D22", USD)

labeled_row(ws, 20, "Production")
calc_cell(ws, 20, 2, "=Assumptions!B23", USD)
calc_cell(ws, 20, 3, "=Assumptions!C23", USD)
calc_cell(ws, 20, 4, "=Assumptions!D23", USD)

labeled_row(ws, 21, "Total variable cost / bout", is_total=True)
calc_cell(ws, 21, 2, "=SUM(B15:B20)", USD, total=True)
calc_cell(ws, 21, 3, "=SUM(C15:C20)", USD, total=True)
calc_cell(ws, 21, 4, "=SUM(D15:D20)", USD, total=True)

section_header(ws, 23, "CONTRIBUTION MARGIN / BOUT", color=INK)

labeled_row(ws, 24, "Contribution $", is_total=True)
calc_cell(ws, 24, 2, "=B12-B21", USD, total=True)
calc_cell(ws, 24, 3, "=C12-C21", USD, total=True)
calc_cell(ws, 24, 4, "=D12-D21", USD, total=True)

labeled_row(ws, 25, "Contribution %")
calc_cell(ws, 25, 2, "=IFERROR(B24/B12,0)", PCT)
calc_cell(ws, 25, 3, "=IFERROR(C24/C12,0)", PCT)
calc_cell(ws, 25, 4, "=IFERROR(D24/D12,0)", PCT)

ws.cell(row=27, column=1,
        value="Excludes fixed opex. See P&L tab for full picture.").font = NOTE

# ── Save ──────────────────────────────────────────────────────────────────
OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
wb.save(OUT_PATH)
print(f"Wrote {OUT_PATH.relative_to(APP_ROOT.parent)}")
