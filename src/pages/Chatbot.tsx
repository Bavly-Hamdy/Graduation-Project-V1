import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/contexts/I18nContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { realTimeDb, ref, push, onValue, set, remove } from '@/config/firebaseConfig';
import MessageBubble from '@/components/chatbot/MessageBubble';
import { 
  Send, 
  Paperclip, 
  Mic, 
  MicOff,
  FileText,
  Image as ImageIcon,
  Trash2,
  Bot,
  User,
  Stethoscope,
  Volume2,
  VolumeX,
  History,
  Plus
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  fileUrl?: string;
  fileName?: string;
  isDeepThink?: boolean;
  isTyping?: boolean;
  isEditing?: boolean;
}

const Chatbot = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { t, language } = useI18n();
  const { theme } = useTheme();
  const { toast } = useToast();
  
  // Use the provided Gemini API key directly
  const apiKey = "AIzaSyAWKPfeepjAlHToguhq-n1Ai--XtvG5K44";
  const userId = "demo"; // In a real app, this would come from auth

  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeepThink, setIsDeepThink] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [rateLimitCount, setRateLimitCount] = useState(0);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [userFirstName, setUserFirstName] = useState<string>('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<string>('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognition = useRef<SpeechRecognition | null>(null);

  // Initialize session and fetch user data
  useEffect(() => {
    const initializeSession = async () => {
      // Fetch user profile for personalized greeting
      const userRef = ref(realTimeDb, `users/${userId}`);
      onValue(userRef, (snapshot) => {
        const userData = snapshot.val();
        if (userData?.firstName) {
          setUserFirstName(userData.firstName);
        }
      });

      let activeSessionId = sessionId;
      
      if (!activeSessionId) {
        // Create new session
        const sessionsRef = ref(realTimeDb, `users/${userId}/chatSessions`);
        const newSessionRef = push(sessionsRef);
        activeSessionId = newSessionRef.key!;
        
        // Set session metadata
        await set(ref(realTimeDb, `users/${userId}/chatSessions/${activeSessionId}/metadata`), {
          createdAt: Date.now(),
          updatedAt: Date.now()
        });
        
        navigate(`/chat/${activeSessionId}`, { replace: true });
      }
      
      setCurrentSessionId(activeSessionId);
      
      // Load messages for this session
      const messagesRef = ref(realTimeDb, `users/${userId}/chatSessions/${activeSessionId}/messages`);
      onValue(messagesRef, (snapshot) => {
        const messagesData = snapshot.val();
        if (messagesData) {
          const messagesList = Object.entries(messagesData).map(([id, data]: [string, any]) => ({
            id,
            type: data.type,
            content: data.content,
            timestamp: new Date(data.timestamp),
            fileUrl: data.fileUrl,
            fileName: data.fileName,
            isDeepThink: data.isDeepThink
          }));
          
          messagesList.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
          setMessages(messagesList);
        } else {
          // Add personalized greeting for new sessions
          addPersonalizedGreeting(activeSessionId);
        }
      });
    };

    initializeSession();
  }, [sessionId, userId, navigate]);

  const addPersonalizedGreeting = async (sessionId: string) => {
    const greeting = userFirstName 
      ? (language === 'en' 
          ? `**Hello, ${userFirstName}!**\nHow can I help you today?`
          : `**مرحباً، ${userFirstName}!**\nكيف يمكنني مساعدتك اليوم؟`)
      : (language === 'en' 
          ? "**Hello!** I'm your medical AI assistant. How can I help you today?"
          : "**مرحباً!** أنا مساعدك الطبي الذكي. كيف يمكنني مساعدتك اليوم؟");

    const greetingMessage = {
      type: 'bot',
      content: greeting,
      timestamp: Date.now(),
      isDeepThink: false
    };

    const messagesRef = ref(realTimeDb, `users/${userId}/chatSessions/${sessionId}/messages`);
    await push(messagesRef, greetingMessage);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setRateLimitCount(0);
      setIsRateLimited(false);
    }, 30000);
    return () => clearTimeout(timer);
  }, [rateLimitCount]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.lang = language === 'ar' ? 'ar-SA' : 'en-US';
      recognition.current.continuous = false;
      recognition.current.interimResults = true;

      recognition.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setInputValue(transcript);
      };

      recognition.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, [language]);

  const callGeminiAPI = async (query: string, isDeepThink: boolean): Promise<string> => {
    console.log("callGeminiAPI called with:", query);

    // Domain restriction check
    if (isNonMedicalQuery(query)) {
      return "I'm sorry, I can only provide medical and health-related information. Please ask a question about symptoms, conditions, treatments, or wellness.";
    }

    try {
      const modelName = 'gemini-1.5-flash';
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      
      const systemPrompt = `You are a certified medical AI assistant. Follow these rules:

**1. Domain Restriction**
Answer only medical and health questions. If the query is outside healthcare, reply:
"I'm sorry, I can only provide medical and health-related information. Please ask a question about symptoms, conditions, treatments, or wellness."

**2. Language & Dialect Matching**
- If the user's input is in Arabic, reply entirely in that Arabic dialect.
- If the user's input is in English, reply entirely in English.

**3. Response Format**
- Use Markdown with bold headings only (e.g., **Overview**, **Symptoms**)
- Use hyphens for bullet lists (e.g., "- Tremor in hands")
- Do not use asterisks for emphasis or bullets inside the body text
- Do not wrap content in backticks or code blocks

**4. Thinking Indicator**
- Show "💭 Chatbot is thinking..." only if Deep Think is enabled
- Otherwise respond immediately without any interim placeholder

**5. Disclaimer**
End every reply with:
This information is for educational purposes and does not replace consulting a qualified healthcare professional.

**Response Guidelines:**
- ${isDeepThink ? 'Provide detailed, comprehensive medical analysis' : 'Provide concise, focused medical information'}
- Use professional, empathetic medical tone
- Structure: Bold heading + short paragraphs + hyphen bullet lists + disclaimer

**Length:** ${isDeepThink ? '4-6 paragraphs with detailed explanations' : '2-3 concise paragraphs'}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nUser query: ${query}`
            }]
          }],
          generationConfig: {
            temperature: isDeepThink ? 0.7 : 0.5,
            maxOutputTokens: isDeepThink ? 1000 : 500,
            topP: 0.8,
            topK: 40
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  };

  const isNonMedicalQuery = (query: string): boolean => {
    const nonMedicalKeywords = [
      'joke', 'funny', 'weather', 'news', 'politics', 'sports', 'movie', 'music',
      'recipe', 'cooking', 'travel', 'shopping', 'entertainment', 'games', 'google',
      'account', 'password', 'login', 'computer', 'software', 'programming', 'math',
      'history', 'geography', 'science', 'physics', 'chemistry', 'biology', 'english',
      'literature', 'art', 'business', 'finance', 'economics', 'law', 'education'
    ];
    const arabicNonMedical = [
      'نكتة', 'مضحك', 'طقس', 'أخبار', 'سياسة', 'رياضة', 'فيلم', 'موسيقى',
      'وصفة', 'طبخ', 'سفر', 'تسوق', 'ترفيه', 'ألعاب', 'جوجل', 'حساب', 'كلمة سر',
      'رياضيات', 'تاريخ', 'جغرافيا', 'علوم', فيزياء', 'كيمياء', 'أحياء', 'إنجليزي',
      'أدب', 'فن', 'أعمال', 'مالية', 'اقتصاد', 'قانون', 'تعليم'
    ];
    
    const lowercaseQuery = query.toLowerCase();
    return nonMedicalKeywords.some(keyword => lowercaseQuery.includes(keyword)) ||
           arabicNonMedical.some(keyword => query.includes(keyword));
  };

  const sendOrUpdateMessage = async () => {
    if (!inputValue.trim() || isLoading || isRateLimited || !currentSessionId) return;

    if (rateLimitCount >= 5) {
      setIsRateLimited(true);
      toast({
        title: language === 'en' ? "Rate Limit Exceeded" : "تم تجاوز الحد الأقصى",
        description: language === 'en' 
          ? "You're sending messages too quickly. Please wait a moment."
          : "ترسل الرسائل بسرعة كبيرة. يرجى الانتظار قليلاً.",
        variant: "destructive"
      });
      return;
    }

    const userMessage = {
      type: 'user',
      content: inputValue,
      timestamp: Date.now(),
      fileUrl: uploadedFile ? URL.createObjectURL(uploadedFile) : undefined,
      fileName: uploadedFile?.name
    };

    const messagesRef = ref(realTimeDb, `users/${userId}/chatSessions/${currentSessionId}/messages`);
    await push(messagesRef, userMessage);

    setInputValue('');
    setUploadedFile(null);
    setIsLoading(true);
    setRateLimitCount(prev => prev + 1);

    // Only show thinking indicator if Deep Think is enabled
    if (isDeepThink) {
      const typingMessage = {
        type: 'bot',
        content: '💭 Chatbot is thinking...',
        timestamp: Date.now(),
        isTyping: true
      };
      await push(messagesRef, typingMessage);
    }

    try {
      const response = await callGeminiAPI(userMessage.content, isDeepThink);
      
      // Remove typing indicator if it was shown
      if (isDeepThink) {
        // Remove the typing message from Firebase
        const currentMessages = await new Promise((resolve) => {
          onValue(messagesRef, (snapshot) => {
            resolve(snapshot.val());
          }, { onlyOnce: true });
        });
        
        // Find and remove typing message
        if (currentMessages) {
          const typingEntry = Object.entries(currentMessages as any).find(([_, msg]: [string, any]) => 
            msg.isTyping === true
          );
          if (typingEntry) {
            await remove(ref(realTimeDb, `users/${userId}/chatSessions/${currentSessionId}/messages/${typingEntry[0]}`));
          }
        }
      }
      
      const botMessage = {
        type: 'bot',
        content: response,
        timestamp: Date.now(),
        isDeepThink
      };

      await push(messagesRef, botMessage);

      // Update session metadata
      await set(ref(realTimeDb, `users/${userId}/chatSessions/${currentSessionId}/metadata/updatedAt`), Date.now());

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get response. Please try again.";
      
      toast({
        title: language === 'en' ? "Error" : "خطأ",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditMessage = async (messageId: string, newContent: string) => {
    if (!currentSessionId) return;
    
    // Update message in Firebase
    await set(ref(realTimeDb, `users/${userId}/chatSessions/${currentSessionId}/messages/${messageId}/content`), newContent);
    
    // Find the bot response after this message and regenerate it
    const userMessageIndex = messages.findIndex(msg => msg.id === messageId);
    if (userMessageIndex !== -1 && userMessageIndex < messages.length - 1) {
      const botMessage = messages[userMessageIndex + 1];
      if (botMessage.type === 'bot') {
        try {
          setIsLoading(true);
          const newResponse = await callGeminiAPI(newContent, botMessage.isDeepThink || false);
          await set(ref(realTimeDb, `users/${userId}/chatSessions/${currentSessionId}/messages/${botMessage.id}/content`), newResponse);
        } catch (error) {
          toast({
            title: language === 'en' ? "Error" : "خطأ",
            description: "Failed to regenerate response",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      }
    }
    
    setEditingMessageId(null);
    setEditingContent('');
  };

  const handleSaveMessage = async (message: Message) => {
    const savedRef = ref(realTimeDb, `users/${userId}/savedMessages`);
    await push(savedRef, {
      id: message.id,
      content: message.content,
      timestamp: message.timestamp.getTime(),
      type: message.type
    });
    
    toast({
      title: language === 'en' ? "Message Saved" : "تم حفظ الرسالة",
      description: language === 'en' ? "Message saved successfully!" : "تم حفظ الرسالة بنجاح!"
    });
  };

  const handleFavoriteMessage = async (message: Message) => {
    const favRef = ref(realTimeDb, `users/${userId}/favouriteMessages`);
    await push(favRef, {
      id: message.id,
      content: message.content,
      timestamp: message.timestamp.getTime(),
      type: message.type
    });
    
    toast({
      title: language === 'en' ? "Message Favorited" : "تم إضافة الرسالة للمفضلة",
      description: language === 'en' ? "Message added to favorites!" : "تم إضافة الرسالة للمفضلة!"
    });
  };

  const handleCopyMessage = async (content: string) => {
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

  const handleNewChat = () => {
    navigate('/chatbot');
  };

  const handleClearChat = async () => {
    if (!currentSessionId) return;
    
    await remove(ref(realTimeDb, `users/${userId}/chatSessions/${currentSessionId}/messages`));
    
    // Add new greeting
    addPersonalizedGreeting(currentSessionId);
    
    toast({
      title: language === 'en' ? "Chat Cleared" : "تم مسح المحادثة",
      description: language === 'en' ? "Chat history has been cleared." : "تم مسح تاريخ المحادثة."
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      if (allowedTypes.includes(file.type)) {
        setUploadedFile(file);
      } else {
        toast({
          title: language === 'en' ? "Invalid File Type" : "نوع ملف غير صالح",
          description: language === 'en' 
            ? "Please upload images (JPEG, PNG, GIF) or PDF files only."
            : "يرجى رفع الصور (JPEG, PNG, GIF) أو ملفات PDF فقط.",
          variant: "destructive"
        });
      }
    }
  };

  const toggleRecording = () => {
    if (!recognition.current) {
      toast({
        title: language === 'en' ? "Not Supported" : "غير مدعوم",
        description: language === 'en' 
          ? "Speech recognition is not supported in your browser."
          : "التعرف على الكلام غير مدعوم في متصفحك.",
        variant: "destructive"
      });
      return;
    }

    if (isRecording) {
      recognition.current.stop();
      setIsRecording(false);
    } else {
      recognition.current.start();
      setIsRecording(true);
    }
  };

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'ar' ? 'ar-SA' : 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (messages.length > 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.lang = language === 'ar' ? 'ar-SA' : 'en-US';
      recognition.current.continuous = false;
      recognition.current.interimResults = true;

      recognition.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setInputValue(transcript);
      };

      recognition.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, [language]);

  return (
    <MainLayout>
      <div className="container-custom max-w-4xl mx-auto pt-8 pb-4 h-screen flex flex-col">
        {/* Header */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-fluid-2xl font-bold mb-2 text-gradient">
            {t('chatbot.title')}
          </h1>
          <p className="text-muted-foreground">
            {language === 'en' 
              ? "Powered by AI to answer your health questions in real time."
              : "مدعوم بالذكاء الاصطناعي للرد على أسئلتك الصحية في الوقت الفعلي."}
          </p>
          <div className="flex justify-center gap-2 mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/history')}
              className="text-muted-foreground hover:text-primary"
            >
              <History className="w-4 h-4 mr-2" />
              {language === 'en' ? 'History' : 'التاريخ'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNewChat}
              className="text-muted-foreground hover:text-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              {language === 'en' ? 'New Chat' : 'محادثة جديدة'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearChat}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Clear Chat' : 'مسح المحادثة'}
            </Button>
          </div>
        </motion.div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 scroll-smooth">
          <AnimatePresence>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isEditing={editingMessageId === message.id}
                editingContent={editingContent}
                onEdit={setEditingMessageId}
                onSave={handleEditMessage}
                onCopy={handleCopyMessage}
                onSaveMessage={handleSaveMessage}
                onFavorite={handleFavoriteMessage}
                setEditingContent={setEditingContent}
                language={language}
              />
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area - keep existing code */}
        <motion.div
          className="glass-card p-4 rounded-2xl border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Deep Think Toggle */}
          <div className="flex items-center mb-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isDeepThink}
                onChange={(e) => setIsDeepThink(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded border-2 mr-2 flex items-center justify-center ${
                isDeepThink ? 'bg-health-primary border-health-primary' : 'border-muted-foreground'
              }`}>
                {isDeepThink && <div className="w-2 h-2 bg-white rounded-sm"></div>}
              </div>
              <span className="text-sm">
                {language === 'en' ? 'Enable Deep Think' : 'تفعيل التفكير المتقدم'}
              </span>
            </label>
          </div>

          {/* File Preview */}
          {uploadedFile && (
            <div className="mb-3 p-2 bg-health-primary/10 rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                {uploadedFile.type.includes('pdf') ? (
                  <FileText className="w-4 h-4 mr-2 text-health-primary" />
                ) : (
                  <ImageIcon className="w-4 h-4 mr-2 text-health-primary" />
                )}
                <span className="text-sm">{uploadedFile.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUploadedFile(null)}
                className="h-6 w-6 p-0"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          )}

          {/* Input Row */}
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={t('chatbot.placeholder')}
                className="resize-none border-0 focus:ring-2 focus:ring-health-primary bg-transparent"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendOrUpdateMessage();
                  }
                }}
                disabled={isLoading || isRateLimited}
              />
            </div>

            {/* Action Buttons - keep existing code */}
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="p-2"
              >
                <Paperclip className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleRecording} // Keep existing toggle recording logic
                disabled={isLoading}
                className={`p-2 ${isRecording ? 'text-red-500' : ''}`}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>

              <Button
                type="button"
                onClick={sendOrUpdateMessage}
                disabled={!inputValue.trim() || isLoading || isRateLimited}
                className="btn-primary p-2"
              >
                {isLoading ? (
                  <motion.div
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileUpload} // Keep existing file upload logic
            className="hidden"
          />
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Chatbot;
