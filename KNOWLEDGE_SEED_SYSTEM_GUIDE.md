# מדריך מערכת זרעי הידע (Knowledge Seed System)
## מערכת RAG מלאה ליצירת וניהול בסיס ידע מובנה

---

## 📋 תוכן עניינים

1. [מבוא](#מבוא)
2. [התקנה והגדרה](#התקנה-והגדרה)
3. [יצירת זרע ידע](#יצירת-זרע-ידע)
4. [ניהול זרעי ידע](#ניהול-זרעי-ידע)
5. [שימוש ב-RAG Playground](#שימוש-ב-rag-playground)
6. [API Reference](#api-reference)
7. [דוגמאות שימוש](#דוגמאות-שימוש)
8. [פתרון בעיות](#פתרון-בעיות)

---

## מבוא

### מה זה זרע ידע?

**זרע ידע (Knowledge Seed)** הוא קובץ JSON מובנה המכיל מידע מחולץ ממקור לא מובנה (מאמר, מדריך טכני, דוח, וכו'). הזרע משמש כיחידת ידע בסיסית במערכת RAG (Retrieval-Augmented Generation).

### מבנה זרע ידע

```json
{
  "source_id": "מזהה ייחודי",
  "title": "כותרת תיאורית",
  "category": "קטגוריה",
  "core_summary": "סיכום של 3 משפטים",
  "technical_depth": 1-5,
  "key_entities": {
    "tools": ["כלים"],
    "concepts": ["מושגים"],
    "hardware": ["חומרה"]
  },
  "implementation_details": {
    "problem_solved": "בעיה שנפתרה",
    "architecture": "ארכיטקטורה",
    "constraints": ["מגבלות"]
  },
  "expansion_vectors": ["שאלות להרחבה"],
  "cross_references": ["קשרים לנושאים אחרים"]
}
```

### למה זה חשוב?

1. **מבנה אחיד**: כל הידע מאוחסן בפורמט סטנדרטי
2. **חיפוש סמנטי**: ניתן לחפש לפי משמעות, לא רק מילות מפתח
3. **הקשר עשיר**: כל זרע כולל מטא-דאטה והקשרים
4. **הרחבה עתידית**: וקטורי ההרחבה מנחים מחקר עתידי
5. **RAG איכותי**: בסיס ידע מובנה = תשובות טובות יותר

---

## התקנה והגדרה

### דרישות מקדימות

- Node.js 18+
- Base44 account
- PostgreSQL עם pgvector extension

### שלב 1: הרצת הסכמה

```bash
# התחבר למסד הנתונים
psql -U your_user -d your_database

# הרץ את הסכמה
\i database/knowledge_seeds_schema.sql
```

### שלב 2: הגדרת Backend Functions

העלה את הפונקציות ל-Base44:

```bash
# knowledgeSeedGenerator.ts
# documentProcessor.ts
# semanticSearch.ts
```

### שלב 3: הגדרת משתני סביבה

```env
VITE_BASE44_APP_ID=your_app_id
VITE_BASE44_BACKEND_URL=https://api.base44.com
```

### שלב 4: אימות התקנה

1. גש ל-`/knowledge-seed-builder`
2. נסה ליצור זרע ידע פשוט
3. בדוק שהוא מופיע ב-`/knowledge-seeds`

---

## יצירת זרע ידע

### דרך 1: טקסט ישיר

1. **גש לבונה הזרעים**: `/knowledge-seed-builder`
2. **בחר טאב "טקסט"**
3. **הדבק את התוכן**:
   ```
   מאמר על אופטימיזציה של K-Means על Arduino Nano 33.
   המאמר מציג שיטה לדחיסת האלגוריתם ל-256KB RAM...
   ```
4. **בחר קטגוריה** (אופציונלי): `TinyML/Edge AI`
5. **לחץ "צור זרע ידע"**

### דרך 2: URL

1. **בחר טאב "URL"**
2. **הזן כתובת**:
   ```
   https://example.com/article-about-tinyml
   ```
3. **המערכת תוריד ותעבד את התוכן אוטומטית**
4. **לחץ "צור זרע ידע"**

### דרך 3: קובץ

1. **בחר טאב "קובץ"**
2. **העלה קובץ**: TXT, PDF, DOCX (עד 10MB)
3. **המערכת תחלץ את הטקסט**
4. **לחץ "צור זרע ידע"**

### תהליך היצירה

```
קלט → עיבוד → חילוץ מובנה → יצירת embedding → שמירה
  ↓        ↓           ↓                ↓              ↓
טקסט   ניקוי    LLM Analysis    Vector DB      PostgreSQL
```

### טיפים ליצירה איכותית

✅ **עשה**:
- השתמש בטקסטים עשירים בתוכן טכני
- ודא שהמקור מכיל מידע ספציפי
- בחר קטגוריה מתאימה
- בדוק את התוצאה ושפר במידת הצורך

❌ **אל תעשה**:
- אל תשתמש בטקסטים קצרים מדי (פחות מ-200 מילים)
- אל תערבב נושאים שונים במקור אחד
- אל תשכח לבדוק את איכות החילוץ

---

## ניהול זרעי ידע

### צפייה בזרעים

גש ל-`/knowledge-seeds` לראות את כל הזרעים במערכת.

### סינון וחיפוש

```
חיפוש: "אופטימיזציה של K-Means"
קטגוריה: TinyML/Edge AI
מיון: לפי פופולריות
```

### פעולות על זרע

1. **צפייה בפרטים**: לחץ על "פרטים"
2. **ייצוא JSON**: לחץ על כפתור ההורדה
3. **מחיקה**: לחץ על כפתור המחיקה (זהירות!)

### סטטיסטיקות

הדף מציג:
- **סך הכל זרעים**: מספר הזרעים במערכת
- **קטגוריות**: מספר הקטגוריות השונות
- **שימושים**: כמה פעמים נעשה שימוש בזרעים
- **איכות ממוצעת**: ציון איכות ממוצע

---

## שימוש ב-RAG Playground

### מה זה RAG?

**RAG (Retrieval-Augmented Generation)** הוא טכניקה שבה:
1. מחפשים מידע רלוונטי (Retrieval)
2. משתמשים בו כהקשר (Augmentation)
3. מייצרים תשובה (Generation)

### מצבי חיפוש

#### 1. RAG מלא
```
שאלה → חיפוש סמנטי → איחזור הקשר → יצירת תשובה + ציטוטים
```

**מתי להשתמש**: כשאתה רוצה תשובה מלאה עם מקורות

**דוגמה**:
```
שאלה: "מהן השיטות לאופטימיזציה של K-Means על Arduino?"

תשובה: "ישנן מספר שיטות עיקריות:
1. קוונטיזציה של 8-bit להפחתת זיכרון [מקור 1]
2. עיבוד אצווה (batch processing) [מקור 1]
3. שימוש ב-SIMD instructions [מקור 2]
..."
```

#### 2. חיפוש סמנטי
```
שאלה → חיפוש וקטורי → רשימת זרעים רלוונטיים
```

**מתי להשתמש**: כשאתה רוצה למצוא מקורות רלוונטיים בלבד

#### 3. חיפוש היברידי
```
שאלה → חיפוש וקטורי + חיפוש טקסט → רשימה משולבת
```

**מתי להשתמש**: לתוצאות מדויקות יותר

### דוגמאות שאילתות

```
✅ טובות:
- "מהן המגבלות של Google Apps Script בהקשר של V8 runtime?"
- "כיצד ניתן לשלב TinyML עם מערכות No-Code?"
- "מה ההבדל בין vector database ל-traditional database?"

❌ לא טובות:
- "מה זה AI?" (כללי מדי)
- "תספר לי על כל מה שאתה יודע" (לא ספציפי)
- "..." (ריק)
```

### הבנת התוצאות

#### מקורות (Contexts)
כל מקור מציג:
- **כותרת**: שם הזרע
- **סיכום**: תקציר התוכן
- **דמיון**: אחוז הדמיון לשאלה (70%+)
- **קטגוריה**: התחום

#### זרעים קשורים
זרעים נוספים שעשויים להיות רלוונטיים

#### ציטוטים
הפניות למקורות המדויקים בתשובה

---

## API Reference

### Backend Functions

#### knowledgeSeedGenerator

```typescript
// יצירת זרע
await base44.functions.invoke('knowledgeSeedGenerator', {
  action: 'generate_seed',
  data: {
    content: 'טקסט המקור...',
    sourceType: 'text',
    category: 'TinyML/Edge AI' // אופציונלי
  }
});

// עיבוד אצווה
await base44.functions.invoke('knowledgeSeedGenerator', {
  action: 'batch_process',
  data: {
    documents: [
      { content: 'מסמך 1...' },
      { content: 'מסמך 2...' }
    ]
  }
});

// אימות מבנה
await base44.functions.invoke('knowledgeSeedGenerator', {
  action: 'validate_seed',
  data: seedObject
});
```

#### documentProcessor

```typescript
// עיבוד קובץ
await base44.functions.invoke('documentProcessor', {
  action: 'process_file',
  data: {
    fileUrl: 'https://...',
    fileType: 'pdf',
    fileName: 'document.pdf'
  }
});

// עיבוד URL
await base44.functions.invoke('documentProcessor', {
  action: 'process_url',
  data: {
    url: 'https://example.com/article'
  }
});

// חלוקת טקסט לחלקים
await base44.functions.invoke('documentProcessor', {
  action: 'chunk_text',
  data: {
    text: 'טקסט ארוך...',
    chunkSize: 1000,
    overlap: 200
  }
});
```

#### semanticSearch

```typescript
// חיפוש סמנטי
await base44.functions.invoke('semanticSearch', {
  action: 'semantic_search',
  data: {
    query: 'שאלה...',
    limit: 5,
    threshold: 0.7,
    category: 'TinyML/Edge AI' // אופציונלי
  }
});

// שאילתת RAG מלאה
await base44.functions.invoke('semanticSearch', {
  action: 'rag_query',
  data: {
    query: 'שאלה...',
    contextLimit: 3,
    includeRelated: true,
    generateResponse: true
  }
});

// חיפוש היברידי
await base44.functions.invoke('semanticSearch', {
  action: 'hybrid_search',
  data: {
    query: 'שאלה...',
    limit: 10,
    vectorWeight: 0.7,
    textWeight: 0.3
  }
});
```

### Database Queries

```typescript
// שליפת כל הזרעים
const { data: seeds } = await base44
  .from('knowledge_seeds')
  .select('*')
  .order('created_at', { ascending: false });

// סינון לפי קטגוריה
const { data: seeds } = await base44
  .from('knowledge_seeds')
  .select('*')
  .eq('category', 'TinyML/Edge AI');

// חיפוש טקסט מלא
const { data: seeds } = await base44
  .from('knowledge_seeds')
  .select('*')
  .textSearch('search_vector', 'אופטימיזציה');

// קבלת זרעים קשורים
const { data: related } = await base44
  .rpc('get_related_seeds', {
    seed_uuid: 'uuid-here',
    max_results: 5
  });

// חיפוש סמנטי (עם embeddings)
const { data: results } = await base44
  .rpc('search_knowledge_seeds', {
    query_embedding: embeddingVector,
    match_threshold: 0.7,
    match_count: 5
  });
```

---

## דוגמאות שימוש

### דוגמה 1: יצירת בסיס ידע על TinyML

```javascript
// 1. הכן מקורות
const sources = [
  { content: 'מאמר על K-Means optimization...', category: 'TinyML/Edge AI' },
  { content: 'מדריך Arduino Nano 33...', category: 'TinyML/Edge AI' },
  { content: 'דוח על quantization techniques...', category: 'TinyML/Edge AI' }
];

// 2. צור זרעים
for (const source of sources) {
  await base44.functions.invoke('knowledgeSeedGenerator', {
    action: 'generate_seed',
    data: source
  });
}

// 3. בדוק את התוצאות
const { data: seeds } = await base44
  .from('knowledge_seeds')
  .select('*')
  .eq('category', 'TinyML/Edge AI');

console.log(`נוצרו ${seeds.length} זרעי ידע`);
```

### דוגמה 2: מערכת שאלות ותשובות

```javascript
// פונקציה לשאילתת RAG
async function askQuestion(question) {
  const { data } = await base44.functions.invoke('semanticSearch', {
    action: 'rag_query',
    data: {
      query: question,
      contextLimit: 3,
      generateResponse: true
    }
  });

  if (data.hasContext) {
    console.log('תשובה:', data.response);
    console.log('מקורות:', data.citations);
  } else {
    console.log('לא נמצא הקשר רלוונטי');
  }
}

// שימוש
await askQuestion('מהן המגבלות של Arduino Nano 33?');
```

### דוגמה 3: ניתוח פערי ידע

```javascript
// שליפת פערי ידע
const { data: gaps } = await base44
  .from('knowledge_gaps')
  .select('*')
  .eq('status', 'identified')
  .order('occurrence_count', { ascending: false });

console.log('פערי ידע מזוהים:');
gaps.forEach(gap => {
  console.log(`- ${gap.topic} (${gap.occurrence_count} פעמים)`);
});

// מילוי פער
const topGap = gaps[0];
// צור זרע ידע חדש בנושא...
```

---

## פתרון בעיות

### בעיה: "לא נמצא הקשר רלוונטי"

**סיבות אפשריות**:
1. אין זרעי ידע בנושא
2. השאלה כללית מדי
3. Embeddings לא נוצרו

**פתרון**:
```javascript
// 1. בדוק כמה זרעים יש
const { count } = await base44
  .from('knowledge_seeds')
  .select('*', { count: 'exact', head: true });

// 2. נסה שאלה ספציפית יותר
// 3. ודא ש-embeddings נוצרו
const { count: embCount } = await base44
  .from('knowledge_embeddings')
  .select('*', { count: 'exact', head: true });
```

### בעיה: "שגיאה ביצירת זרע"

**סיבות אפשריות**:
1. הטקסט קצר מדי
2. בעיית רשת
3. LLM לא זמין

**פתרון**:
```javascript
// 1. ודא שהטקסט מספיק ארוך
if (content.length < 200) {
  console.error('טקסט קצר מדי');
}

// 2. נסה שוב עם retry logic
async function createSeedWithRetry(data, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await base44.functions.invoke('knowledgeSeedGenerator', {
        action: 'generate_seed',
        data
      });
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
}
```

### בעיה: "Embeddings לא עובדים"

**הערה**: המערכת כוללת placeholder ל-embeddings. לייצור אמיתי:

```typescript
// הוסף אינטגרציה עם OpenAI
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateEmbedding(text: string) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text
  });
  return response.data[0].embedding;
}
```

---

## Best Practices

### 1. ארגון זרעים

```
✅ טוב:
- זרע אחד = נושא אחד
- כותרות תיאוריות
- קטגוריות עקביות

❌ לא טוב:
- זרע אחד = מספר נושאים
- כותרות כלליות
- קטגוריות אקראיות
```

### 2. איכות תוכן

```
✅ טוב:
- מקורות טכניים ומפורטים
- מידע ספציפי ומדיד
- דוגמאות קוד

❌ לא טוב:
- מקורות שיווקיים
- מידע כללי
- ללא דוגמאות
```

### 3. תחזוקה

```javascript
// בדיקה שבועית
async function weeklyMaintenance() {
  // 1. מצא זרעים לא בשימוש
  const { data: unused } = await base44
    .from('knowledge_seeds')
    .select('*')
    .eq('usage_count', 0)
    .lt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

  // 2. עדכן quality scores
  // 3. מחק duplicates
  // 4. רענן embeddings
}
```

---

## תמיכה ועזרה

### משאבים

- **תיעוד Base44**: https://base44.com/docs
- **GitHub Issues**: https://github.com/your-repo/issues
- **Discord Community**: [קישור]

### שאלות נפוצות

**ש: כמה זרעים אני צריך?**
ת: תלוי בתחום. התחל עם 20-50 זרעים איכותיים.

**ש: האם אפשר לערוך זרע אחרי יצירה?**
ת: כן, דרך ה-API או ישירות במסד הנתונים.

**ש: מה עושים עם duplicates?**
ת: המערכת מזהה אוטומטית דרך cross-references.

---

<div align="center">

**מערכת זרעי הידע**

*Knowledge Seed System Guide*

*עודכן: דצמבר 2024*

</div>
