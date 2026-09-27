import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app as raw_app

class VercelPathFixMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope.get("type") == "http":
            path = scope.get("path", "")
            for prefix in ["/api/index.py", "/api/index"]:
                if path.startswith(prefix):
                    new_path = path[len(prefix):]
                    if not new_path or not new_path.startswith("/"):
                        new_path = "/" + new_path
                    scope["path"] = new_path
                    break
        await self.app(scope, receive, send)

app = VercelPathFixMiddleware(raw_app)

__all__ = ["app"]