# Production pipeline

## 1. Setup
1. Read `STYLE.md`; pick one reference image per page as the style anchor.
2. Import `assets.csv` into your tracker; add columns *owner, status, version, licence, AI-generated (Y/N)*.
3. Create a shared folder structure: `/masters` (4K/RAW), `/web` (optimised), `/source` (PSD/Figma/AEP), `/releases`.

## 2. Tool routing
| Asset | Route |
|---|---|
| People (P-series) | Real shoot (SHOTLIST) → retouch. Concepts/placeholders: Magnific/Higgsfield/Figma Weave with ASSETS prompts |
| 3D (D-series) | Meshy or Magnific for base forms → Blender/Spline for lighting, alpha, turntables |
| Motion (M-series) | After Effects → Bodymovin Lottie; Remotion for MP4/WebM loops; Magnific/Higgsfield for photoreal clips |
| UI (U-series) | Figma (real components) → export @2x; frames feed M02 |
| Text-bearing (OG, badges, QR) | Figma/Canva with real fonts; official store badges; never AI text |

## 3. Generation tactics (AI)
- Generate 4–8 candidates, pick one, then upscale (Magnific upscaler) and fix hands/phones in Photoshop/Firefly.
- Lock consistency: reuse the same seed/reference image, same lens phrase and grade; generate a page's images in one session.
- For sets (D06 icons) generate as a grid then slice.
- Cut-outs: image_remove_background, then manual hair clean-up on red and dark backgrounds (check no fringe).
- Never rely on the model for text, logos, flags with fine detail, or currency design.

## 4. Optimisation budgets
| Type | Format | Budget |
|---|---|---|
| Hero photo | AVIF/WebP, 2 sizes + `srcset` | ≤ 180 KB (desktop), ≤ 90 KB (mobile); LCP image preloaded, never animated |
| Photo (other) | WebP | ≤ 120 KB |
| 3D transparent | WebP alpha | ≤ 150 KB static; turntable ≤ 600 KB WebM |
| Lottie | JSON | ≤ 150 KB, poster ≤ 150 KB; strip embedded bitmaps and third-party badges |
| UI screens | PNG→WebP @2x | ≤ 100 KB each |
| Page total (above the fold) | — | ≤ 500 KB images; test on mid-range Android over 3G/4G |

Naming: `{id}-{slug}_{variant}_{width}.{ext}`, e.g. `p01-home-hero-model_cutout_1600.webp`. Always add descriptive `alt` text (what is happening); empty alt for decorative.

## 5. QA checklist (per asset)
- [ ] Matches prompt intent and STYLE; one red accent; palette on brand
- [ ] No garbled text, logos, real brands, or readable UI
- [ ] Hands/faces/phones correct at 100 % zoom; no plastic skin
- [ ] Negative space where the layout needs copy; works at mobile crop
- [ ] Contrast of overlaid text ≥ 4.5:1 (add scrim if needed)
- [ ] File budget met; poster provided for motion; reduced-motion tested
- [ ] Licence/release recorded; AI-generated flagged

## 6. Legal & ethics
- Real people: signed releases for every identifiable person; keep indexed by asset ID.
- AI imagery: don't present as real customers/staff/testimonials; keep a register of tool, prompt, date; check each tool's commercial licence terms before launch; consider disclosure per local advertising rules.
- Third-party marks (Mastercard, Visa, MTN, Telecel, AirtelTigo, Apple/Google badges): use official brand assets under their guidelines only.
- Financial claims in visuals (rates, savings) must be labelled "Illustrative" and approved by compliance.
- Check cultural accuracy (clothing, settings, language) with local reviewers.

## 7. Placement map
Home: P01, P16, D01, D02, M01, M02, U01–U04 · Money Transfer: P02/b/c, P03, M03, D05 · Bill Payment: P04, D06 · Cards: P05, D02, M04 · Groups: P06, P07, D07 · Business hub: D02, D03, U05 · BizCollect: P08, U05 · EgaPOS: P09, D03, D04, M05 · Card Issuing: P10, D02 · Agency Banking: P11, D09, M06 · Bulk Messaging: P12, D10, M07 · Egahub: P13, D01, U06 · About: P14 · Security: D08/P15 · Social: B01.

## 8. Handoff
Deliver `/web` to the build repo under `assets/img/{page}/`, update the page generators (`eganow-business/build.py`) to replace CSS mocks with the real images, and run Lighthouse (LCP, CLS) before sign-off.
