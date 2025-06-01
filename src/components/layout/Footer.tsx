
import React from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/contexts/I18nContext';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  const { t, direction } = useI18n();

  const quickLinks = [
    { key: 'home', href: '/' },
    { key: 'about', href: '/about' },
    { key: 'chatbot', href: '/chatbot' },
    { key: 'contact', href: '/contact' },
    { key: 'privacy', href: '/privacy' },
    { key: 'terms', href: '/terms' }
  ];

  const socialLinks = [
    { 
      name: 'Facebook', 
      icon: Facebook, 
      href: 'https://facebook.com',
      color: 'hover:text-blue-500'
    },
    { 
      name: 'Twitter', 
      icon: Twitter, 
      href: 'https://twitter.com',
      color: 'hover:text-cyan-400'
    },
    { 
      name: 'LinkedIn', 
      icon: Linkedin, 
      href: 'https://linkedin.com',
      color: 'hover:text-blue-600'
    },
    { 
      name: 'Instagram', 
      icon: Instagram, 
      href: 'https://instagram.com',
      color: 'hover:text-pink-500'
    }
  ];

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <footer className="bg-card border-t border-border">
      <motion.div
        className="container-custom section-padding"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo & Tagline */}
          <motion.div 
            className="space-y-4"
            variants={itemVariants}
          >
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-10 h-10 bg-gradient-health rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <h3 className="text-xl font-bold text-gradient">
                {t('app.name')}
              </h3>
            </div>
            <motion.p 
              className="text-muted-foreground leading-relaxed max-w-md"
              whileHover={{ color: 'hsl(var(--health-primary))' }}
              transition={{ duration: 0.3 }}
            >
              {t('app.tagline')}
            </motion.p>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            className="space-y-4"
            variants={itemVariants}
          >
            <h4 className="text-lg font-semibold text-foreground">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <motion.li 
                  key={link.key}
                  initial={{ opacity: 0, x: direction === 'rtl' ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-health-primary transition-all duration-300 relative group"
                  >
                    {t(`navigation.${link.key}`) || t(`footer.${link.key}`)}
                    <motion.div
                      className="absolute -bottom-1 left-0 h-0.5 bg-health-primary rounded-full"
                      initial={{ width: 0 }}
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Social Links */}
          <motion.div 
            className="space-y-4"
            variants={itemVariants}
          >
            <h4 className="text-lg font-semibold text-foreground">
              {t('footer.social')}
            </h4>
            <div className="flex space-x-4 rtl:space-x-reverse">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-full glass-card transition-all duration-300 ${social.color} group`}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  aria-label={`Visit our ${social.name}`}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="pt-8 border-t border-border"
          variants={itemVariants}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <motion.p 
              className="text-muted-foreground text-center md:text-left"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              {t('footer.copyright')}
            </motion.p>
            
            <motion.div
              className="flex space-x-6 rtl:space-x-reverse"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <a
                href="/privacy"
                className="text-muted-foreground hover:text-health-primary transition-colors duration-300"
              >
                {t('footer.privacy')}
              </a>
              <a
                href="/terms"
                className="text-muted-foreground hover:text-health-primary transition-colors duration-300"
              >
                {t('footer.terms')}
              </a>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;
