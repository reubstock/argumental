"""Pull logos / hero images for each backed charity.

Strategy per charity:
  1. Fetch the homepage HTML.
  2. Extract og:image (canonical share-preview, often the org's logo or hero).
  3. Download it.
  4. Use `sips` to resize to a 1200 px long edge JPEG.
  5. Save as /public/charities/{id}.jpg.

Logos are trademarks; nominative-use applies (we identify the org we're
linking to).  Compatible with how charity-directory sites display logos.

If a homepage og:image fails or doesn't exist, the script logs the
failure and we'll hand-pick a replacement.
"""

from __future__ import annotations

import re
import subprocess
import urllib.parse
import urllib.request
from pathlib import Path

USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 "
    "(KHTML, like Gecko) Version/17.0 Safari/605.1.15"
)

PUBLIC_DIR = Path(
    "/Users/reubensteiger/Desktop/Claude Projects/Argumental/argumental-app/public/charities"
)
PUBLIC_DIR.mkdir(parents=True, exist_ok=True)

CHARITIES = [
    ("fidf",                       "https://www.fidf.org/"),
    ("unrwa-usa",                  "https://www.unrwausa.org/"),
    ("job-creators-network",       "https://www.jobcreatorsnetwork.com/"),
    ("humanity-forward",           "https://movehumanityforward.com/"),
    ("alliance-defending-freedom", "https://adflegal.org/"),
    ("trans-lifeline",             "https://translifeline.org/"),
    ("equal-justice-initiative",   "https://eji.org/"),
    ("cops-survivors",             "https://concernsofpolicesurvivors.org/"),
]


def fetch_html(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=20) as r:
        return r.read().decode("utf-8", errors="replace")


def find_og_image(html: str, base_url: str) -> str | None:
    # Try og:image, then og:image:secure_url, then twitter:image.
    patterns = [
        r'property=["\']og:image["\']\s+content=["\']([^"\']+)["\']',
        r'content=["\']([^"\']+)["\']\s+property=["\']og:image["\']',
        r'name=["\']twitter:image["\']\s+content=["\']([^"\']+)["\']',
        r'rel=["\']apple-touch-icon["\'][^>]*href=["\']([^"\']+)["\']',
    ]
    for pat in patterns:
        m = re.search(pat, html, re.IGNORECASE)
        if m:
            url = m.group(1).strip()
            return urllib.parse.urljoin(base_url, url)
    return None


def download(url: str, path: Path) -> None:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=30) as r, open(path, "wb") as f:
        f.write(r.read())


def resize_to_jpg(input_path: Path, output_path: Path, max_dim: int = 1200, quality: int = 88) -> None:
    subprocess.run(
        [
            "sips",
            "-Z", str(max_dim),
            "-s", "format", "jpeg",
            "-s", "formatOptions", str(quality),
            str(input_path),
            "--out", str(output_path),
        ],
        check=True,
        capture_output=True,
    )


def main() -> None:
    results = []
    for cid, homepage in CHARITIES:
        try:
            html = fetch_html(homepage)
            og = find_og_image(html, homepage)
            if not og:
                print(f"✗ {cid:32}  no og:image / twitter:image found")
                results.append((cid, None, "no meta image"))
                continue

            raw_path = Path(f"/tmp/{cid}.raw")
            try:
                download(og, raw_path)
            except Exception as e:
                print(f"✗ {cid:32}  download failed: {e}")
                results.append((cid, og, f"download error: {e}"))
                continue

            out_path = PUBLIC_DIR / f"{cid}.jpg"
            try:
                resize_to_jpg(raw_path, out_path)
            except subprocess.CalledProcessError as e:
                stderr = (e.stderr or b"").decode(errors="replace")
                print(f"✗ {cid:32}  sips failed: {stderr.strip()}")
                results.append((cid, og, "sips error"))
                continue

            size = out_path.stat().st_size
            dims = subprocess.run(
                ["sips", "-g", "pixelWidth", "-g", "pixelHeight", str(out_path)],
                check=True, capture_output=True, text=True,
            ).stdout
            print(f"✓ {cid:32}  {size//1024} KB  {dims.strip().split()[-1]:>4} tall")
            results.append((cid, og, "ok"))
        except Exception as e:
            print(f"✗ {cid:32}  ERROR {e}")
            results.append((cid, None, str(e)))

    print("\n=== SOURCES ===")
    for cid, url, status in results:
        print(f"  {cid}: {status}\n    {url}")


if __name__ == "__main__":
    main()
