import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { TONE_OPTIONS } from '../constants';

interface Props {
  // Changed to selectedToneId to match your App.tsx logic better
  selectedToneId: string; 
  onSelect: (tone: any) => void;
  disabled: boolean;
}

const ToneSelector: React.FC<Props> = ({ selectedToneId, onSelect, disabled }) => {
  // SAFETY CHECK: If constants haven't loaded, don't crash
  if (!TONE_OPTIONS || !Array.isArray(TONE_OPTIONS)) return null;

  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
      <div className="flex lg:grid lg:grid-cols-6 gap-2 min-w-max lg:min-w-0 p-1">
        {TONE_OPTIONS.map((tone) => {
          if (!tone) return null;

          // 1. Dynamic Icon Logic
          // @ts-ignore
          const IconComponent = Icons[tone.iconName] || Icons.Sparkles;
          
          // 2. SAFETY CHECK: Check id existence before comparing
          const isSelected = selectedToneId === tone.id;

          return (
            <motion.button
              key={tone.id}
              onClick={() => onSelect(tone)}
              disabled={disabled}
              whileHover={{ scale: disabled ? 1 : 1.02 }}
              whileTap={{ scale: disabled ? 1 : 0.98 }}
              className={`
                relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 border
                ${isSelected 
                  ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-sm ring-1 ring-indigo-500/50' 
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className={`
                p-2 rounded-lg shrink-0 transition-colors
                ${isSelected ? 'bg-indigo-100 dark:bg-indigo-500/30 text-indigo-600' : 'bg-slate-100 dark:bg-slate-800'}
              `}>
                <IconComponent size={18} />
              </div>

              <div className="text-left">
                <span className="text-sm font-bold block whitespace-nowrap">
                  {tone.labelKey || tone.id}
                </span>
              </div>
              
              {/* Active Animation Layer */}
              {isSelected && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute inset-0 z-[-1] rounded-xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default ToneSelector;