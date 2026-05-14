# Image Credits

All debater portraits sourced from Wikipedia Commons and resized to a
1200 px long edge (JPEG quality 88).  See `scripts/fetch_debater_portraits.py`
for the bulk-fetch tool used to refresh them.

## Hero (homepage)

- **shapiro.jpg** — Ben Shapiro speaking at AmericaFest 2024.
  Sourced from the Britannica biography
  ([britannica.com/biography/Ben-Shapiro](https://www.britannica.com/biography/Ben-Shapiro))
  via the article's `og:image` (cdn.britannica.com).
  Center-cropped to 3:4 portrait and resized to 864×1200.

- **aoc.jpg** — Alexandria Ocasio-Cortez, official Congressional portrait (2018).
  Public domain (U.S. federal work)
  · [Commons file](https://commons.wikimedia.org/wiki/File:Alexandria_Ocasio-Cortez_Official_Portrait.jpg)

## Debaters (`/debaters/`)

- **walsh.jpg** — Matt Walsh (political commentator).
  · [Commons file](https://commons.wikimedia.org/wiki/File:Matt_Walsh_(cropped).jpg)

- **butler.jpg** — Judith Butler (2013).
  · [Commons file](https://commons.wikimedia.org/wiki/File:JudithButler2013.jpg)

- **yang.jpg** — Andrew Yang (November 2023).
  · [Commons file](https://commons.wikimedia.org/wiki/File:Andrew_Yang_November_2023.jpg)

- **ramaswamy.jpg** — Vivek Ramaswamy (2026).
  · [Commons file](https://commons.wikimedia.org/wiki/File:Vivek_Ramaswamy_2026_(cropped).jpg)

- **omar.jpg** — Ilhan Omar, official Congressional portrait, 116th Congress.
  Public domain (U.S. federal work)
  · [Commons file](https://commons.wikimedia.org/wiki/File:Ilhan_Omar,_official_portrait,_116th_Congress_(cropped)_A.jpg)

- **hegseth.jpg** — Pete Hegseth, official portrait.
  Public domain (U.S. federal work)
  · [Commons file](https://commons.wikimedia.org/wiki/File:Pete_Hegseth_Official_Portrait.jpg)

- **hughes.jpg** — Coleman Hughes (Bokmässan, 2025).
  · [Commons file](https://commons.wikimedia.org/wiki/File:Bokm%C3%A4ssan_2025_%E2%80%93_170.jpg)

- **harris.jpg** — Sam Harris (2016).
  · [Commons file](https://commons.wikimedia.org/wiki/File:Sam_Harris_2016_(cropped).jpg)

- **finkelstein.jpg** — Norman Finkelstein.
  · [Commons file](https://commons.wikimedia.org/wiki/File:NormanFinkelstein_(cropped).jpg)

- **murray.jpg** — Douglas Murray (2019).
  · [Commons file](https://commons.wikimedia.org/wiki/File:DouglasMurray2019_crop.jpg)

- **smith.jpg** — Stephen A. Smith (January 2023).
  · [Commons file](https://commons.wikimedia.org/wiki/File:Stephen_A._Smith_in_January_2023_(3x4_cropped_b).jpg)

- **hasan.jpg** — Mehdi Hasan.
  · [Commons file](https://commons.wikimedia.org/wiki/File:Mehdi_Hasan_portrait_(cropped)_(edited).jpg)

- **peterson.jpg** — Jordan Peterson (2018).
  · [Commons file](https://commons.wikimedia.org/wiki/File:Jordan_Peterson_in_2018_(3x4_cropped).jpg)

- **sullivan.jpg** — Andrew Sullivan.
  · [Commons file](https://commons.wikimedia.org/wiki/File:Andrew_Sullivan_cropped.jpg)

## License notes

Most Wikipedia Commons portraits are CC BY-SA 2.0/3.0/4.0 or public domain.
Specific licenses can be confirmed on each Commons file page linked above.
For CC BY/BY-SA images, attribution is provided by inclusion in this file
and by the link back to the Commons source.

## Charity logos (`/charities/`)

Each backed charity uses its organization's logo as the hero image,
sourced from the org's own homepage `og:image` meta tag (the canonical
share-preview asset they publish for embedding). FIDF's logo was
unavailable through that path (Cloudflare blocks programmatic fetches);
it was sourced from the public Wikipedia article infobox.

Logos are displayed for nominative reference — to identify the org
the user is being linked to — which is the standard well-established
use case for organization marks. Each card links back to the org's
own URL.

- **fidf.jpg** — Friends of the Israel Defense Forces, official logo.
  Sourced from the Wikipedia infobox; composited onto a white 1200×600
  canvas for the hero strip.
- **unrwa-usa.jpg** — UNRWA USA homepage share image.
- **job-creators-network.jpg** — Job Creators Network homepage share image.
- **humanity-forward.jpg** — Humanity Forward homepage share image.
- **alliance-defending-freedom.jpg** — ADF homepage default share image.
- **trans-lifeline.jpg** — Trans Lifeline favicon (the homepage og:image),
  centered on a white 1200×600 canvas.
- **equal-justice-initiative.jpg** — Equal Justice Initiative homepage
  share image (campaign banner).
- **cops-survivors.jpg** — Concerns of Police Survivors org logo,
  centered on a white 1200×600 canvas.

## Refreshing

Debater portraits (Wikipedia Commons articles):

```bash
python3 argumental-app/scripts/fetch_debater_portraits.py
```

Charity logos (org homepage og:image):

```bash
python3 argumental-app/scripts/fetch_charity_logos.py
```
