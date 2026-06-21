'use client';

import React, { useState, useEffect, useRef } from 'react';
/* eslint-disable react-hooks/set-state-in-effect */
import { Terminal, Brain, Activity, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ScanningAnimationProps {
  url?: string;
}

const workflows = [
  { id: 'fetch', label: 'Repository Clone', desc: 'Cloning tree & indexing blobtree' },
  { id: 'ast', label: 'Structure Mapping', desc: 'Parsing path signatures & imports' },
  { id: 'ai', label: 'Documentation Engine', desc: 'Generating technical documentation' },
  { id: 'score', label: 'Health Evaluation', desc: 'Computing documentation health metrics' }
];

const thoughts = [
  "Monologue: Initiating connection to GitHub repository to clone default branch tree. Indexing blobs...",
  "Monologue: Repository cloned. Commencing static analysis. Mapping directories to locate main files, configs, and endpoints...",
  "Monologue: Code structure indexed. Directing AST reports to documentation LLMs to draft READMEs and guidelines...",
  "Monologue: Draft compilation ready. Initiating validator to count undocumented endpoints and score onboarding quality..."
];

export default function ScanningAnimation({ url = '' }: ScanningAnimationProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [monologue, setMonologue] = useState('');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  let repoName = 'repository';
  let repoOwner = 'owner';
  if (url) {
    try {
      const cleaned = url.replace(/\/$/, '');
      const parts = cleaned.split('/');
      if (parts.length >= 2) {
        repoName = parts[parts.length - 1];
        repoOwner = parts[parts.length - 2];
      }
    } catch {}
  }

  // Stepper timings
  useEffect(() => {
    const timers = [
      setTimeout(() => setActiveStep(1), 2200),
      setTimeout(() => setActiveStep(2), 4800),
      setTimeout(() => setActiveStep(3), 7400)
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Inner typewriter monologue
  useEffect(() => {
    let index = 0;
    const currentThought = thoughts[activeStep];
    setMonologue('');
    
    const interval = setInterval(() => {
      if (index < currentThought.length) {
        setMonologue((prev) => prev + currentThought.charAt(index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [activeStep]);

  // Terminal logging logic
  useEffect(() => {
    const timestamp = () => new Date().toLocaleTimeString();
    
    const generateInitialLogs = () => {
      return [
        `[${timestamp()}] [SYSTEM] Agent Antigravity initialized.`,
        `[${timestamp()}] [INFO] Targeting URL: ${url || 'https://github.com/owner/repo'}`,
        `[${timestamp()}] [CLONE] Fetching Git tree for '${repoOwner}/${repoName}'...`,
      ];
    };

    setLogs(generateInitialLogs());

    const logSequence = [
      { delay: 1000, text: `[${timestamp()}] [CLONE] Found default branch: main.` },
      { delay: 1500, text: `[${timestamp()}] [CLONE] Fetch successful. Indexing 152 workspace items.` },
      { delay: 2200, text: `[${timestamp()}] [SYSTEM] Step 1 finished. Starting Structure Analysis.` },
      { delay: 2800, text: `[${timestamp()}] [AST] Locating build configs: package.json, tsconfig.json, next.config.ts...` },
      { delay: 3400, text: `[${timestamp()}] [AST] Discovered core endpoints: /api/v1/auth/login, /api/v1/analyze.` },
      { delay: 4000, text: `[${timestamp()}] [AST] Cataloging exports & imports signatures in 45 TSX source files.` },
      { delay: 4800, text: `[${timestamp()}] [SYSTEM] Step 2 finished. Starting AI Documentation generator.` },
      { delay: 5600, text: `[${timestamp()}] [AI] Preparing payload. Model instance: gemini-3.5-flash-medium.` },
      { delay: 6200, text: `[${timestamp()}] [AI] Analyzing folder tree to assemble comprehensive technical summary...` },
      { delay: 6800, text: `[${timestamp()}] [AI] Drafting setup guidelines, code usage instructions, and architectural maps...` },
      { delay: 7400, text: `[${timestamp()}] [SYSTEM] Step 3 finished. Processing documentation health ratings.` },
      { delay: 8200, text: `[${timestamp()}] [METRICS] Scanning source files for missing comments & exported declarations...` },
      { delay: 8900, text: `[${timestamp()}] [METRICS] Computing weights for README coverage & Onboarding complexity.` },
      { delay: 9500, text: `[${timestamp()}] [SYSTEM] Payloads compiled. Transferring analysis logs to Dashboard.` }
    ];

    const timers = logSequence.map(item => 
      setTimeout(() => {
        setLogs(prev => [...prev, item.text]);
      }, item.delay)
    );

    return () => timers.forEach(clearTimeout);
  }, [url, repoOwner, repoName]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="w-full max-w-5xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-12 gap-6">
      
      {/* Left panel: Stepper (Timeline) */}
      <div className="md:col-span-5 glass-panel rounded-2xl p-6 flex flex-col justify-between shadow-lg relative min-h-[380px] overflow-hidden">
        {/* Glow overlay */}
        <div className="absolute -right-24 -top-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        {/* Laser scanner grid overlay */}
        <div className="absolute inset-x-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-scan z-20 pointer-events-none" />
        
        <div>
          <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-3.5">
            <Activity className="w-4 h-4 text-primary animate-pulse" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/50">
              Analysis Timeline
            </h4>
          </div>
          
          <div className="relative pl-6 space-y-6">
            {/* Timeline Line */}
            <div className="absolute top-2.5 left-2.5 bottom-8 w-[2px] bg-border/40" />
            
            {workflows.map((flow, index) => {
              const isCompleted = index < activeStep;
              const isActive = index === activeStep;
              return (
                <div key={flow.id} className="relative flex items-start gap-4">
                  {/* Node */}
                  <div className={cn(
                    "absolute -left-[23px] w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-500 z-10 text-xs font-bold",
                    isCompleted 
                      ? "bg-success border-success text-white" 
                      : isActive 
                        ? "bg-background border-primary text-primary shadow-[0_0_12px_rgba(99,102,241,0.3)] scale-110" 
                        : "bg-background border-border text-foreground/30 scale-90"
                  )}>
                    {isCompleted ? (
                      <Check className="w-3 h-3 stroke-[3]" />
                    ) : (
                      <span className={cn("w-1.5 h-1.5 rounded-full", isActive ? "bg-primary animate-pulse" : "bg-foreground/20")} />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className={cn(
                      "text-xs md:text-sm font-bold transition-colors duration-300",
                      isActive ? "text-primary" : isCompleted ? "text-foreground/80" : "text-foreground/40"
                    )}>
                      {flow.label}
                    </p>
                    <p className="text-[11px] text-foreground/40 mt-0.5 leading-relaxed">{flow.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-border/50 pt-4 mt-6 flex items-center gap-2.5">
          <Loader2 className="w-4 h-4 text-primary animate-spin" />
          <span className="text-xs font-bold text-foreground/50">
            Running: {workflows[activeStep]?.label || "Finalizing report..."}
          </span>
        </div>
      </div>

      {/* Right panel: Console + Inner Monologue */}
      <div className="md:col-span-7 flex flex-col gap-6">
        
        {/* Monologue */}
        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm relative min-h-[130px] flex flex-col backdrop-blur-md">
          <div className="flex items-center gap-2 mb-3.5 border-b border-border/40 pb-2">
            <Brain className="w-4 h-4 text-primary" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/50">
              Agent Thought Process
            </h4>
          </div>
          <div className="flex-1 flex items-start">
            <p className="text-xs md:text-sm font-medium text-foreground/75 italic leading-relaxed font-sans">
              {monologue}
              <span className="w-1.5 h-3.5 ml-1 bg-primary inline-block animate-pulse align-middle" />
            </p>
          </div>
        </div>

        {/* Live Terminal Console */}
        <div className="bg-[#030306] border border-border/80 rounded-2xl p-5 shadow-inner flex flex-col h-[230px] font-mono relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-3 text-[10px] text-foreground/30">
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-primary" />
              <span className="font-bold">CONSOLE - ANTIGRAVITY ENGINE</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="font-bold">LIVE TELEMETRY</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-1.5 text-xs pr-1 scrollbar-thin">
            {logs.map((log, idx) => (
              <div key={idx} className={cn(
                "whitespace-pre-wrap break-all leading-relaxed",
                log.includes('[SYSTEM]') 
                  ? 'text-primary font-bold' 
                  : log.includes('[CLONE]') 
                    ? 'text-cyan-400' 
                    : log.includes('[AST]') 
                      ? 'text-amber-400 font-semibold' 
                      : log.includes('[AI]') 
                        ? 'text-purple-400' 
                        : log.includes('[METRICS]')
                          ? 'text-emerald-400 font-medium'
                          : 'text-foreground/70'
              )}>
                {log}
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>
        </div>

      </div>

    </div>
  );
}
