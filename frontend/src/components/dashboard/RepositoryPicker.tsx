'use client';

import React from 'react';
import { GitBranch, GitFork, Loader2, Lock, Search, Star, Unlock, RefreshCw } from 'lucide-react';
import { GitHubRepository } from '@/types/analyze';
import { motion } from 'framer-motion';

interface RepositoryPickerProps {
  repositories: GitHubRepository[];
  isLoading: boolean;
  error: string;
  onRefresh: () => void;
  onSelect: (url: string) => void;
}

const getLanguageColor = (lang: string | null): string => {
  if (!lang) return 'text-foreground/40 bg-foreground/5 border-border';
  const l = lang.toLowerCase();
  if (l === 'typescript') return 'text-sky-400 bg-sky-400/10 border-sky-400/20';
  if (l === 'javascript') return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
  if (l === 'python') return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
  if (l === 'rust') return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
  if (l === 'go') return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
  if (l === 'html' || l === 'css') return 'text-pink-400 bg-pink-400/10 border-pink-400/20';
  return 'text-primary bg-primary/10 border-primary/20';
};

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
    <motion.section 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="border border-border bg-card/45 backdrop-blur-md rounded-2xl shadow-sm overflow-hidden"
    >
      <div className="flex flex-col gap-3 border-b border-border/80 px-5 py-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            Connected Repositories
          </h2>
          <p className="text-xs text-foreground/50 mt-1">
            Choose a GitHub repository to generate documentation from its latest default branch.
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/60 px-4 py-2 text-xs font-bold text-foreground/80 transition-all hover:bg-card-hover disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.97]"
        >
          {isLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5 text-foreground/60" />
          )}
          Refresh List
        </button>
      </div>

      <div className="p-5">
        <div className="relative mb-5">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/30" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by repository name, language, or description..."
            className="w-full rounded-xl border border-border bg-background/55 py-3 pl-10 pr-4 text-xs md:text-sm text-foreground placeholder:text-foreground/30 outline-none transition-all focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {error && (
          <div className="rounded-xl border border-danger/20 bg-danger/5 px-4 py-3.5 text-xs font-semibold text-danger flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
            {error}
          </div>
        )}

        {!error && isLoading && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-32 animate-pulse rounded-xl border border-border/80 bg-background/40" />
            ))}
          </div>
        )}

        {!error && !isLoading && repositories.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-background/45 px-5 py-8 text-center">
            <p className="font-bold text-sm text-foreground/85">No repositories found</p>
            <p className="mt-1 text-xs text-foreground/50 max-w-sm mx-auto leading-relaxed">
              GitHub did not return repositories for this account. Check OAuth scopes or organization access.
            </p>
          </div>
        )}

        {!error && !isLoading && repositories.length > 0 && filteredRepositories.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-background/40 px-5 py-8 text-center text-xs font-medium text-foreground/40">
            No repositories match your filter.
          </div>
        )}

        {!error && !isLoading && filteredRepositories.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredRepositories.map((repo) => (
              <button
                type="button"
                key={repo.id}
                onClick={() => onSelect(repo.html_url)}
                className="group flex min-h-32 flex-col justify-between rounded-xl border border-border bg-card/40 p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-card-hover/80 hover:shadow-[0_8px_30px_rgba(99,102,241,0.06)] active:scale-[0.99]"
              >
                <div className="w-full">
                  <div className="flex items-center justify-between gap-3">
                    <p className="min-w-0 truncate text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {repo.name}
                    </p>
                    {repo.private ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-warning bg-warning/10 border border-warning/20 px-2 py-0.5 rounded-full">
                        <Lock className="h-2.5 w-2.5" />
                        Private
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-foreground/40 bg-foreground/5 border border-border/80 px-2 py-0.5 rounded-full">
                        <Unlock className="h-2.5 w-2.5" />
                        Public
                      </span>
                    )}
                  </div>
                  <p className="mt-2.5 line-clamp-2 text-xs text-foreground/50 leading-relaxed font-sans">
                    {repo.description || 'No description provided.'}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between w-full border-t border-border/60 pt-3">
                  <div className="flex items-center gap-3 text-[10px] font-bold text-foreground/40">
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3 w-3 text-warning/70" />
                      {repo.stargazers_count}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <GitFork className="h-3 w-3 text-foreground/30" />
                      {repo.forks_count}
                    </span>
                  </div>
                  
                  {repo.language && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 border rounded-full ${getLanguageColor(repo.language)}`}>
                      {repo.language}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}
