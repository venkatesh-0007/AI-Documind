'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import UrlInput from '@/components/dashboard/UrlInput';
import ScanningAnimation from '@/components/dashboard/ScanningAnimation';
import OverviewCards from '@/components/dashboard/OverviewCards';
import HealthScore from '@/components/dashboard/HealthScore';
import WarningsPanel from '@/components/dashboard/WarningsPanel';
import SuggestionsPanel from '@/components/dashboard/SuggestionsPanel';
import DocPreview from '@/components/dashboard/DocPreview';
import SettingsDrawer from '@/components/dashboard/SettingsDrawer';
import RepositoryPicker from '@/components/dashboard/RepositoryPicker';
import { AnalyzeResponse, AuthSession, GitHubRepository, GitHubUser } from '@/types/analyze';
import { Terminal, RefreshCcw, Sparkles, CheckCircle2 } from 'lucide-react';

type AppState = 'initial' | 'scanning' | 'results' | 'error';

interface HistoryItem {
  id: string;
  owner: string;
  repo: string;
  url: string;
  healthScore: number;
  timestamp: string;
  userName?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ai-documind.onrender.com';

const getStoredTheme = (): 'light' | 'dark' | 'system' => {
  if (typeof window === 'undefined') return 'dark';
  const theme = localStorage.getItem('documind-theme');
  return theme === 'light' || theme === 'system' ? theme : 'dark';
};

const getStoredProvider = (): 'openai' | 'gemini' => {
  if (typeof window === 'undefined') return 'openai';
  return localStorage.getItem('documind-api-provider') === 'gemini' ? 'gemini' : 'openai';
};

const getStoredValue = (key: string) => {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(key) || '';
};

const getStoredHistory = (): HistoryItem[] => {
  if (typeof window === 'undefined') return [];
  const storedHistory = localStorage.getItem('documind-history');
  if (!storedHistory) return [];

  try {
    return JSON.parse(storedHistory) as HistoryItem[];
  } catch {
    return [];
  }
};

const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
};

const createRequestTimeout = (timeoutMs = 8000) => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
  return { controller, timeoutId };
};

