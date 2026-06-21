'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, FileText, Copy, Check, Download, Info } from 'lucide-react';
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

  const handleDownload = () => {
    try {
      const element = document.createElement("a");
      const file = new Blob([displayContent], { type: 'text/markdown' });
      element.href = URL.createObjectURL(file);
      element.download = "README.md";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (e) {
      console.error("Download failed", e);
    }
  };

  // Simple statistics
  const linesCount = displayContent.split('\n').length;
  const wordCount = displayContent.split(/\s+/).filter(Boolean).length;
  const byteCount = new Blob([displayContent]).size;
  const kbSize = (byteCount / 1024).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="bg-card border border-border rounded-2xl overflow-hidden transition-all shadow-lg backdrop-blur-md"
    >
      {/* Decorative Editor Window Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3.5 border-b border-border/80 bg-card/70 gap-3">
        <div className="flex items-center gap-3">
          {/* macOS window control buttons */}
          <div className="hidden md:flex items-center gap-1.5 pr-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          
          {/* File Tab */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-background border border-border rounded-lg text-xs font-bold text-primary font-mono select-none">
            <FileText className="w-3.5 h-3.5" />
            <span>README.md</span>
            <span className="text-[10px] text-foreground/30 ml-1">Generated</span>
          </div>
        </div>

        {/* Tab Selector & Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
          <div className="flex items-center bg-background/60 p-1 border border-border rounded-xl">
            <button
              onClick={() => setActiveTab('preview')}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                activeTab === 'preview' ? "bg-card text-foreground shadow-sm" : "text-foreground/50 hover:text-foreground"
              )}
            >
              <FileText className="w-3.5 h-3.5" />
              Preview
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                activeTab === 'code' ? "bg-card text-foreground shadow-sm" : "text-foreground/50 hover:text-foreground"
              )}
            >
              <Code2 className="w-3.5 h-3.5" />
              Code
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="p-2 bg-background hover:bg-card-hover border border-border rounded-xl text-foreground/55 hover:text-foreground transition-all duration-200"
              title="Download README.md"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopy}
              className="p-2 bg-background hover:bg-card-hover border border-border rounded-xl text-foreground/55 hover:text-foreground transition-all duration-200"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Editor Body */}
      <div className="p-6 md:p-8 bg-background/45 overflow-x-auto min-h-[420px] max-h-[600px] custom-scrollbar border-b border-border/80">
        {activeTab === 'preview' ? (
          <div className="prose dark:prose-invert max-w-none text-foreground/90 font-sans prose-sm md:prose-base prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-a:text-primary prose-pre:bg-card prose-pre:border prose-pre:border-border prose-pre:rounded-xl">
            <ReactMarkdown>{displayContent}</ReactMarkdown>
          </div>
        ) : (
          <pre className="text-xs md:text-sm font-mono text-foreground/75 leading-relaxed whitespace-pre-wrap">
            <code>{displayContent}</code>
          </pre>
        )}
      </div>

      {/* File statistics statusbar */}
      <div className="px-5 py-2.5 bg-card/60 border-t border-border/30 text-[10px] font-bold text-foreground/40 font-mono flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span>UTF-8</span>
          <span>Markdown</span>
        </div>
        <div className="flex items-center gap-4">
          <span>{linesCount} Lines</span>
          <span>{wordCount} Words</span>
          <span>{kbSize} KB</span>
        </div>
      </div>
    </motion.div>
  );
}
