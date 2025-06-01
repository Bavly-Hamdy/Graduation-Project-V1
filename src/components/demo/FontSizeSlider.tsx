
import React from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/contexts/I18nContext';
import { Slider } from '@/components/ui/slider';

interface FontSizeSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const FontSizeSlider = ({ value, onChange }: FontSizeSliderProps) => {
  const { t } = useI18n();

  const handleValueChange = (values: number[]) => {
    const newValue = values[0];
    onChange(newValue);
  };

  const getPercentage = () => Math.round(((value - 12) / (24 - 12)) * 100);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">
          {t('hero.customization.fontSize')}
        </label>
        <motion.span
          className="text-xs bg-health-primary text-white px-2 py-1 rounded-full"
          key={value}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {getPercentage()}%
        </motion.span>
      </div>
      
      <div className="relative">
        <Slider
          value={[value]}
          onValueChange={handleValueChange}
          min={12}
          max={24}
          step={1}
          className="w-full"
        />
        
        {/* Size Labels */}
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>{t('hero.customization.small')}</span>
          <span>{t('hero.customization.medium')}</span>
          <span>{t('hero.customization.large')}</span>
        </div>
      </div>
    </div>
  );
};

export default FontSizeSlider;
