'use client';

import React, { useState, useEffect, useRef } from 'react';
/* eslint-disable react-hooks/set-state-in-effect */
import { Terminal, Brain, Activity, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScanningAnimationProps {
  url?: string;
}

const workflows = [
  { id: 'fetch', label: 'Repository Clone', desc: 'Cloning tree & metadata' },
  { id: 'ast', label: 'Structure Mapping', desc: 'Parsing paths & imports' },
  { id: 'ai', label: 'Documentation Engine', desc: 'Generating summaries' },
  { id: 'score', label: 'Health Evaluation', desc: 'Calculating metrics' }
];

const thoughts = [
  "Monologue: Initiating connection to GitHub repository to clone default branch tree. I need to index all blob locations.",
  "Monologue: Repository cloned. Commencing static analysis. Mapping directories to identify core routes, utility files, and configuration files.",
  "Monologue: Folder structures cataloged. I will now invoke my documentation generation models to draft README files, architecture maps, and setup recipes.",
  "Monologue: Document draft complete. Initiating code scans to check for docstrings, missing files, and undocumented routes to compute the overall health index."
];

export default function ScanningAnimation({ url = '' }: ScanningAnimationProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [monologue, setMonologue] = useState('');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Extract repo details for authentic logs
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

  // Stepper timer
  useEffect(() => {
    const timers = [
      setTimeout(() => setActiveStep(1), 2200),
      setTimeout(() => setActiveStep(2), 4800),
      setTimeout(() => setActiveStep(3), 7400)
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Inner thoughts typewriter effect
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

  // Monospace CLI logs simulator
  useEffect(() => {
    const timestamp = () => new Date().toLocaleTimeString();
    
    const generateInitialLogs = () => {
      return [
        `[${timestamp()}] [SYSTEM] Agent Antigravity initialized.`,
        `[${timestamp()}] [INFO] Target url received: ${url || 'https://github.com/owner/repo'}`,
        `[${timestamp()}] [CLONE] Fetching recursive Git Tree for '${repoOwner}/${repoName}'...`,
      ];
    };

    setLogs(generateInitialLogs());

    const logSequence = [
      // Step 1 logs
      {
        delay: 1000,
        text: `[${timestamp()}] [CLONE] Found default branch: main.`
      },
      {
        delay: 1500,
        text: `[${timestamp()}] [CLONE] Fetch successful. Indexing 152 objects.`
      },
      {
        delay: 2200,
        text: `[${timestamp()}] [SYSTEM] Step 1 complete. Starting Structure Analysis.`
      },
      // Step 2 logs
      {
        delay: 2800,
        text: `[${timestamp()}] [AST] Scanning directories for package setups...`
      },
      {
        delay: 3400,
        text: `[${timestamp()}] [AST] Discovered configurations: package.json, tsconfig.json, globals.css.`
      },
      {
        delay: 4000,
        text: `[${timestamp()}] [AST] Detecting endpoints in 'src/app/api/'... found 2 files.`
      },
      {
        delay: 4800,
        text: `[${timestamp()}] [SYSTEM] Step 2 complete. Activating AI Documentation Engine.`
      },
      // Step 3 logs
      {
        delay: 5600,
        text: `[${timestamp()}] [AI] Initializing completions request with model: gemini-3.5-flash.`
      },
      {
        delay: 6200,
        text: `[${timestamp()}] [AI] Analyzing folder tree to draft technical summaries...`
      },
      {
        delay: 6800,
        text: `[${timestamp()}] [AI] Formulating setup recipes, architectural diagrams, and project summaries...`
      },
      {
        delay: 7400,
        text: `[${timestamp()}] [SYSTEM] Step 3 complete. Activating Health Metrics.`
      },
      // Step 4 logs
      {
        delay: 8200,
        text: `[${timestamp()}] [METRICS] Evaluating files for documentation missing markers...`
      },
      {
        delay: 8900,
        text: `[${timestamp()}] [METRICS] Processing health score: evaluating onboarding path clarity.`
      },
      {
        delay: 9500,
        text: `[${timestamp()}] [SYSTEM] All tasks complete. Transferring payload report to dashboard.`
      }
    ];

    const timers = logSequence.map(item => 
      setTimeout(() => {
        setLogs(prev => [...prev, item.text]);
      }, item.delay)
    );

    return () => timers.forEach(clearTimeout);
  }, [url, repoOwner, repoName]);

  // Auto-scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-12 gap-6 p-1 bg-transparent rounded-3xl relative overflow-hidden">
      
      {/* LEFT COLUMN: Stepper Workflow Visualization (5 cols) */}
      <div className="md:col-span-5 bg-card border border-border/80 rounded-2xl p-6 flex flex-col justify-between shadow-lg relative min-h-[350px]">
        {/* Laser scanner grid line overlay */}
        <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-primary/5 via-primary/8 to-transparent h-1/3 animate-scan pointer-events-none border-b border-primary/20" />
        
        <div>
          <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-3">
            <Activity className="w-4 h-4 text-primary animate-pulse" />
            <h4 className="text-xs font-black uppercase tracking-widest text-foreground/60">Autonomous Workflow</h4>
          </div>
          
          <div className="relative pl-6 space-y-6">
            {/* Connecting Timeline Line */}
            <div className="absolute top-2.5 left-2.5 bottom-8 w-0.5 bg-border/60" />
            
            {workflows.map((flow, index) => {
              const isCompleted = index < activeStep;
              const isActive = index === activeStep;
              return (
                <div key={flow.id} className="relative flex items-start gap-4">
                  {/* Circular Node */}
                  <div className={cn(
                    "absolute -left-[23px] w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-500 z-10",
                    isCompleted 
                      ? "bg-success border-success text-white scale-100" 
                      : isActive 
                        ? "bg-background border-primary text-primary scale-110 shadow-[0_0_12px_rgba(99,102,241,0.4)] animate-pulse" 
                        : "bg-background border-border text-foreground/30 scale-90"
                  )}>
                    {isCompleted ? (
                      <Check className="w-3 h-3 stroke-[3]" />
                    ) : (
                      <div className={cn("w-1.5 h-1.5 rounded-full", isActive ? "bg-primary animate-ping" : "bg-foreground/20")} />
                    )}
                  </div>

                  {/* Text details */}
                  <div className="min-w-0">
                    <p className={cn(
                      "text-sm font-semibold transition-colors duration-300",
                      isActive ? "text-primary" : isCompleted ? "text-foreground/80" : "text-foreground/45"
                    )}>
                      {flow.label}
                    </p>
                    <p className="text-xs text-foreground/40 mt-0.5">{flow.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer loader summary */}
        <div className="border-t border-border/50 pt-4 mt-6 flex items-center gap-3">
          <Loader2 className="w-4 h-4 text-primary animate-spin" />
          <span className="text-xs font-medium text-foreground/50">
            Agent executing: {workflows[activeStep]?.label || "Finalizing"}
          </span>
        </div>
      </div>

      {/* RIGHT COLUMN: Inner Thoughts and Terminal Console (7 cols) */}
      <div className="md:col-span-7 flex flex-col gap-6">
        
        {/* Thinking inner monologue */}
        <div className="bg-card border border-border/85 rounded-2xl p-6 shadow-md relative min-h-[140px] flex flex-col">
          <div className="flex items-center gap-2 mb-3 border-b border-border/50 pb-2">
            <Brain className="w-4 h-4 text-primary" />
            <h4 className="text-xs font-black uppercase tracking-widest text-foreground/60">Agent Inner Monologue</h4>
          </div>
          <div className="flex-1 flex items-start">
            <p className="text-sm font-medium text-foreground/80 italic leading-relaxed font-sans">
              {monologue}
              <span className="w-1.5 h-3.5 ml-1 bg-primary inline-block animate-pulse align-middle" />
            </p>
          </div>
        </div>

        {/* Terminal Live Output */}
        <div className="bg-slate-950 border border-border/80 rounded-2xl p-4 shadow-inner flex flex-col h-[220px] font-mono relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3 text-[10px] text-foreground/30">
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              <span>TERMINAL FEED - ANTIGRAVITY v1.0</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span>LIVE FEED</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-2 text-xs leading-relaxed pr-2">
            {logs.map((log, idx) => (
              <div key={idx} className={cn(
                "whitespace-pre-wrap break-all",
                log.includes('[SYSTEM]') 
                  ? 'text-primary font-bold' 
                  : log.includes('[CLONE]') 
                    ? 'text-cyan-400' 
                    : log.includes('[AST]') 
                      ? 'text-amber-400' 
                      : log.includes('[AI]') 
                        ? 'text-purple-400' 
                        : log.includes('[METRICS]')
                          ? 'text-emerald-400 font-medium'
                          : 'text-foreground/75'
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
