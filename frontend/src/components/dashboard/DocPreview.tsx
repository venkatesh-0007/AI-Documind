'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, FileText, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface DocPreviewProps {
  content?: string;
}

export default function DocPreview({ content }: DocPreviewProps) {
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('preview');
  const [copied, setCopied] = useState(false);

  const displayContent = content || "No documentation generated.";

  const handleCopy = () => {
    navigator.clipboard.writeText(displayContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-md overflow-hidden transition-colors shadow-sm"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/60">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('preview')}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
              activeTab === 'preview' ? "bg-foreground/10 text-foreground" : "text-foreground/50 hover:text-foreground"
            )}
          >
            <FileText className="w-4 h-4" />
            Markdown Preview
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
              activeTab === 'code' ? "bg-foreground/10 text-foreground" : "text-foreground/50 hover:text-foreground"
            )}
          >
            <Code2 className="w-4 h-4" />
            Raw Source
          </button>
        </div>
        
        <button
          onClick={handleCopy}
          className="p-2 hover:bg-foreground/10 rounded-md text-foreground/50 hover:text-foreground transition-colors"
          title="Copy to clipboard"
        >
          {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      <div className="p-6 bg-background overflow-x-auto min-h-[400px]">
        {activeTab === 'preview' ? (
          <div className="prose dark:prose-invert max-w-none text-foreground">
            <ReactMarkdown>{displayContent}</ReactMarkdown>
          </div>
        ) : (
          <pre className="text-sm font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">
            <code>{displayContent}</code>
          </pre>
        )}
      </div>
    </motion.div>
  );
}
