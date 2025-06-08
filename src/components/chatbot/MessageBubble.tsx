
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Bot, 
  User, 
  Stethoscope, 
  Volume2, 
  Edit3, 
  Save, 
  Star, 
  Copy, 
  Check, 
  X,
  FileText,
  Image as ImageIcon 
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

interface MessageBubbleProps {
  message: Message;
  isEditing: boolean;
  editingContent: string;
  onEdit: (messageId: string) => void;
  onSave: (messageId: string, content: string) => void;
  onCopy: (content: string) => void;
  onSaveMessage: (message: Message) => void;
  onFavorite: (message: Message) => void;
  setEditingContent: (content: string) => void;
  language: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isEditing,
  editingContent,
  onEdit,
  onSave,
  onCopy,
  onSaveMessage,
  onFavorite,
  setEditingContent,
  language
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleEditStart = () => {
    setEditingContent(message.content);
    onEdit(message.id);
  };

  const handleEditSave = () => {
    onSave(message.id, editingContent);
  };

  const handleEditCancel = () => {
    onEdit('');
    setEditingContent('');
  };

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'ar' ? 'ar-SA' : 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: message.type === 'user' ? 20 : -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
        {/* Message bubble */}
        <div
          className={`p-4 rounded-2xl relative group ${
            message.type === 'user'
              ? 'bg-health-primary text-white'
              : 'glass-card border'
          } ${message.isDeepThink ? 'border-health-secondary border-2' : ''}`}
        >
          {/* Action buttons overlay */}
          {isHovered && !isEditing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`absolute -top-2 ${message.type === 'user' ? '-left-2' : '-right-2'} flex gap-1 bg-white border rounded-lg shadow-md p-1`}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCopy(message.content)}
                className="h-6 w-6 p-0 hover:bg-blue-50"
                title={language === 'en' ? 'Copy' : 'نسخ'}
              >
                <Copy className="w-3 h-3" />
              </Button>
              
              {message.type === 'user' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEditStart}
                  className="h-6 w-6 p-0 hover:bg-green-50"
                  title={language === 'en' ? 'Edit' : 'تعديل'}
                >
                  <Edit3 className="w-3 h-3" />
                </Button>
              )}
              
              {message.type === 'bot' && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSaveMessage(message)}
                    className="h-6 w-6 p-0 hover:bg-green-50"
                    title={language === 'en' ? 'Save' : 'حفظ'}
                  >
                    <Save className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onFavorite(message)}
                    className="h-6 w-6 p-0 hover:bg-yellow-50"
                    title={language === 'en' ? 'Favorite' : 'مفضلة'}
                  >
                    <Star className="w-3 h-3" />
                  </Button>
                </>
              )}
            </motion.div>
          )}

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

          {/* Message content or editing input */}
          {isEditing ? (
            <div className="space-y-2">
              <Input
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
                className="bg-white text-black"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleEditSave();
                  }
                  if (e.key === 'Escape') {
                    handleEditCancel();
                  }
                }}
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleEditSave}
                  className="h-6 px-2"
                >
                  <Check className="w-3 h-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditCancel}
                  className="h-6 px-2"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ) : (
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
          )}

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
  );
};

export default MessageBubble;
