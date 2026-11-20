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

## Security headers

`integrations/launch-files.mjs` writes `dist/_headers` at build time (honoured by Cloudflare Pages and Netlify; on any other host, copy the same headers into its config). Every response gets:

| Header | Value / purpose |
| --- | --- |
| `Content-Security-Policy` | Scripts only from this site plus the **6 inline scripts allow-listed by SHA-256 hash** (generated from the built pages, so they can't go stale). No `'unsafe-inline'`/`'unsafe-eval'` for scripts. Styles allow `'unsafe-inline'` (108 inline `style=""` attributes can't be hashed; styles can't run code). Nothing loads from other hosts (unless analytics is switched on, see below). `form-action` allows only this site and `forms.zohopublic.com`. `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`. `require-trusted-types-for 'script'` blocks string-to-HTML assignment (`innerHTML`) in supporting browsers. |
| `Strict-Transport-Security` | **Production builds only** (and only honoured over HTTPS). Default `max-age=31536000` (1 year). |
| `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy` | `nosniff`, `DENY`, `strict-origin-when-cross-origin`, camera/mic/geolocation/payment/etc. off, `same-origin`. |

Staging builds send the **same CSP** as production (so a policy problem shows up before launch), plus `X-Robots-Tag: noindex`, and no HSTS.

**See the real headers locally:** `npm run build && npm run serve` (http://localhost:4322 applies `dist/_headers`; `astro preview` does not). `npm run check` fails the build if the headers are missing or weakened, if any inline script isn't allow-listed, or if a production build lacks HSTS.

**HSTS rollout.** Browsers remember HSTS for the whole `max-age`, so ramp up: build the first launch with `HSTS_MAX_AGE=300`, then `86400`, then the default one year, as you confirm HTTPS works everywhere. `includeSubDomains` and `preload` are **off by default** because they apply to *every* `*.eganow.com` subdomain (mail, docs, portals, anything run by other teams); turn them on only once all of those serve HTTPS: `HSTS_INCLUDE_SUBDOMAINS=true HSTS_PRELOAD=true` (preload also needs `max-age` >= 1 year, and submission at hstspreload.org is very hard to undo).

**Adding a third-party tool later** (analytics, live chat, an embedded form): add its host to the relevant directive in `integrations/launch-files.mjs` (`script-src`/`connect-src`/`img-src`/`frame-src`) and re-run `npm run serve` + the checker. Without that the browser will block it silently. Also: **don't let the CDN rewrite pages** (HTML/JS minification, Rocket Loader, email-address obfuscation): changing an inline script's bytes breaks its hash, and injected scripts are blocked.

## Analytics and cookie consent

**Default: off.** A build with no analytics settings loads nothing, sets no cookies, shows no banner, and the Cookie Policy says so. Turn a provider on with environment variables on the build:

| Variable | Meaning |
| --- | --- |
| `ANALYTICS_PROVIDER` | `none` (default), `plausible` or `ga4`. An unknown value fails the build. |
| `PLAUSIBLE_DOMAIN` | Plausible site domain (e.g. `eganow.com`). `PLAUSIBLE_SRC` optionally points at a self-hosted script (must be `https`). |
| `GA4_MEASUREMENT_ID` | e.g. `G-XXXXXXXXXX` (validated). |
| `ANALYTICS_IN_STAGING=true` | Analytics are active **only on production builds** unless this is set (for testing on staging). |

When a provider is on, the build adds the banner to every page, a "Cookie settings" link in the footer, the vendor's hosts to the CSP, and generates the Cookie Policy / Privacy Policy wording from the same config, so they cannot disagree.

**Behaviour.** Nothing is loaded or sent until the visitor presses **Accept**. **Reject** (or a Global Privacy Control signal) keeps everything off. The choice is stored in `localStorage` (`eganow_consent`) for 12 months; bumping `CONSENT_VERSION` in `src/data/analytics.mjs` asks everyone again. The banner is in the initial HTML (no layout shift, no LCP regression), is a non-modal dialog, and is keyboard and screen-reader accessible.

**Events** (only after consent; never any personal data or form contents): page views, `chapter_reached` (Personal story), `service_panel_viewed` (Business), `contact_cta` (any `/contact?topic=` link), `contact_submit` (topic only), and store-button clicks via `data-track` attributes. Fire your own with `track(name, props)` from `src/scripts/track.ts`.

**Notes.** GA4 needs Google scripts that are incompatible with Trusted Types, so that one CSP directive is relaxed in GA4 mode (Plausible keeps it). The legal wording is a draft with `[[confirm …]]` placeholders and needs counsel's review. The vendors' real endpoints could not be reached while building, so do a smoke test with the real ID on staging (`ANALYTICS_IN_STAGING=true`).

**Test it:** build with a provider, `npm run serve`, then `npm run test:consent -- plausible|ga4|default` (needs Playwright + Chromium). It uses stand-ins for the vendors at their real URLs, and checks zero requests before consent, payloads, GPC, expiry, focus, accessibility (axe) and CSP violations. `npm run check` also verifies banner / CSP / pages are consistent.

## Hero animation (Personal page)

The first screen plays a Lottie scene: `public/lottie/hero-scene.json` plus its image `public/lottie/hero-woman.webp`, drawn by `lottie-web` (light build, loaded on the Personal page only). `src/assets/hero-scene-poster.webp` is the still shown when scripts, motion or the animation file are unavailable. To swap the scene: export a new Lottie JSON (remove any editor watermark layer), put its images in `public/lottie/` (reference them by path, not embedded base64, to keep the JSON small), and regenerate the poster from its last frame.

## Known gaps

`scripts/known-missing.json` lists internal links whose pages are not built yet (currently none). `npm run check` reports them as warnings and fails on any *other* broken link.

`/business/developers` has **no real API reference**: its code samples are labelled illustrative and its facts are `TODO(verify)` comments in the page source. Engineering must confirm them and decide where the real docs live (then replace the "Docs come with your sandbox" panel with a link).

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
