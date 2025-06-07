
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { realTimeDb, ref, onValue } from '@/config/firebaseConfig';
import { MessageCircle, Clock, ArrowLeft } from 'lucide-react';

interface ChatSession {
  id: string;
  createdAt: number;
  updatedAt: number;
  preview: string;
  messageCount: number;
}

const History = () => {
  const navigate = useNavigate();
  const { language } = useI18n();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = "demo"; // In a real app, this would come from auth

  useEffect(() => {
    const sessionsRef = ref(realTimeDb, `users/${userId}/chatSessions`);
    
    onValue(sessionsRef, (snapshot) => {
      const sessionsData = snapshot.val();
      if (sessionsData) {
        const sessionsList: ChatSession[] = [];
        
        Object.entries(sessionsData).forEach(([sessionId, sessionData]: [string, any]) => {
          const messages = sessionData.messages || {};
          const metadata = sessionData.metadata || {};
          
          // Get first few messages for preview
          const messageEntries = Object.entries(messages);
          const firstMessages = messageEntries
            .sort(([, a]: [string, any], [, b]: [string, any]) => a.timestamp - b.timestamp)
            .slice(0, 3)
            .map(([, msg]: [string, any]) => msg.content)
            .join(' • ');
          
          sessionsList.push({
            id: sessionId,
            createdAt: metadata.createdAt || Date.now(),
            updatedAt: metadata.updatedAt || metadata.createdAt || Date.now(),
            preview: firstMessages || (language === 'en' ? 'New conversation' : 'محادثة جديدة'),
            messageCount: messageEntries.length
          });
        });
        
        // Sort by most recent first
        sessionsList.sort((a, b) => b.updatedAt - a.updatedAt);
        setSessions(sessionsList);
      } else {
        setSessions([]);
      }
      setLoading(false);
    });
  }, [userId, language]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return language === 'en' ? 'Today' : 'اليوم';
    } else if (diffInDays === 1) {
      return language === 'en' ? 'Yesterday' : 'أمس';
    } else if (diffInDays < 7) {
      return language === 'en' ? `${diffInDays} days ago` : `منذ ${diffInDays} أيام`;
    } else {
      return date.toLocaleDateString(language === 'en' ? 'en-US' : 'ar-SA');
    }
  };

  const handleSessionClick = (sessionId: string) => {
    navigate(`/chat/${sessionId}`);
  };

  return (
    <MainLayout>
      <div className="container-custom max-w-4xl mx-auto pt-8 pb-4">
        {/* Header */}
        <motion.div
          className="flex items-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/chatbot')}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {language === 'en' ? 'Back to Chat' : 'العودة للمحادثة'}
          </Button>
          <div>
            <h1 className="text-fluid-2xl font-bold text-gradient">
              {language === 'en' ? 'Chat History' : 'تاريخ المحادثات'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'en' 
                ? 'View and continue your previous conversations'
                : 'اعرض واستكمل محادثاتك السابقة'}
            </p>
          </div>
        </motion.div>

        {/* Sessions List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-health-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-muted-foreground">
                {language === 'en' ? 'Loading history...' : 'جاري تحميل التاريخ...'}
              </p>
            </div>
          ) : sessions.length === 0 ? (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {language === 'en' ? 'No chat history' : 'لا يوجد تاريخ محادثات'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {language === 'en' 
                  ? 'Start your first conversation to see it here'
                  : 'ابدأ محادثتك الأولى لتراها هنا'}
              </p>
              <Button onClick={() => navigate('/chatbot')}>
                {language === 'en' ? 'Start Chatting' : 'ابدأ المحادثة'}
              </Button>
            </motion.div>
          ) : (
            sessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="glass-card p-4 rounded-lg border hover:border-health-primary transition-colors cursor-pointer"
                onClick={() => handleSessionClick(session.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageCircle className="w-4 h-4 text-health-primary flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        {session.messageCount} {language === 'en' ? 'messages' : 'رسالة'}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(session.updatedAt)}
                      </span>
                    </div>
                    <p className="text-sm line-clamp-2 text-muted-foreground">
                      {session.preview}
                    </p>
                  </div>
                  <div className="flex items-center text-muted-foreground ml-4">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default History;
