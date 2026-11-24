# Eganow Design System (v1)

Source of truth for the new Eganow website. Tokens live in `tokens.css` (`--eg-*`); logo files in `brand/`; live preview in `preview.html`.
Derived from: the shipped site CSS (red/ice/slate palette, Manrope/Poppins/Inter, Framer tokens), the logo SVGs in session 2's build, and the website plan (Revolut-style: bold type, full-bleed colour, product-first motion).

## 1. Principles
1. **Product first.** Every page shows the app/product UI or a real person using it, never abstract decoration.
2. **Red leads, ice breathes.** Eganow Red for energy (heroes, primary CTA); Ice Blue and white for space; dark slate for trust.
3. **Big, plain type.** Short headlines (≤ 8 words), one idea per section, one primary CTA per view.
4. **Motion explains.** Scroll/animation shows how the product works; it never blocks reading (reduced-motion = static).
5. **Regulated and honest.** Licence text stays verbatim; sample/indicative numbers are labelled.

## 2. Logo
| File | Use |
|---|---|
| `brand/eganow-wordmark-red.svg` | Default on white/ice backgrounds |
| `brand/eganow-wordmark-white.svg` | On Eganow Red, night or photo with scrim |
| `brand/eganow-icon.svg` | Favicon, app tile, small spaces (red mark, blue accent) |
| `brand/eganow-icon-white-blue.svg` | Icon on red/dark backgrounds |

Rules: clear space = height of the "e"; min width 96 px (wordmark) / 24 px (icon); never recolour, outline, rotate, add shadows, or place on busy imagery without a ≥ 40 % scrim; the blue tick is part of the logo — don't remove it. The wordmark is lowercase "eganow"; in running text write "Eganow".

## 3. Colour
| Token | Hex | Role | Contrast |
|---|---|---|---|
| `--eg-red` | `#CC0229` | Primary CTA, hero blocks, key accents | white on red **5.8:1** (AA) |
| `--eg-red-hover` | `#A80222` | Hover/pressed | white 7.8:1 |
| `--eg-red-tint` | `#FFF1F3` | Selected states, error backgrounds | — |
| `--eg-blue` | `#1F8FFF` | Logo tick, illustration, charts | 3.3:1 on white → **never for text** |
| `--eg-blue-action` | `#1065E3` | Links, secondary buttons (current site) | white on it 5.3:1 |
| `--eg-ink` | `#14202E` | Body/headings on light | on ice 15.5:1 |
| `--eg-slate` | `#485E79` | Subheads, dark UI | on ice 6.3:1 |
| `--eg-text-muted` | `#596779` | Secondary text | 5.8:1 white / 5.4:1 ice |
| `--eg-mute` | `#828E9D` | Icons, dividers, placeholder, large decorative text only | 3.3:1 → **not for body text** |
| `--eg-mist` / `-2` | `#C8D3E3` / `#DEE8F6` | Borders, dividers | — |
| `--eg-ice` | `#F2F9FE` | Page background, cards on white | — |
| `--eg-night` | `#0F1B2A` | Developers/dark sections | white on it > 15:1 |
| `--eg-amber` | `#FFB407` | Boss Card, badges, focus ring (sparingly) | ink on amber 9.2:1 |
| `--eg-success/-warning/-error` | `#0D6647` `#B26A00` `#B3122D` | Status | all ≥ 4.5:1 on white |

Usage ratio per page ≈ 60 % ice/white, 25 % red/slate sections, 10 % night, 5 % accents. Red text on white is allowed for large headings only (5.8:1 passes, but avoid body copy). Do not put red text on red, or blue text on red.
Note: the amber in the plan is a suggested accent, not found in the live brand beyond one token; drop it if brand owners disagree. Existing Framer-era tokens (`#F8F9FE`, `#F4F6FA`, `#EEF2F7`) map to `--eg-ice`/white.

## 4. Typography
- **Display/headings:** Manrope 800 (Poppins 600/700 as fallback and where existing pages use it). Tight tracking (−0.02em).
- **Body/UI:** Inter 400/600. Numerals tabular in calculators, tables, dashboards.
- Self-hosted in the site build (`eganow-business/assets/fonts`, loaded by `assets/fonts.css`); never load from Google in production.

| Style | Size (desktop → mobile) | Line height | Weight |
|---|---|---|---|
| Display (hero) | 72 → 40 | 1.05 | 800 |
| H1 | 56 → 34 | 1.05 | 800 |
| H2 | 40 → 28 | 1.25 | 800 |
| H3 | 28 | 1.25 | 700 |
| H4 | 20 | 1.3 | 700 |
| Body | 16 (18 for lead) | 1.6 | 400 |
| Small / caption | 14 / 12 | 1.5 | 400–600 |

