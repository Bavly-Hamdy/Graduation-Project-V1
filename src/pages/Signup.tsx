
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/contexts/I18nContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { 
  UserPlus, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff,
  Shield,
  Check,
  X
} from 'lucide-react';

const Signup = () => {
  const { t, language } = useI18n();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailOTP, setEmailOTP] = useState(['', '', '', '', '', '']);
  const [smsOTP, setSmsOTP] = useState(['', '', '', '', '', '']);
  const [passwordStrength, setPasswordStrength] = useState(0);

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

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.firstName.trim()) errors.push('First name is required');
    if (!formData.lastName.trim()) errors.push('Last name is required');
    if (!formData.email.includes('@')) errors.push('Valid email is required');
    if (formData.phone.length < 10) errors.push('Valid phone number is required');
    if (formData.password.length < 8) errors.push('Password must be at least 8 characters');
    if (formData.password !== formData.confirmPassword) errors.push('Passwords do not match');

    return errors;
  };

  const handleGetOTP = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      toast({
        title: language === 'en' ? "Validation Error" : "خطأ في التحقق",
        description: errors[0],
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate sending OTPs
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: language === 'en' ? "OTPs Sent" : "تم إرسال رموز التحقق",
      description: language === 'en' 
        ? "Verification codes sent to your email and phone."
        : "تم إرسال رموز التحقق إلى بريدك الإلكتروني وهاتفك."
    });

    setCurrentStep(2);
    setIsLoading(false);
  };

  const handleOTPChange = (value: string, index: number, type: 'email' | 'sms') => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      if (type === 'email') {
        const newOTP = [...emailOTP];
        newOTP[index] = value;
        setEmailOTP(newOTP);
        
        // Auto-focus next field
        if (value && index < 5) {
          const nextField = document.getElementById(`email-otp-${index + 1}`);
          nextField?.focus();
        }
      } else {
        const newOTP = [...smsOTP];
        newOTP[index] = value;
        setSmsOTP(newOTP);
        
        // Auto-focus next field
        if (value && index < 5) {
          const nextField = document.getElementById(`sms-otp-${index + 1}`);
          nextField?.focus();
        }
      }
    }
  };

  const handleOTPKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number, type: 'email' | 'sms') => {
    if (e.key === 'Backspace' && !(e.target as HTMLInputElement).value && index > 0) {
      const prevField = document.getElementById(`${type}-otp-${index - 1}`);
      prevField?.focus();
    }
  };

  const handleCompleteRegistration = async () => {
    const emailCode = emailOTP.join('');
    const smsCode = smsOTP.join('');
    
    if (emailCode.length !== 6 || smsCode.length !== 6) {
      toast({
        title: language === 'en' ? "Incomplete OTP" : "رمز التحقق غير مكتمل",
        description: language === 'en' 
          ? "Please enter both 6-digit verification codes."
          : "يرجى إدخال كلا الرمزين المكونين من 6 أرقام.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate OTP verification and account creation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate different scenarios
      if (emailCode === '123456' || smsCode === '123456') {
        throw new Error('Invalid OTP');
      }

      // Simulate successful registration
      const user = {
        uid: 'newuser123',
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone
      };

      localStorage.setItem('user', JSON.stringify(user));
      
      toast({
        title: t('auth.signup.welcome', { name: formData.firstName }),
        description: language === 'en' 
          ? "Your account has been created successfully."
          : "تم إنشاء حسابك بنجاح."
      });

      // Redirect to home
      window.location.href = '/';
    } catch (error) {
      toast({
        title: language === 'en' ? "Verification Failed" : "فشل التحقق",
        description: t('auth.otp.invalid'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async (type: 'email' | 'sms') => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: language === 'en' ? "OTP Resent" : "تم إعادة إرسال رمز التحقق",
      description: language === 'en' 
        ? `New verification code sent to your ${type}.`
        : `تم إرسال رمز تحقق جديد إلى ${type === 'email' ? 'بريدك الإلكتروني' : 'هاتفك'}.`
    });

    if (type === 'email') {
      setEmailOTP(['', '', '', '', '', '']);
    } else {
      setSmsOTP(['', '', '', '', '', '']);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return language === 'en' ? 'Weak' : 'ضعيف';
    if (passwordStrength <= 3) return language === 'en' ? 'Medium' : 'متوسط';
    return language === 'en' ? 'Strong' : 'قوي';
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
          <div className="max-w-lg mx-auto">
            {currentStep === 1 ? (
              /* Step 1: Registration Form */
              <motion.div
                className="glass-card-elevated p-8 rounded-3xl"
                variants={itemVariants}
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-health-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <UserPlus className="w-8 h-8 text-health-primary" />
                  </div>
                  <h1 className="text-2xl font-bold mb-2">
                    {t('auth.signup.title')}
                  </h1>
                  <p className="text-muted-foreground">
                    {t('auth.signup.subtitle')}
                  </p>
                </div>

                {/* Form */}
                <form className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <Input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder=" "
                        className="input-floating peer pl-12"
                        required
                      />
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground peer-focus:text-health-primary transition-colors" />
                      <label className="label-floating ml-8">
                        {t('auth.signup.firstName')}
                      </label>
                    </div>
                    <div className="relative">
                      <Input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder=" "
                        className="input-floating peer pl-12"
                        required
                      />
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground peer-focus:text-health-primary transition-colors" />
                      <label className="label-floating ml-8">
                        {t('auth.signup.lastName')}
                      </label>
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="relative">
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder=" "
                      className="input-floating peer pl-12"
                      required
                    />
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground peer-focus:text-health-primary transition-colors" />
                    <label className="label-floating ml-8">
                      {t('auth.signup.email')}
                    </label>
                  </div>

                  {/* Phone Field */}
                  <div className="relative">
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder=" "
                      className="input-floating peer pl-12"
                      required
                    />
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground peer-focus:text-health-primary transition-colors" />
                    <label className="label-floating ml-8">
                      {t('auth.signup.phone')}
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
                      {t('auth.signup.password')}
                    </label>
                    
                    {/* Password Strength Indicator */}
                    {formData.password && (
                      <div className="mt-2">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-muted rounded-full h-1">
                            <div 
                              className={`h-1 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                              style={{ width: `${(passwordStrength / 5) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {getPasswordStrengthText()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder=" "
                      className={`input-floating peer pl-12 pr-12 ${
                        formData.confirmPassword && formData.password !== formData.confirmPassword 
                          ? 'border-red-500' : ''
                      }`}
                      required
                    />
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground peer-focus:text-health-primary transition-colors" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-health-primary transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                    <label className="label-floating ml-8">
                      {t('auth.signup.confirmPassword')}
                    </label>
                    
                    {/* Password Match Indicator */}
                    {formData.confirmPassword && (
                      <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
                        {formData.password === formData.confirmPassword ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Get OTP Button */}
                  <Button
                    type="button"
                    onClick={handleGetOTP}
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
                      <Shield className="w-5 h-5 mr-2 group-hover:animate-bounce-subtle" />
                    )}
                    {isLoading ? (
                      language === 'en' ? 'Sending OTPs...' : 'جاري إرسال رموز التحقق...'
                    ) : (
                      t('auth.signup.getOTP')
                    )}
                  </Button>
                </form>

                {/* Login Link */}
                <div className="text-center mt-6 pt-6 border-t border-border">
                  <p className="text-muted-foreground">
                    {language === 'en' ? "Already have an account? " : "لديك حساب بالفعل؟ "}
                    <Link 
                      to="/login" 
                      className="text-health-primary hover:underline font-medium"
                    >
                      {t('navigation.login')}
                    </Link>
                  </p>
                </div>
              </motion.div>
            ) : (
              /* Step 2: OTP Verification */
              <motion.div
                className="glass-card-elevated p-8 rounded-3xl"
                variants={itemVariants}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-health-secondary/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-health-secondary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">
                    {language === 'en' ? 'Verify Your Account' : 'تحقق من حسابك'}
                  </h2>
                  <p className="text-muted-foreground">
                    {t('auth.otp.title')}
                  </p>
                </div>

                {/* OTP Fields */}
                <div className="space-y-6">
                  {/* Email OTP */}
                  <div>
                    <label className="block text-sm font-medium mb-3">
                      {language === 'en' ? 'Email Verification Code' : 'رمز التحقق من البريد الإلكتروني'}
                    </label>
                    <div className="flex space-x-2 justify-center">
                      {emailOTP.map((digit, index) => (
                        <Input
                          key={index}
                          id={`email-otp-${index}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOTPChange(e.target.value, index, 'email')}
                          onKeyDown={(e) => handleOTPKeyDown(e, index, 'email')}
                          className="w-12 h-12 text-center text-lg font-bold border-2 rounded-lg focus:border-health-primary"
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => resendOTP('email')}
                      className="text-sm text-health-primary hover:underline mt-2 block mx-auto"
                    >
                      {language === 'en' ? 'Resend Email OTP' : 'إعادة إرسال رمز البريد الإلكتروني'}
                    </button>
                  </div>

                  {/* SMS OTP */}
                  <div>
                    <label className="block text-sm font-medium mb-3">
                      {language === 'en' ? 'SMS Verification Code' : 'رمز التحقق من الرسائل النصية'}
                    </label>
                    <div className="flex space-x-2 justify-center">
                      {smsOTP.map((digit, index) => (
                        <Input
                          key={index}
                          id={`sms-otp-${index}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOTPChange(e.target.value, index, 'sms')}
                          onKeyDown={(e) => handleOTPKeyDown(e, index, 'sms')}
                          className="w-12 h-12 text-center text-lg font-bold border-2 rounded-lg focus:border-health-primary"
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => resendOTP('sms')}
                      className="text-sm text-health-primary hover:underline mt-2 block mx-auto"
                    >
                      {language === 'en' ? 'Resend SMS OTP' : 'إعادة إرسال رمز الرسائل النصية'}
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 mt-8">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    {t('common.back')}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCompleteRegistration}
                    className="btn-primary flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      <UserPlus className="w-5 h-5 mr-2" />
                    )}
                    {isLoading ? (
                      language === 'en' ? 'Creating Account...' : 'جاري إنشاء الحساب...'
                    ) : (
                      t('auth.signup.completeRegistration')
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </section>
    </MainLayout>
  );
};

export default Signup;
