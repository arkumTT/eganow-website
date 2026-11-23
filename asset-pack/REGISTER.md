# Asset register (what is actually in the site)

| ID | File(s) | Used on | Source | Created | Status |
|---|---|---|---|---|---|
| P01 | `eganow-business/assets/img/p01-home-hero-model_cutout_{600,1000}.webp` (transparent cut-out, 74 KB / 172 KB) | Home hero | **AI-generated** with Magnific (free plan, auto model), then Magnific background removal. Prompt: `ASSETS.md` P01 (red studio backdrop; the cut-out sits on the CSS brand red). | 2026-11-23 | Placeholder-quality stand-in: replace with the real shoot (SHOTLIST P01) |
| P02 | `eganow-business/assets/img/p02-uk-to-ghana-video-call_{800,1400}.webp` (89 KB / 35 KB) | Home "Send money home" band; Money Transfer, UK, US, Canada "Seamless transfer" | **AI-generated** with Magnific (free plan, auto model). Prompt: `ASSETS.md` P02. | 2026-11-23 | Stand-in. The scene is a London flat; US/Canada pages reuse it until corridor-specific photos exist (P02b/c) |
| P02b | `p02b-us-to-ghana-video-call_{800,1400}.webp` (23 / 56 KB) | US page "Seamless transfer" | **AI-generated** (Magnific free plan). Prompt: P02 adapted (Houston living room) | 2026-11-23 | Stand-in |
| P02c | `p02c-canada-to-ghana-video-call_{800,1400}.webp` (25 / 59 KB) | Canada page "Seamless transfer" | **AI-generated** (Magnific free plan). Prompt: P02 adapted (Toronto kitchen, snow) | 2026-11-23 | Stand-in |
| P04 | `p04-bills-at-home_{800,1400}.webp` (25 / 52 KB) | Bill Payment "Scheduled payments" | **AI-generated** (Magnific free plan). Prompt: `ASSETS.md` P04 | 2026-11-23 | Stand-in |
| P05 | `p05-card-abroad_{800,1400}.webp` (26 / 52 KB) | Cards "Shop. Pay. Stream. Travel." | **AI-generated** (Magnific free plan). Prompt: `ASSETS.md` P05 (plain red card, no network logos; the Mastercard mark is only in text) | 2026-11-23 | Stand-in |
| fonts | `eganow-business/assets/fonts/*.woff2` + `assets/fonts.css` | all pages | Inter (400/600) and Manrope (variable 600–800), latin + latin-ext (includes the cedi sign), downloaded from Google Fonts (SIL Open Font License) | 2026-11-23 | Self-hosted; no third-party font requests |

## Generated but rejected (not shipped)
- **D01 phone render**: the screen UI contained garbled text ("#C0229"). The site uses CSS/HTML phone mock-ups instead.
- Batch 2 alternates not used: a second Canada/US/bills/cards variant each (US variant had awkward hand gesture; cards variant 2 cropped the face).
- **D02 card trio**: cards were flat and not fanned as briefed; the site keeps CSS cards. Both need another pass (consider Meshy/Blender per PIPELINE.md).

## Before launch (checklist from PIPELINE.md)
- [ ] Confirm commercial-use terms for the plan used (Magnific **free** plan) before publishing AI images; keep this register.
- [ ] Disclose/replace AI imagery per local advertising rules; never use it as a real customer/staff testimonial (it currently appears as brand illustration only).
- [ ] Replace P01/P02 with licensed photography from the shoot, same filenames/dimensions so no code changes are needed (re-run `python3 eganow-business/build.py && python3 deploy/assemble.py`).
- [ ] Add the page-level alt text for P02 variants for US/Canada, and a meaningful alt for P01 if it ever stops being decorative (it is `alt=""` because the nearby cards and headline carry the message).
- [ ] Budgets met: hero image ≤ 180 KB desktop (172 KB), ≤ 90 KB mobile (74 KB); photo band ≤ 120 KB (89 KB).

## Provenance links (Magnific "Personal" project)
P01 original and cut-out, P02 original: kept in the Magnific creations list for the account that ran this session (originals are 2512×1664).
