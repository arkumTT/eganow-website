#!/usr/bin/env python3
"""Assembles the deployable site from eganow-business (every page is now rebuilt; the Framer export is only used for robots.txt/.htaccess templates and legacy redirect sources).
Usage: python3 deploy/assemble.py   -> deploy/dist/, deploy/redirects.json and host configs inside dist/
"""
import os, re, json, shutil, glob

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
FRAMER = os.path.join(ROOT, "eganow-site"); NEWS = os.path.join(ROOT, "eganow-business"); DIST = os.path.join(HERE, "dist")
DOMAIN = "https://eganow.com"
REPLACED = ["index", "about", "bill-payment", "business", "canada", "cards", "contact", "developer", "groups", "money-transfer", "pos", "uk", "us"]
SKIP_FRAMER = {"preview.py", "set-domain.sh", "mt-calculator", "README.md"}

# ---- legacy redirects (source, target); clean-URL hosts serve /x and /x.html, so list both where it matters
OLD_BLOG = ["a-guide-to-mastering-investment-tracking", "diversify-and-prosper-with-portfolio-management", "optimizing-strategies-for-financial-growth", "regain-control-with-debt-management", "start-planning-for-retirement-today", "stay-informed-with-real-time-updates"]
CSP = "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self'; form-action 'self' https://forms.zohopublic.com; base-uri 'self'; frame-ancestors 'none'; object-src 'none'"
PERMS = "camera=(), microphone=(), geolocation=(), payment=()"
REDIRECTS = [("/pos", "/business/egapos"), ("/pos.html", "/business/egapos"), ("/developer", "/business/developers"), ("/developer.html", "/business/developers"),
             ("/bizcollect", "/business/bizcollect"), ("/index.html", "/"),
             ("/privacy-policy", "/legal/terms"), ("/privacy-policy.html", "/legal/terms"),
             ("/money-transfer-terms-and-conditions", "/legal/money-transfer-terms"), ("/money-transfer-terms-and-conditions.html", "/legal/money-transfer-terms")] + \
            [(f"/blog/{b}", "/blog") for b in OLD_BLOG] + [(f"/blog/{b}.html", "/blog") for b in OLD_BLOG]

shutil.rmtree(DIST, ignore_errors=True); os.makedirs(DIST)

# 1. robots.txt from the existing export
shutil.copy2(os.path.join(FRAMER, "robots.txt"), os.path.join(DIST, "robots.txt"))

# 2. New site, flattened to clean-URL files (/x/index.html -> /x.html) to match the existing hosting convention
def flat(html):
    html = re.sub(r'((?:href|action)=")(/[^"?#]*?)/((?:\?[^"]*)?")', lambda m: m.group(1) + m.group(2) + m.group(3) if m.group(2) != "" else m.group(0), html)
    html = re.sub(r'(https://eganow\.com/[a-z0-9][a-z0-9/-]*?)/(?=["?#<])', r'\1', html)
    return html
pages = []
for dp, dn, fn in os.walk(NEWS):
    dn[:] = [d for d in dn if d not in ("assets", "brand", ".git")]
    for f in fn:
        if f != "index.html": continue
        rel = os.path.relpath(dp, NEWS)  # '.', 'about', 'business/bizcollect'
        out = "index.html" if rel == "." else rel + ".html"
        dst = os.path.join(DIST, out); os.makedirs(os.path.dirname(dst) or DIST, exist_ok=True)
        open(dst, "w").write(flat(open(os.path.join(dp, f)).read())); pages.append(out)
for d in ("assets", "brand"): shutil.copytree(os.path.join(NEWS, d), os.path.join(DIST, d), dirs_exist_ok=True)

# 3. (Framer bridge no longer needed: no Framer pages remain)
bridged = []

