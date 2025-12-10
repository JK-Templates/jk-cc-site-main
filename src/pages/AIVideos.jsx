import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Film, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import SeoHead from '@/components/SeoHead';
import LikeButton from '@/components/ui/LikeButton';
import ProjectDetailsModal from '@/components/ui/ProjectDetailsModal';
import { Button } from '@/components/ui/button';

export default function AIVideosPage() {
  const { data: videos, isLoading } = useQuery({
    queryKey: ['projects', 'ai_video'],
    queryFn: async () => {
      const allProjects = await base44.entities.Project.list();
      return allProjects.filter(p => p.category === 'ai_video');
    }
  });

  return (
    <div className="min-h-screen pt-10">
      <SeoHead 
        title="AI Videos | Jony Kashi" 
        description="A collection of AI-generated commercials, trailers, and short films." 
      />

      <div className="flex flex-col items-center mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-full bg-slate-900/50 mb-6 border border-slate-800"
        >
          <Film className="w-8 h-8 text-amber-500" />
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-600"
        >
          סרטוני AI
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 max-w-2xl text-lg"
        >
          פרסומות קצרות, טריילירים ויצירות ויזואליות שנוצרו באמצעות בינה מלאכותית.
        </motion.p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {videos?.map((video, index) => (
              <VideoCard key={video.id} video={video} index={index} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {!isLoading && videos?.length === 0 && (
        <div className="text-center py-20 text-slate-500">
          <p>טרם הועלו סרטונים.</p>
        </div>
      )}
    </div>
  );
}

function VideoCard({ video, index }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="bg-slate-900 border-slate-800 overflow-hidden hover:border-amber-500/30 transition-all group h-full flex flex-col">
        <div className="relative aspect-video bg-slate-950 group">
          {video.video_url && isPlaying ? (
            <iframe 
              src={getEmbedUrl(video.video_url)} 
              className="w-full h-full" 
              allow="autoplay; encrypted-media" 
              allowFullScreen
              title={video.title}
            />
          ) : (
            <>
              <img 
                src={video.image_url || 'https://images.unsplash.com/photo-1626544827763-d516dce335ca?q=80&w=1000&auto=format&fit=crop'} 
                alt={video.title}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
                <button 
                  onClick={() => setIsPlaying(true)}
                  className="w-16 h-16 rounded-full bg-amber-500/90 text-slate-950 flex items-center justify-center transform group-hover:scale-110 transition-transform"
                >
                  <Play className="w-6 h-6 ml-1 fill-current" />
                </button>
              </div>
            </>
          )}
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
              {video.title}
            </h3>
          </div>
          <p className="text-slate-400 text-sm mb-4 line-clamp-3 flex-grow">
            {video.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {video.technologies?.map((tech, i) => (
              <span key={i} className="text-xs text-slate-500 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                {tech}
              </span>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-800 mt-auto">
            <LikeButton entityName="Project" entityId={video.id} initialLikes={video.likes} />
             <ProjectDetailsModal 
              project={video} 
              trigger={
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-amber-500">
                  פרטים נוספים
                </Button>
              } 
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function getEmbedUrl(url) {
  if (!url) return '';
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.split('v=')[1] || url.split('/').pop();
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }
  if (url.includes('vimeo.com')) {
    const videoId = url.split('/').pop();
    return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
  }
  return url;
}