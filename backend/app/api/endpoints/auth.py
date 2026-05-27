from urllib.parse import urlencode

import httpx
from fastapi import APIRouter, Cookie, HTTPException, Query, Response
from fastapi.responses import RedirectResponse

from app.core.config import settings
from app.schemas.auth import AuthSessionResponse, GitHubRepository, GitHubUser
from app.services.session_service import (
    create_session,
    create_state,
    delete_session,
    get_session,
    verify_state,
)

router = APIRouter(prefix="/auth")

GITHUB_AUTHORIZE_URL = "https://github.com/login/oauth/authorize"
GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token"
GITHUB_API_BASE_URL = "https://api.github.com"


def _cookie_options() -> dict:
    return {
        "httponly": True,
        "secure": settings.COOKIE_SECURE,
        "samesite": settings.COOKIE_SAMESITE,
        "path": "/",
    }


def _require_oauth_config() -> None:
    if not settings.GITHUB_CLIENT_ID or not settings.GITHUB_CLIENT_SECRET:
        raise HTTPException(
            status_code=500,
            detail="GitHub OAuth is not configured. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET.",
        )


@router.get("/github/login")
async def github_login() -> RedirectResponse:
    _require_oauth_config()

    state, signed_state = create_state()
    redirect_uri = settings.GITHUB_OAUTH_REDIRECT_URI
    if not redirect_uri:
        redirect_uri = f"{settings.BACKEND_PUBLIC_URL.rstrip('/')}/api/v1/auth/github/callback"

    params = urlencode(
        {
            "client_id": settings.GITHUB_CLIENT_ID,
            "redirect_uri": redirect_uri,
            "scope": "read:user repo",
            "state": state,
            "allow_signup": "true",
        }
    )
    response = RedirectResponse(f"{GITHUB_AUTHORIZE_URL}?{params}")
    response.set_cookie(
        settings.OAUTH_STATE_COOKIE_NAME,
        signed_state,
        max_age=600,
        **_cookie_options(),
    )
    return response


@router.get("/github/callback")
async def github_callback(
    code: str | None = Query(None),
    state: str | None = Query(None),
    error: str | None = Query(None),
    signed_state: str | None = Cookie(None, alias=settings.OAUTH_STATE_COOKIE_NAME),
) -> RedirectResponse:
    _require_oauth_config()

    frontend_url = settings.FRONTEND_URL.rstrip("/")
    if error:
        return RedirectResponse(f"{frontend_url}/?auth=error&reason={error}")
    if not code or not verify_state(signed_state, state):
        return RedirectResponse(f"{frontend_url}/?auth=error&reason=invalid_state")

    async with httpx.AsyncClient(timeout=20.0) as client:
        token_response = await client.post(
            GITHUB_TOKEN_URL,
            headers={"Accept": "application/json"},
            data={
                "client_id": settings.GITHUB_CLIENT_ID,
                "client_secret": settings.GITHUB_CLIENT_SECRET,
                "code": code,
            },
        )

        token_data = token_response.json()
        access_token = token_data.get("access_token")
        if token_response.status_code >= 400 or not access_token:
            return RedirectResponse(f"{frontend_url}/?auth=error&reason=token_exchange_failed")

        user_response = await client.get(
            f"{GITHUB_API_BASE_URL}/user",
            headers={
                "Accept": "application/vnd.github+json",
                "Authorization": f"Bearer {access_token}",
                "X-GitHub-Api-Version": "2022-11-28",
                "User-Agent": "DocuMind-AI-Backend",
            },
        )
        if user_response.status_code >= 400:
            return RedirectResponse(f"{frontend_url}/?auth=error&reason=user_fetch_failed")

    user_data = user_response.json()
    user = {
        "id": user_data["id"],
        "login": user_data["login"],
        "name": user_data.get("name"),
        "avatar_url": user_data.get("avatar_url"),
        "html_url": user_data.get("html_url"),
    }

    signed_session = create_session(user, access_token)
    response = RedirectResponse(f"{frontend_url}/?auth=success")
    response.set_cookie(
        settings.SESSION_COOKIE_NAME,
        signed_session,
        max_age=60 * 60 * 24 * 7,
        **_cookie_options(),
    )
    response.delete_cookie(settings.OAUTH_STATE_COOKIE_NAME, path="/")
    return response


@router.get("/session", response_model=AuthSessionResponse)
async def get_auth_session(
    signed_session: str | None = Cookie(None, alias=settings.SESSION_COOKIE_NAME),
) -> AuthSessionResponse:
    session = get_session(signed_session)
    if not session:
        return AuthSessionResponse(authenticated=False)
    return AuthSessionResponse(authenticated=True, user=GitHubUser(**session["user"]))


@router.post("/logout")
async def logout(
    response: Response,
    signed_session: str | None = Cookie(None, alias=settings.SESSION_COOKIE_NAME),
) -> dict[str, bool]:
    delete_session(signed_session)
    response.delete_cookie(settings.SESSION_COOKIE_NAME, path="/")
    return {"ok": True}


@router.get("/github/repos", response_model=list[GitHubRepository])
async def list_github_repositories(
    signed_session: str | None = Cookie(None, alias=settings.SESSION_COOKIE_NAME),
) -> list[GitHubRepository]:
    session = get_session(signed_session)
    if not session:
        raise HTTPException(status_code=401, detail="Sign in with GitHub to list repositories.")

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(
            f"{GITHUB_API_BASE_URL}/user/repos",
            params={
                "per_page": 100,
                "sort": "updated",
                "affiliation": "owner,collaborator,organization_member",
            },
            headers={
                "Accept": "application/vnd.github+json",
                "Authorization": f"Bearer {session['access_token']}",
                "X-GitHub-Api-Version": "2022-11-28",
                "User-Agent": "DocuMind-AI-Backend",
            },
        )

    if response.status_code >= 400:
        raise HTTPException(status_code=response.status_code, detail="Unable to fetch GitHub repositories.")

    repos = response.json()
    return [
        GitHubRepository(
            id=repo["id"],
            name=repo["name"],
            full_name=repo["full_name"],
            private=repo["private"],
            html_url=repo["html_url"],
            description=repo.get("description"),
            default_branch=repo.get("default_branch", "main"),
            language=repo.get("language"),
            stargazers_count=repo.get("stargazers_count", 0),
            forks_count=repo.get("forks_count", 0),
            updated_at=repo.get("updated_at"),
        )
        for repo in repos
    ]
