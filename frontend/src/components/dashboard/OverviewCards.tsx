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
    { label: 'Files Analyzed', value: data.summary.total_files.toString(), icon: FolderGit2, color: 'text-primary' },
    { label: 'Stars', value: data.stars.toString(), icon: Star, color: 'text-warning' },
    { label: 'Forks', value: data.forks.toString(), icon: GitFork, color: 'text-slate-300' },
    { label: 'Open Issues', value: data.open_issues.toString(), icon: AlertCircle, color: 'text-danger' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-card border border-border rounded-md p-4 hover:bg-card-hover transition-colors shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground/70 font-medium">{stat.label}</h3>
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </div>
          <p className="text-3xl font-bold text-foreground tracking-tight">{stat.value}</p>
        </motion.div>
      ))}
    </div>
  );
}
