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
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-b from-slate-100 to-slate-500 bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-7xl"
        >
          Law Executes Before Code
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-10 max-w-2xl text-xl leading-relaxed text-slate-400 md:text-2xl"
        >
          אנו בונים את השכבה החוקתית (Constitutional Layer) של האינטרנט. מערכת שאינה מצהירה על כוונותיה – אינה רצה.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link to={createPageUrl('Audit')}>
            <button className="flex items-center gap-2 rounded-full bg-amber-500 px-8 py-4 font-bold text-slate-950 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:bg-amber-600 hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]">
              התחל את המהפכה (Start the Audit) <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>
          <Link to={createPageUrl('Technology')}>
            <button className="rounded-full border border-slate-700 px-8 py-4 font-medium text-slate-200 transition-all hover:border-slate-500">
              גלה את הטכנולוגיה
            </button>
          </Link>
        </motion.div>
      </section>

      {/* The Problem Section */}
      <section className="w-full max-w-3xl py-20 text-center">
        <h2 className="mb-6 text-4xl font-bold text-slate-100">הבעיה: העולם הוא "קופסה שחורה"</h2>
        <p className="mb-8 text-xl leading-relaxed text-slate-400">
          ארגונים כיום פועלים על בסיס אנלוגיות ("כך עשינו תמיד") ומערכות AI שאינן יודעות להסביר את עצמן. רגולציה בדיעבד היא פלסטר על שבר.
        </p>
        <h3 className="mb-4 text-2xl font-semibold text-amber-400">הפתרון שלנו:</h3>
        <p className="text-lg leading-relaxed text-slate-300">
          מעבר מחשיבה של "טבחים" (העתקת מתכונים קיימים) לחשיבה של "שפים" (הבנת חומרי הגלם). אנו מפרקים את הבעיות לגורמים הבסיסיים ביותר (First Principles) ובונים מחדש מערכות שקופות, בטוחות ומבוססות אמת.
        </p>
      </section>

      {/* The Methodology Section */}
      <section className="w-full max-w-5xl py-20 text-center">
        <h2 className="mb-12 text-4xl font-bold text-slate-100">המתודולוגיה: ארגז הכלים האסטרטגי (Our Framework)</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
            <h3 className="mb-4 text-2xl font-semibold text-amber-400">עמוד 1: קוגניציה (The Cognition)</h3>
            <p className="text-lg leading-relaxed text-slate-300">
              הכלי: Socratic Auditing. אנו לא מניחים הנחות. אנו משתמשים בתשאול סוקרטי כדי לחשוף את האמת הארגונית ולפרק אמונות מגבילות.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
            <h3 className="mb-4 text-2xl font-semibold text-amber-400">עמוד 2: טכנולוגיה (The Tech)</h3>
            <p className="text-lg leading-relaxed text-slate-300">
              הכלי: Golden Canon Stack. תשתית Bare Metal, פורמט דיסק קנוני (CDF) וטבלאות חוק. המערכת בודקת את ה"דרכון" של כל פיסת קוד לפני שהיא מורשית לרוץ.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
            <h3 className="mb-4 text-2xl font-semibold text-amber-400">עמוד 3: ביצוע (The Execution)</h3>
            <p className="text-lg leading-relaxed text-slate-300">
              הכלי: Base44 Rapid Deployment. בניית פתרונות קצה (End-to-End) באמצעות שפה טבעית. מניהול משתמשים ועד דאטה-בייס, הכל נבנה אוטומטית וללא קוד, כדי לאפשר ולידציה מהירה.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
