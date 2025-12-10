

Main Git repo for downstreaming changes to both different hosted sites but with same identical content except the mode which:
test.jonykashi.cc- is Matrix LSD site mode - different hosted site

www.jonykashi.cc - is main normal mode site - hosted on different app of base 44
Base44:


Repository URL www.jonykashi.cc:
https://github.com/base44dev/jony-kashis-portfolio-9277b9c5.git
https://github.com/base44dev/jony-kashis-portfolio-9277b9c5


Repository URL test.jonykashi.cc:
https://github.com/base44dev/jony-kashis-portfolio-copy-e1c0bc77.git
https://github.com/base44dev/jony-kashis-portfolio-copy-e1c0bc77
——

**משימה:** בנה אתר תיק עבודות מקיף ומסודר בפלטפורמת **Base44** עבור הדומיין הראשי [**הכנס דומיין: drykashi.com / jonykashi.cc**].

**1. ארכיטקטורת קוד וניהול שינויים (Git Downstream):**

*   **מקור אמת לתוכן (Source of Truth):**
    *   **מאגר ראשי:** https://github.com/base44dev/jony-kashis-portfolio-9277b9c5
    *   **דרישה:** כל עדכון תוכן באתר חייב להתבצע במאגר הראשי, ולהיות מוזרם (Downstreamed) באופן אוטומטי לשני אתרי הפריסה.

*   **אתרי פריסה (Deployment Targets):**
    1.  **אתר ראשי:** **[www.jonykashi.cc](http://www.jonykashi.cc/)** (מאגר: https://github.com/base44dev/jony-kashis-portfolio-9277b9c5.git)
        *   **מצב (Mode):** Normal Mode Site (מצב רגיל).
    2.  **אתר בדיקה:** **[test.jonykashi.cc](http://test.jonykashi.cc/)** (מאגר: https://github.com/base44dev/jony-kashis-portfolio-copy-e1c0bc77.git)
        *   **מצב (Mode):** Matrix LSD Site Mode (מצב תצוגה ניסיוני/שונה).
        *   **דרישה:** התוכן בשני האתרים חייב להיות **זהה לחלוטין**, ההבדל היחיד הוא ה'מצב' החזותי (Mode).

**2. מבנה אתר ותכנים (מדור ראשי):**

יש לבנות את האתר לפי המבנה הבא, תוך הטמעת (Embed) התכנים מ-Google Drive באמצעות קוד "פרסום ברשת" (Publish to the web) עבור עדכון אוטומטי:

| מדור ראשי                 | תכנים מרכזיים להצגה (Assets)                                                                                                              | סוג תוכן נדרש            
——
-=-=-=-=-=-=-=-=-=-=
