import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Github, ExternalLink, Handshake, MessageSquare } from 'lucide-react';
import Comments from '@/components/ui/Comments';
import AdoptionModal from '@/components/ui/AdoptionModal';
import { RegisteredOnly } from '@/components/auth/AccessControl';

export default function ProjectDetailsModal({ project, trigger }) {
  const [isAdoptionOpen, setIsAdoptionOpen] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-950 border-slate-800 text-slate-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-100 flex items-center justify-between">
            {project.title}
            <Badge variant="outline" className="ml-2 border-amber-500/50 text-amber-500">
              {project.category}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-8 mt-4">
          <div>
            {project.image_url && (
              <img 
                src={project.image_url} 
                alt={project.title} 
                className="w-full h-64 object-cover rounded-xl mb-6 border border-slate-800"
              />
            )}
            
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap mb-6">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {project.technologies?.map((tech, i) => (
                <Badge key={i} variant="secondary" className="bg-slate-900 text-slate-400">
                  {tech}
                </Badge>
              ))}
            </div>

            <div className="flex gap-4">
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-white">
                  <Github className="w-4 h-4" /> Source Code
                </a>
              )}
              {project.link_url && (
                <a href={project.link_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-white">
                  <ExternalLink className="w-4 h-4" /> Live Demo
                </a>
              )}
            </div>

            <div className="mt-8 pt-8 border-t border-slate-800">
               <RegisteredOnly 
                 fallback={
                   <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20 text-center">
                     <p className="text-amber-500 text-sm font-medium mb-2">מעוניין לאמץ את הפרויקט?</p>
                     <p className="text-slate-400 text-xs">התחבר למערכת כדי להגיש בקשה</p>
                   </div>
                 }
               >
                  <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-800">
                    <h4 className="text-lg font-semibold mb-2 flex items-center gap-2 text-amber-500">
                      <Handshake className="w-5 h-5" />
                      אימוץ פרויקט
                    </h4>
                    <p className="text-sm text-slate-400 mb-4">
                      רוצה לקחת את הפרויקט הזה לשלב הבא? שלח בקשת אימוץ וקבל גישה לקוד ולמשאבים.
                    </p>
                    <Button 
                      onClick={() => setIsAdoptionOpen(true)}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
                    >
                      הגש בקשת אימוץ
                    </Button>
                  </div>
               </RegisteredOnly>
            </div>
          </div>

          <div className="border-t md:border-t-0 md:border-r md:pr-8 border-slate-800 pt-8 md:pt-0">
            <Comments entityType="Project" entityId={project.id} />
          </div>
        </div>

        <AdoptionModal 
          project={project} 
          isOpen={isAdoptionOpen} 
          onClose={() => setIsAdoptionOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  );
}