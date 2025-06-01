
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/contexts/I18nContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send,
  Building
} from 'lucide-react';

const Contact = () => {
  const { t, language } = useI18n();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: language === 'en' ? "Missing Information" : "معلومات مفقودة",
        description: language === 'en' 
          ? "Please fill in all fields before sending."
          : "يرجى ملء جميع الحقول قبل الإرسال.",
        variant: "destructive"
      });
      return;
    }

    // Create mailto URL
    const emailBody = `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`;
    const mailtoUrl = `mailto:Bavly.morgan2030@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Open email client
    window.location.href = mailtoUrl;
    
    // Show success toast
    toast({
      title: language === 'en' ? "Email Client Opened" : "تم فتح عميل البريد الإلكتروني",
      description: language === 'en' 
        ? "Your email client has opened. Send the message to contact us."
        : "تم فتح عميل البريد الإلكتروني لديك. أرسل الرسالة للاتصال بنا."
    });

    // Clear form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      label: language === 'en' ? 'Email' : 'البريد الإلكتروني',
      value: 'Bavly.morgan2030@gmail.com',
      color: 'text-health-primary'
    },
    {
      icon: Phone,
      label: language === 'en' ? 'Phone' : 'الهاتف',
      value: '+20-123-456-7890',
      color: 'text-health-secondary'
    },
    {
      icon: MapPin,
      label: language === 'en' ? 'Office' : 'المكتب',
      value: language === 'en' 
        ? 'Software Engineering Department, King Salman International University'
        : 'قسم هندسة البرمجيات، جامعة الملك سلمان الدولية',
      color: 'text-health-success'
    }
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="section-padding">
        <motion.div
          className="container-custom"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="text-center mb-16"
            variants={itemVariants}
          >
            <h1 className="text-fluid-3xl font-bold mb-6">
              <span className="text-gradient">
                {t('contact.title')}
              </span>
            </h1>
            <p className="text-fluid-lg text-muted-foreground max-w-2xl mx-auto">
              {language === 'en'
                ? "Have questions? We're here to help. Send us a message, and we'll respond via email."
                : "هل لديك أسئلة؟ نحن هنا للمساعدة. أرسل لنا رسالة وسنرد عبر البريد الإلكتروني."}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <motion.div
              className="glass-card-elevated p-8 rounded-3xl"
              variants={itemVariants}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-health-primary/10 rounded-2xl flex items-center justify-center mr-4">
                  <Send className="w-6 h-6 text-health-primary" />
                </div>
                <h2 className="text-2xl font-bold">
                  {language === 'en' ? 'Send Message' : 'إرسال رسالة'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div className="relative">
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder=" "
                    className="input-floating peer"
                    required
                  />
                  <label className="label-floating">
                    {t('contact.form.name')}
                  </label>
                </div>

                {/* Email Field */}
                <div className="relative">
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder=" "
                    className="input-floating peer"
                    required
                  />
                  <label className="label-floating">
                    {t('contact.form.email')}
                  </label>
                </div>

                {/* Subject Field */}
                <div className="relative">
                  <Input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder=" "
                    className="input-floating peer"
                    required
                  />
                  <label className="label-floating">
                    {t('contact.form.subject')}
                  </label>
                </div>

                {/* Message Field */}
                <div className="relative">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder=" "
                    rows={5}
                    className="input-floating peer resize-none"
                    required
                  />
                  <label className="label-floating">
                    {t('contact.form.message')}
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="btn-primary w-full group"
                >
                  <Send className="w-5 h-5 mr-2 group-hover:animate-bounce-subtle" />
                  {t('contact.form.submit')}
                </Button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              className="space-y-8"
              variants={itemVariants}
            >
              <div className="glass-card p-8 rounded-3xl">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-health-secondary/10 rounded-2xl flex items-center justify-center mr-4">
                    <Building className="w-6 h-6 text-health-secondary" />
                  </div>
                  <h2 className="text-2xl font-bold">
                    {language === 'en' ? 'Contact Information' : 'معلومات الاتصال'}
                  </h2>
                </div>

                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start group cursor-pointer"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className={`w-10 h-10 ${info.color.replace('text-', 'bg-')}/10 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`}>
                        <info.icon className={`w-5 h-5 ${info.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{info.label}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {info.value}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Additional Information */}
              <motion.div
                className="glass-card p-6 rounded-2xl"
                variants={itemVariants}
              >
                <h3 className="font-semibold mb-3 text-health-primary">
                  {language === 'en' ? 'Response Time' : 'وقت الاستجابة'}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {language === 'en'
                    ? "We typically respond to emails within 24-48 hours during business days. For urgent medical concerns, please consult a healthcare professional immediately."
                    : "نرد عادة على رسائل البريد الإلكتروني خلال 24-48 ساعة أثناء أيام العمل. للمخاوف الطبية العاجلة، يرجى استشارة أخصائي رعاية صحية فورًا."}
                </p>
              </motion.div>

              <motion.div
                className="glass-card p-6 rounded-2xl"
                variants={itemVariants}
              >
                <h3 className="font-semibold mb-3 text-health-secondary">
                  {language === 'en' ? 'Office Hours' : 'ساعات العمل'}
                </h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>{language === 'en' ? 'Sunday - Thursday' : 'الأحد - الخميس'}</span>
                    <span>9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'en' ? 'Friday - Saturday' : 'الجمعة - السبت'}</span>
                    <span>{language === 'en' ? 'Closed' : 'مغلق'}</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </MainLayout>
  );
};

export default Contact;
