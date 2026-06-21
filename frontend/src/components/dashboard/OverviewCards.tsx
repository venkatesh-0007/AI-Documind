'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FolderGit2, Star, GitFork, AlertCircle } from 'lucide-react';
import { AnalyzeResponse } from '@/types/analyze';

interface OverviewCardsProps {
  data: AnalyzeResponse;
}

export default function OverviewCards({ data }: OverviewCardsProps) {
  const stats = [
    { 
      label: 'Files Analyzed', 
      value: data.summary.total_files.toString(), 
      icon: FolderGit2, 
      color: 'text-primary border-primary/20 bg-primary/10',
      glow: 'shadow-[0_0_20px_rgba(99,102,241,0.15)]'
    },
    { 
      label: 'Stars Rating', 
      value: data.stars.toString(), 
      icon: Star, 
      color: 'text-warning border-warning/20 bg-warning/10',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]'
    },
    { 
      label: 'Fork Count', 
      value: data.forks.toString(), 
      icon: GitFork, 
      color: 'text-sky-400 border-sky-400/20 bg-sky-400/10',
      glow: 'shadow-[0_0_20px_rgba(56,189,248,0.15)]'
    },
    { 
      label: 'Open Issues', 
      value: data.open_issues.toString(), 
      icon: AlertCircle, 
      color: 'text-danger border-danger/20 bg-danger/10',
      glow: 'shadow-[0_0_20px_rgba(244,63,94,0.15)]'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: index * 0.08 }}
          className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 hover:bg-card-hover/80 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
        >
          {/* Subtle background card circle decor */}
          <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-foreground/5 rounded-full blur-xl group-hover:bg-primary/5 transition-all duration-300" />
          
          <div className="flex items-center justify-between mb-5">
            <span className="text-xs font-bold text-foreground/50 tracking-wider uppercase">
              {stat.label}
            </span>
            <div className={`p-2 rounded-xl border ${stat.color} ${stat.glow} transition-transform duration-300 group-hover:scale-110`}>
              <stat.icon className="w-4.5 h-4.5" />
            </div>
          </div>
          <p className="text-3xl font-black text-foreground tracking-tight font-mono">
            {stat.value}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
