'use client';

import { GitBranch, LogOut, Settings } from 'lucide-react';
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
    <header className="sticky top-0 z-50 w-full glass-panel border-b bg-header-bg/40 backdrop-blur-md transition-colors duration-300">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div 
          className="flex items-center gap-2.5 cursor-pointer group" 
          onClick={() => window.location.reload()}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="DocuMind AI Logo"
            className="h-8 w-8 object-contain rounded-lg ring-2 ring-primary/20 group-hover:ring-primary/45 transition-all duration-300"
          />
          <span className="text-base font-black tracking-wider text-gradient-primary uppercase font-sans">
            DocuMind AI
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          {githubUser ? (
            <div className="hidden items-center gap-2 md:flex bg-card/45 px-3 py-1.5 rounded-xl border border-border">
              {githubUser.avatar_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={githubUser.avatar_url}
                  alt=""
                  className="h-6 w-6 rounded-full border border-border/40"
                />
              )}
              <span className="max-w-36 truncate text-xs font-semibold text-foreground/80">
                {githubUser.name || githubUser.login}
              </span>
            </div>
          ) : userName ? (
            <span className="hidden text-xs font-medium text-foreground/50 md:inline-flex items-center gap-1.5 bg-card/30 px-3 py-1.5 rounded-xl border border-border">
              <span className="w-1.5 h-1.5 rounded-full bg-success/60 animate-pulse" />
              Active: {userName}
            </span>
          ) : null}

          {githubUser ? (
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-4 py-2 text-xs font-bold text-foreground/75 transition-all duration-200 hover:bg-card-hover hover:text-foreground hover:scale-[0.98] active:scale-[0.95]"
              title="Log out"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onLogin}
              disabled={isAuthLoading}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-violet-600 px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-[0_0_15px_rgba(99,102,241,0.25)] hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all duration-300 hover:brightness-105 active:scale-[0.97] disabled:cursor-wait disabled:opacity-70"
            >
              <GitBranch className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign in with GitHub</span>
              <span className="sm:hidden">Sign in</span>
            </button>
          )}

          <button
            onClick={onOpenSettings}
            className="p-2 bg-card hover:bg-card-hover border border-border rounded-xl text-foreground/70 hover:text-foreground transition-all duration-200 group active:scale-[0.95]"
            title="Open settings"
          >
            <Settings className="h-4.5 w-4.5 group-hover:rotate-45 transition-transform duration-300" />
            <span className="sr-only">Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
}
