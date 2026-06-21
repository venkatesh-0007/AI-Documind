'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, FileWarning, TerminalSquare, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UndocumentedFile } from '@/types/analyze';

interface WarningsPanelProps {
  warnings: UndocumentedFile[];
}

const severityConfig = {
  high: {
    card: 'bg-danger/5 border-danger/15 hover:border-danger/40 shadow-[0_0_15px_rgba(244,63,94,0.04)]',
    badge: 'bg-danger/10 text-danger border-danger/25',
    iconColor: 'text-danger bg-danger/10 border-danger/20',
    icon: AlertTriangle,
    label: 'High Priority'
  },
  medium: {
    card: 'bg-warning/5 border-warning/15 hover:border-warning/40 shadow-[0_0_15px_rgba(245,158,11,0.04)]',
    badge: 'bg-warning/10 text-warning border-warning/25',
    iconColor: 'text-warning bg-warning/10 border-warning/20',
    icon: FileWarning,
    label: 'Medium'
  },
  low: {
    card: 'bg-primary/5 border-primary/15 hover:border-primary/40 shadow-[0_0_15px_rgba(99,102,241,0.04)]',
    badge: 'bg-primary/10 text-primary border-primary/25',
    iconColor: 'text-primary bg-primary/10 border-primary/20',
    icon: TerminalSquare,
    label: 'Low'
  },
};

export default function WarningsPanel({ warnings }: WarningsPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="bg-card border border-border rounded-2xl p-5 h-full flex flex-col hover:bg-card-hover/20 transition-all duration-300 group"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-bold text-foreground flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 text-danger" />
          Missing Documentation
        </h3>
        <span className="bg-danger/15 text-danger border border-danger/20 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
          {warnings.length} Issues
        </span>
      </div>

      <div className="space-y-3.5 overflow-y-auto flex-1 max-h-[295px] pr-2 scrollbar-thin">
        {warnings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center opacity-60">
            <p className="text-xs font-bold text-foreground/50">Perfect Documentation!</p>
            <p className="text-[10px] text-foreground/40 mt-1">No undocumented files found in code tree.</p>
          </div>
        ) : (
          warnings.map((warning, index) => {
            const conf = severityConfig[warning.severity as keyof typeof severityConfig] || severityConfig.medium;
            const Icon = conf.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
                className={cn(
                  "flex gap-3.5 p-3.5 rounded-xl border transition-all duration-200",
                  conf.card
                )}
              >
                <div className={cn("p-2 rounded-xl border h-fit flex-shrink-0", conf.iconColor)}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
                    <p className="text-xs font-bold text-foreground font-mono truncate max-w-[160px] md:max-w-[200px]" title={warning.file}>
                      {warning.file.split('/').pop() || warning.file}
                    </p>
                    <span className={cn("text-[9px] font-black uppercase tracking-wider px-2 py-0.5 border rounded-full", conf.badge)}>
                      {conf.label}
                    </span>
                  </div>
                  <p className="text-xs text-foreground/60 leading-relaxed font-sans">
                    {warning.issue}
                  </p>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
