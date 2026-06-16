import base64
import hashlib
import hmac
import json
import secrets
import time
from typing import Any

from app.core.config import settings


SESSION_TTL_SECONDS = 60 * 60 * 24 * 7
STATE_TTL_SECONDS = 60 * 10

_sessions: dict[str, dict[str, Any]] = {}


def _sign(value: str) -> str:
    return hmac.new(
        settings.SESSION_SECRET.encode("utf-8"),
        value.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()


def sign_value(value: str) -> str:
    return f"{value}.{_sign(value)}"


def verify_signed_value(signed_value: str | None) -> str | None:
    if not signed_value or "." not in signed_value:
        return None

    value, signature = signed_value.rsplit(".", 1)
    expected = _sign(value)
    if not hmac.compare_digest(signature, expected):
        return None
    return value


def create_state() -> tuple[str, str]:
    state_payload = {
        "state": secrets.token_urlsafe(32),
        "exp": int(time.time()) + STATE_TTL_SECONDS,
    }
    encoded = base64.urlsafe_b64encode(json.dumps(state_payload).encode("utf-8")).decode("ascii")
    return state_payload["state"], sign_value(encoded)


def verify_state(signed_state: str | None, returned_state: str | None) -> bool:
    encoded = verify_signed_value(signed_state)
    if not encoded or not returned_state:
        return False

    try:
        padded = encoded + "=" * (-len(encoded) % 4)
        payload = json.loads(base64.urlsafe_b64decode(padded.encode("ascii")).decode("utf-8"))
    except (ValueError, json.JSONDecodeError):
        return False

    return payload.get("state") == returned_state and int(payload.get("exp", 0)) >= int(time.time())


def create_session(user: dict[str, Any], access_token: str) -> str:
    cleanup_expired_sessions()
    session_id = secrets.token_urlsafe(32)
    _sessions[session_id] = {
        "user": user,
        "access_token": access_token,
        "created_at": int(time.time()),
        "expires_at": int(time.time()) + SESSION_TTL_SECONDS,
    }
    return sign_value(session_id)


def get_session(signed_session_id: str | None) -> dict[str, Any] | None:
    session_id = verify_signed_value(signed_session_id)
    if not session_id:
        return None

    session = _sessions.get(session_id)
    if not session:
        return None

    if int(session.get("expires_at", 0)) < int(time.time()):
        _sessions.pop(session_id, None)
        return None

    return session


def delete_session(signed_session_id: str | None) -> None:
    session_id = verify_signed_value(signed_session_id)
    if session_id:
        _sessions.pop(session_id, None)


def cleanup_expired_sessions() -> None:
    now = int(time.time())
    expired_ids = [
        session_id
        for session_id, session in _sessions.items()
        if int(session.get("expires_at", 0)) < now
    ]
    for session_id in expired_ids:
        _sessions.pop(session_id, None)
