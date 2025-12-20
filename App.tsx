import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Copy, CheckCircle2, Globe2, Share2, 
  ChevronDown, Zap, Eraser, History as HistoryIcon,
  Menu, X, MessageSquare, Mic
} from 'lucide-react';

// --- IMPORTS ---
// Assuming you have these components/constants in your project structure
import ToneSelector from './components/ToneSelector';
import HistorySidebar from './components/HistorySidebar';
import { TONE_OPTIONS, TARGET_LANGUAGES, PLATFORMS } from './constants';
import { HistoryItem, ToneOption } from './types';

const App: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedTone, setSelectedTone] = useState<ToneOption>(TONE_OPTIONS[0]);
  const [targetLang, setTargetLang] = useState('English');
  const [platform, setPlatform] = useState('none');
  
  // UI States
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Refs for scrolling
  const outputRef = useRef<HTMLDivElement>(null);

  // --- EFFECT: Load History ---
  useEffect(() => {
    const saved = localStorage.getItem('toneMasterHistory');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  // --- EFFECT: Save History ---
  useEffect(() => {
    localStorage.setItem('toneMasterHistory', JSON.stringify(history));
  }, [history]);

  // --- HANDLERS ---

  const handleRewrite = async () => {
    if (!inputText.trim()) return;
    
    setIsStreaming(true);
    setResult('');
    
    // Mobile: Auto-scroll to output area to show progress
    if (window.innerWidth < 1024) {
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: inputText, 
          tone: selectedTone.labelKey, 
          language: targetLang,
          platform: platform
        }),
      });

      if (!response.ok) throw new Error('API Error');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let fullText = '';

      while (!done) {
        const { value, done: doneReading } = await reader!.read();
        done = doneReading;
        const chunkValue = decoder.decode(value, { stream: !done });
        
        fullText += chunkValue;
        setResult((prev) => prev + chunkValue);
      }

      // Save to History after completion
      addToHistory(inputText, fullText);

    } catch (error) {
      console.error(error);
      setResult("⚠️ connection interrupted. Please try again.");
    } finally {
      setIsStreaming(false);
    }
  };

  const addToHistory = (original: string, rewritten: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      originalText: original,
      rewrittenText: rewritten,
      toneId: selectedTone.id,
      platform: platform,
      targetLanguage: targetLang
    };
    setHistory(prev => [newItem, ...prev].slice(0, 50)); // Keep last 50
  };

  const restoreHistoryItem = (item: HistoryItem) => {
    setInputText(item.originalText);
    setResult(item.rewrittenText);
    setTargetLang(item.targetLanguage);
    setPlatform(item.platform);
    const tone = TONE_OPTIONS.find(t => t.id === item.toneId);
    if (tone) setSelectedTone(tone);
    setIsHistoryOpen(false);
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // --- RENDER ---

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500/30 transition-colors duration-300">
      
      {/* 1. BACKGROUND AMBIENCE */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
      </div>

      {/* 2. NAVBAR */}
      <nav className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 dark:bg-[#0B1120]/70 border-b border-slate-200/50 dark:border-slate-800/50 transition-all">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Sparkles size={18} fill="currentColor" />
            </div>
            <span className="font-bold text-lg tracking-tight">ToneMaster <span className="text-indigo-600 dark:text-indigo-400">AI</span></span>
          </div>
          
          <button 
            onClick={() => setIsHistoryOpen(true)}
            className="group p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2"
          >
            <span className="hidden sm:block text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200">History</span>
            <HistoryIcon size={20} className="text-slate-500 dark:text-slate-400 group-hover:text-indigo-500 transition-colors" />
          </button>
        </div>
      </nav>

      {/* 3. MAIN LAYOUT */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-6 lg:py-10">
        
        {/* TOP CONTROLS */}
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 lg:mb-8 space-y-4"
        >
          {/* Tone Selector */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-1.5 overflow-hidden">
             <ToneSelector 
               selectedToneId={selectedTone.id} 
               onSelect={setSelectedTone} 
               disabled={isStreaming}
               // Mock t function for translation if you removed i18n
               t={{ tones: {}, selectTone: "Select Tone" } as any} 
             />
          </div>

          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row gap-4">
             {/* Language */}
             <div className="relative group flex-1">
               <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10">
                 <Globe2 size={16} />
               </div>
               <select 
                 value={targetLang}
                 onChange={(e) => setTargetLang(e.target.value)}
                 disabled={isStreaming}
                 className="w-full appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3.5 pl-10 pr-4 text-sm font-medium text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow cursor-pointer hover:border-indigo-300 dark:hover:border-slate-600"
               >
                 {TARGET_LANGUAGES.map(l => <option key={l.code} value={l.label}>{l.label}</option>)}
               </select>
               <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
             </div>

             {/* Platform */}
             <div className="relative group flex-1">
               <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10">
                 <Share2 size={16} />
               </div>
               <select 
                 value={platform}
                 onChange={(e) => setPlatform(e.target.value)}
                 disabled={isStreaming}
                 className="w-full appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3.5 pl-10 pr-4 text-sm font-medium text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow cursor-pointer hover:border-indigo-300 dark:hover:border-slate-600"
               >
                 {PLATFORMS.map(p => <option key={p.id} value={p.id}>{p.labelKey === 'formatStandard' ? 'Standard Format' : `Format for ${p.labelKey.replace('format', '')}`}</option>)}
               </select>
               <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
             </div>
          </div>
        </motion.section>

        {/* EDITOR SPLIT VIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 min-h-[500px] lg:h-[calc(100vh-340px)]">
          
          {/* --- LEFT: INPUT --- */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col h-[400px] lg:h-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-200 dark:border-slate-800 overflow-hidden ring-1 ring-transparent focus-within:ring-indigo-500/50 transition-all"
          >
            {/* Header */}
            <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <MessageSquare size={14} />
                <span>Your Draft</span>
              </div>
              {inputText && (
                <button 
                  onClick={() => setInputText('')} 
                  className="text-xs font-medium text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Eraser size={12} /> Clear
                </button>
              )}
            </div>

            {/* Text Area */}
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your rough text here... (e.g. 'i need to ask my boss for a raise but nicely')"
              className="flex-1 w-full p-5 lg:p-6 resize-none bg-transparent outline-none text-base md:text-lg leading-relaxed placeholder:text-slate-300 dark:placeholder:text-slate-600 text-slate-800 dark:text-slate-200"
              spellCheck={false}
            />
            
            {/* Action Bar (Stuck to bottom of input) */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleRewrite}
                disabled={isStreaming || !inputText.trim()}
                className="w-full group relative overflow-hidden rounded-xl bg-slate-900 dark:bg-indigo-600 text-white py-3.5 px-6 font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {/* Shiny Gradient Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                
                <span className="flex items-center justify-center gap-2 relative z-10">
                  {isStreaming ? (
                    <>
                       <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                       <span className="animate-pulse">Polishing...</span>
                    </>
                  ) : (
                    <>
                      <Zap size={18} className="fill-indigo-300 text-indigo-300 dark:fill-white dark:text-white" />
                      <span>Polish & Rewrite</span>
                    </>
                  )}
                </span>
              </button>
            </div>
          </motion.div>

          {/* --- RIGHT: OUTPUT --- */}
          <motion.div 
            ref={outputRef}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col h-[400px] lg:h-full bg-slate-50 dark:bg-slate-950/50 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden relative shadow-inner"
          >
            {/* Header */}
            <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                <Sparkles size={14} />
                <span>Polished Result</span>
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={copyToClipboard} 
                  disabled={!result}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm transition-all disabled:opacity-30"
                >
                  {isCopied ? <CheckCircle2 size={14} className="text-green-500"/> : <Copy size={14} />}
                  {isCopied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
              {result ? (
                <div className="prose prose-slate dark:prose-invert max-w-none leading-relaxed text-base md:text-lg whitespace-pre-wrap">
                  {result}
                  {isStreaming && (
                    <span className="inline-block w-2 h-5 ml-1 align-middle bg-indigo-500 animate-pulse rounded-sm"/>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 opacity-60 px-6 text-center">
                  <div className="w-16 h-16 mb-4 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                    <Sparkles size={32} className="text-slate-300 dark:text-slate-700" />
                  </div>
                  <p className="text-sm font-medium">Select a tone and rewrite your text.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
      
      {/* 4. SIDEBAR OVERLAY */}
      <HistorySidebar 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        history={history}
        onRestore={restoreHistoryItem}
        onClear={() => setHistory([])}
        // Mock props for TS compatibility
        t={{ historyTitle: "History", noHistory: "No history yet", clearHistory: "Clear All" } as any}
        isRTL={false}
      />
    </div>
  );
};

export default App;