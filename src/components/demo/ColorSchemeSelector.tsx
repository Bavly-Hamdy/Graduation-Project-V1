
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/button';
import { Palette, Check } from 'lucide-react';

interface ColorSchemeSelectorProps {
  selectedColor: string;
  onChange: (color: string) => void;
}

const ColorSchemeSelector = ({ selectedColor, onChange }: ColorSchemeSelectorProps) => {
  const { t } = useI18n();
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [customColor, setCustomColor] = useState('#06B6D4');

  const predefinedSchemes = [
    {
      id: 'default',
      name: t('hero.customization.default'),
      color: '#06B6D4', // Health blue/teal
      description: 'Calm teal-blue for medical apps'
    },
    {
      id: 'highContrast',
      name: t('hero.customization.highContrast'),
      color: '#FFFF00', // Bright yellow for high contrast
      description: 'High contrast yellow accent'
    },
    {
      id: 'custom',
      name: t('hero.customization.custom'),
      color: customColor,
      description: 'Pick your own color'
    }
  ];

  const handleSchemeSelect = (scheme: typeof predefinedSchemes[0]) => {
    if (scheme.id === 'custom') {
      setShowCustomPicker(true);
      onChange(customColor);
    } else {
      setShowCustomPicker(false);
      onChange(scheme.color);
    }
  };

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
    onChange(color);
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium">
        {t('hero.customization.colorScheme')}
      </label>
      
      <div className="grid grid-cols-1 gap-3">
        {predefinedSchemes.map((scheme) => (
          <motion.button
            key={scheme.id}
            onClick={() => handleSchemeSelect(scheme)}
            className={`
              p-3 rounded-xl border-2 transition-all duration-300 text-left
              ${selectedColor === scheme.color 
                ? 'border-health-primary bg-health-primary/10' 
                : 'border-transparent glass-card hover:bg-white/20 dark:hover:bg-black/30'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              {/* Color Swatch */}
              <div 
                className="w-8 h-8 rounded-lg border-2 border-white shadow-sm flex items-center justify-center"
                style={{ backgroundColor: scheme.color }}
              >
                <AnimatePresence>
                  {selectedColor === scheme.color && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Check className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Scheme Info */}
              <div className="flex-1">
                <div className="font-medium text-sm">{scheme.name}</div>
                <div className="text-xs text-muted-foreground">{scheme.description}</div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Custom Color Picker */}
      <AnimatePresence>
        {showCustomPicker && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-4 rounded-xl border">
              <div className="flex items-center space-x-3 mb-3">
                <Palette className="w-5 h-5 text-health-primary" />
                <span className="font-medium text-sm">Custom Color</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => handleCustomColorChange(e.target.value)}
                  className="w-12 h-12 rounded-lg border-2 border-border cursor-pointer"
                />
                <div className="flex-1">
                  <input
                    type="text"
                    value={customColor}
                    onChange={(e) => handleCustomColorChange(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background"
                    placeholder="#06B6D4"
                  />
                </div>
              </div>
              
              {/* Color Presets */}
              <div className="grid grid-cols-6 gap-2 mt-3">
                {[
                  '#06B6D4', '#3B82F6', '#8B5CF6', '#EF4444', 
                  '#10B981', '#F59E0B', '#EC4899', '#6B7280'
                ].map((color) => (
                  <button
                    key={color}
                    onClick={() => handleCustomColorChange(color)}
                    className="w-8 h-8 rounded-lg border-2 border-white shadow-sm hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ColorSchemeSelector;
