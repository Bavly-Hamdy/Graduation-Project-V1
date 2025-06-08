
import React from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import { useI18n } from '@/contexts/I18nContext';

const Terms = () => {
  const { language } = useI18n();

  return (
    <MainLayout>
      <div className="container-custom max-w-4xl mx-auto section-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-muted-foreground">
              Please read these terms carefully before using our service
            </p>
          </div>

          <div className="glass-card p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-health-primary mb-4">
                Welcome
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-health-primary mb-4">
                Use of Service
              </h2>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="text-health-primary mr-2">•</span>
                    Service is intended for health-related inquiries only
                  </li>
                  <li className="flex items-start">
                    <span className="text-health-primary mr-2">•</span>
                    Information provided is for educational purposes
                  </li>
                  <li className="flex items-start">
                    <span className="text-health-primary mr-2">•</span>
                    Not a substitute for professional medical advice
                  </li>
                  <li className="flex items-start">
                    <span className="text-health-primary mr-2">•</span>
                    Users must be 18 years or older
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-health-primary mb-4">
                User Obligations
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p className="flex items-start">
                  <span className="text-health-primary mr-2">•</span>
                  Provide accurate and truthful information
                </p>
                <p className="flex items-start">
                  <span className="text-health-primary mr-2">•</span>
                  Use the service responsibly and ethically
                </p>
                <p className="flex items-start">
                  <span className="text-health-primary mr-2">•</span>
                  Respect intellectual property rights
                </p>
                <p className="flex items-start">
                  <span className="text-health-primary mr-2">•</span>
                  Report any technical issues or concerns
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-health-primary mb-4">
                Intellectual Property
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-health-primary mb-4">
                Limitation of Liability
              </h2>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.
                </p>
                <div className="p-4 bg-health-warning/10 rounded-lg border border-health-warning/20">
                  <p className="text-sm text-muted-foreground">
                    <strong>Important Disclaimer:</strong> This service provides general health information for educational purposes only and is not intended to diagnose, treat, cure, or prevent any disease. Always consult with qualified healthcare professionals for medical advice.
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.
                </p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Terms;
