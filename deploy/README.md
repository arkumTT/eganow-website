# Deploying the new Eganow site

`python3 deploy/assemble.py` builds `deploy/dist/` = new pages (`eganow-business/`) + the Framer pages that are still live (blog, privacy policy, money-transfer T&Cs, 404), with redirects and the Framer bridge. Then zip `dist/` contents (see `../eganow-new-site.zip`) and upload to the web root. Test locally: `python3 deploy/serve.py 8095`.

## What changes
| | |
|---|---|
| **URL style** | Clean URLs like the old export: `/about` serves `about.html`; nested pages are `/business/bizcollect`, `/legal/terms`, `/blog/<slug>`. Trailing slashes redirect to the slash-less URL. |
| **Everything is rebuilt** | No Framer pages remain, so the old `_f/_gf/_s` bundles and the Framer bridge script are no longer shipped (the earlier `framer-bridge.js` was removed). |
| **New in this round** | Blog (index + 4 starter drafts), Legal hub + 6 documents, 404 page |
| **Redirects (301)** | `/pos` → `/business/egapos`, `/developer` → `/business/developers`, `/bizcollect` → `/business/bizcollect`, `/privacy-policy` → `/legal/terms`, `/money-transfer-terms-and-conditions` → `/legal/money-transfer-terms`, the 6 old blog posts → `/blog` (+ `.html` variants) |
| **Sitemap** | generated from the built pages; pages with `noindex` (help, security, blog, draft legal) are excluded automatically |

> Why `/privacy-policy` redirects to the Terms: the old "Privacy Policy" page actually contained the end-user Terms of Service. There is no real privacy policy in force yet; the draft is at `/legal/privacy` (noindex).

## Host config (all generated into `dist/`)
- **Vercel:** `vercel.json` (cleanUrls, `trailingSlash:false`, redirects, cache headers)
- **Netlify / Cloudflare Pages:** `_redirects` + `_headers` (turn on pretty URLs)
- **Apache / cPanel / Hostinger:** `.htaccess` (clean URLs + legacy 301s)
- **nginx:** `nginx.conf.snippet`

## Checklist before go-live
1. Smoke-test redirects on the real host (only the local `serve.py` copy was tested here).
2. Replace placeholders: app URL (`https://eganow.com/download`), mock calculator provider, Help/Security TODOs, legal text.
3. Remove the `noindex` flags (`NOINDEX` handling in `eganow-business/build.py`) from Help, Security, Blog and the legal drafts once they are approved, then re-run `build.py` and `assemble.py` (the sitemap updates itself).
4. Fonts: new pages load Manrope/Inter from Google Fonts; self-host before launch.
5. Submit the new sitemap in Search Console; watch 404s for old Framer-only URLs.
