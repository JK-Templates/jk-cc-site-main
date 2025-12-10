import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Handshake } from 'lucide-react';

export default function AdoptionModal({ project, isOpen, onClose }) {
  const { user } = useAuth();
  const [message, setMessage] = useState('');

  const createRequest = useMutation({
    mutationFn: async (data) => {
      return await base44.entities.AdoptionRequest.create(data);
    },
    onSuccess: () => {
      toast.success('בקשת האימוץ נשלחה בהצלחה!', {
        description: 'ניצור איתך קשר בהקדם.'
      });
      setMessage('');
      onClose();
    },
    onError: () => {
      toast.error('שגיאה בשליחת הבקשה');
    }
  });

  const handleSubmit = () => {
    if (!message.trim()) return;

    createRequest.mutate({
      projectId: project.id,
      projectTitle: project.title,
      userId: user.id || user.email,
      userEmail: user.email,
      userName: user.name,
      message
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-950 border-slate-800 text-slate-200 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-500">
            <Handshake className="w-5 h-5" />
            אימוץ פרויקט: {project.title}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            מעוניין להמשיך לפתח את הפרויקט? שלח בקשה וספר לנו למה אתה מעוניין ומה התוכניות שלך.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="היי, אני מעוניין לאמץ את הפרויקט כי..."
            className="min-h-[120px] bg-slate-900 border-slate-700 focus:border-amber-500/50"
          />
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} className="text-slate-400 hover:text-slate-200">
            ביטול
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950"
            disabled={createRequest.isPending || !message.trim()}
          >
            {createRequest.isPending ? 'שולח...' : 'שלח בקשה'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}