<div align="center">

# 🧠 DocuMind AI

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Outfit&size=22&duration=3000&pause=1000&color=238636&center=true&vCenter=true&width=450&lines=Scan+codebases+instantly;Generate+perfect+Markdown;Assess+documentation+health" alt="Typing SVG" />
</p>

**Autonomously scan, analyze, and document any codebase with AI.**

[![Vercel Deployment](https://img.shields.io/badge/Demo-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)](https://documind-ai-generater.vercel.app)
[![Render Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://ai-documind.onrender.com)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)

</div>

---

## 🌟 Key Features

<table width="100%">
  <tr>
    <td width="50%">
      <h3>🔑 Secure OAuth Sessions</h3>
      <p>Seamless GitHub integration using server-side secure cookies. Raw GitHub access tokens are <b>never</b> exposed to the frontend client.</p>
    </td>
    <td width="50%">
      <h3>🚀 Agentic Analysis</h3>
      <p>Recursively traverses repository folders via the GitHub API and extracts metadata for intelligent layout parsing.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>📄 Instant Document Generation</h3>
      <p>Generates a complete documentation bundle including <code>README.md</code>, <code>CONTRIBUTING.md</code>, installation guides, and API documentation.</p>
    </td>
    <td width="50%">
      <h3>📊 Health Assessment</h3>
      <p>Provides an AI-derived Documentation Health Score (0-100), warnings for undocumented files, and actionable improvements.</p>
    </td>
  </tr>
</table>

---

## 🏗️ Architecture

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

---

## 💻 API Usage

Base API Route: `https://ai-documind.onrender.com/api/v1`

*   `GET /auth/github/login` - Initiates the GitHub OAuth sequence.
*   `GET /auth/github/callback` - Callback handler exchanging tokens and setting httpOnly session cookie.
*   `GET /auth/session` - Retrieves session info for current logged-in user.
*   `POST /auth/logout` - Destroys current session and deletes cookie.
*   `GET /auth/github/repos` - Lists repositories for the authenticated user.
*   `POST /analyze` - Starts repository analysis and document generation.

#### Example Analyze Request

```bash
curl -X POST https://ai-documind.onrender.com/api/v1/analyze \
  -H "Content-Type: application/json" \
  -d '{"repository_url":"https://github.com/openai/openai-python"}'
```

---

## ⚙️ Environment Configurations

### 1. Backend (Render Settings)

Configure the following variables in the **Environment** tab of your Render Web Service:

| Variable | Value / Description |
| :--- | :--- |
| `GITHUB_CLIENT_ID` | `0v23lixwx13mslyLer5T` |
| `GITHUB_CLIENT_SECRET` | *Your GitHub OAuth App Client Secret* |
| `GITHUB_OAUTH_REDIRECT_URI` | `https://ai-documind.onrender.com/api/v1/auth/github/callback` |
| `BACKEND_PUBLIC_URL` | `https://ai-documind.onrender.com` |
| `FRONTEND_URL` | `https://documind-ai-generater.vercel.app` |
| `COOKIE_SECURE` | `true` |
| `COOKIE_SAMESITE` | `none` |
| `SESSION_SECRET` | *A long, randomly generated secure key string* |
| `OPENAI_API_KEY` | *Optional OpenAI api key override* |
| `GEMINI_API_KEY` | *Optional Gemini api key override* |

### 2. Frontend (Vercel Settings)

Configure the following environment variable in your Vercel Project dashboard:

| Variable | Value |
| :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `https://ai-documind.onrender.com` |

---

## 🔒 Security Summary

*   **Token Isolation**: GitHub API Access tokens stay on the backend memory session store and are never transmitted to the browser.
*   **HttpOnly Cookies**: Sessions are maintained via signed, httpOnly, secure cookies to prevent XSS-based session hijacking.
*   **CSRF Mitigation**: OAuth state tokens are signed and verified on every authorization callback.
