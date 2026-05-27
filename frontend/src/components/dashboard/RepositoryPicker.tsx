'use client';

import React from 'react';
import { GitBranch, GitFork, Loader2, Lock, Search, Star, Unlock } from 'lucide-react';
import { GitHubRepository } from '@/types/analyze';

interface RepositoryPickerProps {
  repositories: GitHubRepository[];
  isLoading: boolean;
  error: string;
  onRefresh: () => void;
  onSelect: (url: string) => void;
}

export default function RepositoryPicker({
  repositories,
  isLoading,
  error,
  onRefresh,
  onSelect,
}: RepositoryPickerProps) {
  const [query, setQuery] = React.useState('');

  const filteredRepositories = repositories.filter((repo) => {
    const haystack = `${repo.full_name} ${repo.description || ''} ${repo.language || ''}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  return (
    <section className="border border-border bg-card rounded-md shadow-sm overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-border px-4 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-primary" />
            Connected repositories
          </h2>
          <p className="text-sm text-foreground/60 mt-1">
            Choose a GitHub repository to generate documentation from its latest default branch.
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-card-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Refresh
        </button>
      </div>

      <div className="p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter by name, language, or description"
            className="w-full rounded-md border border-border bg-background py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-foreground/40 outline-none transition-colors focus:border-primary/70 focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {error && (
          <div className="rounded-md border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        {!error && isLoading && (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-32 animate-pulse rounded-md border border-border bg-background" />
            ))}
          </div>
        )}

        {!error && !isLoading && repositories.length === 0 && (
          <div className="rounded-md border border-dashed border-border bg-background px-5 py-8 text-center">
            <p className="font-medium text-foreground">No repositories found</p>
            <p className="mt-1 text-sm text-foreground/60">
              GitHub did not return repositories for this account. Check OAuth scopes or organization access.
            </p>
          </div>
        )}

        {!error && !isLoading && repositories.length > 0 && filteredRepositories.length === 0 && (
          <div className="rounded-md border border-dashed border-border bg-background px-5 py-8 text-center text-sm text-foreground/60">
            No repositories match your filter.
          </div>
        )}

        {!error && !isLoading && filteredRepositories.length > 0 && (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filteredRepositories.map((repo) => (
              <button
                type="button"
                key={repo.id}
                onClick={() => onSelect(repo.html_url)}
                className="group flex min-h-32 flex-col justify-between rounded-md border border-border bg-background p-4 text-left transition-colors hover:border-primary/60 hover:bg-card-hover"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <p className="min-w-0 truncate font-semibold text-foreground group-hover:text-primary">
                      {repo.full_name}
                    </p>
                    {repo.private ? (
                      <Lock className="h-4 w-4 shrink-0 text-warning" />
                    ) : (
                      <Unlock className="h-4 w-4 shrink-0 text-foreground/40" />
                    )}
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-foreground/60">
                    {repo.description || 'No description provided.'}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-foreground/50">
                  {repo.language && <span>{repo.language}</span>}
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-3.5 w-3.5" />
                    {repo.stargazers_count}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <GitFork className="h-3.5 w-3.5" />
                    {repo.forks_count}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
