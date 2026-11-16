// Post-build audit of dist/: broken internal links, broken #anchors, and basic SEO hygiene.
//   npm run build && npm run check          (exit code 1 on failures; warnings never fail)
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const DIST = 'dist';
const known = JSON.parse(readFileSync('scripts/known-missing.json', 'utf8'));
delete known._note;

const walk = (d, out = []) => { for (const e of readdirSync(d, { withFileTypes: true })) { const p = join(d, e.name); e.isDirectory() ? walk(p, out) : out.push(p); } return out; };
const files = walk(DIST);
const pages = files.filter((f) => f.endsWith('.html'));
const urlOf = (f) => '/' + f.slice(DIST.length + 1).replace(/(^|\/)index\.html$/, '').replace(/\.html$/, '');
const html = new Map(pages.map((f) => [f, readFileSync(f, 'utf8')]));

// url (no trailing slash) -> file
const byUrl = new Map(pages.map((f) => [urlOf(f) || '/', f]));
const idsOf = (h) => new Set([...h.matchAll(/\sid=["']([^"']+)["']/g)].map((m) => m[1]));
const idCache = new Map();

const resolve = (path) => {
  const clean = path.replace(/\/$/, '') || '/';
  if (byUrl.has(clean)) return { kind: 'page', file: byUrl.get(clean) };
  const asset = join(DIST, path);
  if (extname(path) && existsSync(asset) && statSync(asset).isFile()) return { kind: 'asset' };
  return null;
};

const broken = new Map(), brokenAnchors = [], usedKnown = new Set();
let checked = 0;
for (const [file, h] of html) {
  const from = urlOf(file) || '/';
  for (const m of h.matchAll(/<a\b[^>]*?\shref=["']([^"']*)["']/gi)) {
    const href = m[1].replace(/&amp;/g, '&');
    if (!href || /^(https?:|mailto:|tel:|javascript:|\/\/)/i.test(href)) continue;
    checked++;
    const [pathAndQuery, hash] = href.split('#');
    const path = pathAndQuery.split('?')[0] || from;
    const target = pathAndQuery.startsWith('?') || pathAndQuery === '' ? { kind: 'page', file } : resolve(path);
    if (!target) {
      const key = path.replace(/\/$/, '') || '/';
      if (key in known) { usedKnown.add(key); }
      (broken.get(key) ?? broken.set(key, new Set()).get(key)).add(from);
      continue;
    }
    if (hash && target.kind === 'page') {
      if (!idCache.has(target.file)) idCache.set(target.file, idsOf(html.get(target.file)));
      if (!idCache.get(target.file).has(hash)) brokenAnchors.push(`${from}  ->  ${href}`);
    }
  }
}

