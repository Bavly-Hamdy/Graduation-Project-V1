
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { realTimeDb, ref, onValue, remove } from '@/config/firebaseConfig';
import { Save, ArrowLeft, Copy, Trash2, User, Bot } from 'lucide-react';

interface SavedMessage {
  id: string;
  firebaseId: string;
  content: string;
  timestamp: number;
  type: 'user' | 'bot';
}

const SavedMessages = () => {
  const navigate = useNavigate();
  const { language } = useI18n();
  const { toast } = useToast();
  const [savedMessages, setSavedMessages] = useState<SavedMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = "demo";

  useEffect(() => {
    const savedRef = ref(realTimeDb, `users/${userId}/savedMessages`);
    
    onValue(savedRef, (snapshot) => {
      const savedData = snapshot.val();
      if (savedData) {
        const messagesList = Object.entries(savedData).map(([firebaseId, data]: [string, any]) => ({
          id: data.id,
          firebaseId,
          content: data.content,
          timestamp: data.timestamp,
          type: data.type
        }));
        
        messagesList.sort((a, b) => b.timestamp - a.timestamp);
        setSavedMessages(messagesList);
      } else {
        setSavedMessages([]);
      }
      setLoading(false);
    });
  }, [userId]);

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: language === 'en' ? "Copied!" : "تم النسخ!",
        description: language === 'en' ? "Copied to clipboard!" : "تم النسخ إلى الحافظة!"
      });
    } catch (error) {
      toast({
        title: language === 'en' ? "Error" : "خطأ",
        description: language === 'en' ? "Failed to copy" : "فشل في النسخ",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (firebaseId: string) => {
    try {
      await remove(ref(realTimeDb, `users/${userId}/savedMessages/${firebaseId}`));
      toast({
        title: language === 'en' ? "Removed" : "تم الحذف",
        description: language === 'en' ? "Message removed from saved" : "تم حذف الرسالة من المحفوظات"
      });
    } catch (error) {
      toast({
        title: language === 'en' ? "Error" : "خطأ",
        description: language === 'en' ? "Failed to remove message" : "فشل في حذف الرسالة",
        variant: "destructive"
      });
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(language === 'en' ? 'en-US' : 'ar-SA') + ' ' + 
           date.toLocaleTimeString(language === 'en' ? 'en-US' : 'ar-SA');
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
              {language === 'en' ? 'Saved Messages' : 'الرسائل المحفوظة'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'en' 
                ? 'Your saved messages from conversations'
                : 'رسائلك المحفوظة من المحادثات'}
            </p>
          </div>
        </motion.div>

        {/* Messages List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-health-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-muted-foreground">
                {language === 'en' ? 'Loading saved messages...' : 'جاري تحميل الرسائل المحفوظة...'}
              </p>
            </div>
          ) : savedMessages.length === 0 ? (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Save className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {language === 'en' ? 'No saved messages' : 'لا توجد رسائل محفوظة'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {language === 'en' 
                  ? 'Save important messages from your conversations to see them here'
                  : 'احفظ الرسائل المهمة من محادثاتك لتراها هنا'}
              </p>
              <Button onClick={() => navigate('/chatbot')}>
                {language === 'en' ? 'Start Chatting' : 'ابدأ المحادثة'}
              </Button>
            </motion.div>
          ) : (
            savedMessages.map((message, index) => (
              <motion.div
                key={message.firebaseId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="glass-card p-4 rounded-lg border group hover:border-health-primary transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      message.type === 'user' ? 'bg-health-primary' : 'bg-health-secondary/10'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="w-3 h-3 text-white" />
                      ) : (
                        <Bot className="w-3 h-3 text-health-secondary" />
                      )}
                    </div>
                    <span className="text-sm font-medium">
                      {message.type === 'user' 
                        ? (language === 'en' ? 'You' : 'أنت')
                        : (language === 'en' ? 'Medical AI' : 'الذكاء الطبي')}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(message.timestamp)}
                    </span>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(message.content)}
                      className="h-6 w-6 p-0"
                      title={language === 'en' ? 'Copy' : 'نسخ'}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(message.firebaseId)}
                      className="h-6 w-6 p-0 hover:text-destructive"
                      title={language === 'en' ? 'Remove' : 'حذف'}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default SavedMessages;
