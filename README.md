# Eganow website

New design for eganow.com (Revolut-inspired: bold type, product-first visuals, scroll motion), built as a dependency-free static site.

- **Deploy:** upload the contents of `eganow-new-site.zip` to the web root (see `deploy/README.md` for Vercel / Netlify / Cloudflare Pages / Apache / nginx).
- **Edit:** copy lives in `eganow-business/build.py` (+ `blog_posts.py`, `legal_drafts.py`, `legal-src/`); run `python3 eganow-business/build.py && python3 deploy/assemble.py`.
- **Status and launch checklist:** `deploy/FINAL-REVIEW.md`. QA log: `deploy/QA.md`.
- **Design system:** `design-system/DESIGN.md`. **Assets & prompts:** `asset-pack/`.

(`index.html`, `form.css`, `validation.js`, `salesiqintegration.js` at the repo root are the original Zoho contact-form export, kept for reference.)
