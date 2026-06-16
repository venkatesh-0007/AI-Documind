import json
import textwrap
from openai import AsyncOpenAI
from app.core.config import settings
from typing import Dict, Any

# Initialize client conditionally based on API key availability
client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None
gemini_client = AsyncOpenAI(
    api_key=settings.GEMINI_API_KEY,
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
) if settings.GEMINI_API_KEY else None

def clean_json_response(content: str) -> str:
    content = content.strip()
    # Remove markdown code block wrappers if present
    if content.startswith("```json"):
        content = content[7:]
    elif content.startswith("```"):
        content = content[3:]
    if content.endswith("```"):
        content = content[:-3]
    content = content.strip()
    
    # Escape raw control characters (newlines, carriage returns, tabs) inside JSON string values
    in_string = False
    escaped = False
    result = []
    for char in content:
        if char == '"' and not escaped:
            in_string = not in_string
            result.append(char)
        elif char == '\\' and in_string:
            escaped = not escaped
            result.append(char)
        else:
            if char == '\n' and in_string:
                result.append('\\n')
            elif char == '\r' and in_string:
                result.append('\\r')
            elif char == '\t' and in_string:
                result.append('\\t')
            else:
                result.append(char)
            escaped = False
    return "".join(result)

async def generate_documentation_and_health(
    owner: str, 
    repo: str, 
    description: str, 
    tree_items: list, 
    openai_api_key: str = None,
    gemini_api_key: str = None,
    provider: str = 'openai'
) -> Dict[str, Any]:
    
    # Priority: 1. Client-supplied API key, 2. Server env API key
    if provider == 'gemini':
        active_client = AsyncOpenAI(
            api_key=gemini_api_key,
            base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
        ) if gemini_api_key else gemini_client
        model = "gemini-3.5-flash"
    else:
        active_client = AsyncOpenAI(api_key=openai_api_key) if openai_api_key else client
        model = "gpt-4o"

    if not active_client:
        return {
            "generated_docs": f"```markdown\n# AI Documentation Generation Disabled\n\nPlease provide a valid API key for {provider.upper()} in your Settings or `.env` file.\n```",
            "health_score": 50,
            "metrics": {
                "readme_completeness": 0,
                "api_documentation_coverage": 0,
                "onboarding_quality": 0,
                "missing_documentation_percentage": 0
            },
            "recommendations": [f"Enable {provider.upper()} API key in Settings or Server Environment to get advanced insights."]
        }

    # Extract folder structure to provide context to the LLM
    file_paths = [item.get("path") for item in tree_items if item.get("type") == "blob"]
    
    # We only send a subset of file paths to avoid context overflow for massive repos
    files_context = "\n".join(file_paths[:300])
    if len(file_paths) > 300:
        files_context += f"\n... and {len(file_paths) - 300} more files."

    prompt = textwrap.dedent(f"""
        You are an expert developer and technical writer. 
        Analyze the file structure of a GitHub repository and generate documentation and health metrics.

        Repository: {owner}/{repo}
        Description: {description or 'No description provided.'}

        File Structure:
        {files_context}

        Your task:
        1. Generate a comprehensive Markdown documentation bundle (under 'generated_docs') containing clearly separated sections for:
           - README.md
           - CONTRIBUTING.md
           - Installation Guide
           - Project Overview
           - API Documentation if the structure suggests APIs, routes, controllers, server handlers, or OpenAPI files
        2. Calculate an AI-based Documentation Health Score (0-100).
        3. Provide Categorized Metrics (0-100 for each):
           - readme_completeness
           - api_documentation_coverage
           - onboarding_quality
           - missing_documentation_percentage
        4. Provide actionable recommendations (list of strings).
        5. Detect missing documentation and return warnings as a list of objects. Consider:
           - Missing README.md
           - Missing setup instructions or package manager files
           - Undocumented API routes (files in api/, routes/, controllers/)
           - Files that likely lack comments (core logic files)

        Respond STRICTLY in JSON format matching this schema:
        {{
            "generated_docs": "markdown string",
            "health_score": 85,
            "metrics": {{
                "readme_completeness": 90,
                "api_documentation_coverage": 80,
                "onboarding_quality": 70,
                "missing_documentation_percentage": 20
            }},
            "recommendations": ["string"],
            "warnings": [
                {{
                    "file": "filename.py",
                    "issue": "description of missing docs",
                    "severity": "high/medium/low"
                }}
            ]
        }}
    """)

    try:
        response = await active_client.chat.completions.create(
            model=model, 
            response_format={ "type": "json_object" },
            messages=[
                {"role": "system", "content": "You are a senior developer technical writer. Always output valid JSON matching the requested schema."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=4000
        )
        
        content = response.choices[0].message.content
        if content:
            cleaned_content = clean_json_response(content)
            return json.loads(cleaned_content)
        raise ValueError("Empty response from LLM")
    except Exception as e:
        return {
            "generated_docs": f"```markdown\n# Error generating documentation\n\nAn error occurred:\n{str(e)}\n```",
            "health_score": 0,
            "metrics": {
                "readme_completeness": 0,
                "api_documentation_coverage": 0,
                "onboarding_quality": 0,
                "missing_documentation_percentage": 0
            },
            "recommendations": [f"Error: {str(e)}"],
            "warnings": []
        }
