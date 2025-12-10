import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import { Calendar, Tag, User, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import SeoHead from '@/components/SeoHead';
import LikeButton from '@/components/ui/LikeButton';
import Comments from '@/components/ui/Comments';

export default function BlogPostPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');

  const { data: post, isLoading } = useQuery({
    queryKey: ['blogPost', id],
    queryFn: async () => {
        if (!id) return null;
        return await base44.entities.BlogPost.get(id);
    },
    enabled: !!id
  });

  if (isLoading) return <div className="pt-20 text-center text-slate-500">Loading post...</div>;
  if (!post) return <div className="pt-20 text-center text-slate-500">Post not found.</div>;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": post.cover_image,
    "datePublished": post.published_date,
    "author": [{
        "@type": "Person",
        "name": "Jony Kashi"
    }]
  };

  return (
    <div className="pt-10 max-w-4xl mx-auto">
      <SeoHead 
        title={post.title} 
        description={post.excerpt} 
        image={post.cover_image}
        type="article"
        schema={schema}
      />

      <Link to={createPageUrl('Blog')}>
        <Button variant="ghost" className="mb-8 text-slate-400 hover:text-white pl-0 gap-2">
            <ArrowRight className="w-4 h-4" /> חזרה לבלוג
        </Button>
      </Link>

      <article>
        {/* Header */}
        <header className="mb-12">
            <div className="flex gap-2 mb-6">
                {post.categories?.map(cat => (
                    <Badge key={cat} className="bg-emerald-500 text-slate-950 hover:bg-emerald-400">
                        {cat}
                    </Badge>
                ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-6 leading-tight">
                {post.title}
            </h1>
            <div className="flex items-center gap-6 text-slate-500 border-b border-slate-800 pb-8">
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>Jony Kashi</span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(post.published_date).toLocaleDateString('he-IL')}</span>
                </div>
            </div>
        </header>

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none prose-emerald prose-headings:font-bold prose-p:text-slate-300 prose-a:text-emerald-400">
            {post.cover_image && (
                <img src={post.cover_image} alt={post.title} className="w-full h-[400px] object-cover rounded-2xl mb-12" />
            )}
            <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-slate-800 flex justify-between items-center">
            <div className="flex gap-2">
                {post.tags?.map(tag => (
                    <Badge key={tag} variant="outline" className="text-slate-500 border-slate-700">
                        #{tag}
                    </Badge>
                ))}
            </div>
            <LikeButton entityName="BlogPost" entityId={post.id} className="bg-slate-900 px-4 py-2 rounded-full border border-slate-800 hover:border-red-500/50" />
        </div>

        <Comments entityType="BlogPost" entityId={post.id} />
      </article>
    </div>
  );
}