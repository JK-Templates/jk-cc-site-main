import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Tag, ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GridSkeleton } from '@/components/ui/Skeletons';
import { createPageUrl } from '@/utils';
import SeoHead from '@/components/SeoHead';

export default function BlogPage() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => base44.entities.BlogPost.list({ status: 'published' }, '-published_date'),
  });

  return (
    <div className="pt-10">
      <SeoHead 
        title="הבלוג | Jony Kashi" 
        description="מחשבות, מדריכים ותובנות על טכנולוגיה, AI ופילוסופיה." 
      />
      
      <header className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-200 to-teal-400">
          הבלוג
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          מחשבות, מדריכים ותובנות על טכנולוגיה, AI ופילוסופיה.
        </p>
      </header>

      {isLoading ? (
        <GridSkeleton count={3} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts?.map((post, index) => (
                <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Link to={`${createPageUrl('BlogPost')}?id=${post.id}`}>
                        <Card className="bg-slate-900 border-slate-800 overflow-hidden hover:border-emerald-500/30 transition-all hover:shadow-lg h-full flex flex-col group">
                            <div className="h-48 overflow-hidden relative bg-slate-950">
                                {post.cover_image && (
                                    <img 
                                        src={post.cover_image} 
                                        alt={post.title} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex gap-2 mb-3">
                                    {post.categories?.slice(0, 2).map(cat => (
                                        <Badge key={cat} variant="secondary" className="bg-emerald-900/30 text-emerald-400 border-none text-xs">
                                            {cat}
                                        </Badge>
                                    ))}
                                </div>
                                <h2 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-emerald-300 transition-colors">
                                    {post.title}
                                </h2>
                                <p className="text-slate-400 text-sm line-clamp-3 mb-4 flex-grow">
                                    {post.excerpt}
                                </p>
                                <div className="flex items-center justify-between text-slate-500 text-xs mt-auto pt-4 border-t border-slate-800">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(post.published_date).toLocaleDateString('he-IL')}
                                    </span>
                                    <span className="flex items-center gap-1 text-emerald-500 group-hover:translate-x-[-4px] transition-transform">
                                        קרא עוד <ArrowLeft className="w-3 h-3" />
                                    </span>
                                </div>
                            </div>
                        </Card>
                    </Link>
                </motion.div>
            ))}
        </div>
      )}
    </div>
  );
}