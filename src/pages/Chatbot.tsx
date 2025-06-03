import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/contexts/I18nContext';
import { useTheme } from '@/contexts/ThemeContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { realTimeDb, ref, push, onValue } from '@/config/firebaseConfig';
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
  VolumeX
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
  console.log("API Key value:", apiKey);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: language === 'en' 
        ? "Hello! I'm your medical AI assistant. I can help you with health-related questions, analyze symptoms, and provide medical information. How can I assist you today?"
        : "مرحباً! أنا مساعدك الطبي الذكي. يمكنني مساعدتك في الأسئلة المتعلقة بالصحة وتحليل الأعراض وتقديم المعلومات الطبية. كيف يمكنني مساعدتك اليوم؟",
      timestamp: new Date()
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeepThink, setIsDeepThink] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [rateLimitCount, setRateLimitCount] = useState(0);
  const [isRateLimited, setIsRateLimited] = useState(false);
  
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
      'recipe', 'cooking', 'travel', 'shopping', 'entertainment', 'games'
    ];
    const arabicNonMedical = [
      'نكتة', 'مضحك', 'طقس', 'أخبار', 'سياسة', 'رياضة', 'فيلم', 'موسيقى',
      'وصفة', 'طبخ', 'سفر', 'تسوق', 'ترفيه', 'ألعاب'
    ];
    
    const lowercaseQuery = query.toLowerCase();
    return nonMedicalKeywords.some(keyword => lowercaseQuery.includes(keyword)) ||
           arabicNonMedical.some(keyword => query.includes(keyword));
  };

  const callGeminiAPI = async (query: string, isDeepThink: boolean): Promise<string> => {
    console.log("callGeminiAPI called with:", query);
    console.log("Using API Key:", apiKey);

    if (isNonMedicalQuery(query)) {
      return language === 'en' 
        ? "I am configured to discuss medical and health-related topics only. How can I assist you with your health today?"
        : "أنا مخصص لمناقشة المواضيع الطبية والصحية فقط. كيف يمكنني مساعدتك في صحتك اليوم؟";
    }

    try {
      // Use the correct Gemini API endpoint and model
      const modelName = 'gemini-1.5-flash';
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      
      const systemPrompt = `You are a certified medical assistant chatbot. Follow these rules exactly:

1. **Language & Dialect Matching:**
   - If the user's input is in Arabic (including Egyptian, Gulf, Levantine, or any other dialect), respond entirely in the same Arabic dialect and style.
   - If the user's input is in English, respond entirely in English.
   - If the user mixes languages, respond in the dominant language detected.
   - Match the formality level: if user uses colloquial expressions, respond colloquially but professionally.

2. **Professional Markdown Formatting (REQUIRED):**
   - Always use Markdown formatting in your responses.
   - Start with a bold heading summarizing your answer (e.g., **نظرة عامة** or **Overview**).
   - Use bullet points (\`- \`) or numbered lists (\`1. \`) where appropriate.
   - Use bold (\`**\`) to highlight key medical terms, symptoms, or important points.
   - Keep paragraphs short and well-structured.
   - Example structure:
     \`\`\`
     **Main Topic**
     Brief introduction paragraph.
     
     **Key Points:**
     - First important point
     - Second important point
     - **Critical information** in bold
     
     **Recommendations:**
     1. First recommendation
     2. Second recommendation
     \`\`\`

3. **Medical Guidelines:**
   - Provide only factual, evidence-based medical information.
   - ${isDeepThink ? 'Provide detailed, comprehensive analysis with thorough explanations.' : 'Provide concise, helpful responses focused on key information.'}
   - Always recommend consulting healthcare professionals for serious concerns.
   - Use clear, professional tone appropriate for medical guidance.

4. **Response Requirements:**
   - ${isDeepThink ? 'Aim for 4-6 well-structured paragraphs with detailed explanations.' : 'Aim for 2-4 concise paragraphs.'}
   - Include at least one formatted list (bullet or numbered) when listing symptoms, steps, or recommendations.
   - Avoid overly technical jargon—explain medical terms briefly when used.`;

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

      console.log("API Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error Details:", errorData);
        
        if (response.status === 401) {
          throw new Error("Invalid Gemini API key. Contact support.");
        } else if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please wait and try again.");
        } else if (response.status === 404) {
          throw new Error("Model not found. Please contact support.");
        } else {
          throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
        }
      }

      const data = await response.json();
      console.log("API Response data:", data);

      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error("Invalid response format from Gemini API");
      }

      return data.candidates[0].content.parts[0].text;
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

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setUploadedFile(null);
    setIsLoading(true);
    setRateLimitCount(prev => prev + 1);

    // Add typing indicator
    const typingMessage: Message = {
      id: 'typing',
      type: 'bot',
      content: language === 'en' ? 'AI is thinking...' : 'الذكاء الاصطناعي يفكر...',
      timestamp: new Date(),
      isTyping: true
    };

    setMessages(prev => [...prev, typingMessage]);

    try {
      const response = await callGeminiAPI(userMessage.content, isDeepThink);
      
      // Remove typing indicator and add real response
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response,
        timestamp: new Date(),
        isDeepThink
      };

      setMessages(prev => [...prev, botMessage]);

      // Scroll to bottom after new message
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

      // Save to Firebase
      try {
        const chatRef = ref(realTimeDb, 'chats/demo');
        await push(chatRef, {
          userMessage: userMessage.content,
          botResponse: response,
          timestamp: Date.now(),
          isDeepThink
        });
      } catch (firebaseError) {
        console.error("Firebase Error:", firebaseError);
      }

    } catch (error) {
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
      
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

  const clearChat = () => {
    setMessages([{
      id: '1',
      type: 'bot',
      content: language === 'en' 
        ? "Hello! I'm your medical AI assistant. How can I assist you today?"
        : "مرحباً! أنا مساعدك الطبي الذكي. كيف يمكنني مساعدتك اليوم؟",
      timestamp: new Date()
    }]);
    toast({
      title: language === 'en' ? "Chat Cleared" : "تم مسح المحادثة",
      description: language === 'en' 
        ? "Chat history has been cleared."
        : "تم مسح تاريخ المحادثة."
    });
  };

  // Scroll to bottom when new messages arrive (not on initial load)
  useEffect(() => {
    if (messages.length > 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChat}
            className="mt-2 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {t('chatbot.clearChat')}
          </Button>
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
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
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
                        <button
                          onClick={() => speakMessage(message.content)}
                          className="text-muted-foreground hover:text-health-primary transition-colors"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
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
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      )}
                    </div>

                    {/* Timestamp */}
                    <div className={`text-xs mt-2 ${message.type === 'user' ? 'text-white/70' : 'text-muted-foreground'}`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
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
