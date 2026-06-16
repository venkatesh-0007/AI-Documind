'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, FileWarning, TerminalSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UndocumentedFile } from '@/types/analyze';

interface WarningsPanelProps {
  warnings: UndocumentedFile[];
}

const severityColors = {
  high: 'bg-danger/10 text-danger border-danger/20',
  medium: 'bg-warning/10 text-warning border-warning/20',
  low: 'bg-primary/10 text-primary border-primary/20',
};

const severityIcons = {
  high: AlertTriangle,
  medium: FileWarning,
  low: TerminalSquare
};

export default function WarningsPanel({ warnings }: WarningsPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card border border-border rounded-md p-5 h-full flex flex-col hover:bg-card-hover/20 transition-colors shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-foreground">Missing Documentation</h3>
        <span className="bg-danger/20 text-danger text-xs font-bold px-2.5 py-1 rounded-full">
          {warnings.length} Issues
        </span>
      </div>

      <div className="space-y-4 overflow-y-auto flex-1 max-h-[300px] pr-2">
        {warnings.length === 0 ? (
          <p className="text-foreground/70 text-sm">No missing documentation found.</p>
        ) : (
          warnings.map((warning, index) => {
            const Icon = severityIcons[warning.severity as keyof typeof severityIcons] || FileWarning;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 p-3 rounded-md bg-background/30 border border-border/60 hover:bg-background/60 transition-colors"
              >
                <div className={cn("p-2 rounded-lg border h-fit", severityColors[warning.severity as keyof typeof severityColors] || severityColors.medium)}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-foreground font-mono text-sm mb-1 break-all">{warning.file}</p>
                  <p className="text-foreground/70 text-sm leading-relaxed">{warning.issue}</p>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
