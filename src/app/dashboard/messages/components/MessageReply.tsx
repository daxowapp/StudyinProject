'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Paperclip, X, FileText, Image as ImageIcon, File } from 'lucide-react';
import { toast } from 'sonner';
import { sendReply } from '../actions';

interface MessageReplyProps {
  applicationId: string;
  originalMessageId: string;
  onSuccess?: () => void;
}

interface AttachmentFile {
  file: File;
  preview?: string;
}

export function MessageReply({ applicationId, originalMessageId, onSuccess }: MessageReplyProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxSize = 10 * 1024 * 1024; // 10MB

    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Max size is 10MB`);
        return false;
      }
      return true;
    });

    const newAttachments: AttachmentFile[] = validFiles.map(file => {
      const attachment: AttachmentFile = { file };
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          attachment.preview = reader.result as string;
        };
        reader.readAsDataURL(file);
      }
      
      return attachment;
    });

    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <ImageIcon className="w-4 h-4" />;
    if (fileType.includes('pdf')) return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const handleSubmit = async () => {
    if (!message.trim() && attachments.length === 0) {
      toast.error('Please enter a message or attach a file');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('applicationId', applicationId);
      formData.append('message', message);
      formData.append('originalMessageId', originalMessageId);
      
      attachments.forEach((attachment, index) => {
        formData.append(`file_${index}`, attachment.file);
      });

      const result = await sendReply(formData);
      
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Reply sent successfully!');
        setMessage('');
        setAttachments([]);
        setIsOpen(false);
        onSuccess?.();
      }
    } catch (error) {
      toast.error('Failed to send reply');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="gap-2"
      >
        <Send className="w-4 h-4" />
        Reply
      </Button>
    );
  }

  return (
    <Card className="mt-4 border-l-4 border-l-blue-500">
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">Write a Reply</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsOpen(false);
              setMessage('');
              setAttachments([]);
            }}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <Label>Your Message</Label>
          <Textarea
            placeholder="Type your reply here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[120px]"
            disabled={isLoading}
          />
        </div>

        {/* Attachments */}
        {attachments.length > 0 && (
          <div className="space-y-2">
            <Label>Attachments ({attachments.length})</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="relative border rounded-lg p-2 flex items-center gap-2 bg-muted/50"
                >
                  {attachment.preview ? (
                    <img
                      src={attachment.preview}
                      alt={attachment.file.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : (
                    <div className="w-10 h-10 flex items-center justify-center bg-muted rounded">
                      {getFileIcon(attachment.file.type)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">
                      {attachment.file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(attachment.file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttachment(index)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <Input
              type="file"
              id={`file-upload-${originalMessageId}`}
              className="hidden"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt"
              onChange={handleFileSelect}
              disabled={isLoading}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById(`file-upload-${originalMessageId}`)?.click()}
              disabled={isLoading}
              className="gap-2"
            >
              <Paperclip className="w-4 h-4" />
              Attach Files
            </Button>
          </div>
          
          <Button
            onClick={handleSubmit}
            disabled={isLoading || (!message.trim() && attachments.length === 0)}
            className="gap-2"
          >
            <Send className="w-4 h-4" />
            {isLoading ? 'Sending...' : 'Send Reply'}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Accepted formats: PDF, DOC, DOCX, JPG, PNG, GIF, TXT (Max 10MB per file)
        </p>
      </CardContent>
    </Card>
  );
}
