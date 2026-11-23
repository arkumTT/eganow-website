#!/usr/bin/env python3
"""Assembles the deployable site: new pages (eganow-business) + remaining Framer pages (eganow-site), with redirects and the Framer bridge.
Usage: python3 deploy/assemble.py   -> deploy/dist/, deploy/redirects.json and host configs inside dist/
"""
import os, re, json, shutil, glob

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
FRAMER = os.path.join(ROOT, "eganow-site"); NEWS = os.path.join(ROOT, "eganow-business"); DIST = os.path.join(HERE, "dist")
DOMAIN = "https://eganow.com"
REPLACED = ["index", "about", "bill-payment", "business", "canada", "cards", "contact", "developer", "groups", "money-transfer", "pos", "uk", "us"]
SKIP_FRAMER = {"preview.py", "set-domain.sh", "mt-calculator", "README.md"}

# ---- legacy redirects (source, target); clean-URL hosts serve /x and /x.html, so list both where it matters
REDIRECTS = [("/pos", "/business/egapos"), ("/pos.html", "/business/egapos"), ("/developer", "/business/developers"), ("/developer.html", "/business/developers"),
             ("/bizcollect", "/business/bizcollect"), ("/index.html", "/")]

shutil.rmtree(DIST, ignore_errors=True); os.makedirs(DIST)

# 1. Framer base (minus replaced pages)
for name in os.listdir(FRAMER):
    if name in SKIP_FRAMER: continue
    s, d = os.path.join(FRAMER, name), os.path.join(DIST, name)
    if os.path.isdir(s): shutil.copytree(s, d)
    elif name[:-5] in REPLACED and name.endswith(".html"): continue
    else: shutil.copy2(s, d)

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
shutil.copy2(os.path.join(HERE, "framer-bridge.js"), os.path.join(DIST, "assets", "framer-bridge.js"))

# 3. Bridge into remaining Framer pages
bridged = []
for f in glob.glob(os.path.join(DIST, "**", "*.html"), recursive=True):
    rel = os.path.relpath(f, DIST)
    if rel in pages: continue
    h = open(f).read(); i = h.rfind("</body>")
    if i < 0 or "framer-bridge" in h: continue
    open(f, "w").write(h[:i] + '<script src="/assets/framer-bridge.js" defer></script>' + h[i:]); bridged.append(rel)

# 4. Sitemap (indexable pages only)
noindex = {"help.html", "security.html"}
urls = ["/"] + sorted("/" + p[:-5] for p in pages if p != "index.html" and p not in noindex) + sorted("/" + p[:-5] for p in bridged if p not in ("404.html",))
open(os.path.join(DIST, "sitemap.xml"), "w").write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "".join(f"<url><loc>{DOMAIN}{u}</loc></url>\n" for u in urls) + "</urlset>\n")

# 5. Redirect configs
json.dump(REDIRECTS, open(os.path.join(HERE, "redirects.json"), "w"), indent=1)
vercel = json.load(open(os.path.join(FRAMER, "vercel.json")))
vercel["trailingSlash"] = False
vercel["redirects"] = [{"source": s, "destination": d, "permanent": True} for s, d in REDIRECTS if s != "/index.html"]
vercel["headers"] = vercel["headers"] + [{"source": "/assets/(.*)", "headers": [{"key": "Cache-Control", "value": "public, max-age=86400, must-revalidate"}]}]
json.dump(vercel, open(os.path.join(DIST, "vercel.json"), "w"), indent=2)
hdr = open(os.path.join(FRAMER, "_headers")).read().rstrip("\n")
hdr = hdr.replace("/*\n  X-Content-Type-Options", "/assets/*\n  Cache-Control: public, max-age=86400, must-revalidate\n/*\n  X-Content-Type-Options")
open(os.path.join(DIST, "_headers"), "w").write(hdr + "\n")
open(os.path.join(DIST, "_redirects"), "w").write("# Netlify / Cloudflare Pages (pretty URLs must be on)\n" + "".join(f"{s} {d} 301\n" for s, d in REDIRECTS if s != "/index.html"))
ht = open(os.path.join(FRAMER, ".htaccess")).read()
rules = "# Legacy routes -> new site\n" + "".join(f"RewriteRule ^{re.escape(s.lstrip('/'))}/?$ {d} [R=301,L]\n" for s, d in REDIRECTS if s != "/index.html")
ht = ht.replace("RewriteEngine On\n", "RewriteEngine On\n" + rules, 1)
open(os.path.join(DIST, ".htaccess"), "w").write(ht)
open(os.path.join(DIST, "nginx.conf.snippet"), "w").write("# nginx: add inside the server block\nlocation / { try_files $uri $uri.html /404.html; }\n" + "".join(f"location = {s} {{ return 301 {d}; }}\n" for s, d in REDIRECTS if s != "/index.html") + "types { text/javascript mjs; }\n")
print(f"new pages: {len(pages)} | bridged Framer pages: {len(bridged)} | sitemap urls: {len(urls)}")
print("bridged:", bridged)
