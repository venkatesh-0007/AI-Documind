from fastapi import APIRouter, HTTPException, Header
from typing import Optional
from app.schemas.analyze import AnalyzeRequest, AnalyzeResponse
from app.services.github_service import fetch_github_data, parse_github_url

router = APIRouter()

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_repository(
    request: AnalyzeRequest,
    x_provider: Optional[str] = Header("openai"),
    x_openai_key: Optional[str] = Header(None),
    x_gemini_key: Optional[str] = Header(None),
    x_github_token: Optional[str] = Header(None)
):
    """
    Analyze a GitHub repository and generate documentation insights.
    """
    try:
        url_str = str(request.repository_url)
        owner, repo = parse_github_url(url_str)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    # Fetch data and generate insights, passing optional user credentials & provider selection
    response_data = await fetch_github_data(
        owner, 
        repo, 
        github_token=x_github_token, 
        openai_api_key=x_openai_key,
        gemini_api_key=x_gemini_key,
        provider=x_provider
    )
    
    return response_data

