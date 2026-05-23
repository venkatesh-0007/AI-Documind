'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Sun, Moon, Laptop, Trash2, Key, 
  History, User, Eye, EyeOff, FolderGit2, CheckCircle2 
} from 'lucide-react';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface HistoryItem {
  id: string;
  owner: string;
  repo: string;
  url: string;
  healthScore: number;
  timestamp: string;
  userName?: string;
}

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  setUserName: (name: string) => void;
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  defaultRepo: string;
  setDefaultRepo: (repo: string) => void;
  openaiKey: string;
  setOpenaiKey: (key: string) => void;
  githubToken: string;
  setGithubToken: (token: string) => void;
  provider: 'openai' | 'gemini';
  setProvider: (val: 'openai' | 'gemini') => void;
  geminiKey: string;
  setGeminiKey: (key: string) => void;
  history: HistoryItem[];
  onClearHistory: () => void;
  onDeleteHistoryItem: (id: string) => void;
  onSelectHistoryItem: (url: string) => void;
  onResetAll: () => void;
}

export default function SettingsDrawer({
  isOpen,
  onClose,
  userName,
  setUserName,
  theme,
  setTheme,
  defaultRepo,
  setDefaultRepo,
  openaiKey,
  setOpenaiKey,
  githubToken,
  setGithubToken,
  provider,
  setProvider,
  geminiKey,
  setGeminiKey,
  history,
  onClearHistory,
  onDeleteHistoryItem,
  onSelectHistoryItem,
  onResetAll
}: SettingsDrawerProps) {
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showGithubToken, setShowGithubToken] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md"
          />

          {/* Drawer container */}
          <motion.div
            initial={{ x: '110%' }}
            animate={{ x: 0 }}
            exit={{ x: '110%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            className="fixed top-4 right-4 bottom-4 z-50 w-[calc(100%-32px)] bg-background/90 border border-border backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl flex flex-col overflow-hidden"
            style={{ maxWidth: '440px' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">Settings & Setup</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-foreground/10 rounded-lg text-foreground/50 hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Profile Config */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground/60 uppercase tracking-wider">User Profile</h3>
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1.5">Your Name</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2.5 bg-card hover:bg-card-hover border border-border rounded-xl text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              {/* Theme Settings */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground/60 uppercase tracking-wider">Appearance</h3>
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-2">Color Mode</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'light', label: 'Light', icon: Sun },
                      { value: 'dark', label: 'Dark', icon: Moon },
                      { value: 'system', label: 'System', icon: Laptop }
                    ].map((item) => {
                      const Icon = item.icon;
                      const active = theme === item.value;
                      return (
                        <button
                          key={item.value}
                          onClick={() => setTheme(item.value as any)}
                          className={`flex flex-col items-center justify-center py-3 border rounded-xl transition-all ${
                            active 
                              ? 'bg-primary/10 border-primary text-primary shadow-[0_0_10px_rgba(99,102,241,0.15)] font-medium' 
                              : 'bg-card border-border text-foreground/60 hover:text-foreground hover:bg-card-hover'
                          }`}
                        >
                          <Icon className="w-5 h-5 mb-1" />
                          <span className="text-xs">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Default Repository Setting */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground/60 uppercase tracking-wider">Repository Settings</h3>
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-1.5">Default Analysis Repository</label>
                  <input
                    type="text"
                    value={defaultRepo}
                    onChange={(e) => setDefaultRepo(e.target.value)}
                    placeholder="https://github.com/username/repo"
                    className="w-full px-4 py-2.5 bg-card hover:bg-card-hover border border-border rounded-xl text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 transition-colors text-sm"
                  />
                </div>
              </div>

              {/* Custom Keys overrides */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground/60 uppercase tracking-wider">Client API Overrides</h3>
                  <span className="text-[10px] bg-primary/15 text-primary px-2 py-0.5 rounded-full font-medium">Local Only</span>
                </div>
                
                {/* Provider Selector */}
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-2">API Provider</label>
                  <div className="grid grid-cols-2 gap-2 bg-card p-1 border border-border rounded-xl">
                    <button
                      type="button"
                      onClick={() => setProvider('openai')}
                      className={`py-2 rounded-lg text-sm font-medium transition-all ${
                        provider === 'openai' 
                          ? 'bg-primary text-white shadow-sm' 
                          : 'text-foreground/50 hover:text-foreground'
                      }`}
                    >
                      OpenAI
                    </button>
                    <button
                      type="button"
                      onClick={() => setProvider('gemini')}
                      className={`py-2 rounded-lg text-sm font-medium transition-all ${
                        provider === 'gemini' 
                          ? 'bg-primary text-white shadow-sm' 
                          : 'text-foreground/50 hover:text-foreground'
                      }`}
                    >
                      Gemini
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* OpenAI key conditional input */}
                  {provider === 'openai' ? (
                    <div>
                      <label className="flex items-center gap-1.5 text-sm font-medium text-foreground/70 mb-1.5">
                        <Key className="w-3.5 h-3.5" />
                        OpenAI API Key
                      </label>
                      <div className="relative">
                        <input
                          type={showOpenaiKey ? 'text' : 'password'}
                          value={openaiKey}
                          onChange={(e) => setOpenaiKey(e.target.value)}
                          placeholder="sk-proj-..."
                          className="w-full pl-4 pr-10 py-2.5 bg-card hover:bg-card-hover border border-border rounded-xl text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 transition-colors text-sm font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
                        >
                          {showOpenaiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Gemini key conditional input */
                    <div>
                      <label className="flex items-center gap-1.5 text-sm font-medium text-foreground/70 mb-1.5">
                        <Key className="w-3.5 h-3.5" />
                        Gemini API Key
                      </label>
                      <div className="relative">
                        <input
                          type={showGeminiKey ? 'text' : 'password'}
                          value={geminiKey}
                          onChange={(e) => setGeminiKey(e.target.value)}
                          placeholder="AIzaSy..."
                          className="w-full pl-4 pr-10 py-2.5 bg-card hover:bg-card-hover border border-border rounded-xl text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 transition-colors text-sm font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowGeminiKey(!showGeminiKey)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
                        >
                          {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* GitHub key */}
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-medium text-foreground/70 mb-1.5">
                      <GithubIcon className="w-3.5 h-3.5" />
                      GitHub Access Token
                    </label>
                    <div className="relative">
                      <input
                        type={showGithubToken ? 'text' : 'password'}
                        value={githubToken}
                        onChange={(e) => setGithubToken(e.target.value)}
                        placeholder="ghp_..."
                        className="w-full pl-4 pr-10 py-2.5 bg-card hover:bg-card-hover border border-border rounded-xl text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 transition-colors text-sm font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowGithubToken(!showGithubToken)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
                      >
                        {showGithubToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analysis History */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground/60 uppercase tracking-wider flex items-center gap-1.5">
                    <History className="w-4 h-4" />
                    Recent History
                  </h3>
                  {history.length > 0 && (
                    <button
                      onClick={onClearHistory}
                      className="text-xs text-danger hover:underline font-medium"
                    >
                      Clear History
                    </button>
                  )}
                </div>

                {history.length === 0 ? (
                  <div className="text-center py-6 bg-card border border-border rounded-xl text-foreground/40 text-sm">
                    No repositories analyzed yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-card border border-border rounded-xl hover:border-foreground/20 transition-all flex items-start justify-between gap-3 text-sm"
                      >
                        <div 
                          className="flex-1 min-w-0 cursor-pointer"
                          onClick={() => onSelectHistoryItem(item.url)}
                          title="Click to analyze"
                        >
                          <div className="flex items-center gap-1.5 font-semibold text-foreground truncate">
                            <FolderGit2 className="w-4 h-4 text-primary shrink-0" />
                            {item.owner}/{item.repo}
                          </div>
                          <div className="text-xs text-foreground/50 truncate mt-0.5">{item.url}</div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] text-foreground/40">
                              {new Date(item.timestamp).toLocaleDateString(undefined, { 
                                month: 'short', 
                                day: 'numeric', 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                            {item.userName && (
                              <span className="text-[10px] bg-foreground/5 text-foreground/60 px-1.5 py-0.5 rounded">
                                by {item.userName}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-end justify-between self-stretch">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.healthScore >= 80 
                              ? 'bg-success/10 text-success' 
                              : item.healthScore >= 50 
                                ? 'bg-warning/10 text-warning' 
                                : 'bg-danger/10 text-danger'
                          }`}>
                            Score: {item.healthScore}
                          </span>
                          <button
                            onClick={() => onDeleteHistoryItem(item.id)}
                            className="p-1 hover:bg-danger/10 rounded text-foreground/30 hover:text-danger transition-colors mt-auto"
                            title="Remove from history"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border bg-card/40 flex items-center justify-between">
              <button
                onClick={onResetAll}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-danger/10 hover:bg-danger/25 border border-danger/20 rounded-xl text-danger text-sm font-semibold transition-all hover:shadow-[0_0_15px_rgba(239,68,68,0.1)]"
              >
                <Trash2 className="w-4 h-4" />
                Reset App Cache & Settings
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
