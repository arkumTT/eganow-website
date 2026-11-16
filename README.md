# Eganow website

Astro static site. Personal (`/`) and Business (`/business`) worlds, six Business service pages, contact, help, legal, security, about.

```bash
npm install
npm run dev                 # local development
npm run build               # staging-safe build (see "Launch switches")
npm run build:production    # the build for the live site
npm run check               # audit dist/: broken links/anchors + SEO basics (run after a build)
```

## Launch switches (read before going live)

| Switch | Where | Effect |
| --- | --- | --- |
| `SITE_ENV=production` | environment variable on the **live** build only (`npm run build:production`) | Real `robots.txt` + `sitemap.xml`. **Without it** every build is staging-safe: `robots.txt` blocks all crawlers, there is no sitemap, and every response is sent with `X-Robots-Tag: noindex` (via `dist/_headers`, honoured by Cloudflare Pages / Netlify). |
| `LEGAL_DRAFT` | `src/data/legal-status.ts` | While `true`: legal pages show a draft banner and are `noindex`. Setting it `false` **fails the build** if any `[[placeholder]]` remains. |
| `HELP_DRAFT` | `src/data/help.ts` | Same, for `/help`. |
| `COMPANY_DRAFT` | `src/data/company-status.ts` | Same, for `/about` and `/security`. |

`[[Highlighted placeholders]]` mark facts only Eganow can supply (legal entity, licence number, contacts, people, partners, security specifics).

## How sitemap / robots work

`integrations/launch-files.mjs` runs after the build and reads the **finished HTML**: a page goes in the sitemap only if it has a canonical URL and is not `noindex` (and is not the 404). So the sitemap cannot disagree with the pages. Draft pages drop out automatically and appear when their draft switch is turned off.

## Known gaps

`scripts/known-missing.json` lists internal links whose pages are not built yet (currently `/business/developers`). `npm run check` reports them as warnings and fails on any *other* broken link.

There is deliberately **no public pricing page**: quotes go through `/contact?topic=sales`.

## Performance (measured)

Lighthouse, production build, mobile profile (simulated slow 4G, mid-range phone), headless Chromium:

| | Before fixes | After |
| --- | --- | --- |
| Performance / Accessibility / Best practices | 99–100 / 100 / 100 | **100 / 100 / 100** on every page |
| First and largest contentful paint | 0.9 s | **0.6–0.7 s** |
| Layout shift (worst page) | 0.071 (Contact) | **0.000** everywhere |
| Total blocking time | 0–14 ms | 0–20 ms (run-to-run noise) |
| Page weight | 83–134 KB | 81–131 KB (home and Business ≈ 130 KB, of which ≈ 47 KB is the lazy-loaded animation library) |

Scroll smoothness (frame times while scrolling the Personal story, Business panels, EgaPOS and a long legal page, CPU throttled 4x at phone size): 60 fps, no frame over 50 ms.

SEO scores 66 on `/about`, `/help`, `/security` and `/legal/*` **on purpose**: they are draft pages marked `noindex` (see "Launch switches"). They score 100 once their draft switch is turned off.

To re-run (Lighthouse is not a project dependency, so install it in a scratch folder). Lighthouse reads `robots.txt`, so test the **production** build:

```bash
mkdir /tmp/lh && cd /tmp/lh && npm init -y && npm i lighthouse
cd /path/to/eganow-website && npm run build:production && npm run preview   # serves http://localhost:4321
CHROME_PATH=/path/to/chrome npx lighthouse http://localhost:4321/ --chrome-flags="--headless=new --no-sandbox"
```
