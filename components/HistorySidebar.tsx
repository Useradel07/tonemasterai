import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, X, Clock, ArrowRight } from 'lucide-react';
import { HistoryItem, Translations } from '../types';
import AdUnit from './AdUnit'; // Adjust path if necessary


interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onRestore: (item: HistoryItem) => void;
  onClear: () => void;
  t: Translations['en'];
  isRTL: boolean;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ 
  isOpen, 
  onClose, 
  history, 
  onRestore, 
  onClear,
  t,
  isRTL
}) => {
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
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: isRTL ? 100 : -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: isRTL ? 100 : -300, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`
              fixed top-0 bottom-0 z-50 w-80 bg-white dark:bg-slate-900 border-r dark:border-slate-800 shadow-2xl
              ${isRTL ? 'right-0 border-l border-r-0' : 'left-0'}
            `}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-bold">
                  <Clock size={18} className="text-brand-500" />
                  {t.historyTitle}
                </div>
                <button 
                  onClick={onClose}
                  className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-slate-400 text-sm text-center">
                    <History size={32} className="mb-2 opacity-50" />
                    <p>{t.noHistory}</p>
                  </div>
                ) : (
                  history.map((item) => (
                    <motion.div
                      key={item.id}
                      layoutId={item.id}
                      onClick={() => {
                        onRestore(item);
                        if (window.innerWidth < 1024) onClose();
                      }}
                      className="group relative p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md hover:border-brand-200 dark:hover:border-brand-900 transition-all cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider bg-brand-50 dark:bg-brand-900/30 px-1.5 py-0.5 rounded">
                           {item.toneId}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-2 italic">
                        "{item.originalText}"
                      </p>
                      <div className="flex items-center gap-1 text-xs font-medium text-slate-700 dark:text-slate-200">
                        <ArrowRight size={12} className="text-slate-400" />
                        <span className="truncate">{item.targetLanguage}</span>
                        {item.platform !== 'none' && (
                          <span className="ml-auto text-[10px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">
                            {item.platform}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
                /* --- AD PLACEMENT 3: SIDEBAR --- */
                {history.length > 2 && (
                  <AdUnit slotId="0987654321" format="vertical" /> 
                )}
                
              </div>

              {/* Footer */}
              {history.length > 0 && (
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                  <button
                    onClick={onClear}
                    className="w-full py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    {t.clearHistory}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};


export default HistorySidebar;