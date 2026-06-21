'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Sun, Moon, Laptop, Trash2, Key, 
  History, User, Eye, EyeOff, FolderGit2
} from 'lucide-react';

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
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 140 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full md:w-[420px] bg-background/95 border-l border-border backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border/80 bg-card/40">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">Settings & Scope</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-foreground/5 border border-transparent hover:border-border rounded-xl text-foreground/50 hover:text-foreground transition-all duration-200"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-7 scrollbar-thin">
              {/* Profile Config */}
              <div className="space-y-3.5">
                <h3 className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">User Profile</h3>
                <div>
                  <label className="block text-xs font-bold text-foreground/60 mb-2">Display Name</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="E.g., Venkatesh"
                    className="w-full px-4 py-3 bg-card/60 hover:bg-card-hover border border-border/85 rounded-xl text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all font-sans text-sm"
                  />
                </div>
              </div>

              {/* Theme Settings */}
              <div className="space-y-3.5">
                <h3 className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Appearance</h3>
                <div>
                  <label className="block text-xs font-bold text-foreground/60 mb-2.5">UI Color Scheme</label>
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
                          onClick={() => setTheme(item.value as 'light' | 'dark' | 'system')}
                          className={`flex flex-col items-center justify-center py-2.5 border rounded-xl transition-all duration-200 ${
                            active 
                              ? 'bg-primary/10 border-primary text-primary font-bold shadow-[0_0_15px_rgba(99,102,241,0.1)]' 
                              : 'bg-card/40 border-border text-foreground/50 hover:text-foreground hover:bg-card-hover'
                          }`}
                        >
                          <Icon className="w-4 h-4 mb-1" />
                          <span className="text-[10px] tracking-wide">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Default Repository Setting */}
              <div className="space-y-3.5">
                <h3 className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Repository Config</h3>
                <div>
                  <label className="block text-xs font-bold text-foreground/60 mb-2">Default Target Repository</label>
                  <input
                    type="text"
                    value={defaultRepo}
                    onChange={(e) => setDefaultRepo(e.target.value)}
                    placeholder="https://github.com/username/repo"
                    className="w-full px-4 py-3 bg-card/60 hover:bg-card-hover border border-border/85 rounded-xl text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all font-mono text-xs"
                  />
                </div>
              </div>

              {/* Custom Keys overrides */}
              <div className="space-y-3.5 border-t border-border/60 pt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">API Endpoint Keys</h3>
                  <span className="text-[8px] font-black bg-primary/10 border border-primary/25 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider">Local Sandboxed</span>
                </div>
                
                {/* Provider Selector */}
                <div>
                  <label className="block text-xs font-bold text-foreground/60 mb-2.5">Inference Model Provider</label>
                  <div className="grid grid-cols-2 gap-1 bg-card/75 p-1 border border-border/85 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setProvider('openai')}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                        provider === 'openai' 
                          ? 'bg-primary text-white shadow-sm' 
                          : 'text-foreground/40 hover:text-foreground'
                      }`}
                    >
                      OpenAI API
                    </button>
                    <button
                      type="button"
                      onClick={() => setProvider('gemini')}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                        provider === 'gemini' 
                          ? 'bg-primary text-white shadow-sm' 
                          : 'text-foreground/40 hover:text-foreground'
                      }`}
                    >
                      Gemini API
                    </button>
                  </div>
                </div>

                <div className="space-y-3.5">
                  {provider === 'openai' ? (
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-foreground/60 mb-2">
                        <Key className="w-3.5 h-3.5 text-foreground/45" />
                        OpenAI Token
                      </label>
                      <div className="relative">
                        <input
                          type={showOpenaiKey ? 'text' : 'password'}
                          value={openaiKey}
                          onChange={(e) => setOpenaiKey(e.target.value)}
                          placeholder="sk-proj-..."
                          className="w-full pl-4 pr-10 py-3 bg-card/60 hover:bg-card-hover border border-border/85 rounded-xl text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-primary/60 transition-all font-mono text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground/35 hover:text-foreground transition-colors"
                        >
                          {showOpenaiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-foreground/60 mb-2">
                        <Key className="w-3.5 h-3.5 text-foreground/45" />
                        Gemini Token
                      </label>
                      <div className="relative">
                        <input
                          type={showGeminiKey ? 'text' : 'password'}
                          value={geminiKey}
                          onChange={(e) => setGeminiKey(e.target.value)}
                          placeholder="AIzaSy..."
                          className="w-full pl-4 pr-10 py-3 bg-card/60 hover:bg-card-hover border border-border/85 rounded-xl text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-primary/60 transition-all font-mono text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => setShowGeminiKey(!showGeminiKey)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground/35 hover:text-foreground transition-colors"
                        >
                          {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="rounded-xl border border-border/80 bg-card/30 px-3.5 py-3 text-[10px] leading-relaxed text-foreground/50">
                    GitHub authentication scopes are verified and managed by secure cookies. Your local API key overrides stay in local sandbox state only.
                  </div>
                </div>
              </div>

              {/* Analysis History */}
              <div className="space-y-3.5 border-t border-border/60 pt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black text-foreground/40 uppercase tracking-widest flex items-center gap-1">
                    <History className="w-3.5 h-3.5" />
                    Analysis History
                  </h3>
                  {history.length > 0 && (
                    <button
                      onClick={onClearHistory}
                      className="text-[10px] font-bold text-danger hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {history.length === 0 ? (
                  <div className="text-center py-6 bg-card/30 border border-border/60 rounded-xl text-foreground/30 text-xs">
                    No records found.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-card/35 border border-border/80 rounded-xl hover:border-foreground/15 transition-all flex items-start justify-between gap-3 text-xs group"
                      >
                        <div 
                          className="flex-1 min-w-0 cursor-pointer"
                          onClick={() => onSelectHistoryItem(item.url)}
                          title="Select to analyze"
                        >
                          <div className="flex items-center gap-1.5 font-bold text-foreground truncate">
                            <FolderGit2 className="w-3.5 h-3.5 text-primary shrink-0" />
                            {item.owner}/{item.repo}
                          </div>
                          <div className="text-[10px] text-foreground/45 truncate mt-0.5 font-mono">{item.url}</div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[9px] font-semibold text-foreground/35">
                              {new Date(item.timestamp).toLocaleDateString(undefined, { 
                                month: 'short', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            {item.userName && (
                              <span className="text-[9px] bg-foreground/5 text-foreground/50 px-1.5 py-0.5 rounded font-bold">
                                {item.userName}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-end justify-between self-stretch flex-shrink-0">
                          <span className={`text-[9px] font-black px-2 py-0.5 border rounded-full ${
                            item.healthScore >= 80 
                              ? 'bg-success/10 text-success border-success/20' 
                              : item.healthScore >= 50 
                                ? 'bg-warning/10 text-warning border-warning/20' 
                                : 'bg-danger/10 text-danger border-danger/20'
                          }`}>
                            {item.healthScore}
                          </span>
                          <button
                            onClick={() => onDeleteHistoryItem(item.id)}
                            className="p-1 hover:bg-danger/10 rounded-lg text-foreground/20 hover:text-danger transition-colors mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200"
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
            <div className="p-6 border-t border-border/80 bg-card/45 flex items-center justify-between">
              <button
                onClick={onResetAll}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-3 bg-danger/5 hover:bg-danger/10 border border-danger/15 rounded-xl text-danger text-xs font-bold transition-all hover:shadow-[0_0_15px_rgba(244,63,94,0.06)] active:scale-[0.98]"
              >
                <Trash2 className="w-4 h-4" />
                Reset App Cache & Cache Settings
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