Max 2 weights per view; measure 60–75 characters; sentence case everywhere (no ALL CAPS except 12 px chips).

## 5. Spacing, layout, shape
- 8-pt scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Section padding 96–128 desktop, 64 mobile.
- Container 1200 px, gutter 24 (16 on ≤ 480). 12-col grid; breakpoints **≥1200 desktop, 810–1199 tablet, ≤809 mobile** (matches the Framer pages).
- Radius: 12 (buttons, `--eg-r-btn`), 8 (labels, tags, badges and chips, `--eg-r-tag`), 14 (inputs, selects), 18 (fields), 28 (cards, calculator). Fully round (999/50 %) is reserved for avatars, step numbers and check/progress dots; never buttons or tags.
- Elevation: card `0 8px 30px /10%`, floating `0 24px 60px /22%`; no hard borders on cards, mist 1.5 px borders for inputs and chips.

## 6. Components
- **Buttons:** rectangular with slightly rounded corners (`--eg-r-btn` 12 px; 8 px on small inline buttons), Manrope 700 16 px, 14×28 padding. Primary = red; secondary = blue-action outline, 1.5 px line (never black; on red or night backgrounds the outline is white, because blue on red fails contrast); on-red = white fill/red text; ghost-on-red = white outline. Min target 44 px. Focus: 3 px amber ring.
- **Cards / bento tiles:** white or ice, radius 28, 32 px padding, UI mock + one-line benefit + "Explore →".
- **Inputs:** ice fill, 2 px transparent border, red border on focus, 18 radius, big 28 px numerals for money inputs (see `money-transfer-calculator`).
- **Chips/badges/tags:** rectangular, 8 px corners, 12 px uppercase, mist border (e.g., "Sample rates", status).
- **Navigation:** sticky glass bar (Personal ▾, Business, Developer | Register Business, Sign In); on red hero uses white wordmark and white text; collapses to hamburger ≤ 809.
- **Footer:** ice or night; links grouped (Personal, Business, Developer, Company, Legal) plus the verbatim regulatory paragraph and region switch (Ghana, UK, US, Canada).
- **Calculator:** see `money-transfer-calculator/` (built; uses these tokens' values).
- **Sticky CTA bar, FAQ accordion, stat counters, pinned phone story:** specs in the website plan.

## 7. Imagery & illustration
- **Photography:** real people, candid and warm, lit with soft key + red/ice backdrops; consistent grade (warm skin, slightly desaturated environments, red as accent). Model releases and a licence log are mandatory.
- **3D:** glossy-clay objects (phone, card, POS, coins, shield) lit by a soft ice-blue studio, red as the hero colour, blue only as a small accent. Always supplied as transparent PNG/WebP + optional loop.
- **UI mocks:** use real product screens in device frames; sample numbers must be plausible and labelled "Illustrative".
- **Icons:** 2 px rounded line icons, 24 px grid; 3D icons only in feature grids.

## 8. Motion
Durations 150 ms (hover), 300 ms (UI), 600 ms (section reveal); easing `cubic-bezier(.2,.8,.2,1)`. Scroll: pinned sections use scrubbed timelines (GSAP ScrollTrigger); numbers count up once; parallax ≤ 40 px. `prefers-reduced-motion` → no scrub, show final-frame posters; autoplay media pauses on data-saver. LCP image never animates in.

## 9. Voice & copy
Friendly, plain, confident, Africa-first ("We power happiness."). Verbs first ("Send, pay, save"). No jargon, no unverified claims (uptime 99.95 % is from the current site; keep sources for any stat). Regulatory line (verbatim): "Eganow (TekSol Eganow Ltd) is a financial technology company, not a Bank. Eganow is licensed by Bank of Ghana as an Enhanced Payment Service Provider (EPSP) under the Payment Systems and Services ACT, 2019 (ACT 987)…" Use "mobile money" and name MTN, Telecel, AirtelTigo exactly.

## 10. Accessibility checklist
AA contrast per table; focus ring on every interactive element; targets ≥ 44 px; form labels always visible; errors announced (`role="alert"`) and not colour-only; live regions for dynamic numbers; captions/transcripts for video; reduced-motion tested; zoom to 200 % without loss.

## 11. Implementation notes
- Import `tokens.css`; build with `.eg-*` primitives or map tokens into the framework (Astro/Tailwind `theme.extend`).
- Site today is a Framer export with its own tokens; keep new components additive (like `mt-calculator`) until pages are rebuilt.
- Keep this file and `tokens.css` in sync; changes go through a PR. Open decisions: confirm brand-owner approval of the muted-text/amber additions and the official logo master files (these SVGs come from session 2's build).
