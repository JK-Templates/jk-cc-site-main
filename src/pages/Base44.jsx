import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Zap, Shield, Database, Globe, Cpu, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import SeoHead from '@/components/SeoHead';

export default function Base44Page() {
  return (
    <div className="pt-10">
      <SeoHead 
        title="Base44 | The Development Platform" 
        description="Base44 is the revolutionary development platform where everything connects." 
      />

      {/* Hero Section */}
      <section className="text-center py-20 relative">
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-block p-4 rounded-2xl bg-slate-900/50 border border-slate-800 mb-8 backdrop-blur-sm"
        >
            <Layers className="w-16 h-16 text-amber-500" />
        </motion.div>
        
        <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500"
        >
            Base44
        </motion.h1>
        
        <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10"
        >
            פלטפורמת הפיתוח המהפכנית שמשנה את הדרך בה אנו בונים יישומים.
            <br />
            תשתיות ענן, אבטחה, ומסדי נתונים - הכל במקום אחד.
        </motion.p>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
        >
            <a href="https://base44.com" target="_blank" rel="noopener noreferrer">
                <Button className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-8 py-6 text-lg rounded-full shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_50px_rgba(245,158,11,0.5)] transition-all">
                    התחל לבנות ב-Base44
                </Button>
            </a>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-8 mb-20">
        <FeatureCard 
            icon={Database}
            title="Backend as a Service"
            description="ניהול ישויות, מסדי נתונים וסכמות JSON בצורה ויזואלית ופשוטה."
        />
        <FeatureCard 
            icon={Shield}
            title="אבטחה מובנית"
            description="אימות משתמשים, הרשאות וניהול תפקידים (RBAC) מוכנים מראש."
        />
        <FeatureCard 
            icon={Globe}
            title="פריסה גלובלית"
            description="האפליקציות שלך רצות על Edge Network מהיר ומאובטח בכל העולם."
        />
        <FeatureCard 
            icon={Zap}
            title="אינטגרציות AI"
            description="חיבור מובנה למודלי שפה, יצירת תמונות וכלים מתקדמים."
        />
        <FeatureCard 
            icon={Cpu}
            title="Serverless Functions"
            description="הרצת קוד בצד שרת ללא ניהול שרתים, עם תמיכה ב-Deno."
        />
        <FeatureCard 
            icon={Layers}
            title="Frontend Agnostic"
            description="בנה את הממשק שלך עם React, Tailwind וכל כלי שתרצה."
        />
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-purple-500/10" />
        <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4 text-white">מוכן להתחיל?</h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                הצטרף למהפכת הפיתוח וצור את האפליקציה הבאה שלך במהירות שיא.
            </p>
            <div className="flex justify-center gap-4">
                <Link to={createPageUrl('Contact')}>
                    <Button variant="outline" className="border-slate-700 hover:bg-slate-800">
                        צור קשר
                    </Button>
                </Link>
                <Link to={createPageUrl('Portfolio')}>
                     <Button variant="ghost" className="text-amber-500 hover:text-amber-400">
                        ראה דוגמאות <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </Link>
            </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
    return (
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-900 hover:border-amber-500/30 transition-all hover:bg-slate-900 group">
            <div className="w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-slate-800 group-hover:border-amber-500/50">
                <Icon className="w-6 h-6 text-slate-400 group-hover:text-amber-500 transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-slate-200 mb-2 group-hover:text-amber-100">{title}</h3>
            <p className="text-slate-400 leading-relaxed text-sm">{description}</p>
        </div>
    );
}