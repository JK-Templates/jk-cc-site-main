import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Send, MessageSquare } from 'lucide-react';
import { RegisteredOnly } from '@/components/auth/AccessControl';

export default function Comments({ entityType, entityId }) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', entityType, entityId],
    queryFn: async () => {
      const res = await base44.entities.Comment.list({ 
        entityType, 
        entityId 
      }, '-created_date');
      return res;
    }
  });

  const createComment = useMutation({
    mutationFn: async (newComment) => {
      return await base44.entities.Comment.create(newComment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', entityType, entityId]);
      setContent('');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    createComment.mutate({
      entityType,
      entityId,
      content,
      userId: user.id || user.email, // Fallback to email if id not present
      userEmail: user.email,
      userName: user.name,
      userPicture: user.picture
    });
  };

  return (
    <div className="space-y-6 mt-8 p-6 bg-slate-900/30 rounded-xl border border-slate-800">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-amber-500" />
        <h3 className="text-xl font-bold text-slate-200">תגובות ({comments?.length || 0})</h3>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {isLoading ? (
          <div className="text-center py-4 text-slate-500">טוען תגובות...</div>
        ) : comments?.length === 0 ? (
          <div className="text-center py-8 text-slate-500 italic">אין תגובות עדיין. היה הראשון להגיב!</div>
        ) : (
          comments?.map((comment) => (
            <div key={comment.id} className="flex gap-4 p-4 bg-slate-950/50 rounded-lg border border-slate-800/50">
              <Avatar className="w-10 h-10 border border-slate-700">
                <AvatarImage src={comment.userPicture} />
                <AvatarFallback>{comment.userName?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-slate-300">{comment.userName}</span>
                  <span className="text-xs text-slate-500">
                    {format(new Date(comment.created_date), 'dd/MM/yyyy HH:mm')}
                  </span>
                </div>
                <p className="text-slate-400 mt-1 text-sm whitespace-pre-wrap">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <RegisteredOnly 
        fallback={
          <div className="p-4 bg-slate-900/50 rounded-lg text-center text-slate-400 text-sm">
            יש להתחבר כדי להגיב
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="flex gap-4">
          <Avatar className="w-10 h-10 hidden md:block">
            <AvatarImage src={user?.picture} />
            <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 flex gap-2">
            <Textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="כתוב תגובה..."
              className="bg-slate-950 border-slate-800 focus:border-amber-500/50 min-h-[80px]"
            />
            <Button 
              type="submit" 
              size="icon" 
              className="h-auto bg-amber-500 hover:bg-amber-600 text-slate-950"
              disabled={createComment.isPending || !content.trim()}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </form>
      </RegisteredOnly>
    </div>
  );
}