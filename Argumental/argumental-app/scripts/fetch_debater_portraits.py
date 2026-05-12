"""One-shot: pull high-res portraits from Wikipedia Commons for every
debater referenced on Argumental, resize to 1200 px max, and write to
argumental-app/public/debaters/.

Prints a credits table on completion so attribution can be added to
public/IMAGE_CREDITS.md.
"""

from __future__ import annotations

import json
import subprocess
import urllib.parse
import urllib.request

USER_AGENT = "ArgumentalApp/1.0 (https://argumental.vercel.app; reubstock@gmail.com)"
PUBLIC_DIR = (
    "/Users/reubensteiger/Desktop/Claude Projects/Argumental/argumental-app/public/debaters"
)

# (output filename, [candidate Wikipedia titles in priority order])
DEBATERS = [
    ("walsh.jpg",       ["Matt Walsh (political commentator)"]),
    ("butler.jpg",      ["Judith Butler"]),
    ("yang.jpg",        ["Andrew Yang"]),
    ("ramaswamy.jpg",   ["Vivek Ramaswamy"]),
    ("omar.jpg",        ["Ilhan Omar"]),
    ("hegseth.jpg",     ["Pete Hegseth"]),
    ("hughes.jpg",      ["Coleman Hughes (writer)", "Coleman Hughes"]),
    ("harris.jpg",      ["Sam Harris"]),
    ("finkelstein.jpg", ["Norman Finkelstein"]),
    ("murray.jpg",      ["Douglas Murray (author)"]),
    ("smith.jpg",       ["Stephen A. Smith"]),
    ("hasan.jpg",       ["Mehdi Hasan"]),
    ("peterson.jpg",    ["Jordan Peterson"]),
    ("sullivan.jpg",    ["Andrew Sullivan"]),
]


def fetch_summary(title):
    url = (
        "https://en.wikipedia.org/api/rest_v1/page/summary/"
        + urllib.parse.quote(title.replace(" ", "_"), safe="()")
    )
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.loads(r.read())


def download(url, path):
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=60) as r, open(path, "wb") as f:
        f.write(r.read())


def resize(input_path, output_path, max_dim=1200, quality=88):
    subprocess.run(
        [
            "sips",
            "-Z", str(max_dim),
            "-s", "format", "jpeg",
            "-s", "formatOptions", str(quality),
            input_path,
            "--out", output_path,
        ],
        check=True,
        capture_output=True,
    )


def main():
    credits = []
    failures = []

    for fname, candidates in DEBATERS:
        chosen = None
        for title in candidates:
            try:
                summary = fetch_summary(title)
                if summary.get("type") == "disambiguation":
                    print(f"  - {title}: disambiguation page, trying next candidate")
                    continue
                img = summary.get("originalimage")
                if not img:
                    print(f"  - {title}: no originalimage")
                    continue
                chosen = (title, summary.get("title", title), img["source"])
                break
            except Exception as e:
                print(f"  - {title}: ERROR {e}")
                continue

        if not chosen:
            failures.append((fname, candidates))
            print(f"✗ {fname}: no working candidate")
            continue

        query_title, resolved_title, img_url = chosen
        tmp = f"/tmp/{fname}.raw"
        try:
            download(img_url, tmp)
            out = f"{PUBLIC_DIR}/{fname}"
            resize(tmp, out)
            size = subprocess.run(
                ["sips", "-g", "pixelWidth", "-g", "pixelHeight", out],
                check=True, capture_output=True, text=True,
            ).stdout
            credits.append({
                "file": fname,
                "subject": resolved_title,
                "query": query_title,
                "source": img_url,
            })
            print(f"✓ {fname:18} {resolved_title}  ({size.strip().split()[-1]})")
        except Exception as e:
            failures.append((fname, str(e)))
            print(f"✗ {fname}: {e}")

    print("\n=== CREDITS ===")
    for c in credits:
        print(f"  {c['file']}: {c['subject']}\n    Source: {c['source']}\n")

    if failures:
        print("=== FAILURES ===")
        for f in failures:
            print(f"  {f}")


if __name__ == "__main__":
    main()
