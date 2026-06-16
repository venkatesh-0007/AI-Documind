'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CategorizedMetrics } from '@/types/analyze';

interface HealthScoreProps {
  score: number;
  metrics?: CategorizedMetrics;
}

export default function HealthScore({ score, metrics }: HealthScoreProps) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let color = 'text-danger';
  if (score >= 80) color = 'text-success';
  else if (score >= 60) color = 'text-warning';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card border border-border rounded-md p-5 flex flex-col items-center justify-center relative overflow-hidden h-full hover:bg-card-hover/20 transition-colors shadow-sm"
    >
      
      <h3 className="text-xl font-semibold text-foreground mb-6 self-start w-full">Documentation Health</h3>
      
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="45"
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            className="text-foreground/10"
          />
          {/* Progress circle */}
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx="96"
            cy="96"
            r="45"
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            className={`${color}`}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-5xl font-black text-foreground">{score}</span>
          <span className="text-sm text-foreground/50 font-medium">/ 100</span>
        </div>
      </div>
      
      {metrics && (
        <div className="w-full mt-6 space-y-3.5 text-sm text-foreground/80">
          {[
            { label: 'README Completeness', value: metrics.readme_completeness, color: 'bg-primary' },
            { label: 'API Coverage', value: metrics.api_documentation_coverage, color: 'bg-success' },
            { label: 'Onboarding Quality', value: metrics.onboarding_quality, color: 'bg-warning' }
          ].map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-foreground/70">
                <span>{item.label}</span>
                <span>{item.value}%</span>
              </div>
              <div className="h-1.5 w-full bg-foreground/5 rounded-full overflow-hidden border border-border/20">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ duration: 1.2, delay: idx * 0.15, ease: "easeOut" }}
                  className={`h-full ${item.color}`}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
