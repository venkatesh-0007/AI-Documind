from pydantic import BaseModel


class GitHubUser(BaseModel):
    id: int
    login: str
    name: str | None = None
    avatar_url: str | None = None
    html_url: str | None = None


class AuthSessionResponse(BaseModel):
    authenticated: bool
    user: GitHubUser | None = None


class GitHubRepository(BaseModel):
    id: int
    name: str
    full_name: str
    private: bool
    html_url: str
    description: str | None = None
    default_branch: str
    language: str | None = None
    stargazers_count: int = 0
    forks_count: int = 0
    updated_at: str | None = None
