from pydantic import BaseModel, HttpUrl
from typing import List, Optional

class AnalyzeRequest(BaseModel):
    repository_url: HttpUrl

class UndocumentedFile(BaseModel):
    file: str
    issue: str
    severity: str

class Suggestion(BaseModel):
    suggestion: str

class CategorizedMetrics(BaseModel):
    readme_completeness: int
    api_documentation_coverage: int
    onboarding_quality: int
    missing_documentation_percentage: int

class RepoSummary(BaseModel):
    total_files: int
    has_readme: bool
    code_files: int
    doc_files: int
    health_score: int
    metrics: Optional[CategorizedMetrics] = None

class AnalyzeResponse(BaseModel):
    owner: str
    repo: str
    description: Optional[str] = None
    stars: int = 0
    forks: int = 0
    open_issues: int = 0
    summary: RepoSummary
    warnings: List[UndocumentedFile]
    suggestions: List[Suggestion]
    generated_docs: Optional[str] = None
