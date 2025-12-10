import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Code2, Database, Film } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full min-h-[80vh] flex flex-col items-center justify-center text-center relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-64 h-64 md:w-96 md:h-96 rounded-full overflow-hidden mb-12 relative z-10 shadow-[0_0_100px_rgba(245,158,11,0.2)]"
        >
           {/* Using the Geometric Sphere image provided by user */}
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_690f86f9ae14595b002611c5/c0ecdc595_ChatGPTImageOct12202501_33_36AM.png" 
            alt="Geometric Sphere" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-50" />
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-slate-100 to-slate-500"
        >
          ארכיטקטורה של מחשבה
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-xl md:text-2xl text-slate-400 max-w-2xl leading-relaxed mb-10"
        >
          יונתן קאשי. מפתח, יוצר והוגה. <br/>
          בונה גשרים בין טכנולוגיה, פילוסופיה ואמנות.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Link to={createPageUrl('Portfolio')}>
            <button className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-full transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]">
              לצפייה בעבודות <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <Link to={createPageUrl('Codex')}>
            <button className="px-8 py-4 bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-200 font-medium rounded-full transition-all">
              הקודקס הפילוסופי
            </button>
          </Link>
        </motion.div>
      </section>

      {/* Featured Categories Preview */}
      <section className="w-full py-20 grid md:grid-cols-3 gap-8">
        <CategoryCard 
          icon={Code2}
          title="קוד וטכנולוגיה"
          description="פיתוח מערכות, אתרים ופרויקטים בקוד פתוח. Base44, אוטומציה ו-AI."
          image="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_690f86f9ae14595b002611c5/965525a32_ChatGPTImageOct9202508_49_42PM.png"
          link="Portfolio"
        />
        <CategoryCard 
          icon={Database}
          title="קודקס ומחקר"
          description="מסמכים אסטרטגיים, פילוסופיה של הבינה המלאכותית ופרוטוקולים."
          image="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_690f86f9ae14595b002611c5/b51d40531_Whisk_7b8f70273b65b0da25b47ac010aafc60dr.jpg"
          link="Codex"
        />
        <CategoryCard 
          icon={Film}
          title="סרטוני AI"
          description="פרסומות, טריילירים ויצירות וידאו שנוצרו בבינה מלאכותית."
          image="https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=2000&auto=format&fit=crop"
          link="AIVideos"
        />
        <CategoryCard 
          icon={ExternalLink}
          title="Base44"
          description="פלטפורמת הפיתוח המהפכנית. המקום שבו הכל מתחבר."
          image="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
          link="Base44"
        />
      </section>
    </div>
  );
}

import TiltWrapper from '@/components/ui/TiltWrapper';

function CategoryCard({ icon: Icon, title, description, image, link }) {
  return (
    <TiltWrapper>
        <Link to={createPageUrl(link)} className="block group relative overflow-hidden rounded-2xl h-80 bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all duration-500 shadow-xl">
        <div className="absolute inset-0">
            <img src={image} alt={title} className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-start transform transition-transform duration-500 group-hover:translate-y-[-10px]">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 mb-4 backdrop-blur-sm border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors duration-300">
            <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-100 mb-2 group-hover:text-amber-400 transition-colors">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
        </div>
        </Link>
    </TiltWrapper>
  );
}