export default function Home() {
  const [appState, setAppState] = useState<AppState>('initial');
  const [analysisData, setAnalysisData] = useState<AnalyzeResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [githubUser, setGithubUser] = useState<GitHubUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [isReposLoading, setIsReposLoading] = useState(false);
  const [reposError, setReposError] = useState('');
  
  // Settings States
  const [userName, setUserName] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');
  const [defaultRepo, setDefaultRepo] = useState('');
  const [provider, setProvider] = useState<'openai' | 'gemini'>('openai');
  const [openaiKey, setOpenaiKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchUrl, setSearchUrl] = useState('');

  // Load settings from localStorage on client-side mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setUserName(getStoredValue('documind-user-name'));
      setTheme(getStoredTheme());
      setDefaultRepo(getStoredValue('documind-default-repo'));
      setProvider(getStoredProvider());
      setOpenaiKey(getStoredValue('documind-openai-api-key'));
      setGeminiKey(getStoredValue('documind-gemini-api-key'));
      setHistory(getStoredHistory());
      setSearchUrl(getStoredValue('documind-default-repo'));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const loadRepositories = React.useCallback(async () => {
    setIsReposLoading(true);
    setReposError('');
    const { controller, timeoutId } = createRequestTimeout();
    try {
      const response = await fetch(`${API_URL}/api/v1/auth/github/repos`, {
        credentials: 'include',
        signal: controller.signal,
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || 'Unable to load repositories from GitHub.');
      }
      const data: GitHubRepository[] = await response.json();
      setRepositories(data);
    } catch (err: unknown) {
      setReposError(getErrorMessage(err, 'Unable to load repositories from GitHub.'));
    } finally {
      window.clearTimeout(timeoutId);
      setIsReposLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadSession = async () => {
      setIsAuthLoading(true);
      const { controller, timeoutId } = createRequestTimeout(5000);
      try {
        const response = await fetch(`${API_URL}/api/v1/auth/session`, {
          credentials: 'include',
          signal: controller.signal,
        });
        const data: AuthSession = await response.json();
        const user = data.authenticated ? data.user || null : null;
        setGithubUser(user);
        if (user) {
          await loadRepositories();
        }
      } catch {
        setGithubUser(null);
      } finally {
        window.clearTimeout(timeoutId);
        setIsAuthLoading(false);
      }
    };

    loadSession();
  }, [loadRepositories]);

  // Sync theme changes to Document root element
  useEffect(() => {
    const applyTheme = (t: 'light' | 'dark' | 'system') => {
      const root = window.document.documentElement;
      if (t === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        if (systemTheme === 'dark') {
          root.classList.remove('light');
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
          root.classList.add('light');
        }
      } else if (t === 'dark') {
        root.classList.remove('light');
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
      }
    };

    applyTheme(theme);
    
    if (theme === 'system') {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme('system');
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
  }, [theme]);

  // Setter helper wrappers that auto-update localStorage
  const handleSetUserName = (val: string) => {
    setUserName(val);
    localStorage.setItem('documind-user-name', val);
  };

  const handleSetTheme = (val: 'light' | 'dark' | 'system') => {
    setTheme(val);
    localStorage.setItem('documind-theme', val);
  };

  const handleSetDefaultRepo = (val: string) => {
    setDefaultRepo(val);
    localStorage.setItem('documind-default-repo', val);
  };

  const handleSetOpenaiKey = (val: string) => {
    setOpenaiKey(val);
    localStorage.setItem('documind-openai-api-key', val);
  };

  const handleSetProvider = (val: 'openai' | 'gemini') => {
    setProvider(val);
    localStorage.setItem('documind-api-provider', val);
  };

  const handleSetGeminiKey = (val: string) => {
    setGeminiKey(val);
    localStorage.setItem('documind-gemini-api-key', val);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('documind-history');
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('documind-history', JSON.stringify(updated));
  };

  const handleSelectHistoryItem = (url: string) => {
    setSearchUrl(url);
    setIsSettingsOpen(false);
    handleAnalyze(url);
  };

  const handleResetAll = () => {
    localStorage.clear();
    setUserName('');
    setTheme('dark');
    setDefaultRepo('');
    setProvider('openai');
    setOpenaiKey('');
    setGeminiKey('');
    setHistory([]);
    setSearchUrl('');
    setIsSettingsOpen(false);
    setAppState('initial');
    setAnalysisData(null);
  };

  const handleLogin = () => {
    window.location.href = `${API_URL}/api/v1/auth/github/login`;
  };

  const handleLogout = async () => {
    setIsAuthLoading(true);
    try {
      await fetch(`${API_URL}/api/v1/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      setGithubUser(null);
      setRepositories([]);
      setIsAuthLoading(false);
    }
  };

  const handleAnalyze = async (url: string) => {
    setAppState('scanning');
    setErrorMsg('');
    setSearchUrl(url);
    
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      const currentProvider = localStorage.getItem('documind-api-provider') || 'openai';
      const currentOpenaiKey = localStorage.getItem('documind-openai-api-key') || '';
      const currentGeminiKey = localStorage.getItem('documind-gemini-api-key') || '';
      
      headers['X-Provider'] = currentProvider;
      
      if (currentOpenaiKey && currentProvider === 'openai') {
        headers['X-OpenAI-Key'] = currentOpenaiKey;
      }
      if (currentGeminiKey && currentProvider === 'gemini') {
        headers['X-Gemini-Key'] = currentGeminiKey;
      }
      const response = await fetch(`${API_URL}/api/v1/analyze`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ repository_url: url }),
      });

      if (!response.ok) {
        let errorDetail = `API error: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData.detail) errorDetail = errorData.detail;
          else if (errorData.message) errorDetail = errorData.message;
        } catch {
          // If response isn't JSON, we fall back to the default status text
        }
        throw new Error(errorDetail);
      }

      const data: AnalyzeResponse = await response.json();
      setAnalysisData(data);
      setAppState('results');
      
      // Append to history log
      const newHistoryItem: HistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        owner: data.owner,
        repo: data.repo,
        url: url,
        healthScore: data.summary.health_score,
        timestamp: new Date().toISOString(),
        userName: localStorage.getItem('documind-user-name') || undefined
      };
      
      const currentHistory = getStoredHistory();
      const filteredHistory = currentHistory.filter((item) => item.url !== url);
      const updatedHistory = [newHistoryItem, ...filteredHistory].slice(0, 10);
      
      setHistory(updatedHistory);
      localStorage.setItem('documind-history', JSON.stringify(updatedHistory));
      
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(getErrorMessage(err, 'An error occurred during analysis.'));
      setAppState('error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-background text-foreground transition-colors duration-300 overflow-x-hidden select-none">
      
      {/* Decorative Premium Mesh Glowing Background elements */}
      <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-primary/5 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-[20%] left-[10%] w-[350px] h-[350px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-success/5 rounded-full blur-[130px] pointer-events-none z-0" />

      {/* Top Navbar Header */}
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        userName={userName}
        githubUser={githubUser}
        isAuthLoading={isAuthLoading}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
      
      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-6 z-10 relative">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-3"
        >
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2.5 font-sans flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-primary" />
              Agentic Analysis Engine
            </h1>
            <p className="text-sm md:text-base text-foreground/50 leading-relaxed font-sans max-w-xl">
              Autonomously scan, map structure, and generate high-fidelity technical documentation from any GitHub codebase.
            </p>
          </div>
          
          <UrlInput key={searchUrl} onAnalyze={handleAnalyze} isScanning={appState === 'scanning'} initialUrl={searchUrl} />
        </motion.div>

        {githubUser && (
          <RepositoryPicker
            repositories={repositories}
            isLoading={isReposLoading}
            error={reposError}
            onRefresh={loadRepositories}
            onSelect={handleAnalyze}
          />
        )}

        <AnimatePresence mode="wait">
          {appState === 'initial' && (
             <motion.div 
               key="empty"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               transition={{ duration: 0.3 }}
               className="flex-1 flex flex-col items-center justify-center min-h-[35vh] py-12"
             >
               <div className="text-center opacity-70 max-w-sm border border-border bg-card/45 backdrop-blur-md rounded-2xl p-8 shadow-sm flex flex-col items-center">
                 <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 mb-4 text-primary">
                   <Terminal className="w-6 h-6" />
                 </div>
                 <h2 className="text-sm font-bold uppercase tracking-wider mb-2 text-foreground/80">Awaiting Target</h2>
                 <p className="text-xs text-foreground/45 leading-relaxed">Enter a public or authenticated GitHub URL above to trigger the autonomous workspace scanning sequence.</p>
               </div>
             </motion.div>
          )}

          {appState === 'scanning' && (
             <motion.div 
               key="scanning"
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.98 }}
               transition={{ duration: 0.3 }}
               className="w-full flex-1 min-h-[300px]"
             >
               <ScanningAnimation url={searchUrl} />
             </motion.div>
          )}

          {appState === 'results' && analysisData && (
             <motion.div
               key="results-feed"
               initial={{ opacity: 0, y: 15 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -15 }}
               transition={{ duration: 0.4 }}
               className="space-y-6 pb-20"
             >
               {/* Analysis complete card banner */}
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-card/50 border border-border p-5 rounded-2xl shadow-sm backdrop-blur-md gap-4">
                 <div>
                   <div className="flex items-center gap-2 mb-1.5">
                     <CheckCircle2 className="w-4 h-4 text-success" />
                     <span className="font-extrabold text-success text-xs uppercase tracking-wider">Analysis Complete</span>
                   </div>
                   <p className="text-foreground/80 font-mono text-sm">
                     {analysisData.owner}/{analysisData.repo}
                   </p>
                 </div>
                 <button
                   onClick={() => {
                     setSearchUrl(defaultRepo || searchUrl);
                     setAppState('initial');
                   }}
                   className="w-full md:w-auto px-4 py-2.5 bg-background border border-border hover:bg-card-hover rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 active:scale-[0.97]"
                 >
                   <RefreshCcw className="w-3.5 h-3.5 text-foreground/60" />
                   Scan Another Target
                 </button>
               </div>

               <OverviewCards data={analysisData} />

               <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                 <div className="xl:col-span-1">
                   <HealthScore score={analysisData.summary.health_score} metrics={analysisData.summary.metrics} />
                 </div>
                 <div className="xl:col-span-1">
                   <WarningsPanel warnings={analysisData.warnings} />
                 </div>
                 <div className="xl:col-span-1">
                   <SuggestionsPanel suggestions={analysisData.suggestions} />
                 </div>
               </div>

               <DocPreview content={analysisData.generated_docs} />
             </motion.div>
            )}

           {appState === 'error' && (
             <motion.div
               initial={{ opacity: 0, y: 15 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0 }}
               className="mt-4 bg-danger/5 border border-danger/15 rounded-2xl p-6 shadow-sm backdrop-blur-sm max-w-xl mx-auto"
             >
               <h3 className="text-base font-bold text-danger mb-2.5 flex items-center gap-2">
                 <span className="w-2.5 h-2.5 rounded-full bg-danger animate-pulse" />
                 Telemetry Scan Interrupted
               </h3>
               <p className="text-foreground/70 text-xs md:text-sm leading-relaxed mb-5 font-mono bg-black/25 p-3 rounded-lg border border-border">
                 {errorMsg}
               </p>
               <button
                 onClick={() => setAppState('initial')}
                 className="w-full sm:w-auto px-4 py-2.5 bg-danger/10 hover:bg-danger/15 border border-danger/20 text-danger rounded-xl text-xs font-bold transition-all active:scale-[0.97]"
               >
                 Acknowledge & Try Again
               </button>
             </motion.div>
           )}
        </AnimatePresence>
      </main>

      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userName={userName}
        setUserName={handleSetUserName}
        theme={theme}
        setTheme={handleSetTheme}
        defaultRepo={defaultRepo}
        setDefaultRepo={handleSetDefaultRepo}
        openaiKey={openaiKey}
        setOpenaiKey={handleSetOpenaiKey}
        provider={provider}
        setProvider={handleSetProvider}
        geminiKey={geminiKey}
        setGeminiKey={handleSetGeminiKey}
        history={history}
        onClearHistory={handleClearHistory}
        onDeleteHistoryItem={handleDeleteHistoryItem}
        onSelectHistoryItem={handleSelectHistoryItem}
        onResetAll={handleResetAll}
      />
    </div>
  );
}
