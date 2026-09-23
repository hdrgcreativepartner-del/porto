#!/usr/bin/env python3
"""Local preview with the same upload index that GitHub Pages generates."""
import json
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parent.parent
EXTENSIONS = {'.png', '.jpg', '.jpeg', '.webp', '.avif', '.svg', '.json'}

class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if urlsplit(self.path).path == '/media-index.json':
            files = []
            for folder in ('assets/clients', 'assets/portfolio'):
                for asset in (ROOT / folder).rglob('*'):
                    relative = asset.relative_to(ROOT)
                    if asset.is_file() and asset.suffix.lower() in EXTENSIONS and not any(part.startswith(('_', '.')) for part in relative.parts):
                        files.append('/' + relative.as_posix())
            data = json.dumps({'version': 1, 'files': sorted(files)}).encode()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(data)))
            self.end_headers()
            self.wfile.write(data)
        else:
            super().do_GET()

if __name__ == '__main__':
    print('HDRG preview: http://localhost:8000', flush=True)
    ThreadingHTTPServer(('0.0.0.0', 8000), partial(Handler, directory=str(ROOT))).serve_forever()
