# DocuMind AI

DocuMind AI is an AI documentation workflow for GitHub repositories. Users can sign in with GitHub, select a repository, analyze its structure, and generate a documentation bundle that includes README content, contribution guidance, installation notes, project overview, and API documentation when routes are detected.

## Features

- GitHub OAuth login with HttpOnly session cookies
- Connected repository browser for public and private repositories authorized by the user
- Repository metadata and recursive tree analysis through the GitHub API
- AI-generated documentation bundle:
  - `README.md`
  - `CONTRIBUTING.md`
  - installation guide
  - project overview
  - API documentation when applicable
- Documentation health score, warnings, and recommendations
- Loading, error, empty, and mobile-responsive dashboard states
- OpenAI and Gemini provider support for documentation generation

## Screenshots

Add production screenshots after deployment:

- Dashboard empty state
- GitHub repository picker
- Analysis results and Markdown preview

## Architecture

```text
frontend/                 Next.js 16 + React 19 dashboard
  src/app/page.tsx        Main dashboard, auth/session calls, analysis workflow
  src/components/         Header, settings drawer, repository picker, analysis panels
  src/types/              Shared frontend response types

backend/                  FastAPI service
  app/main.py             App setup and CORS
  app/api/api.py          API router
  app/api/endpoints/      Analyze and auth routes
  app/services/           GitHub, LLM, and session services
  app/schemas/            Pydantic request/response models
```

The frontend calls the backend using `NEXT_PUBLIC_API_URL`. GitHub OAuth is completed by the backend, which exchanges the OAuth code for an access token, stores the token server-side, and sends only a signed HttpOnly session cookie to the browser. The browser never receives the GitHub token.

No database is currently required. Sessions are stored in backend memory, which is simple for local development but should be replaced with Redis, Postgres, or another shared session store before scaling to multiple backend instances.

## API Usage

Base path: `/api/v1`

- `GET /auth/github/login` starts GitHub OAuth.
- `GET /auth/github/callback` handles the GitHub OAuth callback.
- `GET /auth/session` returns the current authenticated GitHub user.
- `POST /auth/logout` clears the current session.
- `GET /auth/github/repos` returns repositories for the authenticated user.
- `POST /analyze` analyzes a GitHub repository.
Example analyze request:

```bash
curl -X POST https://ai-documind.onrender.com/api/v1/analyze \
  -H "Content-Type: application/json" \
  -d '{"repository_url":"https://github.com/openai/openai-python"}'
```

## Production Deployment & Environment Variables

The project is deployed in production with the frontend hosted on Vercel and the backend hosted on Render:

*   **Frontend (Vercel)**: [https://documind-ai-generater.vercel.app](https://documind-ai-generater.vercel.app)
*   **Backend (Render)**: [https://ai-documind.onrender.com](https://ai-documind.onrender.com)

### Environment Variables

#### Backend (Render Web Service)

These must be configured under the **Environment** tab of your Render Web Service:

```bash
GITHUB_CLIENT_ID=0v23lixwx13mslyLer5T
GITHUB_CLIENT_SECRET=your_github_oauth_app_client_secret
GITHUB_OAUTH_REDIRECT_URI=https://ai-documind.onrender.com/api/v1/auth/github/callback
BACKEND_PUBLIC_URL=https://ai-documind.onrender.com
FRONTEND_URL=https://documind-ai-generater.vercel.app
COOKIE_SECURE=true
COOKIE_SAMESITE=none
SESSION_SECRET=your_long_random_session_secret
OPENAI_API_KEY=optional_server_openai_key
GEMINI_API_KEY=optional_server_gemini_key
GITHUB_TOKEN=optional_server_fallback_token_for_public_repo_rate_limits
```

#### Frontend (Vercel Project)

These must be configured in your Vercel Project Environment Variables:

```bash
NEXT_PUBLIC_API_URL=https://ai-documind.onrender.com
```

## Security Notes

- GitHub access tokens are never exposed to the frontend.
- The session id is signed and stored in an HttpOnly cookie.
- OAuth state is signed and validated to reduce CSRF risk.
- Use a strong `SESSION_SECRET` in every deployed environment.
- Do not commit `.env` files or provider API keys.
