
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { realTimeDb, ref, push, onValue, remove } from '@/config/firebaseConfig';
import { 
  Menu,
  Plus,
  MessageSquare,
  Star,
  Share2,
  Trash2,
  X,
  Clock
} from 'lucide-react';

interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
  lastMessage: string;
  isActive?: boolean;
}

interface SavedMessage {
  id: string;
  content: string;
  timestamp: Date;
  sessionId: string;
}

interface ChatSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentSessionId: string;
  onNewChat: () => void;
  onLoadSession: (sessionId: string) => void;
  onShareChat: () => void;
  language: string;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  isOpen,
  onToggle,
  currentSessionId,
  onNewChat,
  onLoadSession,
  onShareChat,
  language
}) => {
  const { toast } = useToast();
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [savedMessages, setSavedMessages] = useState<SavedMessage[]>([]);
  const [activeTab, setActiveTab] = useState<'history' | 'saved'>('history');

  // Load chat sessions
  useEffect(() => {
    const sessionsRef = ref(realTimeDb, 'chatSessions');
    const unsubscribe = onValue(sessionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const sessions: ChatSession[] = Object.entries(data).map(([id, session]: [string, any]) => ({
          id,
          title: session.title || session.firstMessage || 'New Chat',
          timestamp: new Date(session.timestamp),
          lastMessage: session.lastMessage || '',
          isActive: id === currentSessionId
        }));
        
        // Sort by timestamp, newest first
        sessions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        setChatSessions(sessions);
      }
    });

    return () => unsubscribe();
  }, [currentSessionId]);

  // Load saved messages
  useEffect(() => {
    const savedRef = ref(realTimeDb, 'savedMessages');
    const unsubscribe = onValue(savedRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messages: SavedMessage[] = Object.entries(data).map(([id, message]: [string, any]) => ({
          id,
          content: message.content,
          timestamp: new Date(message.timestamp),
          sessionId: message.sessionId || ''
        }));
        
        // Sort by timestamp, newest first
        messages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        setSavedMessages(messages);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const sessionRef = ref(realTimeDb, `chatSessions/${sessionId}`);
      await remove(sessionRef);
      
      toast({
        title: language === 'en' ? "Session Deleted" : "تم حذف الجلسة",
        description: language === 'en' 
          ? "Chat session has been deleted successfully."
          : "تم حذف جلسة المحادثة بنجاح."
      });
    } catch (error) {
      console.error('Failed to delete session:', error);
      toast({
        title: language === 'en' ? "Error" : "خطأ",
        description: language === 'en' 
          ? "Failed to delete chat session."
          : "فشل في حذف جلسة المحادثة.",
        variant: "destructive"
      });
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return language === 'en' ? 'Yesterday' : 'أمس';
    } else if (diffDays < 7) {
      return `${diffDays} ${language === 'en' ? 'days ago' : 'أيام مضت'}`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 h-full w-80 bg-background border-r z-50 flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              {language === 'en' ? 'Medical AI Chat' : 'محادثة الذكاء الطبي'}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="p-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button
              onClick={onNewChat}
              className="flex-1 justify-start"
              variant="default"
            >
              <Plus className="w-4 h-4 mr-2" />
              {language === 'en' ? 'New Chat' : 'محادثة جديدة'}
            </Button>
            
            <Button
              onClick={onShareChat}
              variant="outline"
              size="sm"
              className="p-2"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 p-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'history'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <MessageSquare className="w-4 h-4 inline mr-2" />
            {language === 'en' ? 'History' : 'السجل'}
          </button>
          
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 p-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'saved'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Star className="w-4 h-4 inline mr-2" />
            {language === 'en' ? 'Saved' : 'المحفوظة'}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'history' ? (
            <div className="p-2">
              {chatSessions.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">
                    {language === 'en' ? 'No chat history yet' : 'لا يوجد سجل محادثات بعد'}
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {chatSessions.map((session) => (
                    <div
                      key={session.id}
                      onClick={() => onLoadSession(session.id)}
                      className={`group p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                        session.isActive ? 'bg-primary/10 border border-primary/20' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium truncate">
                            {session.title}
                          </h4>
                          <p className="text-xs text-muted-foreground truncate mt-1">
                            {session.lastMessage}
                          </p>
                          <div className="flex items-center mt-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTime(session.timestamp)}
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleDeleteSession(session.id, e)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-2">
              {savedMessages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Star className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">
                    {language === 'en' ? 'No saved messages yet' : 'لا توجد رسائل محفوظة بعد'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {savedMessages.map((message) => (
                    <div
                      key={message.id}
                      className="p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <p className="text-sm line-clamp-3 mb-2">
                        {message.content}
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default ChatSidebar;
