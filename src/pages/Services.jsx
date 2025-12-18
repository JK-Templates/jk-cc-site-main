import React from 'react';

const Services = () => {
  return (
    <div className="flex flex-col items-center py-20">
      <h1 className="mb-12 text-5xl font-bold text-slate-100 text-center">אסטרטגיה מבוססת אמת (Truth-Based Strategy)</h1>

      <section className="w-full max-w-3xl mb-16">
        <h2 className="mb-6 text-3xl font-semibold text-amber-400 text-center">1. ה-Audit האסטרטגי (The Deep Dive)</h2>
        <ul className="list-disc list-inside text-lg leading-relaxed text-slate-300 space-y-2">
          <li>ניתוח הארגון בשיטת "חמשת הלמה" (5 Whys) לאיתור צווארי בקבוק אמיתיים.</li>
          <li>שימוש במודל SCAMPER לחדשנות (החלפה, שילוב, התאמה) כדי למצוא מנועי צמיחה חדשים.</li>
        </ul>
      </section>

      <section className="w-full max-w-3xl mb-16">
        <h2 className="mb-6 text-3xl font-semibold text-amber-400 text-center">2. פיתוח מנהיגות והון אנושי</h2>
        <ul className="list-disc list-inside text-lg leading-relaxed text-slate-300 space-y-2">
          <li>מעבר ל"כלל הזהב": אנו מטמיעים את "כלל הפלטינום" – אל תתייחס לאחרים כמו שאתה רוצה שיתייחסו אליך, אלא כמו שהם רוצים שיתייחסו אליהם. התאמה אישית של סגנון הניהול לצרכי העובד.</li>
          <li>ניהול אנרגיה במקום זמן: סדנאות לניהול המשאבים הפיזיים, הרגשיים והמנטליים של הצוות למניעת שחיקה ושיפור ביצועים (על בסיס Loehr & Schwartz).</li>
        </ul>
      </section>

      <section className="w-full max-w-3xl">
        <h2 className="mb-6 text-3xl font-semibold text-amber-400 text-center">3. הטמעת יעדים ומדידה</h2>
        <ul className="list-disc list-inside text-lg leading-relaxed text-slate-300 space-y-2">
          <li>בניית מערכת OKRs (יעדים ותוצאות מפתח) ליישור קו ארגוני.</li>
          <li>הגדרת יעדי SMART (ספציפיים, מדידים, ברי-השגה, רלוונטיים, תחומי זמן) לביצוע טקטי.</li>
        </ul>
      </section>
    </div>
  );
};

export default Services;
