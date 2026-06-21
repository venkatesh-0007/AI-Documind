'use client';

import React from 'react';
import { Search, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface UrlInputProps {
  onAnalyze: (url: string) => void;
  isScanning: boolean;
  initialUrl?: string;
}

export default function UrlInput({ onAnalyze, isScanning, initialUrl = '' }: UrlInputProps) {
  const [url, setUrl] = React.useState(initialUrl);
  const [error, setError] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please enter a valid GitHub repository URL.');
      return;
    }
    if (!url.includes('github.com')) {
      setError('Only GitHub URLs are supported currently.');
      return;
    }
    setError('');
    onAnalyze(url);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className={cn(
          "relative flex items-center w-full bg-card border rounded-2xl overflow-hidden backdrop-blur-md transition-all duration-300",
          error 
            ? "border-danger/60 focus-within:ring-2 focus-within:ring-danger/25 focus-within:border-danger" 
            : "border-border focus-within:ring-2 focus-within:ring-primary/25 focus-within:border-primary/60 focus-within:shadow-[0_0_20px_rgba(99,102,241,0.06)]"
        )}>
          <div className="pl-4 pr-1 text-foreground/40">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isScanning}
            placeholder="https://github.com/username/repository"
            className="w-full py-4 px-3 bg-transparent text-foreground placeholder:text-foreground/30 focus:outline-none disabled:opacity-50 text-sm md:text-base font-mono"
          />
          <div className="pr-3 pl-2 flex items-center gap-3">
            {/* Keyboard shortcut hint */}
            <span className="hidden md:inline text-[10px] font-mono tracking-widest text-foreground/30 border border-border/60 bg-background/50 px-2 py-1 rounded-md uppercase">
              Enter ↵
            </span>
            <button
              type="submit"
              disabled={isScanning}
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-violet-600 hover:brightness-105 text-primary-foreground px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all shadow-[0_0_12px_rgba(99,102,241,0.2)] hover:shadow-[0_0_18px_rgba(99,102,241,0.35)] disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <span>Analyze</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
        {error && (
          <p className="mt-2.5 text-danger text-xs font-semibold pl-2 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-danger animate-ping" />
            {error}
          </p>
        )}
      </form>
    </motion.div>
  );
}
