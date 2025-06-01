
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  Heart, 
  Activity, 
  Thermometer, 
  Droplets 
} from 'lucide-react';

interface PhoneMockupProps {
  fontSize: number;
  accentColor: string;
}

const PhoneMockup = ({ fontSize, accentColor }: PhoneMockupProps) => {
  const { theme } = useTheme();

  const vitalsData = [
    {
      icon: Heart,
      label: 'Heart Rate',
      value: '72',
      unit: 'BPM',
      status: 'Normal'
    },
    {
      icon: Activity,
      label: 'Blood Pressure',
      value: '120/80',
      unit: 'mmHg',
      status: 'Normal'
    },
    {
      icon: Thermometer,
      label: 'Temperature',
      value: '98.6',
      unit: '°F',
      status: 'Normal'
    },
    {
      icon: Droplets,
      label: 'Oxygen',
      value: '98',
      unit: '%',
      status: 'Normal'
    }
  ];

  return (
    <motion.div
      className="relative mx-auto"
      style={{
        width: '280px',
        height: '560px'
      }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {/* Phone Frame */}
      <div className={`
        absolute inset-0 rounded-[3rem] border-8 shadow-2xl
        ${theme === 'dark' 
          ? 'border-slate-800 bg-slate-900 shadow-black/50' 
          : 'border-slate-300 bg-white shadow-slate-400/30'
        }
      `}>
        {/* Screen Bezel */}
        <div className="absolute inset-2 rounded-[2.5rem] overflow-hidden">
          {/* Status Bar */}
          <div className={`
            h-8 flex items-center justify-between px-4 text-xs font-medium
            ${theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900'}
          `}>
            <span>9:41</span>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-2 border rounded-sm border-current">
                <div className="w-3/4 h-full bg-current rounded-sm"></div>
              </div>
            </div>
          </div>

          {/* App Content */}
          <div className={`
            flex-1 p-4 space-y-4
            ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}
          `}>
            {/* Header */}
            <motion.div
              className="text-center mb-6"
              animate={{ fontSize: `${fontSize}px` }}
              transition={{ duration: 0.3 }}
            >
              <h1 className={`font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Health Dashboard
              </h1>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                Real-time monitoring
              </p>
            </motion.div>

            {/* Vitals Grid */}
            <div className="grid grid-cols-2 gap-3">
              {vitalsData.map((vital, index) => (
                <motion.div
                  key={index}
                  className={`
                    p-3 rounded-xl border transition-all duration-300
                    ${theme === 'dark' 
                      ? 'bg-slate-800 border-slate-700' 
                      : 'bg-white border-slate-200'
                    }
                  `}
                  style={{
                    borderColor: index === 0 ? accentColor : undefined,
                    boxShadow: index === 0 ? `0 0 0 1px ${accentColor}20` : undefined
                  }}
                  animate={{ fontSize: `${fontSize * 0.8}px` }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center mb-2">
                    <div 
                      className="w-6 h-6 rounded-lg flex items-center justify-center mr-2"
                      style={{ backgroundColor: `${accentColor}20` }}
                    >
                      <vital.icon 
                        className="w-3 h-3" 
                        style={{ color: accentColor }}
                      />
                    </div>
                    <motion.span 
                      className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}
                      animate={{ fontSize: `${fontSize * 0.6}px` }}
                      transition={{ duration: 0.3 }}
                    >
                      {vital.label}
                    </motion.span>
                  </div>
                  <motion.div 
                    className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}
                    animate={{ fontSize: `${fontSize * 1.2}px` }}
                    transition={{ duration: 0.3 }}
                  >
                    {vital.value}
                    <motion.span 
                      className={`text-xs ml-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}
                      animate={{ fontSize: `${fontSize * 0.5}px` }}
                      transition={{ duration: 0.3 }}
                    >
                      {vital.unit}
                    </motion.span>
                  </motion.div>
                  <motion.div 
                    className="text-xs mt-1"
                    style={{ color: accentColor }}
                    animate={{ fontSize: `${fontSize * 0.5}px` }}
                    transition={{ duration: 0.3 }}
                  >
                    {vital.status}
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Action Button */}
            <motion.button
              className="w-full py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: accentColor }}
              animate={{ fontSize: `${fontSize * 0.9}px` }}
              transition={{ duration: 0.3 }}
              whileTap={{ scale: 0.95 }}
            >
              View Details
            </motion.button>
          </div>
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-slate-400 rounded-full"></div>
      </div>

      {/* Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-[3rem] opacity-20 blur-xl -z-10"
        style={{ backgroundColor: accentColor }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
};

export default PhoneMockup;
