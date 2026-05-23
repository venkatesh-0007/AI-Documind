'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, CheckCircle, ArrowRight } from 'lucide-react';
import { Suggestion } from '@/types/analyze';

interface SuggestionsPanelProps {
  suggestions: Suggestion[];
}

export default function SuggestionsPanel({ suggestions }: SuggestionsPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card border border-border rounded-md p-5 h-full flex flex-col hover:bg-card-hover/20 transition-colors shadow-sm"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-success/20 text-success rounded-lg">
          <Lightbulb className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">AI Suggestions</h3>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto max-h-[300px] pr-2">
        {suggestions.length === 0 ? (
          <p className="text-foreground/70 text-sm">No suggestions available.</p>
        ) : (
          suggestions.map((suggestion, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              className="flex items-start gap-3 group cursor-pointer"
            >
              <CheckCircle className="w-5 h-5 text-success/50 mt-0.5 group-hover:text-success transition-colors flex-shrink-0" />
              <p className="text-sm text-foreground/80 leading-relaxed group-hover:text-foreground transition-colors">
                {suggestion.suggestion}
              </p>
            </motion.div>
          ))
        )}
      </div>

      <button className="mt-6 w-full py-2 bg-card hover:bg-card-hover border border-border rounded-md flex items-center justify-center gap-2 text-foreground/90 text-sm font-medium transition-colors group shadow-sm">
        Apply All Suggestions
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  );
}
