#!/usr/bin/env python3
"""Local preview server with clean URLs (/about -> about.html). Usage: python3 preview.py [port]"""
import http.server, os, sys
ROOT = os.path.dirname(os.path.abspath(__file__))
class H(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map,
                      ".mjs": "text/javascript", ".js": "text/javascript",
                      ".framercms": "application/octet-stream", ".webp": "image/webp"}
    def translate_path(self, path):
        p = super().translate_path(path.split("?")[0])
        if not os.path.exists(p) and os.path.exists(p + ".html"):
            return p + ".html"
        return p
    def send_error(self, code, *a, **k):
        page = os.path.join(ROOT, "404.html")
        if code == 404 and os.path.exists(page):
            data = open(page, "rb").read()
            self.send_response(404); self.send_header("Content-Type", "text/html")
            self.send_header("Content-Length", str(len(data))); self.end_headers(); self.wfile.write(data); return
        super().send_error(code, *a, **k)
if __name__ == "__main__":
    os.chdir(ROOT)
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    print(f"Serving on http://localhost:{port}")
    http.server.ThreadingHTTPServer(("", port), H).serve_forever()
