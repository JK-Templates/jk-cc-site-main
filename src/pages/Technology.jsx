import React from 'react';

const Technology = () => {
  return (
    <div className="flex flex-col items-center py-20">
      <h1 className="mb-12 text-5xl font-bold text-slate-100">The Golden Canon Engine</h1>

      <section className="w-full max-w-3xl mb-16 text-center">
        <h2 className="mb-6 text-3xl font-semibold text-amber-400">עיקרון ה-Refuse to Run:</h2>
        <p className="text-lg leading-relaxed text-slate-300">
          הסבר כיצד המערכת משמשת כ"מפסק פחת דיגיטלי". אם הפעולה חורגת מהחוקה המוגדרת ב-Law Tables, היא נחסמת פיזית ברמת המעבד.
        </p>
      </section>

      <section className="w-full max-w-3xl text-center">
        <h2 className="mb-6 text-3xl font-semibold text-amber-400">אינטגרציה עם Base44:</h2>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
            <h3 className="mb-4 text-2xl font-semibold text-slate-100">Text-to-App:</h3>
            <p className="text-lg leading-relaxed text-slate-300">
              אנו מאפשרים למנהלים לא טכניים לבנות כלי פיקוח וממשל (Governance Tools) באמצעות פקודות טקסט פשוטות.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
            <h3 className="mb-4 text-2xl font-semibold text-slate-100">Built-in Security:</h3>
            <p className="text-lg leading-relaxed text-slate-300">
              ניהול הרשאות ואימות משתמשים כחלק אינטגרלי מהפלטפורמה, לא כתוסף.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Technology;
