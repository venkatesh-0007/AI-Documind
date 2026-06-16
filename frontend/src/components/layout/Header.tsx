import React from 'react';
import { BookOpen, GitBranch, LogOut, Settings } from 'lucide-react';
import { GitHubUser } from '@/types/analyze';

interface HeaderProps {
  onOpenSettings: () => void;
  userName?: string;
  githubUser?: GitHubUser | null;
  isAuthLoading?: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export default function Header({
  onOpenSettings,
  userName,
  githubUser,
  isAuthLoading = false,
  onLogin,
  onLogout,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-header-bg transition-colors duration-300">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background">
            <BookOpen className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            DocuMind AI
          </span>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          {githubUser ? (
            <div className="hidden items-center gap-2 md:flex">
              {githubUser.avatar_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={githubUser.avatar_url}
                  alt=""
                  className="h-7 w-7 rounded-full border border-border"
                />
              )}
              <span className="max-w-36 truncate text-sm font-medium text-foreground/80">
                {githubUser.name || githubUser.login}
              </span>
            </div>
          ) : userName ? (
            <span className="hidden text-sm font-medium text-foreground/80 md:inline">
              Welcome back, {userName}
            </span>
          ) : null}

          {githubUser ? (
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground/75 transition-colors hover:bg-card-hover hover:text-foreground"
              title="Log out"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onLogin}
              disabled={isAuthLoading}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-wait disabled:opacity-70"
            >
              <GitBranch className="h-4 w-4" />
              <span className="hidden sm:inline">Sign in with GitHub</span>
              <span className="sm:hidden">Sign in</span>
            </button>
          )}

          <button
            onClick={onOpenSettings}
            className="p-1.5 hover:bg-foreground/5 rounded-lg text-foreground/70 hover:text-foreground transition-all duration-200 group"
            title="Open settings"
          >
            <Settings className="h-5 w-5 group-hover:rotate-45 transition-transform duration-300" />
            <span className="sr-only">Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
}
