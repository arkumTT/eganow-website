# QA report — new Eganow site (20 pages)

Scope: every page built in `eganow-business/` (Home, Money Transfer ×4, Bill Payment, Cards, Groups, Business hub + 7 service pages, About, Contact, Help, Security) as assembled in `deploy/dist` and served by `deploy/serve.py`. Date: 2026-11-23. Tools: axe-core 4 (WCAG 2.0/2.1 A+AA + best-practice), Lighthouse 13 (headless Chromium, local server, no throttled real network), Playwright, static HTML checks.

## Fixed during this pass
| # | Finding | Fix |
|---|---|---|
| 1 | Page titles on Home/Personal/Company pages ended "| Eganow Business" | Suffix is now "Eganow Business" only under `/business/*`, otherwise "Eganow" |
| 2 | Meta descriptions 193–208 chars on Money Transfer pages | Trimmed to the ≤160-char corridor intro |
| 3 | Heading order: decorative mock titles were `<h5>` (h1→h5), feature headings were `<h3>` straight after `<h1>`, contact/help/about used `<h3>` after `<h1>` | Mock titles are now `<p class="mk-h">`; split-section headings and contact/help/about sub-headings are `<h2>`; axe heading-order cleared |
| 4 | Contrast: inactive scroll-story steps (opacity .35) failed (1.95:1); green status pills 4.4:1 | Story steps stay full-opacity with a red left-border active indicator; success colour darkened `#12805C → #0D6647` (6.3:1) in tokens, CSS and DESIGN.md |
| 5 | Developers code samples scrollable but not keyboard-focusable | `tabindex=0` + `role=group` + label on the real (non-decorative) code blocks; decorative ones (inside `aria-hidden`) stay unfocusable (Lighthouse `aria-hidden-focus` cleared) |
| 6 | CLS 0.129 on Money Transfer (calculator card grew as quote/payout chips loaded) | Reserved heights for expiry line, rate rows, payout chips and sample badge → CLS 0.012 desktop / 0.004 mobile |
| 7 | At 320–375 px, text in split sections (hub, BizCollect, Card Issuing) ran past the screen edge because code blocks forced grid children wider | `min-width:0` on grid children + `.code{max-width:100%}`; re-tested at 320/375/768 |

## Results after fixes
**Lighthouse (local, fonts blocked/unthrottled where noted)**
| Page | Perf (mob/desk) | A11y | Best practices | SEO | LCP mob/desk | CLS |
|---|---|---|---|---|---|---|
| Home | 99 / 100 | 100 | 100 | 100 | 1.6 s / 0.5 s | 0 |
| Money Transfer | 99 / 100 | 100 | 100 | 100 | 1.6 s / 0.5 s | 0.004 / 0.012 |
| BizCollect | 99 / 100 | 100 | 100 | 100 | 1.6 s / 0.5 s | 0 / 0.003 |
| Help | 99 / 100 | 100 | 100 | 69 | 1.6 s / 0.5 s | ≈0 |
Help scores 69 SEO **by design**: it is `noindex` until the draft placeholders are resolved. Lighthouse here runs on localhost without a real CDN/latency, so treat numbers as relative; re-run against production.

**axe-core, 20 pages × desktop + mobile (WCAG 2.0/2.1 A+AA + best-practice):** first run found 3 issue types (contrast, heading order, focusable scroll region); after fixes the re-run reports **0 violations** on all 40 page/viewport combinations. Automated checks catch roughly a third of accessibility issues: a manual screen-reader and keyboard walkthrough is still recommended.

**Static checks:** 20/20 unique titles (29–74 chars), all have meta description, canonical, one `<h1>`, `lang="en"`; 0 images without alt (pages use inline SVG/CSS mocks); all JSON-LD (BreadcrumbList, FAQPage, FinancialService) parses; 0 broken internal links (crawl of the assembled site); CSS 24 KB, JS < 12 KB total, HTML 11–20 KB per page.

**Responsive:** 5 widths (320, 375, 768, 1024, 1440) × 20 pages: no horizontal overflow or JS errors after fix 7.
**Interaction:** mobile menu toggles with correct `aria-expanded`; FAQ accordions open; Help search filters; Contact form validates required fields and preselects `?topic=`; calculator recalculates, swaps and handles limit/offline errors; reduced-motion shows all content and disables the hero scroll hand-off; Tab order is logical with visible focus rings (the amount field uses a border/background focus state).

## Open items (not code defects — need owners)
**Content / compliance**
- Help and Security contain yellow `TODO` placeholders and a draft banner (licence wording, encryption claims, PIN-reset steps, biller list, store links, security contact, certifications). Both are `noindex`.
- Per-country regulatory statements for UK/US/Canada pages (`TODO(legal)` comments) — not written.
- FAQ answers on Home/Business/Transfer were drafted from existing copy; compliance should review. Card/Boss Card perks and "Rate locked / arrives in minutes" wording need sign-off.
- Legal pages (Terms, Privacy, Cookies, AML & KYC, Complaints) and Blog are still the old Framer versions / template filler.

**Product / integration**
- Calculator uses `MockRateProvider` (sample rates + visible "Sample rates" badge) on `/money-transfer`, `/uk`, `/us`, `/canada`. Swap to the rate-engine provider before launch.
- `https://eganow.com/download` (35 occurrences) is a placeholder for the app URL; that route does not exist yet.
- Contact form posts to the existing Zoho form; not tested end-to-end (no outbound access in this environment). Zoho SalesIQ chat widget not added.
- Sales/sandbox/agent/re-issuer topics rely on the Contact form `?topic=` values; confirm routing in Zoho.

**Design / assets**
- All imagery is CSS mock-ups; photography, 3D renders and Lottie from `asset-pack/` are not yet in.
- About page has initials instead of portraits; partners shown as categories (no logos).
- Fonts load from Google Fonts (a layout shift of ≈0.015 appears on first load); self-host Manrope/Inter and preload the two critical weights.

**Hosting**
- Redirects/clean URLs verified only on the local test server; smoke-test on the real host. Framer pages still on the old style (blog, privacy, T&Cs, 404).

## Re-run
```
python3 eganow-business/build.py && python3 deploy/assemble.py && python3 deploy/serve.py 8095
```
then axe/Lighthouse against `http://localhost:8095`.


## Addendum: Blog, Legal and 404 (added after the main QA pass)
Re-ran the crawl and axe-core on the 12 new pages (desktop + mobile): 0 broken links, 0 axe violations after fixing (a) duplicate section landmarks in the long legal documents (sections no longer expose redundant labelled regions) and (b) a button inside article bodies picking up link colour (contrast). Not yet re-run: Lighthouse on these pages.
Open items: legal text approval (see Legal findings above), editorial/compliance approval of blog drafts, remove `noindex` when approved.
