
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { useI18n } from '@/contexts/I18nContext';
import { Menu, X, Sun, Moon, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, changeLanguage, t, direction } = useI18n();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { key: 'home', href: '/', label: 'Home' },
    { key: 'about', href: '/about', label: 'About' },
    { key: 'chatbot', href: '/chatbot', label: 'Chatbot' },
    { key: 'contact', href: '/contact', label: 'Contact' }
  ];

  const secondaryLinks = [
    { key: 'privacy', href: '/privacy', label: 'Privacy' },
    { key: 'terms', href: '/terms', label: 'Terms' }
  ];

  const handleLanguageToggle = () => {
    changeLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'h-16 backdrop-blur-lg bg-background/80 border-b border-border shadow-sm' 
          : 'h-20 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-full">
          {/* Logo & Brand - Centered on mobile, left on desktop */}
          <motion.div 
            className="flex items-center space-x-3 rtl:space-x-reverse group cursor-pointer"
            whileHover={{ x: direction === 'rtl' ? -4 : 4 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-health-primary to-health-secondary rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <div className="relative">
              <h1 className="text-xl font-bold bg-gradient-to-r from-health-primary to-health-secondary bg-clip-text text-transparent">
                CareCompanion
              </h1>
              <motion.div
                className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-health-primary to-health-secondary rounded-full"
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>

          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden lg:flex items-center space-x-8 rtl:space-x-reverse">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.key}
                href={link.href}
                className="relative text-foreground hover:text-health-primary transition-colors duration-300 font-medium group py-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {link.label}
                <motion.div
                  className="absolute -bottom-1 left-0 h-0.5 bg-health-primary rounded-full"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
          </nav>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            {/* Desktop Secondary Links */}
            <div className="hidden lg:flex items-center space-x-4 rtl:space-x-reverse mr-4">
              {secondaryLinks.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-health-primary transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-background/50 backdrop-blur-sm border border-border hover:bg-background/80 transition-all duration-300 focus-ring"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </motion.div>
            </motion.button>

            {/* Language Toggle */}
            <motion.button
              onClick={handleLanguageToggle}
              className="flex items-center space-x-1 rtl:space-x-reverse px-3 py-2 rounded-xl bg-background/50 backdrop-blur-sm border border-border hover:bg-background/80 transition-all duration-300 focus-ring"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Switch to ${language === 'en' ? 'Arabic' : 'English'}`}
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">
                {language.toUpperCase()}
              </span>
            </motion.button>

            {/* Mobile Menu Toggle */}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-background/50 backdrop-blur-sm border border-border hover:bg-background/80 transition-all duration-300 focus-ring"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle menu"
            >
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: isMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </motion.div>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-16 lg:hidden bg-background/95 backdrop-blur-lg z-40"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="container mx-auto px-4 py-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Main Navigation */}
              <nav className="space-y-6 mb-8">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.key}
                    href={link.href}
                    className="block text-2xl font-semibold text-foreground hover:text-health-primary transition-colors duration-300 py-3 border-b border-border/30"
                    initial={{ opacity: 0, x: direction === 'rtl' ? 50 : -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </nav>

              {/* Secondary Links */}
              <div className="pt-6 border-t border-border/30">
                <div className="grid grid-cols-2 gap-4">
                  {secondaryLinks.map((link, index) => (
                    <motion.a
                      key={link.key}
                      href={link.href}
                      className="text-center py-3 px-4 rounded-xl bg-background/50 border border-border text-muted-foreground hover:text-health-primary hover:bg-background/80 transition-all duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
