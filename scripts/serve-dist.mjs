// Zero-dependency static server for dist/ that APPLIES dist/_headers, so you can see (and test) the exact
// security headers a real host will send. `astro preview` ignores _headers.
//   npm run build && npm run serve            # http://localhost:4322   (PORT=... to change)
// Mirrors a typical static host: directory index.html, /x -> /x/index.html or /x.html, 404.html with status 404.
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname, normalize } from 'node:path';

const DIST = 'dist';
const PORT = Number(process.env.PORT ?? 4322);
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml' };

// _headers: a non-indented line is a path pattern, indented "Name: value" lines belong to it.
function loadRules() {
  const f = join(DIST, '_headers'); if (!existsSync(f)) return [];
  const rules = []; let cur = null;
  for (const line of readFileSync(f, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    if (!/^\s/.test(line)) { cur = { re: new RegExp('^' + line.trim().replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$'), headers: [] }; rules.push(cur); }
    else if (cur) { const i = line.indexOf(':'); cur.headers.push([line.slice(0, i).trim(), line.slice(i + 1).trim()]); }
  }
  return rules;
}
const rules = loadRules();

function resolveFile(urlPath) {
  const p = normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, '');
  const candidates = [join(DIST, p), join(DIST, p, 'index.html'), join(DIST, p + '.html')];
  return candidates.find((c) => existsSync(c) && statSync(c).isFile());
}

createServer((req, res) => {
  const path = new URL(req.url, 'http://x').pathname;
  let file = resolveFile(path), status = 200;
  if (!file) { file = join(DIST, '404.html'); status = 404; }
  const h = { 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream' };
  for (const r of rules) if (r.re.test(path)) for (const [k, v] of r.headers) h[k] = h[k] ? `${h[k]}, ${v}` : v;
  res.writeHead(status, h); res.end(readFileSync(file));
}).listen(PORT, '127.0.0.1', () => console.log(`Serving ${DIST}/ with _headers applied at http://localhost:${PORT}`));
