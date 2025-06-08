
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Copy,
  Share2,
  Link,
  Download,
  Check
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

interface ShareChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  sessionId: string;
  language: string;
}

const ShareChatModal: React.FC<ShareChatModalProps> = ({
  isOpen,
  onClose,
  messages,
  sessionId,
  language
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  // Generate shareable URL (in a real app, this would create a public share link)
  React.useEffect(() => {
    if (isOpen) {
      const url = `${window.location.origin}/shared-chat/${sessionId}`;
      setShareUrl(url);
    }
  }, [isOpen, sessionId]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: language === 'en' ? "Link Copied!" : "تم نسخ الرابط!",
        description: language === 'en' 
          ? "Chat link has been copied to clipboard."
          : "تم نسخ رابط المحادثة إلى الحافظة."
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: language === 'en' ? "Error" : "خطأ",
        description: language === 'en' 
          ? "Failed to copy link to clipboard."
          : "فشل في نسخ الرابط إلى الحافظة.",
        variant: "destructive"
      });
    }
  };

  const handleDownloadChat = () => {
    const chatData = {
      sessionId,
      timestamp: new Date().toISOString(),
      messages: messages.map(msg => ({
        type: msg.type,
        content: msg.content,
        timestamp: msg.timestamp.toISOString(),
        isDeepThink: msg.isDeepThink || false
      }))
    };

    const blob = new Blob([JSON.stringify(chatData, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medical-chat-${sessionId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: language === 'en' ? "Chat Downloaded!" : "تم تحميل المحادثة!",
      description: language === 'en' 
        ? "Chat has been saved to your device."
        : "تم حفظ المحادثة على جهازك."
    });
  };

  const handleShareToSocial = (platform: string) => {
    const text = language === 'en' 
      ? "Check out this medical AI chat conversation"
      : "اطلع على هذه المحادثة مع الذكاء الطبي";
    
    let url = '';
    
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`;
        break;
    }
    
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Share2 className="w-5 h-5 mr-2" />
            {language === 'en' ? 'Share Chat' : 'مشاركة المحادثة'}
          </DialogTitle>
          <DialogDescription>
            {language === 'en' 
              ? "Share this medical conversation with others or save it for later."
              : "شارك هذه المحادثة الطبية مع الآخرين أو احفظها لوقت لاحق."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Share Link */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              {language === 'en' ? 'Share Link' : 'رابط المشاركة'}
            </label>
            <div className="flex space-x-2">
              <Input
                value={shareUrl}
                readOnly
                className="flex-1"
                placeholder="Generating link..."
              />
              <Button
                onClick={handleCopyLink}
                variant="outline"
                size="sm"
                className="px-3"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Download Option */}
          <div>
            <Button
              onClick={handleDownloadChat}
              variant="outline"
              className="w-full justify-start"
            >
              <Download className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Download as JSON' : 'تحميل كـ JSON'}
            </Button>
          </div>

          {/* Social Share */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              {language === 'en' ? 'Share on Social Media' : 'مشاركة على وسائل التواصل'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => handleShareToSocial('twitter')}
                variant="outline"
                size="sm"
                className="justify-start"
              >
                <span className="mr-2">🐦</span>
                Twitter
              </Button>
              <Button
                onClick={() => handleShareToSocial('facebook')}
                variant="outline"
                size="sm"
                className="justify-start"
              >
                <span className="mr-2">📘</span>
                Facebook
              </Button>
              <Button
                onClick={() => handleShareToSocial('linkedin')}
                variant="outline"
                size="sm"
                className="justify-start"
              >
                <span className="mr-2">💼</span>
                LinkedIn
              </Button>
              <Button
                onClick={() => handleShareToSocial('whatsapp')}
                variant="outline"
                size="sm"
                className="justify-start"
              >
                <span className="mr-2">💬</span>
                WhatsApp
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            {language === 'en' ? 'Close' : 'إغلاق'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareChatModal;
