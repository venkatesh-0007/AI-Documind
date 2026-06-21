'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, CheckCircle, ArrowRight } from 'lucide-react';
import { Suggestion } from '@/types/analyze';
import { cn } from '@/lib/utils';

interface SuggestionsPanelProps {
  suggestions: Suggestion[];
}

export default function SuggestionsPanel({ suggestions }: SuggestionsPanelProps) {
  // Add some interactivity: allow user to click suggestions to "check them off" as complete!
  const [completed, setCompleted] = useState<Record<number, boolean>>({});

  const toggleComplete = (idx: number) => {
    setCompleted(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleApplyAll = () => {
    // Simply mark all as complete for high-fidelity interactive feel
    const all: Record<number, boolean> = {};
    suggestions.forEach((_, idx) => {
      all[idx] = true;
    });
    setCompleted(all);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-card border border-border rounded-2xl p-5 h-full flex flex-col hover:bg-card-hover/20 transition-all duration-300 group"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-success/10 text-success border border-success/20 rounded-xl">
          <Lightbulb className="w-5 h-5 animate-pulse" />
        </div>
        <h3 className="text-base font-bold text-foreground">AI Suggestions</h3>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto max-h-[295px] pr-2 scrollbar-thin">
        {suggestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center opacity-60">
            <p className="text-xs font-bold text-foreground/50">Everything looks solid!</p>
            <p className="text-[10px] text-foreground/40 mt-1">No AI suggestions at this time.</p>
          </div>
        ) : (
          suggestions.map((suggestion, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.08 }}
              onClick={() => toggleComplete(index)}
              className={cn(
                "flex items-start gap-3 p-3 rounded-xl border border-border/40 hover:border-success/30 hover:bg-success/5 transition-all duration-200 cursor-pointer group/item select-none",
                completed[index] ? "bg-success/5 border-success/30 opacity-60" : "bg-background/25"
              )}
            >
              <CheckCircle className={cn(
                "w-4 h-4 mt-0.5 transition-colors flex-shrink-0",
                completed[index] 
                  ? "text-success fill-success/10" 
                  : "text-foreground/20 group-hover/item:text-success/50"
              )} />
              <p className={cn(
                "text-xs leading-relaxed transition-all",
                completed[index] 
                  ? "text-foreground/40 line-through font-medium" 
                  : "text-foreground/75 group-hover/item:text-foreground"
              )}>
                {suggestion.suggestion}
              </p>
            </motion.div>
          ))
        )}
      </div>

      <button 
        onClick={handleApplyAll}
        className="mt-6 w-full py-2.5 bg-card hover:bg-card-hover border border-border hover:border-primary/50 rounded-xl flex items-center justify-center gap-2 text-foreground/80 hover:text-foreground text-xs font-bold transition-all group active:scale-[0.98] shadow-sm"
      >
        Mark All Completed
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-foreground/50 group-hover:text-foreground" />
      </button>
    </motion.div>
  );
}
