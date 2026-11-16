# Eganow Website — Build Plan

Status: draft v1 · Scope: Personal (consumer app) site + Business (merchant) site, one codebase.

> **Inputs and gaps.** Reviewed: the reference video (`38994508.mp4`), the Eganow design system (README + `tokens.json`), and the repo (only a Zoho "Send a message" form: `index.html`, `form.css`, `validation.js`, `salesiqintegration.js`).
> **Not reviewed:** `eganow.com` (blocked by this session's network allowlist) and the six inspiration sites. All content below is built from your brief; **section 12 lists what must be verified against the live site** (copy, legal text, partner logos, stats, app-store URLs, brand assets). Allow `eganow.com` and re-run a content audit before copywriting starts.

---

## 1. Goals & the one-line idea

**"Simple. Speed. Secure."** (the 3 S's) is the spine of every page, headline and animation.

- **Simple** → few words, one action per screen, calm layouts.
- **Speed** → fast page, fast motion, "in seconds" proof points.
- **Secure** → Bank of Ghana licensed, Mastercard, PCI-style trust cues.

Primary goals: (1) app installs (Personal), (2) merchant sign-ups / sales leads (Business), (3) trust (licensing, security, support).

## 2. Information architecture & sitemap

```
/                         Personal landing (scrollytelling, phone story)
/business                 Business landing (seamless service flow)
/personal/
   money-transfer         Cross-border + local
   bill-payments
   cards                  Virtual & physical Mastercard
   groups                 Private & public contributions
/business/
   bizcollect             Collections (API, Hosted Checkout, Payment Link, USSD), Payouts, Dashboard
   egapos                 Device issuing + POS management platform
   card-issuing           Org expense cards + re-issuer / API programme
   agency-banking         Cash in / cash out agents
   bulk-messaging         Bulk SMS + email
   egahub                 Mobile merchant app
   developers             API docs landing (links to docs site), sandbox sign-up
/pricing                  DROPPED by decision: no public pricing page. Quotes go through /contact?topic=sales
/about                    Story, licence, team, partners
/security                 Security & compliance, licences
/help                     FAQ, support channels, status link
/contact                  Contact form (reuse existing Zoho form), sales vs support routes
/blog (or /news)          Optional, phase 2
/legal/terms  /legal/privacy  /legal/cookies  /legal/aml-policy  /legal/complaints
/404  /sitemap.xml  /robots.txt  /manifest.webmanifest  /.well-known/security.txt
```

**Global nav:** Personal · Business · Pricing · About · Help — with a **Personal ⇄ Business toggle** (pill switch). The toggle swaps the accent colour (red ⇄ blue), nav links and CTA. Primary CTAs: `Get the app` (red) / `Open a business account` (blue) + `Talk to sales`.

## 3. Page-by-page content blueprint

### 3.1 Personal landing `/` — "A day in the life" scrollytelling

**Hero.** Headline (display-xl): *"Money that moves with you."* Sub: *Send, pay, spend and save. Simple, fast, secure.* Buttons: **App Store**, **Google Play**, and a secondary pill **"For business →"** (blue). The **character** (see §5) stands between two worlds: a red-lit phone world on the left, a blue-lit storefront/dashboard world on the right. Scrolling begins the story.

**Story chapters** (pinned phone, screens swap on scroll; the character walks through each):

| # | Chapter | Headline (draft) | Phone screen shows | 3S proof |
|---|---|---|---|---|
| 1 | Money Transfer | *Send home. Send anywhere.* | Pick recipient → amount → FX rate → "Sent" confetti | Speed: "in minutes" · Secure: encrypted |
| 2 | Bill Payments | *Bills? Done before the kettle boils.* | Utility/airtime/TV grid → pay → receipt | Simple: 3 taps |
| 3 | Cards | *Your card. Instant.* | Mastercard virtual card flips in; freeze toggle; "order physical" | Secure: freeze, limits |
| 4 | Groups | *Pool it. Together.* | Group with avatars, progress ring, contribute; private vs public | Simple |
| 5 | Trust | *Licensed. Protected. Yours.* | Bank of Ghana licence, Mastercard mark, security features | Secure |
| 6 | Download | *Ready when you are.* | QR code (desktop) / store buttons (mobile) | — |

Then: **"Meet Eganow Business"** bridge section (colour wipes red → blue) leading to `/business`; FAQ; footer.

### 3.2 Business landing `/business` — seamless flow

Full-bleed sections that **morph into each other** (shared-element transitions, continuous background colour wash, moving imagery), one per service: BizCollect → EgaPOS → Card Issuing → Agency Banking → Bulk Messaging → Egahub. Each: overline, 4–6 word headline, 1 line of copy, 3 bullets, motion visual, "Learn more" link. Close with integration logos/API snippet, trust strip, "Talk to sales / Create account" form.

Sticky side-index (01–06) shows progress; works as a nav.

### 3.3 Service detail pages (all 10)

Common template: Hero (visual + CTA) → What it does (3S triad) → How it works (3–4 step animation) → Features grid → Use cases / who it's for → Pricing teaser → FAQ → CTA. Service specifics:

- **BizCollect:** four collection tabs — *API* (code snippet with copy button, language switcher), *Hosted Checkout* (live-looking mock), *Payment Link* (create-link demo), *USSD* (animated feature-phone dial flow). Then *Payouts* and *Transactions dashboard* (animated chart mock — use `dataviz` skill rules).
- **EgaPOS:** device carousel (3D/parallax), device issuing process, POS management platform screenshots.
- **Card Issuing (Business):** two audiences — *Issue for your organisation's expenses* and *Become a re-issuer* (for your members/customers; via portal or API). Include an API snippet and a programme-application form.
- **Agency Banking:** deposit/withdrawal flow, "become an agent" CTA, agent locator (phase 2).
- **Bulk Messaging:** SMS + email composer animation, delivery stats, sender-ID info.
- **Egahub:** mobile-app showcase mirroring the Personal phone story, in blue.
- **Developers:** quickstart, sandbox sign-up, links to API reference (hosted separately — recommend Mintlify/Docusaurus on `docs.eganow.com`).

## 4. Design system application

Source: the Eganow Brand Assets system (note: it ships tokens only — no components, spacing or radius tokens).

- **Colour:** `eganow-red #cc0229` = Personal + primary actions; `eganow-blue #1f8fff` = Business. Neutrals `neutral-0…950`; semantic `surface / text / border` tokens. **Don't introduce other reds/blues.**
- **Type:** Poppins (display, buttons, labels, money — 500/600/700) + Inter (body — 400/500). Step display sizes down one level on phones. Self-host WOFF2 subsets (Latin) with `font-display: swap` and preload only Poppins 600/700 + Inter 400.
- **Contrast rules to bake in:** white on red passes (5.8:1); **white on blue only ≥24px** (3.3:1) — so small blue buttons use `neutral-950` text or a blue outline/tint; blue as large fills/icons/accents.
- **Gaps to fill (propose, then add to the design-system artifact):** spacing scale (4-pt: 4/8/12/16/24/32/48/64/96/128), radius (8 / 16 / 24 / full), shadow/elevation, motion tokens (durations 150/300/600/1000 ms; easings `cubic-bezier(.22,1,.36,1)` out-expo, `cubic-bezier(.65,0,.35,1)` in-out), breakpoints (360 / 640 / 1024 / 1440), a dark section theme (`neutral-950` for hero/dark chapters is already hinted).
- **Components to build:** Button (primary/secondary/ghost × red/blue), Pill toggle, Nav + mega-menu, Store badges, Phone frame, Card (service/feature/pricing), Accordion, Tabs, Code block, Form fields, Toast, Footer, Cookie banner, Section overline.
- **Tokens pipeline:** export `tokens.json` → CSS custom properties (`tokens.css`) at build; theme switched with `[data-world="personal|business"]` on `<body>` remapping `--accent`.

## 5. Concept & motion direction

### 5.1 Reference-video takeaways (`38994508.mp4`, 41 s, 960×540)
It's a stock mobile-app promo template. What to borrow (not copy): **bold diagonal colour planes** sweeping behind the phone; **phone enters tilted/3D, then rotates upright** per scene; **text lock-ups with a black line + red line** ("Mobile App / *Promo Mockup*"); **thin glitch/speed lines** (a perfect "Speed" motif); phones **duplicating/staggering** into a row; **white-to-red wipes** as transitions. Map to Eganow: red planes (Personal) wipe to blue planes (Business); speed lines = "Speed"; layered phones = "Simple" step-by-step; keep the Envato branding/placeholder text out.

### 5.2 The character
A single friendly guide ("**Ega**", working name — confirm) who travels both worlds: red scarf/outfit accents in Personal, blue in Business. Rendered as a **Rive or Lottie 2D vector rig** (small, interactive, ~50–150 KB) — not video, not 3D — with 4–6 poses/loops (walk, point, hold phone, tap, celebrate, hand-over to merchant). Alternatives to evaluate in week 1: stylised 3D character baked to a sprite sequence (heavier) or a faceless flat-illustration style (cheapest, most consistent). **Decision needed** — see §13.

**Decision (v2):** the guide is a **photographic studio cut-out of an African woman** (not a cartoon), generated with Magnific as a transparent WebP (24 KB at 420 px, 54 KB at 832 px). One photo, two scarf colours: red for Personal, blue (`#1f8fff`) for Business, crossfaded at the hand-over. She is decorative (`alt=""`); every chapter states its message in text. **Open items:** confirm AI-generated-likeness policy/usage rights with Eganow legal, consider a real photoshoot with additional poses (pointing, celebrating, handing over a POS), and decide whether a second person is wanted.

**Decision (v3, current): no character on the Personal page.** The photographic guide was removed after review ("not working for me"); the Personal story is now copy on the left and the phone on the right. The component and images were deleted and remain in git history (commit "Replace cartoon guide with a photographic African woman cut-out") if the idea is revisited. If a human guide is wanted later, a real photoshoot with several poses is recommended over AI-generated cut-outs.

**Brand logo:** the real Eganow logo from the design system is used everywhere: red wordmark in the header, white wordmark on dark footers and the in-phone splash, the icon as favicon/app icons (SVG + 32/180/192/512 px PNG) and in `manifest.webmanifest`. Files live in `public/brand/` and are byte-identical to the design-system originals (SHA-256 verified).

**Legal and Help (drafts):** `/legal/*` and `/help` exist as structured drafts. Eganow-specific facts are `[[highlighted placeholders]]`. Two switches (`src/data/legal-status.ts` and `src/data/help.ts`) keep them `noindex` and bannered; turning a switch off while any placeholder remains **fails the build**. Counsel must approve legal text and support must confirm help answers before launch.

**Security and About (drafts):** `/security` and `/about` exist as structured drafts, `noindex`, with a draft note. Company facts, people, partners, certifications and security specifics are `[[highlighted placeholders]]`; `src/data/company-status.ts` is the switch (turning it off while any placeholder remains fails the build). Security claims must be verified by Eganow's security/compliance team: only claims that can be proven should be published. Public news reports describe Eganow as owned by Teksol with a Bank of Ghana Enhanced PSP licence; confirm before stating either.

### 5.3 Scrollytelling mechanics
- Pin the phone; scrub a timeline with scroll (GSAP ScrollTrigger, `scrub: 0.6`). Each chapter = one scroll "page" (≈100–150 vh).
- Phone screens are **HTML/CSS screens inside a CSS frame** (crisp, tiny, accessible) or short **WebM/AV1+MP4 loops** for complex UI; swap with crossfade/clip-path.
- Background: diagonal planes via `clip-path`/transform (GPU-only), speed lines as SVG with `stroke-dashoffset`.
- Business page: sections cross-fade and **morph** (View Transitions API / FLIP) with a continuous parallax image layer.
- Smooth scroll via **Lenis** (≈3 KB) — optional and disabled for reduced-motion / low-power.
- **Always provide a no-JS/reduced-motion fallback:** stacked, static sections with the same content.
- Mobile: same story but lighter — vertical pinned phone, fewer layers, tap-to-advance chips under the phone as an alternative to scrub.

### 5.4 Messaging (voice: simple, punchy, warm)
Rules: ≤6-word headlines, verbs first, no jargon, sentence-case, numbers over adjectives. Draft lines:
- Brand: *Simple. Speed. Secure.* · *Money, made simple.*
- Transfer: *Send home in minutes.* · Bills: *Pay. Done.* · Cards: *Your card, instantly.* · Groups: *Pool it together.*
- BizCollect: *Get paid in seconds.* · EgaPOS: *Tap. Paid.* · Card Issuing: *Issue cards. Control spend.* · Agency: *Cash in. Cash out. Anywhere.* · Bulk messaging: *Reach everyone. Instantly.* · Egahub: *Your business, in your pocket.*
(Final copy to be reviewed against `brand-voice` skill and legal/compliance — avoid unverified claims like "instant" or "lowest fees".)

## 6. Technical architecture (light & fast)

**Recommendation: Astro (static output) + TypeScript + GSAP/ScrollTrigger (+Lenis) + vanilla CSS with tokens.**
Why: ships near-zero JS by default; animation code loads only on pages/sections that need it ("islands"); easy content collections for services/FAQ/legal; great image pipeline. Considered and rejected: Next.js/React (heavier baseline, unnecessary), Webflow/Framer (fast to prototype but weaker control over performance/accessibility/i18n and design-token fidelity — fine for a throwaway prototype only).

- **Animation libs:** GSAP core + ScrollTrigger (~45 KB gz total; now free) loaded lazily after first paint; use native CSS `animation-timeline: scroll()/view()` where supported (progressive enhancement) for simple reveals; Rive/Lottie runtime only on pages with the character (lazy, `IntersectionObserver`).
- **Images:** AVIF/WebP via Astro `<Image>`, responsive `srcset`, explicit dimensions (zero CLS). Inline small SVGs. No stock photography >150 KB.
- **Video:** only short muted loops (≤1.5 MB each, AV1/WebM + H.264 fallback), `preload="none"` below the fold, poster = LCP-safe image.
- **Fonts:** self-hosted subset WOFF2, 2 preloads.
- **Hosting/CDN:** Cloudflare Pages (global edge, Brotli, HTTP/3, headers file); Ghana-adjacent PoPs. Forms via a small Worker/serverless endpoint (reuse existing Zoho form action, proxied) with Cloudflare Turnstile.
- **CMS (phase 2):** git-based (Decap/Keystatic) or Sanity for blog, FAQ, pricing so non-devs can edit without redeploys.
- **Repo layout:** `src/pages`, `src/components`, `src/content`, `src/styles/tokens.css`, `src/scripts/story/*` (one module per chapter), `public/assets`.
- **Existing repo files:** the Zoho form (`index.html`, `form.css`, `validation.js`, `salesiqintegration.js`) is moved to `/contact` as a component or kept as an embedded fallback; the placeholder root `index.html` is replaced. Keep the Zoho endpoint working.

### Performance budget (enforced in CI)
| Metric | Target (mid-range Android, Slow 4G) |
|---|---|
| LCP | ≤ 2.0 s (hero image/poster, not video) |
| INP | ≤ 200 ms · CLS ≤ 0.05 · TBT ≤ 200 ms |
| Initial JS | ≤ 70 KB gz (animation JS lazy, ≤ 80 KB more) |
| Initial transfer, above the fold | ≤ 400 KB |
| Whole landing page | ≤ 2.5 MB incl. lazy media; each video ≤ 1.5 MB |
| Lighthouse | Perf ≥ 90 mobile, A11y/SEO/Best-practices ≥ 95 |

Tactics: lazy-hydrate each chapter when within 1 viewport; pause/destroy ScrollTriggers off-screen; `will-change` only during motion; respect `prefers-reduced-motion`, `prefers-reduced-data` and `Save-Data` (swap video for stills, disable Lenis); device-memory check to downgrade effects on low-end phones; Lighthouse CI + WebPageTest on a Moto G-class profile.

## 7. Responsive strategy
Mobile-first; breakpoints 360 / 640 / 1024 / 1440 (+ fluid `clamp()` type). Pinned scrollytelling on mobile uses **sticky phone at top 55 vh, text below**; desktop uses **two-column pinned stage**. Touch targets ≥ 44 px; safe-area insets; test on 360×640 up to ultrawide; landscape phones and foldables; sticky mobile CTA bar (store badge appropriate to OS — iOS→App Store, Android→Play, desktop→QR).

## 8. Standard website feature checklist

**Accessibility (target WCAG 2.2 AA)**: semantic landmarks; skip-to-content; visible focus rings (≥3:1); full keyboard operation incl. pinned stories (chapter buttons, no scroll-jacking traps); `prefers-reduced-motion` static mode + a visible "Pause animations" toggle; text alternatives for all imagery/phone screens (`aria-label` summarising each chapter); transcripts/captions for any video with narration; colour-contrast per §4; resizable text to 200 %; no content in canvas only; ARIA only where needed; form labels/errors linked; test with VoiceOver, TalkBack, NVDA, axe, Pa11y.

**SEO & discoverability**: per-page title/meta/canonical, OG + Twitter cards (per service share images), JSON-LD (`Organization`, `FinancialService`, `FAQPage`, `BreadcrumbList`, `SoftwareApplication` for apps), `sitemap.xml`, `robots.txt`, clean URLs, 301 map from the existing `eganow.com` URLs, hreflang if multilingual, semantic H1–H3 on every page (the story must still be crawlable as plain text), `llms.txt`/AI-search friendly FAQ content.

**Trust & compliance (fintech)**: Bank of Ghana licence statement and number (Enhanced PSP — verify), Mastercard attribution/trademark use per brand guidelines, risk/fees disclosures, FX disclaimer, T&Cs, Privacy (Ghana Data Protection Act 843 — verify with counsel), cookie consent (only if non-essential trackers), AML/KYC page, complaints process, security.txt, HTTPS + HSTS, CSP, SRI, no financial data in the marketing site.

**Conversion & utility**: store badges with OS-aware deep links + UTM/attribution (AppsFlyer/Adjust smart links — decide), QR for desktop, contact forms (support/sales/agent/re-issuer/merchant onboarding) with spam protection (Turnstile), chat widget (Zoho SalesIQ already used — load lazily on interaction), calculators (transfer fee/FX estimator, pricing estimator — phase 2), status page link, FAQ search, 404, newsletter (optional).

**Analytics & ops**: privacy-friendly analytics (Plausible/PostHog/GA4 — decide) with event plan (store click, business CTA, form submit, chapter reached), error monitoring (Sentry), uptime, Search Console, consent mode, A/B testing hooks for hero copy.

**i18n readiness**: English first; copy extracted to content files; layout tolerant of ~30 % longer strings; plan for French (cross-border corridors) / local languages later. **Currency/locale:** GHS formatting, 24-hr/GMT dates.

**Security hardening:** static-site attack surface, CSP w/ nonces, Trusted Types where feasible, dependency scanning (Dependabot/`npm audit`), secrets only in CI, Turnstile + rate limit on form endpoints.

## 9. Assets & production pipeline

| Asset | Source | Notes |
|---|---|---|
| Logo, brand marks, favicon set | existing brand assets (design-system artifact Assets: 3 files) | SVG; red & blue lock-ups |
| App screens (consumer + Egahub) | export real UI from product/Figma | recreate as HTML where possible |
| Character rig | commission/illustrate → Rive/Lottie | needs sign-off (§13) |
| Diagonal planes, speed lines, 3D phone | CSS/SVG + optional baked WebM | derived from video language |
| Device photos (POS, cards) | client photography or 3D renders | AVIF; transparent PNG→AVIF |
| Hero/background video loops | generated (Higgsfield/Magnific/Kling) or Remotion-rendered from our own HTML | ≤1.5 MB each |
| Icons | single SVG sprite, 24 px grid, stroke 1.75 | |
| Copy | writing pass using `brand-voice`/`ux-copy` skills | compliance review |
| OG/share images | generated per page at build (Satori/`@vercel/og`-style) | |

## 10. Phased delivery

| Phase | Weeks | Output | Exit criteria |
|---|---|---|---|
| 0 Discovery | 1 | Content audit of eganow.com (needs network access), asset inventory, analytics/legal decisions, character decision, Figma kit | Signed IA + copy deck outline |
| 1 Design | 2–3 | Design-system completion (spacing/radius/motion tokens), component kit, hi-fi desktop + mobile for Home, Business, one service page, storyboard of the scrollytelling (frame-by-frame) | Stakeholder approval |
| 2 Prototype | 4 | Coded vertical slice: Hero + 2 chapters + Business transition; perf test on real low-end Android | Meets perf budget, motion approved |
| 3 Build | 5–8 | All pages, forms, CMS hooks, SEO, analytics, a11y fixes | Feature-complete on staging |
| 4 QA & content | 9 | Cross-browser/device, a11y audit, Lighthouse CI, legal review, copy freeze | 0 blockers |
| 5 Launch | 10 | Redirect map, DNS/CDN cutover, monitoring, hypercare | Live; Core Web Vitals green on field data |

Parallel tracks: character/illustration, copywriting, legal review, app-store link/attribution.

## 11. Tools, skills & MCPs recommended

**Already available in this environment**
- **Skills:** `website-design:landing-page`, `website-design:web-design-system` / `design-system` (DESIGN.md), `website-design:web-review`, `frontend-design:frontend-design`, `animation-studio`, `vectorlab-ux-skills:motion / transitions / reduced-motion / viewports / anti-slop`, `design-skills:accessibility-audit / design-systems / ux-writing`, `design:accessibility-review`, `brand-voice:*` (messaging), `marketing:seo-audit`, `cloudflare:web-perf / workers-development / frameworks-on-cloudflare` (hosting + perf), `remotion:*` (programmatic motion video loops), `motion-reel`, `codesign:*` (OG/social/graphic assets), `dataviz` (dashboard mocks), `legal:compliance-check`.
- **MCPs:** **Figma** (design ⇄ code, motion context, Code Connect), **Higgsfield / Magnific** (image + video + 3D generation, background removal, SVG, upscaling, scene3d for the character/phone), **GitHub** (repo + PRs), **Cloudflare** (deploy/perf — failed to connect this session; reconnect), **A1 Gallery** (measured values from real sites for the six inspirations — failed to connect; reconnect), **Claude Artifacts** (share plan/prototypes).
- **Playwright + Chromium** (pre-installed) for screenshot QA at all breakpoints, and Lighthouse via headless Chromium.

**Worth adding:** Rive (or LottieFiles) for the character, Lenis, GSAP, Astro; Lighthouse CI + axe-core + Pa11y in CI; Sentry; Plausible/PostHog; AppsFlyer/Adjust or Branch for smart store links; Mintlify/Docusaurus for dev docs; Sanity/Decap for CMS; Cloudflare Turnstile.

## 12. Things to verify from `eganow.com` (blocked here)
Exact service names/claims, fee tables and corridors, partner/bank/MNO logos, regulator statements and licence number, team/leadership, office addresses/phones/emails, social links, store URLs, existing brand imagery licensing, current URL list (for redirects), tone of existing copy, legal pages. Also confirm: "Egahub", "BizCollect", "EgaPOS" are final product names (my public web search could not confirm them; a news item only confirmed the BoG Enhanced PSP licence covering merchant aggregation, EMV card printing, remittances and POS).

## 13. Decisions needed from you
1. **Character:** 2D flat vector (Rive/Lottie, recommended) vs 3D baked vs none (phone-only story). Name/persona and who illustrates.
2. **Stack:** OK with Astro + GSAP on Cloudflare Pages? (Or must it live on an existing host/WordPress/Hostinger?)
3. **Languages** at launch (English only?) and **markets** (Ghana only vs cross-border corridors → affects copy, pricing, legal).
4. **Analytics/attribution** vendor and cookie-consent need.
5. **Developer docs** location (existing docs site?) and sandbox sign-up URL.
6. **Pricing page:** publish public rates or "contact sales" for business?
7. Access: allow `eganow.com` for the content audit; share the real app screens/Figma and brand asset files; confirm Mastercard asset permissions.
8. Is the dark mode needed? (Brand system currently defines a light theme only.)

## 14. Risks
- **Scroll-jank on low-end phones** → budgeted lighter mobile path, perf CI, reduced-effects fallback.
- **Over-animated, under-explained** → every chapter must still state the service in plain text; a11y/static mode mandatory.
- **Claims & compliance** (licence, "instant", fees, Mastercard marks) → legal review gate before copy freeze.
- **Blue contrast** → follow §4 rules; add blue-on-dark-neutral button variants.
- **Asset dependency** (character, device renders, real screens) → start sourcing in Phase 0.
- **Two sites in one** → one design system, shared components, a `data-world` theme switch to avoid duplication.
