import React from 'react';

const Manifesto = () => {
  return (
    <div className="flex flex-col items-center py-20 text-center">
      <h1 className="mb-12 text-5xl font-bold text-slate-100">להיות השף, לא הטבח</h1>
      <p className="max-w-3xl text-xl leading-relaxed text-slate-300">
        "רוב העולם פועל כ'טבחים' – מעתיקים מתכונים שמישהו אחר כתב. ב-Project Y, אנחנו ה'שפים'. אנו חוזרים לעקרונות היסוד (First Principles) של הפיזיקה, הכלכלה והטכנולוגיה כדי ליצור פתרונות שלא היו קיימים קודם לכן. ההשראה שלנו מגיעה מהדיוק של 'האיש בעל אקדח הזהב' – ירייה אחת, מדויקת, שפותרת את הבעיה, במקום ריסוס חסר תכלית."
      </p>

      <div className="mt-20 max-w-4xl text-center">
        <h2 className="mb-8 text-4xl font-bold text-slate-100">מודל ניהול האנרגיה האישי</h2>
        <p className="mb-8 text-lg leading-relaxed text-slate-300">
          מודל ניהול האנרגיה האישי (Personal Energy Management) מתבסס על ארבעה מימדים עיקריים הקשורים זה בזה ומשפיעים זה על זה. ניהול נכון של כל אחד מהם חיוני להשגת רווחה ופרודוקטיביות מרבית:
        </p>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="p-6 bg-slate-800 rounded-lg shadow-lg">
            <h3 className="mb-3 text-2xl font-semibold text-slate-100">אנרגיה פיזית</h3>
            <p className="text-slate-300">
              היסוד לכל סוגי האנרגיה. מתמקד בשמירה על בריאות הגוף באמצעות פעילות גופנית, תזונה נכונה, שינה ומנוחה.
            </p>
          </div>
          <div className="p-6 bg-slate-800 rounded-lg shadow-lg">
            <h3 className="mb-3 text-2xl font-semibold text-slate-100">אנרגיה רגשית</h3>
            <p className="text-slate-300">
              עוסק בניהול רגשות לטיפוח חיוביות, חוסן ומוטיבציה. חיוני ליצירתיות ולמערכות יחסים.
            </p>
          </div>
          <div className="p-6 bg-slate-800 rounded-lg shadow-lg">
            <h3 className="mb-3 text-2xl font-semibold text-slate-100">אנרגיה מנטלית</h3>
            <p className="text-slate-300">
              מתמקד בטיפוח מיקוד, יצירתיות ובהירות מחשבתית. מושפע מהכנה מנטלית וניהול זמן.
            </p>
          </div>
          <div className="p-6 bg-slate-800 rounded-lg shadow-lg">
            <h3 className="mb-3 text-2xl font-semibold text-slate-100">אנרגיה רוחנית</h3>
            <p className="text-slate-300">
              קשור למציאת תכלית והלימה בין הפעולות היומיומיות לבין ערכי הליבה והאמונות.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manifesto;
