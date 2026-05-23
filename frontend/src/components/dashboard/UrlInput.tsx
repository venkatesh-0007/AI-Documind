'use client';

import React, { useState } from 'react';
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

  React.useEffect(() => {
    if (initialUrl) {
      setUrl(initialUrl);
    }
  }, [initialUrl]);

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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className={cn(
          "relative flex items-center w-full bg-background border rounded-md overflow-hidden transition-colors focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary/60",
          error ? "border-danger focus-within:ring-danger/40 focus-within:border-danger" : "border-border"
        )}>
          <div className="pl-4 pr-2 text-foreground/50">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isScanning}
            placeholder="https://github.com/username/repository"
            className="w-full py-3 px-2 bg-transparent text-foreground placeholder:text-foreground/40 focus:outline-none disabled:opacity-50 text-base"
          />
          <div className="pr-2 pl-2 flex items-center">
            <button
              type="submit"
              disabled={isScanning}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2 rounded-md text-sm font-medium transition-all disabled:opacity-70 disabled:cursor-not-allowed"
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
          <p className="mt-2 text-danger text-sm font-medium">{error}</p>
        )}
      </form>
    </motion.div>
  );
}
