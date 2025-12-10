import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Sparkles, Filter, SortAsc, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LikeButton from '@/components/ui/LikeButton';
import DriveEmbed from '@/components/ui/DriveEmbed';
import { ListSkeleton } from '@/components/ui/Skeletons';

export default function CodexPage() {
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const { data: documents, isLoading } = useQuery({
    queryKey: ['codex'],
    queryFn: () => base44.entities.Codex.list(),
  });

  const filteredDocs = documents
    ?.filter(doc => filterType === 'all' || doc.type === filterType)
    .sort((a, b) => {
        if (sortBy === 'likes') return (b.likes || 0) - (a.likes || 0);
        if (sortBy === 'oldest') return new Date(a.created_date) - new Date(b.created_date);
        return new Date(b.created_date) - new Date(a.created_date); // newest
    });

  return (
    <div className="pt-10">
      <header className="mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 font-serif">
          הקודקס
        </h1>
        <p className="text-slate-400 text-lg max-w-3xl leading-relaxed border-r-4 border-amber-500 pr-6">
          מאגר הידע, הפילוסופיה והפרוטוקולים. <br/>
          אוסף זה מרכז את עבודות המחקר, המניפסטים והתובנות המעצבות את תפיסת העולם והטכנולוגיה שלי.
        </p>
        
        {/* Controls */}
        <div className="mt-8 flex flex-wrap gap-4 items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-500" />
                <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[150px] bg-slate-950 border-slate-800">
                        <SelectValue placeholder="סנן לפי סוג" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">הכל</SelectItem>
                        <SelectItem value="philosophy">פילוסופיה</SelectItem>
                        <SelectItem value="protocol">פרוטוקולים</SelectItem>
                        <SelectItem value="inspiration">השראה</SelectItem>
                        <SelectItem value="technical">טכני</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center gap-2">
                <SortAsc className="w-4 h-4 text-slate-500" />
                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[150px] bg-slate-950 border-slate-800">
                        <SelectValue placeholder="מיין לפי" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">הכי חדש</SelectItem>
                        <SelectItem value="oldest">הכי ישן</SelectItem>
                        <SelectItem value="likes">פופולריות</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
      </header>

      <div className="grid gap-8">
        {isLoading ? (
            <ListSkeleton />
        ) : (
            <>
                <AnimatePresence mode="popLayout">
                {filteredDocs?.map((doc, index) => (
                    <CodexEntry key={doc.id} doc={doc} index={index} />
                ))}
                </AnimatePresence>
                
                {documents?.length === 0 && (
                    <div className="text-center py-12 bg-slate-900/50 rounded-xl border border-dashed border-slate-800">
                        <p className="text-slate-500">הספרייה עדיין נבנית...</p>
                    </div>
                )}
            </>
        )}
      </div>
    </div>
  );
}

function CodexEntry({ doc, index }) {
  const isEmbed = !!doc.embed_code;
  const [summary, setSummary] = useState(doc.summary);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const handleSummarize = async () => {
    setIsSummarizing(true);
    try {
        // Extract text content from embed code or iframe url (simplified: just sending title and subtitle for now as we can't scrape safely here)
        // Ideally we would have the full text content in the entity.
        // Assuming we want to summarize based on title/subtitle/type context for this demo since we don't have full text field.
        // Or if 'embed_code' contains text.
        const textToSummarize = `Title: ${doc.title}\nSubtitle: ${doc.subtitle}\nType: ${doc.type}\nContent context: ${doc.drive_link || doc.iframe_url || "Embedded content"}`;
        
        const { data } = await base44.functions.invoke('aiHelper', {
            action: 'summarize_codex',
            data: { text: textToSummarize }
        });

        if (data.result) {
            setSummary(data.result);
            // Save it back to DB
            await base44.entities.Codex.update(doc.id, { summary: data.result });
        }
    } catch (e) {
        console.error(e);
    } finally {
        setIsSummarizing(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="bg-slate-900/50 border-slate-800 overflow-hidden hover:border-amber-900/50 transition-all hover:shadow-lg hover:shadow-amber-900/10">
        <div className="grid md:grid-cols-[300px_1fr] gap-0">
          {/* Cover / Visual Side */}
          <div className="bg-slate-950 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-l border-slate-800 relative group">
             {doc.cover_image && (
                 <div className="absolute inset-0 z-0">
                     <img src={doc.cover_image} className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-700" alt="" />
                 </div>
             )}
            <div className="relative z-10">
                <Badge variant="outline" className="border-amber-500/50 text-amber-500 mb-4 rounded-md">
                {doc.type}
                </Badge>
                <h2 className="text-2xl font-bold text-slate-100 font-serif mb-2">{doc.title}</h2>
                {doc.subtitle && <h3 className="text-lg text-slate-400 italic mb-4">{doc.subtitle}</h3>}
                
                {/* AI Summary Section */}
                <div className="mt-6 pt-6 border-t border-slate-800">
                    {!summary ? (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={handleSummarize} 
                            disabled={isSummarizing}
                            className="text-amber-500/70 hover:text-amber-400 hover:bg-amber-900/20 text-xs w-full justify-start gap-2"
                        >
                            {isSummarizing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                            תקציר AI
                        </Button>
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-amber-950/20 p-3 rounded-lg border border-amber-900/30">
                            <div className="flex items-center gap-1.5 text-amber-500 mb-1.5">
                                <Sparkles className="w-3 h-3" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">AI Summary</span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed font-serif italic">
                                "{summary}"
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>
            
            <div className="relative z-10 pt-4 hidden md:block">
               <FileText className="w-8 h-8 text-slate-700 mb-2" />
            </div>
          </div>

          {/* Content Side */}
          <div className="p-8 flex flex-col h-full">
            <div className="prose prose-invert max-w-none mb-6 flex-grow">
                {doc.iframe_url ? (
                     <div className="w-full h-full bg-slate-950 rounded-lg overflow-hidden border border-slate-800 relative group/frame">
                        <iframe 
                            src={doc.iframe_url} 
                            className="w-full h-full min-h-[500px]"
                            title={doc.title}
                            allowFullScreen
                        />
                        <a 
                            href={doc.iframe_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="absolute top-2 right-2 p-2 bg-slate-900/80 hover:bg-amber-500 hover:text-slate-950 text-slate-400 backdrop-blur rounded transition-colors"
                            title="פתח בחלון חדש"
                        >
                            <span className="sr-only">Open in new tab</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        </a>
                     </div>
                ) : doc.drive_link ? (
                    <DriveEmbed url={doc.drive_link} title={doc.title} />
                ) : isEmbed ? (
                    <div 
                        className="w-full aspect-[16/9] md:aspect-[21/9] bg-slate-950 rounded-lg overflow-hidden border border-slate-800 shadow-inner"
                        dangerouslySetInnerHTML={{ __html: doc.embed_code }}
                    />
                ) : (
                    <div className="flex items-center justify-center h-48 bg-slate-950/50 border border-dashed border-slate-800 rounded-lg text-slate-500">
                        <p>המסמך טרם חובר</p>
                    </div>
                )}
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-slate-800/50">
                <LikeButton entityName="Codex" entityId={doc.id} initialLikes={doc.likes} />
                {doc.drive_link && (
                    <a href={doc.drive_link} target="_blank" rel="noopener noreferrer" className="text-xs text-amber-500 hover:underline">
                        פתח ב-Google Drive
                    </a>
                )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}