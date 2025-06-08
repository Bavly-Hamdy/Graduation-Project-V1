
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/contexts/I18nContext';
import { useTheme } from '@/contexts/ThemeContext';
import MainLayout from '@/components/layout/MainLayout';
import MessageActions from '@/components/chatbot/MessageActions';
import ChatSidebar from '@/components/chatbot/ChatSidebar';
import ShareChatModal from '@/components/chatbot/ShareChatModal';
import { useChatSession } from '@/hooks/useChatSession';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
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
  Menu,
  Share2
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
}

const Chatbot = () => {
  const { t, language } = useI18n();
  const { theme } = useTheme();
  const { toast } = useToast();
  
  // Use the provided Gemini API key directly
  const apiKey = "AIzaSyAWKPfeepjAlHToguhq-n1Ai--XtvG5K44";
  console.log("Gemini API Key Check:", apiKey ? "Found" : "Missing");

  // Chat session management
  const {
    currentSessionId,
    messages,
    setMessages,
    createNewSession,
    loadSession,
    addMessage,
    updateMessage,
    clearMessages,
    saveMessage
  } = useChatSession();

  // UI state
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeepThink, setIsDeepThink] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [rateLimitCount, setRateLimitCount] = useState(0);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognition = useRef<SpeechRecognition | null>(null);

  // Rate limiting reset
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
      'رياضيات', 'تاريخ', 'جغرافيا', 'علوم', 'فيزياء', 'كيمياء', 'أحياء', 'إنجليزي',
      'أدب', 'فن', 'أعمال', 'مالية', 'اقتصاد', 'قانون', 'تعليم'
    ];
    
    const lowercaseQuery = query.toLowerCase();
    return nonMedicalKeywords.some(keyword => lowercaseQuery.includes(keyword)) ||
           arabicNonMedical.some(keyword => query.includes(keyword));
  };

  const cleanResponse = (response: string): string => {
    return response
      .replace(/\*{3,}/g, '') // Remove 3+ asterisks
      .replace(/\*{2}([^*]+)\*{2}/g, '**$1**') // Keep only proper bold formatting
      .replace(/\*([^*\n]+)\*/g, '$1') // Remove single asterisk emphasis
      .trim();
  };

  const callGeminiAPI = async (query: string, isDeepThink: boolean): Promise<string> => {
    console.log("callGeminiAPI called with:", query);

    if (isNonMedicalQuery(query)) {
      return language === 'en' 
        ? "I'm sorry, I can only provide medical and health-related information. Please ask a question about symptoms, conditions, treatments, or wellness."
        : "آسف، يمكنني فقط تقديم المعلومات الطبية والصحية. يرجى طرح سؤال حول الأعراض أو الحالات أو العلاجات أو العافية.";
    }

    try {
      const modelName = 'gemini-1.5-flash';
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      
      const systemPrompt = `You are a certified medical AI assistant. Follow these rules strictly:

**1. Domain Restriction**
Answer only medical and health questions. If the query is outside healthcare, reply:
"I'm sorry, I can only provide medical and health-related information. Please ask a question about symptoms, conditions, treatments, or wellness."

**2. Language & Dialect Matching**
- If the user's input is in Arabic, reply entirely in that Arabic dialect.
- If the user's input is in English, reply entirely in English.

**3. Response Format - CRITICAL**
- Use only standard Markdown: **Bold Headings** and - bullet points
- NEVER use asterisk decorations like *** or ***** around text
- NEVER wrap normal text in asterisks for emphasis
- Structure: **Heading** followed by paragraphs and - bullet lists
- Example format:
**Overview**
This condition involves...

**Symptoms**
- Symptom one
- Symptom two

**4. Professional Tone**
- ${isDeepThink ? 'Provide detailed, comprehensive medical analysis' : 'Provide concise, focused medical information'}
- Use empathetic, professional medical language
- Always end with: "This information is for educational purposes and does not replace consulting a qualified healthcare professional."

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
        console.error("API Error Details:", errorData);
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error("Invalid response format from Gemini API");
      }

      const rawResponse = data.candidates[0].content.parts[0].text;
      return cleanResponse(rawResponse);
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  };

  const sendOrUpdateMessage = async () => {
    if (!inputValue.trim() || isLoading || isRateLimited) {
      console.warn("Cannot send message:", { empty: !inputValue.trim(), loading: isLoading, rateLimited: isRateLimited });
      return;
    }

    console.log("sendOrUpdateMessage called with:", inputValue);

    // Rate limiting check
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

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      fileUrl: uploadedFile ? URL.createObjectURL(uploadedFile) : undefined,
      fileName: uploadedFile?.name
    };

    addMessage(userMessage);
    setInputValue('');
    setUploadedFile(null);
    setIsLoading(true);
    setRateLimitCount(prev => prev + 1);

    // Only show thinking indicator if Deep Think is enabled
    if (isDeepThink) {
      const typingMessage: Message = {
        id: 'typing',
        type: 'bot',
        content: '💭 Chatbot is thinking...',
        timestamp: new Date(),
        isTyping: true
      };

      setMessages(prev => [...prev, typingMessage]);
    }

    try {
      const response = await callGeminiAPI(userMessage.content, isDeepThink);
      
      // Remove typing indicator if it was shown
      if (isDeepThink) {
        setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
      }
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response,
        timestamp: new Date(),
        isDeepThink
      };

      addMessage(botMessage);

      // Scroll to bottom after new message
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (error) {
      if (isDeepThink) {
        setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
      }
      
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
    console.log("Editing message:", messageId, newContent);
    
    // Find the message index
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) return;

    // Update the user message
    const updatedMessages = [...messages];
    updatedMessages[messageIndex] = {
      ...updatedMessages[messageIndex],
      content: newContent
    };

    // Remove any subsequent bot messages
    const messagesToKeep = updatedMessages.slice(0, messageIndex + 1);
    setMessages(messagesToKeep);

    // Set the input to the new content and trigger a new response
    setInputValue(newContent);
    
    // Automatically send the edited message
    setTimeout(() => {
      sendOrUpdateMessage();
    }, 100);
  };

  const handleNewChat = async () => {
    const newSessionId = await createNewSession();
    if (newSessionId) {
      setIsSidebarOpen(false);
      toast({
        title: language === 'en' ? "New Chat Started" : "بدأت محادثة جديدة",
        description: language === 'en' 
          ? "Starting a fresh conversation."
          : "بدء محادثة جديدة."
      });
    }
  };

  const handleLoadSession = async (sessionId: string) => {
    const success = await loadSession(sessionId);
    if (success) {
      setIsSidebarOpen(false);
      toast({
        title: language === 'en' ? "Chat Loaded" : "تم تحميل المحادثة",
        description: language === 'en' 
          ? "Previous conversation loaded successfully."
          : "تم تحميل المحادثة السابقة بنجاح."
      });
    }
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

  // Scroll to bottom when new messages arrive (not on initial load)
  useEffect(() => {
    if (messages.length > 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <MainLayout>
      {/* Sidebar */}
      <ChatSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        currentSessionId={currentSessionId}
        onNewChat={handleNewChat}
        onLoadSession={handleLoadSession}
        onShareChat={() => setIsShareModalOpen(true)}
        language={language}
      />

      {/* Share Modal */}
      <ShareChatModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        messages={messages}
        sessionId={currentSessionId}
        language={language}
      />

      <div className="container-custom max-w-4xl mx-auto pt-8 pb-4 h-screen flex flex-col">
        {/* Header */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            {/* Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(true)}
              className="p-2"
            >
              <Menu className="w-5 h-5" />
            </Button>

            {/* Title */}
            <h1 className="text-fluid-2xl font-bold text-gradient">
              {t('chatbot.title')}
            </h1>

            {/* Share Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsShareModalOpen(true)}
              className="p-2"
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
          
          <p className="text-muted-foreground">
            {language === 'en' 
              ? "Powered by AI to answer your health questions in real time."
              : "مدعوم بالذكاء الاصطناعي للرد على أسئلتك الصحية في الوقت الفعلي."}
          </p>
        </motion.div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 scroll-smooth">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ 
                  opacity: 0, 
                  x: message.type === 'user' ? 20 : -20,
                  scale: 0.95 
                }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} group`}
              >
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  {/* Message bubble */}
                  <div
                    className={`p-4 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-health-primary text-white'
                        : 'glass-card border'
                    } ${message.isDeepThink ? 'border-health-secondary border-2' : ''}`}
                  >
                    {/* Bot message header */}
                    {message.type === 'bot' && (
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-health-primary/10 rounded-full flex items-center justify-center mr-2">
                            <Stethoscope className="w-3 h-3 text-health-primary" />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            Medical AI
                            {message.isDeepThink && ' • Deep Think'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* File attachment */}
                    {message.fileUrl && (
                      <div className="mb-2 p-2 bg-white/10 rounded-lg flex items-center">
                        {message.fileName?.includes('.pdf') ? (
                          <FileText className="w-4 h-4 mr-2" />
                        ) : (
                          <ImageIcon className="w-4 h-4 mr-2" />
                        )}
                        <span className="text-sm">{message.fileName}</span>
                      </div>
                    )}

                    {/* Message content */}
                    <div className={message.isTyping ? 'flex items-center' : ''}>
                      {message.isTyping ? (
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-health-primary rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-health-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-health-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <span className="ml-2 text-sm">{message.content}</span>
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap">
                          {message.content.split('\n').map((line, index) => {
                            if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
                              return (
                                <div key={index} className="font-bold text-health-primary mb-2 mt-4 first:mt-0">
                                  {line.slice(2, -2)}
                                </div>
                              );
                            } else if (line.startsWith('- ')) {
                              return (
                                <div key={index} className="ml-4 mb-1">
                                  • {line.slice(2)}
                                </div>
                              );
                            } else if (line.trim()) {
                              return (
                                <p key={index} className="mb-2">
                                  {line}
                                </p>
                              );
                            }
                            return null;
                          })}
                        </div>
                      )}
                    </div>

                    {/* Timestamp */}
                    <div className={`text-xs mt-2 ${message.type === 'user' ? 'text-white/70' : 'text-muted-foreground'}`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>

                  {/* Message Actions */}
                  {!message.isTyping && (
                    <MessageActions
                      message={message}
                      onEdit={handleEditMessage}
                      onSpeak={speakMessage}
                      language={language}
                    />
                  )}
                </div>

                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' ? 'order-1 ml-2 bg-health-primary' : 'order-2 mr-2 bg-health-secondary/10'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-health-secondary" />
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
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

            {/* Action Buttons */}
            <div className="flex space-x-1">
              {/* File Upload */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="p-2"
              >
                <Paperclip className="w-4 h-4" />
              </Button>

              {/* Voice Recording */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleRecording}
                disabled={isLoading}
                className={`p-2 ${isRecording ? 'text-red-500' : ''}`}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>

              {/* Send Button */}
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
            onChange={handleFileUpload}
            className="hidden"
          />
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Chatbot;
