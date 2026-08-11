from fastapi import Request
from typing import Optional


def get_current_user_id(request: Request) -> Optional[int]:
    header_val = request.headers.get("x-user-id") or request.headers.get("X-User-ID")
    if header_val and header_val != "undefined" and header_val != "null":
        try:
            return int(header_val)
        except (ValueError, TypeError):
            return None
    return None
