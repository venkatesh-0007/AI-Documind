# DocuMind AI

**An AI-powered tool that autonomously scans, analyzes, and generates documentation for any GitHub codebase.**

DocuMind AI evaluates codebase health, identifies missing documentation, and automatically generates required docs using AI. With a clean, professional GitHub-inspired interface, it serves as your automated documentation engineer.

---

## 🚀 How It Works (Workflow)

1. **Target Identification:** Enter any public GitHub repository URL into the central command bar.
2. **Agentic Scanning:** The backend engine clones and scans the codebase, mapping out its structure, logic, and existing documentation.
3. **Health & Analysis:** The AI evaluates the "Documentation Health" score, pinpointing exactly which files are lacking comments, types, or descriptions.
4. **Autonomous Generation:** The system uses advanced AI models to generate the missing documentation, presenting you with a clean Markdown preview and the raw source code.
5. **Apply:** Review the suggestions and apply the generated documentation directly to your project.

---

## 🔒 Privacy & API Keys

To ensure maximum privacy and optimal performance, **DocuMind AI requires you to bring your own API key.** 

By supplying your own OpenAI or Google Gemini API key:
- **Your Data Remains Yours:** Your code is processed directly through your own trusted API provider account. We do not store your code or intercept your AI requests.
- **No Rate Limits:** You aren't restricted by shared community quotas, ensuring fast, uninterrupted agentic analysis.

**How to set it up:**
1. Click the **Settings** gear icon in the top right corner of the dashboard.
2. Select your preferred provider (OpenAI or Gemini).
3. Paste your API key (and optionally, a personal GitHub token to bypass GitHub API rate limits).
4. Save your settings. Your keys are stored locally in your browser and are never sent to our database.

---

## 🛠️ Project Structure

This repository is structured into two main environments:

- `/frontend` - The Next.js React application containing the sleek, GitHub-styled user interface.
- `/backend` - The Python-based API server that handles repository fetching, parsing, and communicating with the LLMs.

### Running Locally

**1. Start the Backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
# Start your python backend server (e.g., via uvicorn or python app.py)
```

**2. Start the Frontend**
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.
