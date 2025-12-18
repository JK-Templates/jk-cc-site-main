import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const Footer = () => {
  return (
    <footer className="w-full bg-slate-950 py-20 text-center text-slate-400">
      <h2 className="mb-6 text-3xl font-bold text-slate-100">האם המערכת שלך יודעת להסביר את עצמה?</h2>
      <p className="mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
        אל תחכה לרגולציה או לכשל המערכתי הבא. הטמע את Golden Canon עוד היום.
      </p>
      <div className="flex flex-wrap justify-center gap-6">
        <Link to={createPageUrl('Audit')}>
          <button className="rounded-full bg-amber-500 px-8 py-4 font-bold text-slate-950 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:bg-amber-600 hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]">
            הזמן Audit ראשוני (First Principles Analysis)
          </button>
        </Link>
        <Link to={createPageUrl('Demo')}>
          <button className="rounded-full border border-slate-700 px-8 py-4 font-medium text-slate-200 transition-all hover:border-slate-500">
            בקש דמו לפלטפורמת Base44
          </button>
        </Link>
        <Link to={createPageUrl('Newsletter')}>
          <button className="rounded-full border border-slate-700 px-8 py-4 font-medium text-slate-200 transition-all hover:border-slate-500">
            הצטרף לניוזלטר האסטרטגי שלנו
          </button>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