# 4. Sitemap (indexable pages only)
noindex = {p for p in pages if 'name="robots" content="noindex"' in open(os.path.join(DIST, p)).read() or p == "404.html"}
urls = ["/"] + sorted("/" + p[:-5] for p in pages if p != "index.html" and p not in noindex)
open(os.path.join(DIST, "sitemap.xml"), "w").write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "".join(f"<url><loc>{DOMAIN}{u}</loc></url>\n" for u in urls) + "</urlset>\n")

# 5. Redirect configs
json.dump(REDIRECTS, open(os.path.join(HERE, "redirects.json"), "w"), indent=1)
vercel = {"cleanUrls": True, "trailingSlash": False, "headers": []}
vercel["redirects"] = [{"source": s, "destination": d, "permanent": True} for s, d in REDIRECTS if s != "/index.html"]
vercel["headers"] = vercel["headers"] + [{"source": "/(.*)", "headers": [{"key": "Content-Security-Policy", "value": CSP}, {"key": "X-Content-Type-Options", "value": "nosniff"}, {"key": "Referrer-Policy", "value": "strict-origin-when-cross-origin"}, {"key": "Permissions-Policy", "value": PERMS}, {"key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains"}]}, {"source": "/assets/(.*)", "headers": [{"key": "Cache-Control", "value": "public, max-age=86400, must-revalidate"}]}]
json.dump(vercel, open(os.path.join(DIST, "vercel.json"), "w"), indent=2)
hdr = "# Netlify / Cloudflare Pages\n/assets/*\n  Cache-Control: public, max-age=86400, must-revalidate\n/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: " + PERMS + "\n  Strict-Transport-Security: max-age=31536000; includeSubDomains\n  Content-Security-Policy: " + CSP
open(os.path.join(DIST, "_headers"), "w").write(hdr + "\n")
open(os.path.join(DIST, "_redirects"), "w").write("# Netlify / Cloudflare Pages (pretty URLs must be on)\n" + "".join(f"{s} {d} 301\n" for s, d in REDIRECTS if s != "/index.html"))
rules = "# Legacy routes -> new site\n" + "".join(f"RewriteRule ^{re.escape(s_.lstrip('/'))}/?$ {d_} [R=301,L]\n" for s_, d_ in REDIRECTS if s_ != "/index.html")
ht = f"""# Apache: clean URLs (/about -> about.html), legacy redirects, compression, caching
Options -MultiViews -Indexes
DirectoryIndex index.html
DirectorySlash Off
ErrorDocument 404 /404.html
RewriteEngine On
# strip trailing slash (directories such as /business have a sibling business.html)
RewriteRule ^(.+)/$ /$1 [R=301,L]
{rules}
RewriteCond %{{REQUEST_FILENAME}} !-f
RewriteCond %{{REQUEST_FILENAME}}.html -f
RewriteRule ^(.+)$ $1.html [L]

AddType text/javascript .mjs
AddType image/webp .webp
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript application/json image/svg+xml
</IfModule>
<IfModule mod_headers.c>
  <FilesMatch "\\.(html)$">
    Header set Cache-Control "public, max-age=300, must-revalidate"
  </FilesMatch>
  <FilesMatch "\\.(css|js|svg|webp|png|jpg)$">
    Header set Cache-Control "public, max-age=86400, must-revalidate"
  </FilesMatch>
  Header set X-Content-Type-Options "nosniff"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
  Header set Permissions-Policy "{PERMS}"
  Header set Strict-Transport-Security "max-age=31536000; includeSubDomains"
  Header set Content-Security-Policy "{CSP}"
</IfModule>
"""
open(os.path.join(DIST, ".htaccess"), "w").write(ht)
open(os.path.join(DIST, "nginx.conf.snippet"), "w").write("# nginx: add inside the server block\nlocation / { try_files $uri $uri.html /404.html; }\n" + "".join(f"location = {s} {{ return 301 {d}; }}\n" for s, d in REDIRECTS if s != "/index.html") + "types { text/javascript mjs; }\n")
print(f"pages: {len(pages)} | sitemap urls: {len(urls)} | noindex pages: {sorted(noindex)}")
