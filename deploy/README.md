# Deploying the new Eganow site

`python3 deploy/assemble.py` builds `deploy/dist/` = new pages (`eganow-business/`) + the Framer pages that are still live (blog, privacy policy, money-transfer T&Cs, 404), with redirects and the Framer bridge. Then zip `dist/` contents (see `../eganow-new-site.zip`) and upload to the web root. Test locally: `python3 deploy/serve.py 8095`.

## What changes
| | |
|---|---|
| **URL style** | Same clean-URL convention as the Framer export: `/about` serves `about.html`; business pages are `/business/bizcollect` (`business/bizcollect.html`). Trailing slashes redirect to the slash-less URL. |
| **Replaced Framer pages (deleted)** | home, about, bill-payment, business, canada, cards, contact, developer, groups, money-transfer, pos, uk, us |
| **Still Framer** | `/blog/*` (6 posts, template filler), `/privacy-policy`, `/money-transfer-terms-and-conditions`, `/404` |
| **Redirects (301)** | `/pos` → `/business/egapos`, `/developer` → `/business/developers`, `/bizcollect` → `/business/bizcollect` (+ `.html` variants) |
| **Sitemap** | regenerated (26 URLs); `/help` and `/security` excluded while they are `noindex` drafts |

## Framer nav integration (`assets/framer-bridge.js`)
Framer pages navigate client-side, so clicking "Business", "Personal ▾", the logo, etc. on a blog/legal page would render the *old* Framer page inside the SPA. The bridge intercepts clicks on links to rebuilt routes and does a normal page load (it also maps old anchors `/business#pos` → `/business/egapos`, `/business#bizcollect-1` → `/business/bizcollect`). Verified: from a blog page, Business / About / Bill payment / logo all land on the new pages; with the bridge blocked they stay in the Framer SPA. It is injected before `</body>` of every remaining Framer page by `assemble.py`.
The Framer header/footer on those pages is unchanged visually; to restyle them, rebuild those pages in the new system (recommended for legal pages once text is approved).

## Host config (all generated into `dist/`)
- **Vercel:** `vercel.json` (cleanUrls, `trailingSlash:false`, redirects, cache headers)
- **Netlify / Cloudflare Pages:** `_redirects` + `_headers` (turn on pretty URLs)
- **Apache / cPanel / Hostinger:** `.htaccess` (clean URLs + legacy 301s)
- **nginx:** `nginx.conf.snippet`

## Checklist before go-live
1. Smoke-test redirects on the real host (only the local `serve.py` copy was tested here).
2. Replace placeholders: app URL (`https://eganow.com/download`), mock calculator provider, Help/Security TODOs, legal text.
3. Remove `noindex` from Help/Security when ready and re-run `assemble.py` (sitemap picks them up automatically if you also drop them from `noindex` in `assemble.py`).
4. Fonts: new pages load Manrope/Inter from Google Fonts; self-host before launch.
5. Submit the new sitemap in Search Console; watch 404s for old Framer-only URLs.
