
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { useI18n } from '@/contexts/I18nContext';
import { Menu, X, Sun, Moon, Globe, ChevronDown, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
    { key: 'home', href: '/' },
    { key: 'about', href: '/about' },
    { key: 'chatbot', href: '/chatbot' },
    { key: 'contact', href: '/contact' }
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
          ? 'h-16 glass-card-elevated' 
          : 'h-20 bg-transparent'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-full">
          {/* Logo & Brand */}
          <motion.div 
            className="flex items-center space-x-3 rtl:space-x-reverse group cursor-pointer"
            whileHover={{ x: direction === 'rtl' ? -4 : 4 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-10 h-10 bg-gradient-health rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <div className="relative">
              <h1 className="text-xl font-bold text-gradient">
                {t('app.name')}
              </h1>
              <motion.div
                className="absolute -bottom-1 left-0 h-0.5 bg-gradient-health rounded-full"
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.key}
                href={link.href}
                className="relative text-foreground hover:text-health-primary transition-colors duration-300 font-medium group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {t(`navigation.${link.key}`)}
                <motion.div
                  className="absolute -bottom-1 left-0 h-0.5 bg-health-primary rounded-full"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
          </nav>

          {/* Theme & Language Controls */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-full glass-card hover:bg-white/20 dark:hover:bg-black/30 transition-all duration-300 focus-ring"
              whileHover={{ scale: 1.1 }}
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
              className="flex items-center space-x-1 rtl:space-x-reverse p-2 rounded-full glass-card hover:bg-white/20 dark:hover:bg-black/30 transition-all duration-300 focus-ring"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Switch to ${language === 'en' ? 'Arabic' : 'English'}`}
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">
                {language.toUpperCase()}
              </span>
            </motion.button>

            {/* Auth Buttons - Desktop */}
            <div className="hidden md:flex items-center space-x-3 rtl:space-x-reverse">
              <Button variant="ghost" className="btn-ghost">
                {t('navigation.login')}
              </Button>
              <Button className="btn-primary">
                {t('navigation.signup')}
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-full glass-card hover:bg-white/20 dark:hover:bg-black/30 transition-all duration-300 focus-ring"
              whileHover={{ scale: 1.1 }}
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`md:hidden glass-card-elevated border-t border-white/10 ${
              direction === 'rtl' ? 'slide-in-left' : 'slide-in-right'
            }`}
          >
            <div className="container-custom py-4">
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.key}
                    href={link.href}
                    className="text-lg font-medium text-foreground hover:text-health-primary transition-colors duration-300 py-2"
                    initial={{ opacity: 0, x: direction === 'rtl' ? 50 : -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t(`navigation.${link.key}`)}
                  </motion.a>
                ))}
                
                <div className="flex flex-col space-y-3 pt-4 border-t border-white/10">
                  <Button variant="ghost" className="btn-ghost justify-start">
                    {t('navigation.login')}
                  </Button>
                  <Button className="btn-primary justify-start">
                    {t('navigation.signup')}
                  </Button>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
