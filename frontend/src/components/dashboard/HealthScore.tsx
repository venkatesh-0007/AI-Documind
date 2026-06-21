'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CategorizedMetrics } from '@/types/analyze';
import { Sparkles } from 'lucide-react';

interface HealthScoreProps {
  score: number;
  metrics?: CategorizedMetrics;
}

export default function HealthScore({ score, metrics }: HealthScoreProps) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let color = 'text-danger';
  let badgeBg = 'bg-danger/10 text-danger border-danger/20';
  if (score >= 80) {
    color = 'text-success';
    badgeBg = 'bg-success/10 text-success border-success/20';
  } else if (score >= 60) {
    color = 'text-warning';
    badgeBg = 'bg-warning/10 text-warning border-warning/20';
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-card border border-border rounded-2xl p-5 flex flex-col items-center justify-between relative overflow-hidden h-full hover:bg-card-hover/20 transition-all duration-300 group"
    >
      <div className="flex items-center justify-between w-full mb-6">
        <h3 className="text-base font-bold text-foreground flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-primary" />
          Documentation Health
        </h3>
        <span className={`text-[10px] font-bold px-2 py-0.5 border rounded-full uppercase tracking-wider ${badgeBg}`}>
          {score >= 80 ? 'Good' : score >= 60 ? 'Fair' : 'Poor'}
        </span>
      </div>
      
      <div className="relative w-44 h-44 flex items-center justify-center">
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="88"
            cy="88"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-foreground/5"
          />
          {/* Progress circle */}
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            cx="88"
            cy="88"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray={circumference}
            className={`${color} filter drop-shadow-[0_0_8px_rgba(16,185,129,0.2)]`}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-foreground font-mono leading-none">{score}</span>
          <span className="text-[10px] text-foreground/45 font-bold uppercase tracking-wider mt-1">Health rating</span>
        </div>
      </div>
      
      {metrics && (
        <div className="w-full mt-6 space-y-4 text-sm text-foreground/80 border-t border-border/60 pt-4">
          {[
            { label: 'README Completeness', value: metrics.readme_completeness, color: 'bg-primary' },
            { label: 'API Coverage', value: metrics.api_documentation_coverage, color: 'bg-success' },
            { label: 'Onboarding Quality', value: metrics.onboarding_quality, color: 'bg-warning' }
          ].map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold text-foreground/60 tracking-wide">
                <span>{item.label}</span>
                <span className="font-mono text-foreground">{item.value}%</span>
              </div>
              <div className="h-2 w-full bg-foreground/5 rounded-full overflow-hidden border border-border/50">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ duration: 1.2, delay: idx * 0.12, ease: "easeOut" }}
                  className={`h-full ${item.color} rounded-full`}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
