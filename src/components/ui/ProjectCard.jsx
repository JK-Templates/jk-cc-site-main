import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Github, ExternalLink, Info } from 'lucide-react';
import LikeButton from '@/components/ui/LikeButton';
import ProjectDetailsModal from '@/components/ui/ProjectDetailsModal';
import { Button } from '@/components/ui/button';

export default function ProjectCard({ project }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const showCodeView = project.code_snippet && (!project.image_url || project.category === 'code');

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="relative group h-full"
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl z-0"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(245,158,11,0.1), transparent 40%)`,
        }}
      />
      
      <Card className="relative z-10 bg-slate-900 border-slate-800 overflow-hidden hover:border-amber-500/30 transition-all hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] h-full flex flex-col">
      <div className="h-56 overflow-hidden relative bg-slate-950">
        
        {showCodeView ? (
            <div className="w-full h-full p-4 font-mono text-xs relative group-hover:scale-105 transition-transform duration-500">
                {/* Terminal Header */}
                <div className="flex items-center gap-1.5 mb-2 opacity-50">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                    <span className="ml-2 text-[10px] text-slate-500">{project.language || 'code'}</span>
                </div>
                {/* Code Content */}
                <div className="text-slate-300 overflow-hidden h-full pb-6 opacity-80 group-hover:opacity-100 transition-opacity">
                    <pre className="whitespace-pre-wrap break-all">
                        <span className="text-purple-400">const</span> <span className="text-blue-400">{project.title.replace(/\s+/g, '')}</span> = <span className="text-yellow-400">async</span> () ={'>'} {'{'}
                        {'\n'}  {project.code_snippet.slice(0, 150)}...
                        {'\n'}{'}'}
                    </pre>
                </div>
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent pointer-events-none" />
            </div>
        ) : (
            <>
                <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-all z-10" />
                {project.image_url ? (
                <img 
                    src={project.image_url} 
                    alt={project.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                ) : (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-600">
                    <Globe className="w-12 h-12" />
                </div>
                )}
            </>
        )}
        
        <div className="absolute top-4 right-4 z-20">
          <Badge className="bg-slate-950/80 backdrop-blur text-slate-200 border-slate-700 shadow-sm">
            {project.category}
          </Badge>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-amber-400 transition-colors">
          {project.title}
        </h3>
        <p className="text-slate-400 text-sm mb-6 flex-grow leading-relaxed">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {project.technologies?.map((tech, i) => (
            <span key={i} className="text-xs text-slate-500 bg-slate-950 px-2 py-1 rounded border border-slate-800">
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-auto flex gap-2">
            {project.github_url && (
            <a 
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 flex-1 py-3 bg-slate-950 border border-slate-800 hover:border-slate-600 text-slate-300 rounded-lg transition-all font-medium text-sm group/git"
            >
                <Github className="w-4 h-4 group-hover/git:text-white" />
                Source
            </a>
            )}
            
            {(project.link_url || project.video_url) && (
            <a 
                href={project.link_url || project.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2 ${project.github_url ? 'flex-1' : 'w-full'} py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors font-medium text-sm`}
            >
                <ExternalLink className="w-4 h-4" />
                {project.category === 'code' ? 'Demo' : project.category === 'ai_video' ? 'Watch' : 'Visit'}
            </a>
            )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center">
            <LikeButton entityName="Project" entityId={project.id} initialLikes={project.likes} />
            <ProjectDetailsModal 
              project={project} 
              trigger={
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-amber-500 gap-2">
                  <Info className="w-4 h-4" />
                  פרטים ותגובות
                </Button>
              } 
            />
        </div>
      </div>
      </Card>
    </motion.div>
  );
}