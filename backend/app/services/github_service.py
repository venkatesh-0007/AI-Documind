import httpx
from typing import Tuple
from fastapi import HTTPException
from app.core.config import settings
from app.schemas.analyze import RepoSummary, UndocumentedFile, Suggestion, AnalyzeResponse, CategorizedMetrics

GITHUB_API_BASE_URL = "https://api.github.com"

def parse_github_url(url: str) -> Tuple[str, str]:
    """Parse a GitHub URL and extract owner and repo name."""
    url = url.rstrip("/")
    parts = url.split("/")
    if len(parts) >= 2 and "github.com" in parts[-3:-2] or "github.com" in url:
        return parts[-2], parts[-1]
    raise ValueError("Invalid GitHub URL")

async def fetch_github_data(
    owner: str, 
    repo: str, 
    github_token: str = None, 
    openai_api_key: str = None,
    gemini_api_key: str = None,
    provider: str = "openai"
) -> AnalyzeResponse:
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "DocuMind-AI-Backend"
    }
    
    # Priority: 1. Passed header token, 2. Server env settings token
    token = github_token or settings.GITHUB_TOKEN
    if token:
        headers["Authorization"] = f"token {token}"

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            # Fetch basic repo info
            repo_response = await client.get(
                f"{GITHUB_API_BASE_URL}/repos/{owner}/{repo}",
                headers=headers
            )
            
            if repo_response.status_code != 200:
                if repo_response.status_code == 404:
                    raise HTTPException(status_code=404, detail="Repository not found")
                if repo_response.status_code == 403:
                    raise HTTPException(status_code=403, detail="GitHub API rate limit exceeded")
                raise HTTPException(status_code=repo_response.status_code, detail="Error fetching repository")
                
            repo_data = repo_response.json()
            default_branch = repo_data.get("default_branch", "main")
            
            # Fetch tree recursively
            tree_response = await client.get(
                f"{GITHUB_API_BASE_URL}/repos/{owner}/{repo}/git/trees/{default_branch}?recursive=1",
                headers=headers
            )
            
            tree_data = tree_response.json() if tree_response.status_code == 200 else {}
            tree_items = tree_data.get("tree", [])

    except httpx.ConnectTimeout:
        raise HTTPException(status_code=504, detail="Connection to GitHub API timed out. Please check your internet connection and try again.")
    except httpx.ConnectError:
        raise HTTPException(status_code=503, detail="Cannot connect to GitHub API. Please check your internet connection.")
    except HTTPException:
        raise  # Re-raise HTTP exceptions as-is
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error connecting to GitHub: {str(e)}")

    # Process tree data
    total_files = 0
    has_readme = False
    code_files = 0
    doc_files = 0
    
    CODE_EXTENSIONS = ('.py', '.js', '.ts', '.go', '.rs', '.java', '.cpp', '.c', '.cs', '.php', '.rb')
    DOC_EXTENSIONS = ('.md', '.mdx', '.rst', '.txt')
    
    undocumented_warnings = []
    
    for item in tree_items:
        if item.get("type") == "blob":
            total_files += 1
            path = item.get("path", "")
            
            if path.lower() in ("readme.md", "readme", "readme.txt"):
                has_readme = True
                doc_files += 1
            elif path.lower().endswith(DOC_EXTENSIONS):
                doc_files += 1
            elif path.lower().endswith(CODE_EXTENSIONS):
                code_files += 1
                
                # Naive heuristic: if it's a code file and not a test file, check if we want to flag it
                if "test" not in path.lower() and "spec" not in path.lower() and code_files % 10 == 0:
                    undocumented_warnings.append(
                        UndocumentedFile(
                            file=path,
                            issue="Missing comprehensive documentation or docstrings.",
                            severity="medium"
                        )
                    )
                    
    # Limit warnings
    warnings = undocumented_warnings[:15]
    
    if not has_readme:
        warnings.insert(0, UndocumentedFile(
            file="README.md",
            issue="Missing root README.md file. Essential for project onboarding.",
            severity="high"
        ))

    # Generate documentation and AI health metrics using LLM
    from app.services.llm_service import generate_documentation_and_health
    
    llm_result = await generate_documentation_and_health(
        owner, 
        repo, 
        repo_data.get("description", ""), 
        tree_items,
        openai_api_key=openai_api_key,
        gemini_api_key=gemini_api_key,
        provider=provider
    )
    generated_docs = llm_result.get("generated_docs")
    
    # Override naive health score with AI-based health score and metrics
    health_score = llm_result.get("health_score", 50)
    metrics_data = llm_result.get("metrics", {})
    
    metrics = CategorizedMetrics(
        readme_completeness=metrics_data.get("readme_completeness", 0),
        api_documentation_coverage=metrics_data.get("api_documentation_coverage", 0),
        onboarding_quality=metrics_data.get("onboarding_quality", 0),
        missing_documentation_percentage=metrics_data.get("missing_documentation_percentage", 0)
    )
    
    # Override naive suggestions with AI recommendations
    ai_recommendations = llm_result.get("recommendations", [])
    if ai_recommendations:
        suggestions = [Suggestion(suggestion=rec) for rec in ai_recommendations]
    else:
        suggestions = [
            Suggestion(suggestion="Generate or update README.md covering project setup and prerequisites."),
            Suggestion(suggestion="Add docstrings to public functions and classes in core modules."),
            Suggestion(suggestion="Create an API reference or architecture document.")
        ]

    # Override naive warnings with AI-generated warnings
    ai_warnings = llm_result.get("warnings", [])
    if ai_warnings:
        warnings = [UndocumentedFile(**w) for w in ai_warnings]

    summary = RepoSummary(
        total_files=total_files,
        has_readme=has_readme,
        code_files=code_files,
        doc_files=doc_files,
        health_score=health_score,
        metrics=metrics
    )

    return AnalyzeResponse(
        owner=owner,
        repo=repo,
        description=repo_data.get("description"),
        stars=repo_data.get("stargazers_count", 0),
        forks=repo_data.get("forks_count", 0),
        open_issues=repo_data.get("open_issues_count", 0),
        summary=summary,
        warnings=warnings,
        suggestions=suggestions,
        generated_docs=generated_docs
    )