// ---- SEO hygiene on indexable pages
const seo = [];
for (const [file, h] of html) {
  const url = urlOf(file) || '/';
  if (file.endsWith('404.html')) continue;
  const noindex = /<meta[^>]+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(h);
  const title = h.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim();
  const desc = h.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i)?.[1];
  const canon = h.match(/<link[^>]+rel=["']canonical["']/i);
  const h1s = (h.match(/<h1[\s>]/gi) || []).length;
  const imgsNoAlt = (h.match(/<img\b(?![^>]*\balt=)[^>]*>/gi) || []).length;
  const lang = /<html[^>]+lang=/i.test(h);
  const og = /<meta[^>]+property=["']og:title["']/i.test(h);
  const ogImg = h.match(/<meta[^>]+property=["']og:image["'][^>]*content=["']([^"']+)["']/i)?.[1];
  let ogProblem = '';
  if (ogImg) {
    const file = join(DIST, new URL(ogImg).pathname);
    if (!existsSync(file)) ogProblem = `og:image file missing (${new URL(ogImg).pathname})`;
    else { const b = readFileSync(file); const ok = b.length > 24 && b.readUInt32BE(16) === 1200 && b.readUInt32BE(20) === 630; if (!ok) ogProblem = `og:image is not 1200x630 (${new URL(ogImg).pathname})`; }
  }
  const errs = [], warns = [];
  if (!lang) errs.push('missing <html lang>');
  if (!title) errs.push('missing <title>'); else if (title.length > 70) warns.push(`title is ${title.length} chars (>70)`);
  if (!desc) errs.push('missing meta description'); else if (desc.length < 50 || desc.length > 175) warns.push(`description is ${desc.length} chars (aim 50-175)`);
  if (h1s !== 1) errs.push(`${h1s} <h1> elements (want exactly 1)`);
  if (imgsNoAlt) errs.push(`${imgsNoAlt} <img> without alt`);
  if (!noindex) {
    if (!canon) errs.push('indexable page without canonical');
    if (!og) warns.push('no og:title');
    if (!ogImg) errs.push('indexable page without og:image (link previews would have no picture)');
    else if (ogProblem) errs.push(ogProblem);
  }
  if (errs.length || warns.length) seo.push({ url, noindex, errs, warns });
}

// ---- security headers (dist/_headers is generated at build time from the finished pages)
const secErrs = [];
const headersFile = join(DIST, '_headers');
if (!existsSync(headersFile)) secErrs.push('dist/_headers is missing (no security headers would be sent)');
else {
  const hdr = Object.fromEntries(readFileSync(headersFile, 'utf8').split('\n').filter((l) => /^\s+\S/.test(l)).map((l) => { const i = l.indexOf(':'); return [l.slice(0, i).trim().toLowerCase(), l.slice(i + 1).trim()]; }));
  const csp = hdr['content-security-policy'] ?? '';
  const dir = (name) => csp.split(';').map((d) => d.trim()).find((d) => d.startsWith(name + ' ') || d === name);
  if (!csp) secErrs.push('no Content-Security-Policy header');
  else {
    const scriptSrc = dir('script-src') ?? '';
    if (/'unsafe-inline'|'unsafe-eval'/.test(scriptSrc)) secErrs.push("script-src contains 'unsafe-inline' or 'unsafe-eval'");
    for (const need of ['default-src', 'object-src', 'base-uri', 'frame-ancestors', 'form-action']) if (!dir(need)) secErrs.push(`CSP is missing ${need}`);
    // a bare "*", a whole scheme (https:, data:, blob:) as a source: far too broad. (A host wildcard like https://*.google-analytics.com is fine.)
    if (/(^|[\s;])(\*|https?:|data:|blob:)(?=[\s;]|$)/.test(csp)) secErrs.push('CSP allows a bare wildcard or a whole scheme as a source');
    // analytics: the pages, the CSP and the consent banner must agree
    const analyticsHost = /plausible|googletagmanager|google-analytics/.test(csp);
    const withBanner = [...html.values()].filter((h) => h.includes('data-consent-banner')).length;
    const referencesScripts = [...html.values()].some((h) => /_astro\/(ConsentBanner|analytics)/.test(h));
    if (withBanner === 0) {
      if (analyticsHost) secErrs.push('CSP allows an analytics host, but no page has the consent banner');
      if (referencesScripts) secErrs.push('a page loads the consent/analytics scripts but has no consent banner');
    } else {
      if (withBanner !== html.size) secErrs.push(`consent banner is on ${withBanner} of ${html.size} pages (must be all)`);
      if (!analyticsHost) secErrs.push('consent banner is present but the CSP does not allow the analytics host (the vendor script would be blocked)');
    }
    // every inline executable script in every page must be allow-listed by hash
    for (const [file, h] of html) for (const m of h.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
      if (/\bsrc\s*=/.test(m[1])) continue; const t = m[1].match(/\btype\s*=\s*["']([^"']+)["']/i)?.[1]?.toLowerCase(); if (t && t !== 'module' && t !== 'text/javascript') continue;
      const hash = `'sha256-${createHash('sha256').update(m[2], 'utf8').digest('base64')}'`;
      if (!scriptSrc.includes(hash)) secErrs.push(`inline script in ${urlOf(file) || '/'} is not allow-listed in the CSP (it would be blocked)`);
    }
  }
  if (hdr['x-content-type-options'] !== 'nosniff') secErrs.push('missing X-Content-Type-Options: nosniff');
  if (!hdr['referrer-policy']) secErrs.push('missing Referrer-Policy');
  if (!hdr['permissions-policy']) secErrs.push('missing Permissions-Policy');
  const production = !/Disallow:\s*\/\s*$/m.test(existsSync(join(DIST, 'robots.txt')) ? readFileSync(join(DIST, 'robots.txt'), 'utf8') : '');
  if (production && !hdr['strict-transport-security']) secErrs.push('production build without Strict-Transport-Security (HSTS)');
  if (!production && hdr['strict-transport-security']) secErrs.push('staging build must not send HSTS');
  if (!production && !/noindex/.test(hdr['x-robots-tag'] ?? '')) secErrs.push('staging build is missing X-Robots-Tag: noindex');
}

// ---- report
let failures = 0;
const unknownBroken = [...broken].filter(([k]) => !(k in known));
const knownBroken = [...broken].filter(([k]) => k in known);
console.log(`\nChecked ${pages.length} pages, ${checked} internal links.\n`);
if (unknownBroken.length) {
  failures += unknownBroken.length;
  console.log(`FAIL  ${unknownBroken.length} broken internal link target(s):`);
  for (const [k, from] of unknownBroken) console.log(`   ${k}\n      linked from: ${[...from].join(', ')}`);
} else console.log('PASS  no unexpected broken internal links');
if (knownBroken.length) {
  console.log(`\nWARN  ${knownBroken.length} link target(s) known to be missing (scripts/known-missing.json):`);
  for (const [k, from] of knownBroken) console.log(`   ${k.padEnd(24)} ${from.size} page(s) link here — ${known[k]}`);
}
const stale = Object.keys(known).filter((k) => !usedKnown.has(k));
if (stale.length) console.log(`\nNOTE  known-missing entries nothing links to any more (safe to remove): ${stale.join(', ')}`);
if (brokenAnchors.length) { failures += brokenAnchors.length; console.log(`\nFAIL  ${brokenAnchors.length} broken #anchor(s):\n   ` + brokenAnchors.join('\n   ')); } else console.log('PASS  all #anchors resolve');
const seoErrs = seo.filter((s) => s.errs.length);
if (seoErrs.length) { failures += seoErrs.length; console.log(`\nFAIL  SEO errors:`); for (const s of seoErrs) console.log(`   ${s.url}${s.noindex ? ' (noindex)' : ''}: ${s.errs.join('; ')}`); } else console.log('PASS  every page has lang, title, description, one h1, image alt text, and (if indexable) a canonical');
if (secErrs.length) { failures += secErrs.length; console.log(`\nFAIL  security headers:\n   ` + secErrs.join('\n   ')); } else console.log('PASS  security headers: CSP (no unsafe-inline/eval in script-src, every inline script allow-listed), nosniff, referrer and permissions policy, HSTS/noindex correct for this build type');
const seoWarns = seo.filter((s) => s.warns.length);
if (seoWarns.length) { console.log(`\nWARN  SEO suggestions:`); const g = new Map(); for (const s of seoWarns) for (const w of s.warns) (g.get(w) ?? g.set(w, []).get(w)).push(s.url); for (const [w, urls] of g) console.log(`   ${w}: ${urls.length > 4 ? urls.slice(0, 4).join(', ') + `, +${urls.length - 4} more` : urls.join(', ')}`); }
console.log(failures ? `\n${failures} failure(s).` : '\nAll checks passed.');
process.exit(failures ? 1 : 0);
