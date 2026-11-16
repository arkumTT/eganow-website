# Eganow website

Astro static site. Personal (`/`) and Business (`/business`) worlds, six Business service pages, contact, help, legal, security, about.

```bash
npm install
npm run dev                 # local development
npm run build               # staging-safe build (see "Launch switches")
npm run build:production    # the build for the live site
npm run check               # audit dist/: broken links/anchors + SEO basics (run after a build)
```

## Launch switches (read before going live)

| Switch | Where | Effect |
| --- | --- | --- |
| `SITE_ENV=production` | environment variable on the **live** build only (`npm run build:production`) | Real `robots.txt` + `sitemap.xml`. **Without it** every build is staging-safe: `robots.txt` blocks all crawlers, there is no sitemap, and every response is sent with `X-Robots-Tag: noindex` (via `dist/_headers`, honoured by Cloudflare Pages / Netlify). |
| `LEGAL_DRAFT` | `src/data/legal-status.ts` | While `true`: legal pages show a draft banner and are `noindex`. Setting it `false` **fails the build** if any `[[placeholder]]` remains. |
| `HELP_DRAFT` | `src/data/help.ts` | Same, for `/help`. |
| `COMPANY_DRAFT` | `src/data/company-status.ts` | Same, for `/about` and `/security`. |

`[[Highlighted placeholders]]` mark facts only Eganow can supply (legal entity, licence number, contacts, people, partners, security specifics).

## How sitemap / robots work

`integrations/launch-files.mjs` runs after the build and reads the **finished HTML**: a page goes in the sitemap only if it has a canonical URL and is not `noindex` (and is not the 404). So the sitemap cannot disagree with the pages. Draft pages drop out automatically and appear when their draft switch is turned off.

## Known gaps

`scripts/known-missing.json` lists internal links whose pages are not built yet (`/pricing`, `/business/developers`). `npm run check` reports them as warnings and fails on any *other* broken link.
