export interface CategorizedMetrics {
  readme_completeness: number;
  api_documentation_coverage: number;
  onboarding_quality: number;
  missing_documentation_percentage: number;
}

export interface RepoSummary {
  total_files: number;
  has_readme: boolean;
  code_files: number;
  doc_files: number;
  health_score: number;
  metrics?: CategorizedMetrics;
}

export interface UndocumentedFile {
  file: string;
  issue: string;
  severity: string;
}

export interface Suggestion {
  suggestion: string;
}

export interface AnalyzeResponse {
  owner: string;
  repo: string;
  description?: string;
  stars: number;
  forks: number;
  open_issues: number;
  summary: RepoSummary;
  warnings: UndocumentedFile[];
  suggestions: Suggestion[];
  generated_docs?: string;
}
