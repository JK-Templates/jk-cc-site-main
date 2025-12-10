import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Code2, Database, Film } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import GoogleDriveEmbed from '@/components/GoogleDriveEmbed';
import { driveContentConfig } from '@/config/driveContent';
import { getDriveImageUrl } from '@/utils/drive';

export default function HomePage() {
  const [categories, setCategories] = useState(driveContentConfig.categories.fallback);

  const driveHeroImage = useMemo(
    () => getDriveImageUrl(driveContentConfig.hero.imageUrl),
    []
  );

  useEffect(() => {
    const feedUrl = driveContentConfig.categories.feedUrl;
    if (!feedUrl) return;

    const controller = new AbortController();

    fetch(feedUrl, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        const mapped = data
          .map((item) => ({
            ...item,
            image: getDriveImageUrl(item.image),
          }))
          .filter((item) => item.title && item.link);
        if (mapped.length) setCategories(mapped);
      })
      .catch(() => {
        // Fallback to existing categories if feed fails
        setCategories(driveContentConfig.categories.fallback);
      });

    return () => controller.abort();
  }, []);

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative flex min-h-[80vh] w-full flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="relative z-10 mb-12 h-64 w-64 overflow-hidden rounded-full shadow-[0_0_100px_rgba(245,158,11,0.2)] md:h-96 md:w-96"
        >
          <img
            src={driveHeroImage}
            alt="Hero visual"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-50" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-b from-slate-100 to-slate-500 bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-7xl"
        >
          {driveContentConfig.hero.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-10 max-w-2xl text-xl leading-relaxed text-slate-400 md:text-2xl"
        >
          {driveContentConfig.hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link to={createPageUrl('Portfolio')}>
            <button className="flex items-center gap-2 rounded-full bg-amber-500 px-8 py-4 font-bold text-slate-950 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:bg-amber-600 hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]">
              {driveContentConfig.hero.ctaPrimaryLabel} <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>
          <Link to={createPageUrl('Codex')}>
            <button className="rounded-full border border-slate-700 px-8 py-4 font-medium text-slate-200 transition-all hover:border-slate-500">
              {driveContentConfig.hero.ctaSecondaryLabel}
            </button>
          </Link>
        </motion.div>

        <div className="mt-10 w-full max-w-3xl px-6 md:px-0">
          <GoogleDriveEmbed
            url={driveContentConfig.hero.docEmbedUrl}
            title="Hero copy from Drive"
            className="min-h-[280px]"
            fallback={
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 text-left text-slate-300">
                <p>עדכן את קישור Google Drive כדי להטמיע את ההירו מתוך המקור.</p>
              </div>
            }
          />
        </div>
      </section>

      {/* Featured Categories Preview */}
      <section className="grid w-full gap-8 py-20 md:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard
            key={category.key || category.title}
            icon={category.icon}
            title={category.title}
            description={category.description}
            image={category.image}
            link={category.link}
          />
        ))}
      </section>
    </div>
  );
}

import TiltWrapper from '@/components/ui/TiltWrapper';

const iconMap = {
  Code2,
  Database,
  Film,
  ExternalLink,
};

function CategoryCard({ icon, title, description, image, link }) {
  const Icon = iconMap[icon] || Code2;
  return (
    <TiltWrapper>
        <Link to={createPageUrl(link)} className="group relative block h-80 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl transition-all duration-500 hover:border-amber-500/50">
        <div className="absolute inset-0">
            <img src={image} alt={title} className="h-full w-full object-cover opacity-40 transition-all duration-700 group-hover:scale-105 group-hover:opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 flex transform flex-col items-start p-8 transition-transform duration-500 group-hover:translate-y-[-10px]">
            <div className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-amber-500 backdrop-blur-sm transition-colors duration-300 group-hover:bg-amber-500 group-hover:text-slate-950">
            <Icon className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-slate-100 transition-colors group-hover:text-amber-400">{title}</h3>
            <p className="text-sm leading-relaxed text-slate-400">{description}</p>
        </div>
        </Link>
    </TiltWrapper>
  );
}