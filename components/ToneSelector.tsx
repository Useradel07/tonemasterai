import React from 'react';
import { ToneOption, Translations } from '../types';
import { TONE_OPTIONS } from '../constants';
import * as Icons from 'lucide-react';
import { motion } from 'framer-motion';

interface ToneSelectorProps {
  selectedToneId: string;
  onSelect: (tone: ToneOption) => void;
  disabled: boolean;
  t: Translations['en'];
}

const ToneSelector: React.FC<ToneSelectorProps> = ({ selectedToneId, onSelect, disabled, t }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        {t.selectTone}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {TONE_OPTIONS.map((tone) => {
          // Dynamic Icon Component
          // @ts-ignore
          const IconComponent = Icons[tone.iconName] || Icons.HelpCircle;
          const isSelected = selectedToneId === tone.id;

          return (
            <motion.button
              key={tone.id}
              onClick={() => onSelect(tone)}
              disabled={disabled}
              whileHover={{ scale: disabled ? 1 : 1.02 }}
              whileTap={{ scale: disabled ? 1 : 0.98 }}
              className={`
                relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 h-28
                ${isSelected 
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 ring-1 ring-brand-500' 
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-brand-300 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className={`mb-2 p-2 rounded-full ${isSelected ? 'bg-brand-100 dark:bg-brand-800 text-brand-600 dark:text-brand-200' : 'bg-slate-100 dark:bg-slate-700'}`}>
                <IconComponent size={20} />
              </div>
              <span className="text-xs font-semibold text-center leading-tight">
                {t.tones[tone.labelKey] || tone.id}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default ToneSelector;