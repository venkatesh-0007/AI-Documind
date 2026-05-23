import React from 'react';
import { BookOpen, GitBranch, Settings } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  userName?: string;
}

export default function Header({ onOpenSettings, userName }: HeaderProps) {
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
        
        <div className="flex items-center gap-4">
          {userName && (
            <span className="text-sm font-medium text-foreground/80">
              Welcome back, {userName}
            </span>
          )}

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="text-foreground/70 hover:text-foreground transition-colors"
          >
            <GitBranch className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </a>

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

