# Final review — new Eganow website (33 pages)

Reviewed 2026-11-23 on the assembled build (`deploy/dist`, served by `deploy/serve.py` with the production security headers). **Verdict: technically ready to deploy as a staging/preview site; not ready to launch publicly until the "Launch blockers" below are cleared (all are content/legal/integration decisions, not code defects).**

## What was checked, and the result
| Area | Method | Result |
|---|---|---|
| HTML validity | html-validate (recommended ruleset) on all pages | 0 errors after fixing raw `&` and untyped `<input>`s (now automatic in `build.py` `finalize()`) |
| Accessibility | axe-core (WCAG 2.0/2.1 A+AA + best-practice), all 32 indexable+draft pages × desktop & mobile | **0 violations** |
| Performance | Lighthouse | Home 94 mobile / 100 desktop (LCP is the hero photo, 2.9 s on simulated slow 4G); Contact, Terms, Blog post 100; CLS 0–0.012 |
| Layout | 5 widths (320–1440) × all pages (earlier pass), re-checked after each image batch | no horizontal overflow, no JS errors |
| Links | crawl of every internal link | 0 broken links; 0 broken in-page anchors; 6 old blog URLs, `/pos`, `/developer`, `/privacy-policy`, old T&Cs redirect correctly |
| Security headers | CSP + HSTS + nosniff + Referrer-Policy + Permissions-Policy tested live | 0 CSP violations across 36 pages; calculator, Help search and Contact validation work under the policy |
| SEO | titles, descriptions, canonicals, JSON-LD, sitemap, robots, OG/Twitter | all present; **added in this pass:** `og:image` (1200×630), `twitter:card`, favicon PNGs, apple-touch-icon, web manifest |
| Content | codespell, brand/claim/spelling audit | no typos; UK English consistent; brand name fixed to "Eganow" in running copy |
| Third parties | network trace | **no third-party requests** (fonts self-hosted); only outbound links are the merchant portal, docs site, social profiles and the Zoho form POST |

## Fixed in this pass
1. Raw `&` and `<input>` without `type` on several pages (HTML validity).
2. No Open Graph image / Twitter card / PNG icons / manifest → added.
3. No security headers → CSP, HSTS, Permissions-Policy, nosniff, Referrer-Policy added to all host configs (Vercel, Netlify/Cloudflare, Apache) and to the local test server.
4. Illustrative amounts disagreed with the live calculator (copy said £200 → GH₵3,260, the calculator gave GH₵3,227.56 after the sample fee) → all mocks now match the calculator on the same page (GH₵3,227.56 / 2,449.12 / 1,792.79).
5. Mixed "eganow"/"Eganow" in running text → standardised to "Eganow" (the lowercase wordmark stays in the logo).

## Launch blockers (need an owner)
| # | Item | Owner |
|---|---|---|
| 1 | **Legal text.** The old "Privacy Policy" page was really Terms of Service, so *no privacy policy is in force*; the draft is `noindex`. Money-transfer T&Cs name Eganow Ltd (England) with "FCA register number TBC" and an app name "tbc". Terms contain duplicated clauses. Cookie, AML/KYC and Complaints are drafts. | Legal / compliance |
| 2 | **Placeholders** (yellow `TODO` marks) on Help, Security and the four draft legal pages; per-country regulatory statements on UK/US/Canada pages (`TODO(legal)`). Pages stay `noindex` until cleared (`NOINDEX` in `build.py`). | Compliance, Product |
| 3 | **Rate engine.** The calculator still uses `MockRateProvider` with a visible "Sample rates" badge on 4 pages. Swap in `EganowRateProvider` (spec in `money-transfer-calculator/README.md`) or remove the calculator until ready. | Engineering |
| 4 | **App URL.** 35 links point to the placeholder `https://eganow.com/download` (does not exist). | Product |
| 5 | **Imagery.** 13 AI-generated stand-in photos. Confirm the Magnific free-plan commercial terms; decide on AI disclosure; replace with the planned shoot (same filenames). About page has no team photo on purpose. | Brand / Legal |
| 6 | **Claims to substantiate** (carried from the old site): "99.95% uptime", "100+ features a year", "thousands of satisfied users", ISO 27001 certification, "licensed … Bank of Ghana" wording, "transfers often within minutes". Keep only what Eganow can evidence. | Marketing, Compliance |
| 7 | **Contact form** posts to the existing Zoho form; never tested end-to-end (no outbound access here). Zoho SalesIQ chat widget not added. | Engineering |
| 8 | **Real-host smoke test** of redirects, clean URLs, 404 page and headers (verified only on the local server). Apache `DirectorySlash Off` rules are the least-tested part. | DevOps |

## Recommended before / soon after launch
- Blog: the 4 starter articles are generic drafts; get editorial + compliance approval, add authors/dates, then lift `noindex`.
- Replace CSS mock-ups with real product screenshots (asset pack U01–U06) and 3D renders (D01–D03 were rejected as generated).
- Add analytics + consent banner if tracking is introduced (the Cookie Policy currently says none is used).
- Submit `sitemap.xml` (21 URLs) in Search Console; monitor 404s for old Framer URLs.
- Self-hosted fonts are Latin + Latin-Ext only (covers English and the cedi sign); add other subsets if Twi/Ga/French content is planned.
- Contact form: add spam protection (e.g., Turnstile) and a thank-you page.
- Performance: Home hero image (172 KB) could be shaved with AVIF; defer the story-panel JS on pages without it.

## Repository map
`eganow-business/` source of truth (generator `build.py`, content modules, CSS/JS, images, fonts) · `deploy/` assembler, host configs, local server, QA + this review · `design-system/` tokens, DESIGN.md, logos · `asset-pack/` prompts, style bible, shot list, asset register · `money-transfer-calculator/` standalone calculator demo · `eganow-site/` legacy Framer export (kept for reference; fully superseded) · `eganow-new-site.zip` upload-ready build (use this, not `eganow-site.zip`).

Rebuild: `python3 eganow-business/build.py && python3 deploy/assemble.py`, then zip the contents of `deploy/dist`.
