
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useI18n } from '@/contexts/I18nContext';
import { useTheme } from '@/contexts/ThemeContext';
import MainLayout from '@/components/layout/MainLayout';
import PhoneMockup from '@/components/demo/PhoneMockup';
import FontSizeSlider from '@/components/demo/FontSizeSlider';
import ColorSchemeSelector from '@/components/demo/ColorSchemeSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Play, 
  Download, 
  Heart, 
  Brain, 
  Clock, 
  Smartphone, 
  Volume2, 
  FileText,
  ChevronRight,
  Star,
  Shield,
  Zap
} from 'lucide-react';

const Index = () => {
  const { t } = useI18n();
  const { theme, fontSize, setFontSize, colorScheme, setColorScheme } = useTheme();
  const { scrollY } = useScroll();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Demo Controls State
  const [demoFontSize, setDemoFontSize] = useState(16);
  const [demoAccentColor, setDemoAccentColor] = useState('#06B6D4');

  // Load saved preferences
  useEffect(() => {
    const savedFontSize = localStorage.getItem('demoFontSize');
    const savedAccentColor = localStorage.getItem('demoAccentColor');
    
    if (savedFontSize) setDemoFontSize(parseInt(savedFontSize));
    if (savedAccentColor) setDemoAccentColor(savedAccentColor);
  }, []);

  // Save preferences when changed
  useEffect(() => {
    localStorage.setItem('demoFontSize', demoFontSize.toString());
  }, [demoFontSize]);

  useEffect(() => {
    localStorage.setItem('demoAccentColor', demoAccentColor);
  }, [demoAccentColor]);

  // Parallax effects
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  const features = [
    {
      icon: Heart,
      titleKey: 'features.realTimeMonitoring.title',
      descriptionKey: 'features.realTimeMonitoring.description',
      color: 'text-red-500',
      bgColor: 'bg-red-500/10'
    },
    {
      icon: Brain,
      titleKey: 'features.aiPredictions.title',
      descriptionKey: 'features.aiPredictions.description',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      icon: Clock,
      titleKey: 'features.smartReminders.title',
      descriptionKey: 'features.smartReminders.description',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      icon: Smartphone,
      titleKey: 'features.deviceIntegration.title',
      descriptionKey: 'features.deviceIntegration.description',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      icon: Volume2,
      titleKey: 'features.accessibility.title',
      descriptionKey: 'features.accessibility.description',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    },
    {
      icon: FileText,
      titleKey: 'features.customPlans.title',
      descriptionKey: 'features.customPlans.description',
      color: 'text-teal-500',
      bgColor: 'bg-teal-500/10'
    }
  ];

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show success message (in a real app, this would be a toast)
    alert(t('waitlist.success'));
    setEmail('');
    setIsSubmitting(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Pattern */}
        <div className={`absolute inset-0 ${theme === 'dark' ? 'hero-pattern-dark' : 'hero-pattern'}`} />
        
        {/* Animated Background Orbs */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-health-primary/10 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-3/4 right-1/4 w-48 h-48 bg-health-secondary/10 rounded-full blur-3xl"
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
              scale: [1, 0.8, 1]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <motion.div
          className="container-custom relative z-10"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <motion.div
            className="text-center max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Hero Title */}
            <motion.h1
              className="text-fluid-3xl md:text-6xl lg:text-7xl font-bold mb-6"
              variants={itemVariants}
            >
              <span className="text-gradient">
                {t('hero.title')}
              </span>
              <br />
              <motion.span
                className="text-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                {t('hero.subtitle')}
              </motion.span>
            </motion.h1>

            {/* Hero Description */}
            <motion.p
              className="text-fluid-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              {t('hero.description')}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              variants={itemVariants}
            >
              <Button className="btn-primary group">
                <Download className="w-5 h-5 mr-2 group-hover:animate-bounce-subtle" />
                {t('hero.downloadIOS')}
              </Button>
              <Button className="btn-secondary group">
                <Download className="w-5 h-5 mr-2 group-hover:animate-bounce-subtle" />
                {t('hero.downloadAndroid')}
              </Button>
            </motion.div>

            {/* Demo Button */}
            <motion.div
              className="mb-16"
              variants={itemVariants}
            >
              <Button 
                variant="ghost" 
                className="btn-ghost group text-lg"
                size="lg"
              >
                <div className="w-12 h-12 rounded-full bg-health-primary/20 flex items-center justify-center mr-3 group-hover:bg-health-primary/30 transition-colors">
                  <Play className="w-6 h-6 text-health-primary group-hover:scale-110 transition-transform" />
                </div>
                {t('hero.playDemo')}
              </Button>
            </motion.div>

            {/* Interactive Demo Section */}
            <motion.div
              className="glass-card-elevated p-8 rounded-3xl max-w-6xl mx-auto"
              variants={itemVariants}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                {/* Phone Mockup */}
                <div className="lg:col-span-1 flex justify-center">
                  <PhoneMockup 
                    fontSize={demoFontSize} 
                    accentColor={demoAccentColor}
                  />
                </div>

                {/* Controls */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="text-center lg:text-left">
                    <h3 className="text-2xl font-bold mb-3 text-gradient">
                      Interactive Demo
                    </h3>
                    <p className="text-muted-foreground">
                      Experience how CareCompanion adapts to your preferences in real-time
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Font Size Control */}
                    <div className="glass-card p-6 rounded-2xl">
                      <FontSizeSlider 
                        value={demoFontSize}
                        onChange={setDemoFontSize}
                      />
                    </div>

                    {/* Color Scheme Control */}
                    <div className="glass-card p-6 rounded-2xl">
                      <ColorSchemeSelector 
                        selectedColor={demoAccentColor}
                        onChange={setDemoAccentColor}
                      />
                    </div>
                  </div>

                  {/* Global Customization Panel */}
                  <div className="glass-card p-6 rounded-2xl">
                    <h4 className="font-semibold mb-4">Global Preferences</h4>
                    <div className="grid grid-cols-2 gap-6">
                      {/* Font Size Control */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {t('hero.customization.fontSize')}
                        </label>
                        <div className="space-y-2">
                          {(['small', 'medium', 'large'] as const).map((size) => (
                            <button
                              key={size}
                              onClick={() => setFontSize(size)}
                              className={`w-full p-2 rounded-lg text-sm transition-all ${
                                fontSize === size
                                  ? 'bg-health-primary text-white'
                                  : 'glass-card hover:bg-white/20 dark:hover:bg-black/30'
                              }`}
                            >
                              {t(`hero.customization.${size}`)}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Color Scheme Control */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {t('hero.customization.colorScheme')}
                        </label>
                        <div className="space-y-2">
                          {(['default', 'highContrast', 'custom'] as const).map((scheme) => (
                            <button
                              key={scheme}
                              onClick={() => setColorScheme(scheme)}
                              className={`w-full p-2 rounded-lg text-sm transition-all ${
                                colorScheme === scheme
                                  ? 'bg-health-primary text-white'
                                  : 'glass-card hover:bg-white/20 dark:hover:bg-black/30'
                              }`}
                            >
                              {t(`hero.customization.${scheme}`)}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronRight className="w-6 h-6 text-health-primary rotate-90" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-card/50">
        <motion.div
          className="container-custom"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            className="text-center mb-16"
            variants={itemVariants}
          >
            <h2 className="text-fluid-2xl font-bold mb-4 text-gradient">
              {t('features.title')}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.titleKey}
                className="glass-card p-6 rounded-2xl group hover:scale-105 transition-all duration-300 cursor-pointer"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t(feature.descriptionKey)}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Demo Section */}
      <section className="section-padding">
        <motion.div
          className="container-custom text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            className="max-w-3xl mx-auto"
            variants={itemVariants}
          >
            <div className="relative glass-card-elevated rounded-3xl overflow-hidden group cursor-pointer">
              <div className="aspect-video bg-gradient-health opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform"
                  whileHover={{ scale: 1.1 }}
                  animate={{ 
                    boxShadow: [
                      "0 0 0 0 rgba(6, 182, 212, 0.4)",
                      "0 0 0 20px rgba(6, 182, 212, 0)",
                      "0 0 0 0 rgba(6, 182, 212, 0)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Play className="w-8 h-8 text-white ml-1" />
                </motion.div>
              </div>
            </div>
            <motion.h3
              className="text-2xl font-bold mt-8 mb-4 text-foreground"
              variants={itemVariants}
            >
              {t('demo.title')}
            </motion.h3>
            <motion.p
              className="text-muted-foreground"
              variants={itemVariants}
            >
              {t('demo.description')}
            </motion.p>
          </motion.div>
        </motion.div>
      </section>

      {/* Waitlist Section */}
      <section className="section-padding bg-card/50">
        <motion.div
          className="container-custom"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            className="text-center max-w-2xl mx-auto"
            variants={itemVariants}
          >
            <h2 className="text-fluid-2xl font-bold mb-4 text-gradient">
              {t('waitlist.title')}
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              {t('waitlist.subtitle')}
            </p>

            <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('waitlist.emailPlaceholder')}
                  className="w-full h-12 glass-card border-0 focus:ring-2 focus:ring-health-primary"
                  required
                />
              </div>
              <Button
                type="submit"
                className="btn-primary h-12 px-8"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  t('waitlist.notifyMe')
                )}
              </Button>
            </form>
          </motion.div>
        </motion.div>
      </section>
    </MainLayout>
  );
};

export default Index;
