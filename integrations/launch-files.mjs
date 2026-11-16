// Generates sitemap.xml, robots.txt (and, for non-production builds, an X-Robots-Tag header file)
// from the FINISHED html in dist/, so they can never disagree with the pages themselves.
//
//   SITE_ENV=production  -> real robots.txt (allow all + Sitemap line) and a sitemap of every indexable page
//   anything else/unset  -> staging-safe: robots.txt blocks everything, no sitemap, X-Robots-Tag: noindex on every response
//
// A page is "indexable" when it has no <meta name="robots" content="...noindex...">, is not the 404 page,
// and declares a canonical URL (the sitemap uses exactly that canonical URL).
import { readdirSync, readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const xml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function htmlFiles(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== '_astro') htmlFiles(p, out); }
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
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
        let skipped = 0;
        for (const file of htmlFiles(out)) {
          if (file.endsWith('404.html')) { skipped++; continue; }
          const html = readFileSync(file, 'utf8');
          const noindex = /<meta[^>]+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html);
          const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)?.[1];
          if (noindex || !canonical) { skipped++; continue; }
          urls.push(canonical);
        }
        urls.sort((a, b) => (a === origin + '/' ? -1 : b === origin + '/' ? 1 : a.localeCompare(b)));

        const sitemapPath = join(out, 'sitemap.xml');
        const robots = join(out, 'robots.txt');
        const headers = join(out, '_headers');

        if (production) {
          writeFileSync(sitemapPath, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${xml(u)}</loc></url>`).join('\n')}\n</urlset>\n`);
          writeFileSync(robots, `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);
          if (existsSync(headers)) rmSync(headers);
          logger.info(`production: sitemap.xml lists ${urls.length} indexable pages (${skipped} noindex/404 pages left out)`);
        } else {
          if (existsSync(sitemapPath)) rmSync(sitemapPath);
          writeFileSync(robots, `# Non-production build: keep all crawlers out.\n# The live site must be built with SITE_ENV=production.\nUser-agent: *\nDisallow: /\n`);
          writeFileSync(headers, `/*\n  X-Robots-Tag: noindex, nofollow\n`);
          logger.info(`NON-production build: robots.txt blocks all crawlers, no sitemap, X-Robots-Tag noindex (would list ${urls.length} pages in production)`);
        }
      },
    },
  };
}
