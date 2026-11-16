// Post-build step. Reads the FINISHED html in dist/ and writes, so none of it can disagree with the pages:
//   sitemap.xml   (production only) every indexable page, using each page's own canonical URL
//   robots.txt    production: allow all + Sitemap line | otherwise: block everything
//   _headers      security headers for every response (CSP, HSTS, ...) [+ X-Robots-Tag noindex when not production]
//
//   SITE_ENV=production  -> real robots.txt + sitemap + HSTS
//   anything else/unset  -> staging-safe: robots blocks all, no sitemap, no HSTS, X-Robots-Tag: noindex
//
// The CSP is generated here: every inline <script> in the built pages is allow-listed by SHA-256 hash, so scripts
// stay strictly locked down (no 'unsafe-inline') without maintaining hashes by hand. Staging gets the SAME CSP as
// production, so a policy problem shows up before launch, not after.
//
// HSTS knobs (production only):  HSTS_MAX_AGE (seconds, default 31536000)
//                                HSTS_INCLUDE_SUBDOMAINS=true   HSTS_PRELOAD=true (needs includeSubDomains and >= 1 year)
import { readdirSync, readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { ANALYTICS } from '../src/data/analytics.mjs';

const xml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function htmlFiles(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== '_astro') htmlFiles(p, out); }
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

// Inline scripts that EXECUTE (classic or module). JSON/JSON-LD data blocks are never executed, so they need no hash.
function inlineScriptHashes(html) {
  const hashes = [];
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const [, attrs, body] = m;
    if (/\bsrc\s*=/.test(attrs)) continue;
    const type = attrs.match(/\btype\s*=\s*["']([^"']+)["']/i)?.[1]?.toLowerCase();
    if (type && type !== 'module' && type !== 'text/javascript') continue;
    hashes.push(`'sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}'`);
  }
  return hashes;
}

function hstsValue() {
  const maxAge = Number(process.env.HSTS_MAX_AGE ?? 31536000);
  const sub = process.env.HSTS_INCLUDE_SUBDOMAINS === 'true';
  const preload = process.env.HSTS_PRELOAD === 'true';
  if (!Number.isInteger(maxAge) || maxAge < 0) throw new Error(`HSTS_MAX_AGE must be a non-negative integer (got "${process.env.HSTS_MAX_AGE}")`);
  if (preload && (!sub || maxAge < 31536000)) throw new Error('HSTS_PRELOAD=true requires HSTS_INCLUDE_SUBDOMAINS=true and HSTS_MAX_AGE >= 31536000 (hstspreload.org rules).');
  return `max-age=${maxAge}${sub ? '; includeSubDomains' : ''}${preload ? '; preload' : ''}`;
}

export default function launchFiles({ site }) {
  return {
    name: 'launch-files',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const out = fileURLToPath(dir);
        const production = process.env.SITE_ENV === 'production';
        const origin = site.replace(/\/$/, '');

        const urls = [];
        const scriptHashes = new Set();
        let skipped = 0;
        for (const file of htmlFiles(out)) {
          const html = readFileSync(file, 'utf8');
          inlineScriptHashes(html).forEach((h) => scriptHashes.add(h));
          if (file.endsWith('404.html')) { skipped++; continue; }
          const noindex = /<meta[^>]+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html);
          const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)?.[1];
          if (noindex || !canonical) { skipped++; continue; }
          urls.push(canonical);
        }
        urls.sort((a, b) => (a === origin + '/' ? -1 : b === origin + '/' ? 1 : a.localeCompare(b)));

        // ---- Content-Security-Policy
        // Analytics (if configured) opens exactly its own hosts, nothing more. Default: nothing external is allowed.
        const an = ANALYTICS.enabled ? ANALYTICS.csp : { scriptSrc: [], connectSrc: [], imgSrc: [], trustedTypes: true };
        const list = (...parts) => parts.flat().filter(Boolean).join(' ');
        const csp = [
          "default-src 'self'",
          `script-src ${list("'self'", [...scriptHashes].sort(), an.scriptSrc)}`,
          "style-src 'self' 'unsafe-inline'",           // 100+ inline style="" attributes can't be hashed; styles can't run code
          `img-src ${list("'self'", an.imgSrc)}`,
          "font-src 'self'",
          `connect-src ${list("'self'", an.connectSrc)}`,
          "manifest-src 'self'",
          "media-src 'none'",
          "object-src 'none'",
          "worker-src 'none'",
          "frame-src 'none'",
          "frame-ancestors 'none'",                      // nobody may embed this site
          "base-uri 'self'",
          "form-action 'self' https://forms.zohopublic.com", // the contact form posts to Zoho
          // Browsers refuse string -> HTML (innerHTML etc.); our code has no such sink. Omitted ONLY for Google Analytics:
          // gtag.js is third-party code that can't be tested offline against Trusted Types.
          an.trustedTypes ? "require-trusted-types-for 'script'" : null,
        ].filter(Boolean).join('; ');

        const headers = [
          `Content-Security-Policy: ${csp}`,
          'X-Content-Type-Options: nosniff',
          'X-Frame-Options: DENY',
          'Referrer-Policy: strict-origin-when-cross-origin',
          'Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), serial=(), accelerometer=(), gyroscope=(), magnetometer=()',
          'Cross-Origin-Opener-Policy: same-origin',
        ];

        const sitemapPath = join(out, 'sitemap.xml');
        const robots = join(out, 'robots.txt');
        if (production) {
          headers.push(`Strict-Transport-Security: ${hstsValue()}`);
          writeFileSync(sitemapPath, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${xml(u)}</loc></url>`).join('\n')}\n</urlset>\n`);
          writeFileSync(robots, `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);
          logger.info(`production: sitemap lists ${urls.length} indexable pages (${skipped} left out); CSP allows ${scriptHashes.size} inline scripts by hash; HSTS ${hstsValue()}; analytics: ${ANALYTICS.enabled ? ANALYTICS.provider : 'off'}`);
        } else {
          headers.push('X-Robots-Tag: noindex, nofollow');
          if (existsSync(sitemapPath)) rmSync(sitemapPath);
          writeFileSync(robots, `# Non-production build: keep all crawlers out.\n# The live site must be built with SITE_ENV=production.\nUser-agent: *\nDisallow: /\n`);
          logger.info(`NON-production build: robots blocks all crawlers, no sitemap, no HSTS, X-Robots-Tag noindex; CSP allows ${scriptHashes.size} inline scripts by hash; analytics: ${ANALYTICS.enabled ? ANALYTICS.provider : 'off'}`);
        }
        writeFileSync(join(out, '_headers'), `/*\n${headers.map((h) => `  ${h}`).join('\n')}\n`);
      },
    },
  };
}
