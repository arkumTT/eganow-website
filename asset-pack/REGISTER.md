# Asset register (what is actually in the site)

| ID | File(s) | Used on | Source | Created | Status |
|---|---|---|---|---|---|
| P01 | `eganow-business/assets/img/p01-home-hero-model_cutout_{600,1000}.webp` (transparent cut-out, 74 KB / 172 KB) | Home hero | **AI-generated** with Magnific (free plan, auto model), then Magnific background removal. Prompt: `ASSETS.md` P01 (red studio backdrop; the cut-out sits on the CSS brand red). | 2026-11-23 | Placeholder-quality stand-in: replace with the real shoot (SHOTLIST P01) |
| P02 | `eganow-business/assets/img/p02-uk-to-ghana-video-call_{800,1400}.webp` (89 KB / 35 KB) | Home "Send money home" band; Money Transfer, UK, US, Canada "Seamless transfer" | **AI-generated** with Magnific (free plan, auto model). Prompt: `ASSETS.md` P02. | 2026-11-23 | Stand-in. The scene is a London flat; US/Canada pages reuse it until corridor-specific photos exist (P02b/c) |
| P02b | `p02b-us-to-ghana-video-call_{800,1400}.webp` (23 / 56 KB) | US page "Seamless transfer" | **AI-generated** (Magnific free plan). Prompt: P02 adapted (Houston living room) | 2026-11-23 | Stand-in |
| P02c | `p02c-canada-to-ghana-video-call_{800,1400}.webp` (25 / 59 KB) | Canada page "Seamless transfer" | **AI-generated** (Magnific free plan). Prompt: P02 adapted (Toronto kitchen, snow) | 2026-11-23 | Stand-in |
| P04 | `p04-bills-at-home_{800,1400}.webp` (25 / 52 KB) | Bill Payment "Scheduled payments" | **AI-generated** (Magnific free plan). Prompt: `ASSETS.md` P04 | 2026-11-23 | Stand-in |
| P05 | `p05-card-abroad_{800,1400}.webp` (26 / 52 KB) | Cards "Shop. Pay. Stream. Travel." | **AI-generated** (Magnific free plan). Prompt: `ASSETS.md` P05 (plain red card, no network logos; the Mastercard mark is only in text) | 2026-11-23 | Stand-in |
| P08 | `p08-bizcollect-market-stall_{800,1400}.webp` | BizCollect hero | **AI-generated** (Magnific free plan). Prompt: `ASSETS.md` P08 | 2026-11-23 | Stand-in |
| P09 | `p09-egapos-boutique_{800,1400}.webp` | EgaPOS hero | **AI-generated** (Magnific free plan). Prompt: P09 | 2026-11-23 | Stand-in |
| P10 | `p10-card-issuing-office_{800,1400}.webp` | Card Issuing hero | **AI-generated** (Magnific free plan). Prompt: P10 | 2026-11-23 | Stand-in |
| P11 | `p11-agency-banking-kiosk_{800,1400}.webp` | Agency Banking hero | **AI-generated** (Magnific free plan). Prompt: P11. Shows banknotes (generated, not a real currency design); review before launch | 2026-11-23 | Stand-in |
| P12 | `p12-bulk-messaging-retail_{800,1400}.webp` | Bulk Messaging hero | **AI-generated** (Magnific free plan). Prompt: P12. Tablet/phone screens show blurred pseudo-UI | 2026-11-23 | Stand-in |
| P13 | `p13-egahub-market-merchant_{800,1400}.webp` | Egahub hero | **AI-generated** (Magnific free plan). Prompt: P13 | 2026-11-23 | Stand-in |
| fonts | `eganow-business/assets/fonts/*.woff2` + `assets/fonts.css` | all pages | Inter (400/600) and Manrope (variable 600–800), latin + latin-ext (includes the cedi sign), downloaded from Google Fonts (SIL Open Font License) | 2026-11-23 | Self-hosted; no third-party font requests |

## Generated but deliberately NOT used
- **P14 team portrait** (AI group of six): not used on About. The About page names real board and management members, so an AI team photo would be misleading. Use the real staff shoot (SHOTLIST P14). The image exists in the Magnific project if you want it for internal mock-ups only.
- Business hub, Developers, Help, Security, Legal and Blog pages have no photography by design (hub/developers use product mock-ups; the rest are editorial pages).

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
