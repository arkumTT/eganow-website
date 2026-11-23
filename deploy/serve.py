#!/usr/bin/env python3
"""Local test server for deploy/dist: clean URLs (/x -> x.html or x/index.html) + the redirects from redirects.json. Usage: python3 deploy/serve.py [port]"""
import http.server, os, sys, json
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(HERE, "dist")
RED = {s: d for s, d in json.load(open(os.path.join(HERE, "redirects.json")))}
class H(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map, ".mjs": "text/javascript", ".js": "text/javascript", ".webp": "image/webp"}
    def do_GET(self):
        p = self.path.split("?")[0].split("#")[0]; q = self.path[len(p):]
        if p in RED: self.send_response(301); self.send_header("Location", RED[p] + q); self.end_headers(); return
        if len(p) > 1 and p.endswith("/"): self.send_response(308); self.send_header("Location", p.rstrip("/") + q); self.end_headers(); return
        return super().do_GET()
    def translate_path(self, path):
        p = super().translate_path(path.split("?")[0])
        if not os.path.exists(p) and os.path.exists(p + ".html"): return p + ".html"
        if os.path.isdir(p) and not os.path.exists(os.path.join(p, "index.html")) and os.path.exists(p + ".html"): return p + ".html"
        return p
    def send_error(self, code, *a, **k):
        page = os.path.join(ROOT, "404.html")
        if code == 404 and os.path.exists(page):
            data = open(page, "rb").read(); self.send_response(404); self.send_header("Content-Type", "text/html"); self.send_header("Content-Length", str(len(data))); self.end_headers(); self.wfile.write(data); return
        super().send_error(code, *a, **k)
if __name__ == "__main__":
    os.chdir(ROOT); port = int(sys.argv[1]) if len(sys.argv) > 1 else 8095
    http.server.ThreadingHTTPServer(("", port), H).serve_forever()
