// components/ToneSelector.tsx
import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { TONE_OPTIONS } from '../constants';

interface Props {
  selectedTone: any;
  setSelectedTone: (t: any) => void;
  disabled: boolean;
}

const ToneSelector: React.FC<Props> = ({ selectedTone, setSelectedTone, disabled }) => {
  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
      <div className="flex md:grid md:grid-cols-4 lg:grid-cols-6 gap-2 min-w-max md:min-w-0 p-1">
        {TONE_OPTIONS.map((tone) => {
          // Dynamic Icon loading
          // @ts-ignore
          const Icon = Icons[tone.iconName] || Icons.Sparkles;
          const isSelected = selectedTone.id === tone.id;

          return (
            <motion.button
              key={tone.id}
              onClick={() => setSelectedTone(tone)}
              disabled={disabled}
              whileTap={{ scale: 0.95 }}
              className={`
                relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 border
                ${isSelected 
                  ? 'bg-indigo-50 dark:bg-indigo-500/20 border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-sm' 
                  : 'bg-transparent border-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                }
              `}
            >
              <div className={`
                p-2 rounded-lg shrink-0
                ${isSelected ? 'bg-indigo-100 dark:bg-indigo-500/30' : 'bg-slate-100 dark:bg-slate-800'}
              `}>
                <Icon size={18} />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold">{tone.labelKey}</div>
                {/* Optional: Add a tiny description if you want */}
              </div>
              
              {isSelected && (
                <motion.div 
                  layoutId="active-ring"
                  className="absolute inset-0 border-2 border-indigo-500 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
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