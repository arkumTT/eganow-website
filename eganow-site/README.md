# Eganow website – self-hosted static build

Static copy of https://eganow.framer.website/ (22 pages incl. blog), ready to upload.

## What was changed
- **"Made in Framer" badge removed** on every page: the badge markup, its SVG, the script that
  renders it, and a CSS guard. Framer's analytics beacon, editor-bar loader, generator meta tag
  and "Made in Framer" HTML comments were removed too.
- **Fully self-hosted**: JS modules, fonts (Manrope, Poppins, Inter), icons, images, Lottie
  animations, videos hosted by Framer, and blog (CMS) data are served from this folder
  (`_f/`, `_gf/`, `_s/`) – no runtime dependency on framerusercontent.com, Google Fonts or framer.com.
- **Blog data works on any static host** (a small inline shim emulates Framer's ranged CMS requests).
- **Lighter assets**: Lottie animations ~14 MB -> ~4 MB (re-encoded embedded images, trimmed
  numbers); PNG/JPG losslessly/lightly re-optimised.
- **Hosting config** with clean URLs, gzip, MIME types and 1-year immutable caching for assets.

Still loaded from third parties (unchanged from the original): Zoho SalesIQ chat widget,
Cloudinary-hosted hero/POS videos, and links to eganow.com / merchant portal.

## Upload
Upload the **contents of this folder to the web root** of your domain (paths are root-absolute,
e.g. `/_f/...`; a sub-folder install is not supported). Pages are `about.html`, `blog/<slug>.html`, …
and must be served at clean URLs (`/about`):

| Host | Setup |
|---|---|
| Apache / cPanel / Hostinger | works as-is (`.htaccess` included; needs mod_rewrite) |
| Netlify / Cloudflare Pages | works as-is (`_headers` included) |
| Vercel | works as-is (`vercel.json`) |
| nginx | `location / { try_files $uri $uri.html /404.html; }` plus `types { text/javascript mjs; }` |

## Before going live
Canonical/OG URLs, sitemap and robots still point at `https://eganow.framer.website`. Run:

```bash
./set-domain.sh https://www.your-domain.com
```

## Preview locally
```bash
python3 preview.py 8080   # then open http://localhost:8080
```
(Opening the HTML files directly from disk will not work.) `preview.py`, `set-domain.sh` and this
README are not needed on the server.
