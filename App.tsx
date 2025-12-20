import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Moon, Sun, Copy, CheckCircle2, Sparkles, X, Languages, Volume2, BarChart3, PanelLeft, Globe2, Share2, FileText, Mail, Linkedin, MessageCircle, Hash, ChevronDown } from 'lucide-react';

import ToneSelector from './components/ToneSelector';
import Button from './components/Button';
import HistorySidebar from './components/HistorySidebar';
import { TONE_OPTIONS, DICTIONARY, SUPPORTED_LANGUAGES, TARGET_LANGUAGES, PLATFORMS } from './constants';
import { ToneOption, LanguageCode, RewriteResult, PlatformFormat, HistoryItem } from './types';

// Icon mapping for platforms
const PlatformIconMap: Record<string, React.ElementType> = {
  FileText,
  Mail,
  Linkedin,
  MessageCircle,
  Hash
};

const App: React.FC = () => {
  // --- STATE ---
  const [inputText, setInputText] = useState<string>('');
  const [result, setResult] = useState<RewriteResult | null>(null);
  const [selectedTone, setSelectedTone] = useState<ToneOption>(TONE_OPTIONS[0]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  
  // New Features State
  const [targetLanguage, setTargetLanguage] = useState<string>('English');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformFormat>('none');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isPlatformOpen, setIsPlatformOpen] = useState<boolean>(false);

  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // --- DERIVED ---
  const t = DICTIONARY[language];
  const currentLangConfig = SUPPORTED_LANGUAGES.find(l => l.code === language);
  const isRTL = currentLangConfig?.dir === 'rtl';

  const currentPlatform = PLATFORMS.find(p => p.id === selectedPlatform) || PLATFORMS[0];
  const CurrentPlatformIcon = PlatformIconMap[currentPlatform.icon] || FileText;

  // --- EFFECTS ---
  
  // Load History from LocalStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('toneMasterHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history");
      }
    }
  }, []);

  // Save History to LocalStorage
  useEffect(() => {
    localStorage.setItem('toneMasterHistory', JSON.stringify(history));
  }, [history]);

  // Handle Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle RTL
  useEffect(() => {
    if (isRTL) {
      document.body.style.fontFamily = "'Noto Sans Arabic', sans-serif";
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.body.style.fontFamily = "'Inter', sans-serif";
      document.documentElement.setAttribute('dir', 'ltr');
    }
  }, [isRTL]);

  // --- HANDLERS ---
  const handleRewrite = async () => {
    if (!inputText.trim()) {
      setError(t.errorEmpty);
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsCopied(false);
    
    // Initialize result for streaming
    setResult({
      rewrittenText: "",
      originalScore: 0,
      newScore: 0,
      improvement: ""
    });

    try {
      // 1. Construct the Prompt
      let platformInstruction = "";
      switch (selectedPlatform) {
        case 'email':
          platformInstruction = "Format the output as a professional email, including a clear Subject Line and the Body.";
          break;
        case 'linkedin':
          platformInstruction = "Format the output as a LinkedIn post. Include engaging spacing, hooks, and 3-5 relevant hashtags at the end.";
          break;
        case 'whatsapp':
          platformInstruction = "Format the output as a short, direct WhatsApp message. Use emojis where appropriate.";
          break;
        case 'slack':
          platformInstruction = "Format the output as a Slack message. Use bolding (*) for emphasis and keep it concise.";
          break;
        default:
          platformInstruction = "Output standard text paragraphs.";
          break;
      }

      const prompt = `
        Act as a world-class editor.
        
        Input Text: "${inputText}"
        
        Goal: Rewrite the input text to match the following Tone: ${selectedTone.systemPrompt}
        
        Target Language: ${targetLanguage}
        
        Format Instruction: ${platformInstruction}
        
        Rules:
        - Output ONLY the rewritten text.
        - Do not output any conversational filler (e.g., "Here is the text").
        - Do not output JSON. Output plain text only.
      `;

      // 2. Call the Secure Backend API with Streaming
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      // 3. Process the Stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let fullText = "";

      if (reader) {
        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          
          if (value) {
            const chunkValue = decoder.decode(value, { stream: !done });
            fullText += chunkValue;
            
            // Update React State progressively
            setResult(prev => ({
              ...prev!,
              rewrittenText: fullText,
              improvement: "Streaming..."
            }));
          }
        }
      }
      
      // Finalize Result
      const finalResult: RewriteResult = {
        rewrittenText: fullText,
        originalScore: 0, // Streaming mode skips analysis for speed
        newScore: 0,
        improvement: "Completed"
      };
      
      setResult(finalResult);

      // Add to History
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        originalText: inputText,
        rewrittenText: fullText,
        toneId: selectedTone.id,
        platform: selectedPlatform,
        targetLanguage: targetLanguage
      };
      
      setHistory(prev => [newItem, ...prev].slice(0, 5)); // Keep last 5

    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err instanceof Error ? err.message : t.errorGeneric);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = useCallback(async () => {
    if (result?.rewrittenText) {
      try {
        await navigator.clipboard.writeText(result.rewrittenText);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy", err);
      }
    }
  }, [result]);

  const handleSpeak = () => {
    if (!result?.rewrittenText) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(result.rewrittenText);
    // Rough heuristic for voice selection based on Target Language name
    const voices = window.speechSynthesis.getVoices();
    // Map full names to codes loosely
    const langMap: Record<string, string> = {
      'English': 'en', 'Spanish': 'es', 'French': 'fr', 'German': 'de', 
      'Italian': 'it', 'Portuguese': 'pt', 'Chinese': 'zh', 'Japanese': 'ja', 
      'Arabic': 'ar', 'Hindi': 'hi'
    };
    const code = langMap[targetLanguage.split(' ')[0]] || 'en';
    const voice = voices.find(v => v.lang.startsWith(code));
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  };

  const restoreHistoryItem = (item: HistoryItem) => {
    setInputText(item.originalText);
    setResult({
      rewrittenText: item.rewrittenText,
      originalScore: 0,
      newScore: 0,
      improvement: "Restored from History"
    });
    setTargetLanguage(item.targetLanguage);
    setSelectedPlatform(item.platform);
    // Find tone object
    const restoredTone = TONE_OPTIONS.find(t => t.id === item.toneId) || TONE_OPTIONS[0];
    setSelectedTone(restoredTone);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      
      {/* --- Sidebar --- */}
      <HistorySidebar 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onRestore={restoreHistoryItem}
        onClear={() => setHistory([])}
        t={t}
        isRTL={isRTL || false}
      />

      {/* --- Navbar --- */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsHistoryOpen(true)}
              className="mr-2 p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            >
              <PanelLeft size={20} />
            </button>
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
              <Sparkles size={18} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-none tracking-tight">
                {t.appName}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
             <button 
              onClick={() => setIsHistoryOpen(prev => !prev)}
              className="hidden lg:flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <PanelLeft size={18} />
              {t.historyTitle}
            </button>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden lg:block mx-1"></div>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* --- Settings Modal --- */}
      <AnimatePresence>
        {isSettingsOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed inset-0 m-auto z-50 w-full max-w-md h-fit p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.settings}</h2>
                <button onClick={() => setIsSettingsOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <Languages size={16} /> {t.language}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                          language === lang.code 
                          ? 'bg-brand-600 border-brand-600 text-white shadow-md' 
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-brand-300'
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Appearance
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setIsDarkMode(false)}
                      className={`flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg border transition-all ${
                        !isDarkMode
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Sun size={16} /> {t.lightMode}
                    </button>
                    <button
                      onClick={() => setIsDarkMode(true)}
                      className={`flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg border transition-all ${
                        isDarkMode
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Moon size={16} /> {t.darkMode}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- Main Content --- */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 transition-all duration-300">
        
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3"
          >
            {t.appName}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 dark:text-slate-400"
          >
            {t.appDesc}
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          // Removed overflow-hidden to allow dropdown to display over edges
          className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl dark:shadow-slate-900/50 border border-slate-200 dark:border-slate-800 relative"
        >
          {/* Tone Selection Section */}
          <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 rounded-t-3xl">
            <ToneSelector 
              selectedToneId={selectedTone.id} 
              onSelect={setSelectedTone} 
              disabled={isLoading}
              t={t}
            />
            
            {/* New Control Bar (Language & Platform) */}
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-6">
               {/* Target Language */}
               <div className="w-full md:w-1/3">
                 <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                   <Globe2 size={14} /> {t.targetLanguage}
                 </label>
                 <select 
                    value={targetLanguage}
                    onChange={(e) => setTargetLanguage(e.target.value)}
                    disabled={isLoading}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 outline-none text-sm appearance-none cursor-pointer hover:border-brand-300 transition-colors"
                 >
                   {TARGET_LANGUAGES.map(l => (
                     <option key={l.code} value={l.code}>{l.label}</option>
                   ))}
                 </select>
               </div>

               {/* Platform Selector (Custom Dropdown) */}
               <div className="w-full md:w-2/3 relative">
                 <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                   <Share2 size={14} /> {t.format}
                 </label>
                 
                 <button
                    onClick={() => setIsPlatformOpen(!isPlatformOpen)}
                    disabled={isLoading}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 outline-none text-sm hover:border-brand-300 transition-all"
                 >
                    <div className="flex items-center gap-2">
                        <CurrentPlatformIcon size={16} className="text-brand-600 dark:text-brand-400" />
                        <span>{t.formats[currentPlatform.labelKey]}</span>
                    </div>
                    <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isPlatformOpen ? 'rotate-180' : ''}`} />
                 </button>

                 <AnimatePresence>
                    {isPlatformOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsPlatformOpen(false)} />
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl max-h-60 overflow-y-auto"
                            >
                                {PLATFORMS.map((p) => {
                                    const Icon = PlatformIconMap[p.icon] || FileText;
                                    const isSelected = selectedPlatform === p.id;
                                    return (
                                        <button
                                            key={p.id}
                                            onClick={() => {
                                                setSelectedPlatform(p.id);
                                                setIsPlatformOpen(false);
                                            }}
                                            className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm text-left transition-colors
                                                ${isSelected 
                                                    ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400' 
                                                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                                }
                                            `}
                                        >
                                            <Icon size={16} className={isSelected ? 'text-brand-500' : 'text-slate-400'} />
                                            <span>{t.formats[p.labelKey]}</span>
                                            {isSelected && <CheckCircle2 size={14} className="ml-auto text-brand-500" />}
                                        </button>
                                    );
                                })}
                            </motion.div>
                        </>
                    )}
                 </AnimatePresence>
               </div>
            </div>
          </div>

          {/* Editor Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-slate-800">
            
            {/* INPUT SIDE */}
            <div className="p-6 md:p-8 space-y-4">
              <label className="flex justify-between text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <span>{t.inputLabel}</span>
                <span className="font-normal text-xs">{inputText.length} {t.charCount}</span>
              </label>
              
              <textarea
                className={`
                  w-full h-80 p-4 rounded-xl resize-none text-base leading-relaxed
                  bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800
                  text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600
                  focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all
                  ${isLoading ? 'opacity-50 cursor-wait' : ''}
                `}
                placeholder={t.inputPlaceholder}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isLoading}
                dir={isRTL ? 'rtl' : 'ltr'}
              />

              <div className="pt-2">
                <Button 
                  onClick={handleRewrite} 
                  isLoading={isLoading} 
                  disabled={!inputText.trim()}
                  className="w-full h-12 text-base shadow-lg shadow-brand-500/20"
                >
                  {isLoading ? t.processing : `${t.rewriteButton} (${t.tones[selectedTone.labelKey] || selectedTone.id})`}
                </Button>
                {error && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mt-3 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/50">
                   ⚠️ {error}
                  </motion.div>
                )}
              </div>
            </div>

            {/* OUTPUT SIDE */}
            <div className="flex flex-col p-6 md:p-8 space-y-4 bg-slate-50/30 dark:bg-slate-950/30 relative rounded-b-3xl lg:rounded-bl-none lg:rounded-br-3xl">
              <div className="flex justify-between items-center h-5">
                <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {t.outputLabel}
                </label>
                <div className="flex gap-2">
                  <AnimatePresence>
                    {result?.rewrittenText && (
                      <>
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                          onClick={handleSpeak}
                          className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-full transition-colors"
                        >
                          <Volume2 size={14} />
                          {t.listen}
                        </motion.button>
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                          onClick={handleCopy}
                          className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 hover:bg-brand-100 dark:hover:bg-brand-900/50 rounded-full transition-colors"
                        >
                          {isCopied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                          {isCopied ? t.copied : t.copy}
                        </motion.button>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="relative flex-grow">
                {isLoading && !result?.rewrittenText ? (
                  <div className="absolute inset-0 p-4 space-y-6 animate-pulse overflow-hidden">
                    <div className="space-y-3">
                      <div className="h-4 bg-slate-200/80 dark:bg-slate-800/80 rounded w-3/4"></div>
                      <div className="h-4 bg-slate-200/60 dark:bg-slate-800/60 rounded w-full"></div>
                      <div className="h-4 bg-slate-200/60 dark:bg-slate-800/60 rounded w-11/12"></div>
                    </div>
                    <div className="space-y-3">
                       <div className="h-4 bg-slate-200/70 dark:bg-slate-800/70 rounded w-5/6"></div>
                       <div className="h-4 bg-slate-200/50 dark:bg-slate-800/50 rounded w-4/5"></div>
                    </div>
                  </div>
                ) : (
                  <div 
                    className={`
                      w-full h-full p-4 rounded-xl overflow-y-auto border border-transparent whitespace-pre-wrap
                      ${result?.rewrittenText 
                        ? 'bg-white dark:bg-slate-900 shadow-sm border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200' 
                        : 'text-slate-400 dark:text-slate-600 italic flex items-center justify-center'
                      }
                    `}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    {result?.rewrittenText || t.outputPlaceholder}
                  </div>
                )}
              </div>

              {/* SENTIMENT ANALYSIS VISUALS (Hidden when streaming as we don't get scores) */}
              <AnimatePresence>
                {result && !isLoading && result.originalScore > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      <BarChart3 size={16} className="text-brand-500" />
                      {t.analysisTitle} 
                      <span className="ml-auto text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
                        {result.improvement}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {/* Original Score */}
                      <div>
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span>{t.originalTone}</span>
                          <span>{result.originalScore}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} animate={{ width: `${result.originalScore}%` }}
                            transition={{ duration: 1 }}
                            className="h-full bg-slate-400 dark:bg-slate-500 rounded-full"
                          />
                        </div>
                      </div>

                      {/* New Score */}
                      <div>
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span className="font-medium text-brand-600 dark:text-brand-400">{t.newTone}</span>
                          <span className="font-bold text-brand-600 dark:text-brand-400">{result.newScore}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} animate={{ width: `${result.newScore}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="h-full bg-brand-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </motion.div>
      </main>

      <footer className="py-8 text-center border-t border-slate-200 dark:border-slate-800">
        <p className="text-sm text-slate-500 dark:text-slate-500">
          {t.poweredBy}
        </p>
      </footer>
    </div>
  );
};

export default App;