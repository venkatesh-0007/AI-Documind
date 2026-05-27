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
curl -X POST http://localhost:8000/api/v1/analyze \
  -H "Content-Type: application/json" \
  -d '{"repository_url":"https://github.com/openai/openai-python"}'
```

## Environment Variables

Backend:

```bash
GITHUB_CLIENT_ID=your_github_oauth_app_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_app_client_secret
GITHUB_OAUTH_REDIRECT_URI=http://localhost:8000/api/v1/auth/github/callback
BACKEND_PUBLIC_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
SESSION_SECRET=replace-with-a-long-random-secret
COOKIE_SECURE=false
COOKIE_SAMESITE=lax
OPENAI_API_KEY=optional_server_openai_key
GEMINI_API_KEY=optional_server_gemini_key
GITHUB_TOKEN=optional_server_fallback_token_for_public_repo_rate_limits
```

Frontend:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For production cross-site frontend/backend deployments, set:

```bash
COOKIE_SECURE=true
COOKIE_SAMESITE=none
FRONTEND_URL=https://your-frontend-domain.example
BACKEND_PUBLIC_URL=https://your-backend-domain.example
GITHUB_OAUTH_REDIRECT_URI=https://your-backend-domain.example/api/v1/auth/github/callback
```

## Local Setup

1. Create a GitHub OAuth App at GitHub Developer Settings.
2. Set the callback URL to `http://localhost:8000/api/v1/auth/github/callback`.
3. Start the backend:

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

4. Start the frontend:

```bash
cd frontend
npm install
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000).

## Deployment

- Deploy the FastAPI backend to a service such as Render, Railway, Fly.io, or a container platform.
- Deploy the Next.js frontend to Vercel or another Node-capable host.
- Configure the GitHub OAuth App callback URL to the deployed backend callback.
- Set the production environment variables listed above.
- Ensure backend CORS includes the frontend origin.
- Use a persistent/shared session store before running multiple backend replicas.

## Security Notes

- GitHub access tokens are never exposed to the frontend.
- The session id is signed and stored in an HttpOnly cookie.
- OAuth state is signed and validated to reduce CSRF risk.
- Use a strong `SESSION_SECRET` in every deployed environment.
- Do not commit `.env` files or provider API keys.
