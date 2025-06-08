import { useState, useEffect, useCallback } from 'react';
import { realTimeDb, ref, push, set, onValue, get } from '@/config/firebaseConfig';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  fileUrl?: string;
  fileName?: string;
  isDeepThink?: boolean;
  isTyping?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
  lastMessage: string;
  messages: Message[];
}

export const useChatSession = () => {
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  // Initialize with a default session
  useEffect(() => {
    if (!currentSessionId) {
      createNewSession();
    }
  }, []);

  const createNewSession = useCallback(async () => {
    try {
      const sessionsRef = ref(realTimeDb, 'chatSessions');
      const newSessionRef = push(sessionsRef);
      const sessionId = newSessionRef.key!;
      
      const initialMessage: Message = {
        id: '1',
        type: 'bot',
        content: "Hello! I'm your medical AI assistant. I can help you with health-related questions, analyze symptoms, and provide medical information. How can I assist you today?",
        timestamp: new Date()
      };

      await set(newSessionRef, {
        title: 'New Medical Chat',
        timestamp: Date.now(),
        lastMessage: '',
        firstMessage: 'New Medical Chat',
        messages: {
          '1': {
            type: 'bot',
            content: initialMessage.content,
            timestamp: Date.now()
          }
        }
      });

      setCurrentSessionId(sessionId);
      setMessages([initialMessage]);
      
      return sessionId;
    } catch (error) {
      console.error('Failed to create new session:', error);
      return null;
    }
  }, []);

  const loadSession = useCallback(async (sessionId: string) => {
    try {
      const sessionRef = ref(realTimeDb, `chatSessions/${sessionId}`);
      const snapshot = await get(sessionRef);
      
      if (snapshot.exists()) {
        const sessionData = snapshot.val();
        const loadedMessages: Message[] = [];
        
        if (sessionData.messages) {
          Object.entries(sessionData.messages).forEach(([id, messageData]: [string, any]) => {
            loadedMessages.push({
              id,
              type: messageData.type,
              content: messageData.content,
              timestamp: new Date(messageData.timestamp),
              isDeepThink: messageData.isDeepThink || false,
              isTyping: messageData.isTyping || false
            });
          });
        }
        
        // Sort messages by timestamp
        loadedMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        
        setCurrentSessionId(sessionId);
        setMessages(loadedMessages);
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to load session:', error);
      return false;
    }
  }, []);

  const saveMessage = useCallback(async (message: Message) => {
    if (!currentSessionId) return;

    try {
      const messageRef = ref(realTimeDb, `chatSessions/${currentSessionId}/messages/${message.id}`);
      await set(messageRef, {
        type: message.type,
        content: message.content,
        timestamp: Date.now(),
        isDeepThink: message.isDeepThink || false,
        isTyping: message.isTyping || false
      });

      // Update session metadata
      const sessionRef = ref(realTimeDb, `chatSessions/${currentSessionId}`);
      const sessionSnapshot = await get(sessionRef);
      
      if (sessionSnapshot.exists()) {
        const sessionData = sessionSnapshot.val();
        const updatedData = {
          ...sessionData,
          lastMessage: message.content.substring(0, 100),
          timestamp: Date.now()
        };
        
        // Update title if this is the first user message
        if (message.type === 'user' && (!sessionData.title || sessionData.title === 'New Medical Chat')) {
          updatedData.title = message.content.substring(0, 50) || 'Medical Chat';
          updatedData.firstMessage = message.content;
        }
        
        await set(sessionRef, updatedData);
      }
    } catch (error) {
      console.error('Failed to save message:', error);
    }
  }, [currentSessionId]);

  const addMessage = useCallback((message: Message) => {
    setMessages(prev => {
      const newMessages = [...prev, message];
      // Auto-save the message
      setTimeout(() => saveMessage(message), 0);
      return newMessages;
    });
  }, [saveMessage]);

  const updateMessage = useCallback((messageId: string, updates: Partial<Message>) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, ...updates } : msg
    ));
  }, []);

  const clearMessages = useCallback(() => {
    const initialMessage: Message = {
      id: '1',
      type: 'bot',
      content: "Hello! I'm your medical AI assistant. How can I assist you today?",
      timestamp: new Date()
    };
    setMessages([initialMessage]);
  }, []);

  return {
    currentSessionId,
    messages,
    setMessages,
    createNewSession,
    loadSession,
    addMessage,
    updateMessage,
    clearMessages,
    saveMessage
  };
};
