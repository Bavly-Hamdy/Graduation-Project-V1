
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { realTimeDb, ref, push } from '@/config/firebaseConfig';
import { 
  Edit, 
  Star, 
  Copy, 
  Volume2, 
  Check, 
  X 
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  fileUrl?: string;
  fileName?: string;
  isDeepThink?: boolean;
}

interface MessageActionsProps {
  message: Message;
  onEdit?: (messageId: string, newContent: string) => void;
  onSpeak?: (text: string) => void;
  language: string;
}

const MessageActions: React.FC<MessageActionsProps> = ({ 
  message, 
  onEdit, 
  onSpeak, 
  language 
}) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      toast({
        title: language === 'en' ? "Copied!" : "تم النسخ!",
        description: language === 'en' 
          ? "Message copied to clipboard" 
          : "تم نسخ الرسالة إلى الحافظة"
      });
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const handleEdit = () => {
    if (message.type === 'user') {
      setIsEditing(true);
    }
  };

  const handleSaveEdit = () => {
    if (onEdit && editContent.trim() !== message.content) {
      onEdit(message.id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };

  const handleFavorite = async () => {
    if (message.type === 'bot') {
      try {
        const favoritesRef = ref(realTimeDb, 'favorites');
        await push(favoritesRef, {
          messageId: message.id,
          content: message.content,
          timestamp: Date.now(),
          isDeepThink: message.isDeepThink || false
        });
        
        setIsFavorited(true);
        toast({
          title: language === 'en' ? "Added to Favorites!" : "تمت الإضافة للمفضلة!",
          description: language === 'en' 
            ? "Message saved to your favorites" 
            : "تم حفظ الرسالة في مفضلتك"
        });
      } catch (error) {
        console.error('Failed to save favorite:', error);
        toast({
          title: language === 'en' ? "Error" : "خطأ",
          description: language === 'en' 
            ? "Failed to save to favorites" 
            : "فشل في الحفظ للمفضلة",
          variant: "destructive"
        });
      }
    }
  };

  if (isEditing) {
    return (
      <div className="mt-2 p-3 border rounded-lg bg-muted/50">
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="w-full p-2 border rounded resize-none bg-background"
          rows={3}
          placeholder={language === 'en' ? "Edit your message..." : "عدّل رسالتك..."}
        />
        <div className="flex justify-end space-x-2 mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancelEdit}
            className="p-2"
          >
            <X className="w-4 h-4" />
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleSaveEdit}
            disabled={!editContent.trim()}
            className="p-2"
          >
            <Check className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        aria-label={language === 'en' ? "Copy message" : "نسخ الرسالة"}
        className="p-2 hover:bg-primary/10 rounded-full transition-colors"
      >
        <Copy className="w-4 h-4 text-muted-foreground hover:text-primary" />
      </Button>

      {message.type === 'user' && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleEdit}
          aria-label={language === 'en' ? "Edit message" : "تعديل الرسالة"}
          className="p-2 hover:bg-primary/10 rounded-full transition-colors"
        >
          <Edit className="w-4 h-4 text-muted-foreground hover:text-primary" />
        </Button>
      )}

      {message.type === 'bot' && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFavorite}
            aria-label={language === 'en' ? "Add to favorites" : "إضافة للمفضلة"}
            className="p-2 hover:bg-primary/10 rounded-full transition-colors"
          >
            <Star className={`w-4 h-4 ${isFavorited ? 'text-yellow-500 fill-current' : 'text-muted-foreground hover:text-primary'}`} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSpeak?.(message.content)}
            aria-label={language === 'en' ? "Read aloud" : "قراءة بصوت عالٍ"}
            className="p-2 hover:bg-primary/10 rounded-full transition-colors"
          >
            <Volume2 className="w-4 h-4 text-muted-foreground hover:text-primary" />
          </Button>
        </>
      )}
    </div>
  );
};

export default MessageActions;
