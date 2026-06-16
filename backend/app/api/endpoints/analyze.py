from fastapi import APIRouter, Cookie, HTTPException, Header
from typing import Optional
from app.schemas.analyze import AnalyzeRequest, AnalyzeResponse
from app.services.github_service import fetch_github_data, parse_github_url
from app.core.config import settings
from app.services.session_service import get_session

router = APIRouter()

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_repository(
    request: AnalyzeRequest,
    x_provider: Optional[str] = Header("openai"),
    x_openai_key: Optional[str] = Header(None),
    x_gemini_key: Optional[str] = Header(None),
    signed_session: Optional[str] = Cookie(None, alias=settings.SESSION_COOKIE_NAME)
):
    """
    Analyze a GitHub repository and generate documentation insights.
    """
    try:
        url_str = str(request.repository_url)
        owner, repo = parse_github_url(url_str)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    session = get_session(signed_session)
    github_token = session.get("access_token") if session else None

    # Fetch data and generate insights, passing optional user credentials & provider selection
    response_data = await fetch_github_data(
        owner, 
        repo, 
        github_token=github_token, 
        openai_api_key=x_openai_key,
        gemini_api_key=x_gemini_key,
        provider=x_provider
    )
    
    return response_data
