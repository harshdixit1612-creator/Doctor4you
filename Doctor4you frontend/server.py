#!/usr/bin/env python3
"""Simple HTTP server with no-cache headers so JS changes are always fresh."""
import http.server
import socketserver

PORT = 3000

class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, format, *args):
        pass  # Suppress noisy access logs

with socketserver.TCPServer(("", PORT), NoCacheHTTPRequestHandler) as httpd:
    print(f"✅ Doctor4you frontend running at http://localhost:{PORT}")
    print("   Cache disabled — all JS changes load instantly.")
    httpd.serve_forever()
