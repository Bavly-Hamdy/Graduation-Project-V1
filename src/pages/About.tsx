
import React from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/contexts/I18nContext';
import { useTheme } from '@/contexts/ThemeContext';
import MainLayout from '@/components/layout/MainLayout';
import { 
  Heart, 
  Brain, 
  Smartphone, 
  Users, 
  Calendar,
  Award,
  Target,
  Lightbulb
} from 'lucide-react';

const About = () => {
  const { t, language } = useI18n();
  const { theme } = useTheme();

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

  const projectPhases = [
    {
      phase: "Phase 1",
      phaseAr: "المرحلة الأولى",
      title: "Device Prototype",
      titleAr: "نموذج الجهاز الأولي",
      description: "Hardware development and sensor integration"
    },
    {
      phase: "Phase 2", 
      phaseAr: "المرحلة الثانية",
      title: "App Development",
      titleAr: "تطوير التطبيق",
      description: "Web and mobile application creation"
    },
    {
      phase: "Phase 3",
      phaseAr: "المرحلة الثالثة", 
      title: "AI Training & Validation",
      titleAr: "تدريب الذكاء الاصطناعي والتحقق",
      description: "Machine learning model development"
    },
    {
      phase: "Phase 4",
      phaseAr: "المرحلة الرابعة",
      title: "Testing & Deployment", 
      titleAr: "الاختبار والنشر",
      description: "Quality assurance and production release"
    }
  ];

  const features = [
    {
      icon: Heart,
      title: "Real-time Monitoring",
      titleAr: "المراقبة في الوقت الفعلي",
      description: "Continuous vitals tracking with instant alerts",
      descriptionAr: "تتبع العلامات الحيوية المستمر مع تنبيهات فورية"
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      titleAr: "رؤى مدعومة بالذكاء الاصطناعي",
      description: "Predictive health analytics and personalized recommendations",
      descriptionAr: "تحليلات صحية تنبؤية وتوصيات شخصية"
    },
    {
      icon: Smartphone,
      title: "Mobile Integration",
      titleAr: "التكامل المحمول",
      description: "Seamless connection between device and mobile app",
      descriptionAr: "اتصال سلس بين الجهاز وتطبيق الهاتف المحمول"
    }
  ];

  return (
    <MainLayout>
      {/* Hero Banner */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900' : 'bg-gradient-to-br from-blue-50 via-white to-blue-50'}`} />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/4 left-1/4 w-32 h-32 bg-health-primary/10 rounded-full blur-2xl"
            animate={{
              x: [0, 50, 0],
              y: [0, -25, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-3/4 right-1/4 w-24 h-24 bg-health-secondary/10 rounded-full blur-2xl"
            animate={{
              x: [0, -40, 0],
              y: [0, 30, 0],
              scale: [1, 0.9, 1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <motion.div
          className="container-custom relative z-10 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-fluid-3xl md:text-5xl lg:text-6xl font-bold mb-6"
            variants={itemVariants}
          >
            <span className="text-gradient">
              {t('about.title')}
            </span>
          </motion.h1>
          <motion.p
            className="text-fluid-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            {t('about.subtitle')}
          </motion.p>
        </motion.div>
      </section>

      {/* Who We Are Section */}
      <section className="section-padding bg-card/50">
        <motion.div
          className="container-custom"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-fluid-2xl font-bold mb-4 text-gradient">
              {t('about.whoWeAre.title')}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <motion.div className="glass-card p-6 rounded-2xl" variants={itemVariants}>
              <Lightbulb className="w-12 h-12 text-health-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">
                {t('about.whoWeAre.background.title')}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('about.whoWeAre.background.description')}
              </p>
            </motion.div>

            <motion.div className="glass-card p-6 rounded-2xl" variants={itemVariants}>
              <Target className="w-12 h-12 text-health-secondary mb-4" />
              <h3 className="text-xl font-semibold mb-3">
                {t('about.whoWeAre.story.title')}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('about.whoWeAre.story.description')}
              </p>
            </motion.div>

            <motion.div className="glass-card p-6 rounded-2xl" variants={itemVariants}>
              <Award className="w-12 h-12 text-health-success mb-4" />
              <h3 className="text-xl font-semibold mb-3">
                {t('about.whoWeAre.uniqueness.title')}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('about.whoWeAre.uniqueness.description')}
              </p>
            </motion.div>
          </div>

          {/* Problem Statement & Solution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants} className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-health-primary">
                  {t('about.projectIdea.title')}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {t('about.projectIdea.description')}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">
                  {t('about.solution.title')}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('about.solution.description')}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">
                  {t('about.academicContext.title')}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('about.academicContext.description')}
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <div className="glass-card-elevated p-8 rounded-3xl group hover:scale-105 transition-all duration-500">
                <div className="relative">
                  <div className="aspect-square bg-gradient-health rounded-2xl p-8 flex items-center justify-center mb-6">
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Heart className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-center">
                    CareCompanion Device
                  </h3>
                  <p className="text-muted-foreground text-center text-sm">
                    Portable health monitoring with real-time AI insights
                  </p>
                </div>
                <motion.div
                  className="absolute inset-0 bg-health-primary/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{ 
                    boxShadow: [
                      "0 0 0 0 rgba(6, 182, 212, 0.2)",
                      "0 0 0 10px rgba(6, 182, 212, 0)",
                      "0 0 0 0 rgba(6, 182, 212, 0)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Project Background Section */}
      <section className="section-padding">
        <motion.div
          className="container-custom"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-fluid-2xl font-bold mb-4 text-gradient">
              {t('about.projectBackground.title')}
            </h2>
            <p className="text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              {t('about.projectBackground.description')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="glass-card p-6 rounded-2xl group hover:scale-105 transition-all duration-300"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 bg-health-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-8 h-8 text-health-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  {language === 'en' ? feature.title : feature.titleAr}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {language === 'en' ? feature.description : feature.descriptionAr}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-card/50">
        <motion.div
          className="container-custom"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-fluid-2xl font-bold mb-4 text-gradient">
              {t('about.team.title')}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Team Members - Only show in selected language */}
            <motion.div
              className="glass-card p-6 rounded-2xl text-center group hover:scale-105 transition-all duration-300"
              variants={itemVariants}
              whileHover={{ rotateY: 5 }}
            >
              <div className="w-20 h-20 bg-gradient-health rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {t('about.team.members.bavly.name')}
              </h3>
              <p className="text-health-primary font-medium mb-3">
                {t('about.team.members.bavly.role')}
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t('about.team.members.bavly.description')}
              </p>
            </motion.div>

            <motion.div
              className="glass-card p-6 rounded-2xl text-center group hover:scale-105 transition-all duration-300"
              variants={itemVariants}
              whileHover={{ rotateY: 5 }}
            >
              <div className="w-20 h-20 bg-gradient-health rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {t('about.team.members.yahia.name')}
              </h3>
              <p className="text-health-primary font-medium mb-3">
                {t('about.team.members.yahia.role')}
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t('about.team.members.yahia.description')}
              </p>
            </motion.div>

            <motion.div
              className="glass-card p-6 rounded-2xl text-center group hover:scale-105 transition-all duration-300"
              variants={itemVariants}
              whileHover={{ rotateY: 5 }}
            >
              <div className="w-20 h-20 bg-gradient-health rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {t('about.team.members.eyad.name')}
              </h3>
              <p className="text-health-primary font-medium mb-3">
                {t('about.team.members.eyad.role')}
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t('about.team.members.eyad.description')}
              </p>
            </motion.div>
          </div>

          {/* Advisors */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-semibold text-center mb-8">{t('about.team.advisors.title')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="glass-card p-6 rounded-2xl text-center">
                <Award className="w-12 h-12 text-health-primary mx-auto mb-4" />
                <h4 className="font-semibold mb-2">{t('about.team.advisors.wael.name')}</h4>
                <p className="text-muted-foreground text-sm">
                  {t('about.team.advisors.wael.description')}
                </p>
              </div>
              <div className="glass-card p-6 rounded-2xl text-center">
                <Award className="w-12 h-12 text-health-primary mx-auto mb-4" />
                <h4 className="font-semibold mb-2">{t('about.team.advisors.mohamed.name')}</h4>
                <p className="text-muted-foreground text-sm">
                  {t('about.team.advisors.mohamed.description')}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Project Timeline */}
      <section className="section-padding">
        <motion.div
          className="container-custom"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-fluid-2xl font-bold mb-4 text-gradient">
              Project Roadmap
            </h2>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-health-primary/30"></div>
            
            <div className="space-y-12">
              {projectPhases.map((phase, index) => (
                <motion.div
                  key={index}
                  className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  variants={itemVariants}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 bg-health-primary rounded-full border-4 border-background z-10"></div>
                  
                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                    <div className="glass-card p-6 rounded-2xl">
                      <div className="text-health-primary font-semibold mb-2">
                        {language === 'en' ? phase.phase : phase.phaseAr}
                      </div>
                      <h3 className="text-xl font-bold mb-3">
                        {language === 'en' ? phase.title : phase.titleAr}
                      </h3>
                      <p className="text-muted-foreground">
                        {phase.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Technology Stack */}
      <section className="section-padding bg-card/50">
        <motion.div
          className="container-custom"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-fluid-2xl font-bold mb-4 text-gradient">
              {t('about.techStack.title')}
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              {t('about.technologies.description')}
            </p>
          </motion.div>

          <motion.div
            className="glass-card-elevated p-8 rounded-3xl max-w-4xl mx-auto"
            variants={itemVariants}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-health-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <Lightbulb className="w-6 h-6 text-health-primary" />
                </div>
                <h4 className="font-semibold">Frontend</h4>
                <p className="text-sm text-muted-foreground">React, React Native, Tailwind CSS</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-health-secondary/10 rounded-lg flex items-center justify-center mx-auto">
                  <Brain className="w-6 h-6 text-health-secondary" />
                </div>
                <h4 className="font-semibold">AI/ML</h4>
                <p className="text-sm text-muted-foreground">Gemini API, GPT Models</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-health-success/10 rounded-lg flex items-center justify-center mx-auto">
                  <Target className="w-6 h-6 text-health-success" />
                </div>
                <h4 className="font-semibold">Backend</h4>
                <p className="text-sm text-muted-foreground">Firebase, Node.js, Cloud Functions</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-health-warning/10 rounded-lg flex items-center justify-center mx-auto">
                  <Heart className="w-6 h-6 text-health-warning" />
                </div>
                <h4 className="font-semibold">Hardware</h4>
                <p className="text-sm text-muted-foreground">MAX30100, MLX90614, AD8232, MPU6050</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </MainLayout>
  );
};

export default About;
