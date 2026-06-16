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
    <div className="min-h-screen flex flex-col relative bg-background text-foreground transition-colors duration-300 overflow-x-hidden">
      
      {/* Top Navigation / Header area */}
      <div className="w-full border-b border-border bg-header-bg">
        <div className="max-w-7xl mx-auto">
          <Header
            onOpenSettings={() => setIsSettingsOpen(true)}
            userName={userName}
            githubUser={githubUser}
            isAuthLoading={isAuthLoading}
            onLogin={handleLogin}
            onLogout={handleLogout}
          />
        </div>
      </div>
      
      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-6">
        
        {/* Hero / Input Section */}
        <div className="mb-4">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2 text-foreground">
              Agentic Analysis
            </h1>
            <p className="text-base text-foreground/70">
              Autonomously scan, analyze, and document any codebase with AI.
            </p>
          </div>
          
          <UrlInput key={searchUrl} onAnalyze={handleAnalyze} isScanning={appState === 'scanning'} initialUrl={searchUrl} />
        </div>

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
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="flex-1 flex flex-col items-center justify-center min-h-[40vh] py-12"
             >
               <div className="text-center opacity-60 max-w-md border border-border bg-card rounded-lg p-8 shadow-sm">
                 <svg className="w-12 h-12 text-foreground/50 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                 </svg>
                 <h2 className="text-xl font-semibold mb-2">Awaiting Target</h2>
                 <p className="text-sm text-foreground/80">Enter a valid GitHub URL above to initiate the agentic analysis sequence.</p>
               </div>
             </motion.div>
          )}

          {appState === 'scanning' && (
             <motion.div 
               key="scanning"
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
               exit={{ opacity: 0, height: 0 }}
               className="w-full flex-1 min-h-[300px]"
             >
               <ScanningAnimation url={searchUrl} />
             </motion.div>
          )}

          {appState === 'results' && analysisData && (
             <motion.div
               key="results-feed"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-6 pb-20"
             >
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-card border border-border p-4 rounded-lg shadow-sm">
                 <div>
                   <div className="flex items-center gap-2 mb-1">
                     <div className="w-2.5 h-2.5 rounded-full bg-success" />
                     <span className="font-semibold text-success text-sm">Analysis Complete</span>
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
                   className="mt-4 md:mt-0 px-4 py-2 bg-background border border-border hover:bg-card-hover rounded-md text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
                 >
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                   </svg>
                   Analyze Another
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-danger/10 border border-danger/30 rounded-lg p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold text-danger mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Analysis Failed
              </h3>
              <p className="text-foreground/80 text-sm mb-5 leading-relaxed">{errorMsg}</p>
              <button
                onClick={() => setAppState('initial')}
                className="px-4 py-2 bg-background border border-danger/30 hover:bg-danger/10 rounded-md text-sm font-medium transition-colors"
              >
                Try Again
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
