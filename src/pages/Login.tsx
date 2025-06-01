
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/contexts/I18nContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { 
  LogIn, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  AlertCircle
} from 'lucide-react';

const Login = () => {
  const { t, language } = useI18n();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isEmail = (str: string) => {
    return str.includes('@') && str.includes('.');
  };

  const simulateLogin = async (emailOrPhone: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate different scenarios
    if (password === '123456') {
      throw new Error('Invalid credentials');
    }
    
    // Simulate successful login
    return {
      uid: 'user123',
      email: isEmail(emailOrPhone) ? emailOrPhone : 'user@example.com',
      firstName: 'John',
      lastName: 'Doe'
    };
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.emailOrPhone || !formData.password) {
      toast({
        title: language === 'en' ? "Missing Information" : "معلومات مفقودة",
        description: language === 'en' 
          ? "Please fill in all fields."
          : "يرجى ملء جميع الحقول.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const user = await simulateLogin(formData.emailOrPhone, formData.password);
      
      // Store user data (in real app, this would be handled by Firebase Auth)
      localStorage.setItem('user', JSON.stringify(user));
      
      toast({
        title: t('auth.login.welcomeBack', { name: user.firstName }),
        description: language === 'en' 
          ? "You have successfully logged in."
          : "تم تسجيل الدخول بنجاح."
      });

      // Redirect to home
      window.location.href = '/';
    } catch (error) {
      toast({
        title: language === 'en' ? "Login Failed" : "فشل تسجيل الدخول",
        description: t('auth.login.invalidCredentials'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail) {
      toast({
        title: language === 'en' ? "Email Required" : "البريد الإلكتروني مطلوب",
        description: language === 'en' 
          ? "Please enter your email address."
          : "يرجى إدخال عنوان بريدك الإلكتروني.",
        variant: "destructive"
      });
      return;
    }

    // Simulate sending reset email
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: t('auth.forgotPassword.success'),
      description: language === 'en' 
        ? "If an account with this email exists, you will receive a reset link."
        : "إذا كان هناك حساب بهذا البريد الإلكتروني، ستتلقى رابط إعادة التعيين."
    });

    setShowForgotPassword(false);
    setResetEmail('');
  };

  return (
    <MainLayout>
      <section className="min-h-screen flex items-center justify-center section-padding">
        <motion.div
          className="container-custom"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-md mx-auto">
            {/* Login Form */}
            {!showForgotPassword ? (
              <motion.div
                className="glass-card-elevated p-8 rounded-3xl"
                variants={itemVariants}
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-health-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <LogIn className="w-8 h-8 text-health-primary" />
                  </div>
                  <h1 className="text-2xl font-bold mb-2">
                    {t('auth.login.title')}
                  </h1>
                  <p className="text-muted-foreground">
                    {t('auth.login.subtitle')}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                  {/* Email or Phone Field */}
                  <div className="relative">
                    <Input
                      type="text"
                      name="emailOrPhone"
                      value={formData.emailOrPhone}
                      onChange={handleInputChange}
                      placeholder=" "
                      className="input-floating peer pl-12"
                      required
                    />
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground peer-focus:text-health-primary transition-colors" />
                    <label className="label-floating ml-8">
                      {t('auth.login.emailOrPhone')}
                    </label>
                  </div>

                  {/* Password Field */}
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder=" "
                      className="input-floating peer pl-12 pr-12"
                      required
                    />
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground peer-focus:text-health-primary transition-colors" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-health-primary transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                    <label className="label-floating ml-8">
                      {t('auth.login.password')}
                    </label>
                  </div>

                  {/* Forgot Password Link */}
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-health-primary hover:underline focus:outline-none"
                    >
                      {t('auth.login.forgotPassword')}
                    </button>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="btn-primary w-full group"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      <LogIn className="w-5 h-5 mr-2 group-hover:animate-bounce-subtle" />
                    )}
                    {isLoading ? (
                      language === 'en' ? 'Signing In...' : 'جاري تسجيل الدخول...'
                    ) : (
                      t('auth.login.submit')
                    )}
                  </Button>
                </form>

                {/* Sign Up Link */}
                <div className="text-center mt-6 pt-6 border-t border-border">
                  <p className="text-muted-foreground">
                    {language === 'en' ? "Don't have an account? " : "ليس لديك حساب؟ "}
                    <Link 
                      to="/signup" 
                      className="text-health-primary hover:underline font-medium"
                    >
                      {t('navigation.signup')}
                    </Link>
                  </p>
                </div>
              </motion.div>
            ) : (
              /* Forgot Password Modal */
              <motion.div
                className="glass-card-elevated p-8 rounded-3xl"
                variants={itemVariants}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-health-warning/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-health-warning" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">
                    {t('auth.forgotPassword.title')}
                  </h2>
                  <p className="text-muted-foreground">
                    {language === 'en' 
                      ? "Enter your email address and we'll send you a reset link."
                      : "أدخل عنوان بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين."}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleForgotPassword} className="space-y-6">
                  <div className="relative">
                    <Input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder=" "
                      className="input-floating peer pl-12"
                      required
                    />
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground peer-focus:text-health-primary transition-colors" />
                    <label className="label-floating ml-8">
                      {t('auth.forgotPassword.email')}
                    </label>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowForgotPassword(false)}
                      className="flex-1"
                    >
                      {t('common.cancel')}
                    </Button>
                    <Button
                      type="submit"
                      className="btn-primary flex-1"
                    >
                      {t('auth.forgotPassword.send')}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>
        </motion.div>
      </section>
    </MainLayout>
  );
};

export default Login;
