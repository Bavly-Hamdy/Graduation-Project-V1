
import React from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import { useI18n } from '@/contexts/I18nContext';

const Privacy = () => {
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
              Privacy Policy
            </h1>
            <p className="text-xl text-muted-foreground">
              Your privacy and data protection are our top priorities
            </p>
          </div>

          <div className="glass-card p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-health-primary mb-4">
                Introduction
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-health-primary mb-4">
                Data We Collect
              </h2>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="text-health-primary mr-2">•</span>
                    Chat conversations and message history
                  </li>
                  <li className="flex items-start">
                    <span className="text-health-primary mr-2">•</span>
                    Session preferences and settings
                  </li>
                  <li className="flex items-start">
                    <span className="text-health-primary mr-2">•</span>
                    Usage analytics and performance data
                  </li>
                  <li className="flex items-start">
                    <span className="text-health-primary mr-2">•</span>
                    Device and browser information
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-health-primary mb-4">
                How We Use Data
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-health-primary mb-4">
                Your Rights
              </h2>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="text-health-primary mr-2">•</span>
                    Right to access your personal data
                  </li>
                  <li className="flex items-start">
                    <span className="text-health-primary mr-2">•</span>
                    Right to correct inaccurate information
                  </li>
                  <li className="flex items-start">
                    <span className="text-health-primary mr-2">•</span>
                    Right to delete your data
                  </li>
                  <li className="flex items-start">
                    <span className="text-health-primary mr-2">•</span>
                    Right to data portability
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-health-primary mb-4">
                Contact Us
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.
              </p>
              <div className="mt-4 p-4 bg-health-primary/10 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  For privacy-related inquiries, please contact our support team at privacy@healthapp.com
                </p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Privacy;
