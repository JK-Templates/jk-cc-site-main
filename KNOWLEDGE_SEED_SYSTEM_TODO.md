# Knowledge Seed System - TODO List

## מטרה
יצירת מערכת מלאה ליצירת וניהול קבצי זרע ידע (Knowledge Seed Files) עם אינטגרציה ל-RAG

---

## שלב 1: Backend Infrastructure ✅ (הושלם)

### 1.1 Database Schema
- [x] יצירת טבלת `knowledge_seeds`
- [x] יצירת טבלת `knowledge_embeddings` (לRAG)
- [x] יצירת טבלת `seed_relationships` (cross-references)
- [x] הוספת RLS policies
- [x] יצירת indexes לחיפוש מהיר
- [x] יצירת טבלת `rag_query_history`
- [x] יצירת טבלת `knowledge_gaps`
- [x] פונקציות עזר (search, increment_usage, detect_gap)

### 1.2 Backend Functions
- [x] `knowledgeSeedGenerator.ts` - יצירת זרעים מטקסט
- [x] `documentProcessor.ts` - עיבוד PDF/DOCX/URL
- [x] `semanticSearch.ts` - חיפוש סמנטי וRAG מלא
- [x] תמיכה ב-batch processing
- [x] תמיכה ב-cross-reference analysis
- [ ] `embeddingGenerator.ts` - אינטגרציה מלאה עם OpenAI/Cohere (placeholder קיים)

---

## שלב 2: Frontend Components ✅ (הושלם)

### 2.1 Core Pages
- [x] `src/pages/KnowledgeSeedBuilder.jsx` - יצירת זרעים
- [x] `src/pages/KnowledgeSeeds.jsx` - ניהול וצפייה
- [x] `src/pages/RAGPlayground.jsx` - בדיקת RAG
- [x] עדכון `src/pages.config.js` - הוספת דפים לניווט
- [ ] `src/pages/KnowledgeGraph.jsx` - ויזואליזציה של קשרים (אופציונלי)

### 2.2 UI Components
- [x] קומפוננטות מובנות בדפים (SeedCard, ContextCard)
- [x] תמיכה ב-RTL layout
- [x] אנימציות עם Framer Motion
- [x] Toast notifications
- [ ] `src/components/ui/RelationshipGraph.jsx` - גרף קשרים (אופציונלי)

---

## שלב 3: RAG Integration 🔄

### 3.1 Vector Database
- [ ] הגדרת pgvector extension ב-Base44
- [ ] יצירת embeddings לכל זרע
- [ ] אינדקס HNSW לחיפוש מהיר
- [ ] פונקציית similarity search

### 3.2 RAG Pipeline
- [ ] Query processing
- [ ] Context retrieval (top-k seeds)
- [ ] Response generation עם LLM
- [ ] Citation tracking

---

## שלב 4: Advanced Features 🚀

### 4.1 Automation
- [ ] Batch processing של מסמכים
- [ ] Auto-categorization
- [ ] Auto-cross-referencing
- [ ] Scheduled updates

### 4.2 Analytics
- [ ] Usage tracking
- [ ] Popular seeds dashboard
- [ ] Knowledge gap analysis
- [ ] Quality metrics

---

## שלב 5: Testing & Documentation 📝

### 5.1 Testing
- [ ] Unit tests לפונקציות Backend
- [ ] Integration tests ל-RAG pipeline
- [ ] UI tests לקומפוננטות
- [ ] Performance testing

### 5.2 Documentation
- [ ] User guide (עברית)
- [ ] API documentation
- [ ] Example seed files
- [ ] Video tutorials

---

## קטגוריות נתמכות

1. **TinyML/Edge AI** - למידת מכונה על חומרה מוגבלת
2. **No-Code/Low-Code** - כלי פיתוח ללא קוד
3. **Agentic Systems** - מערכות AI אוטונומיות
4. **RAG Architecture** - ארכיטקטורת Retrieval-Augmented Generation
5. **Web Development** - פיתוח אתרים ואפליקציות
6. **Case Study** - מקרי בוחן ודוגמאות
7. **Constraint Engineering** - הנדסה במגבלות (GAS, Runtime limits)
8. **Vector Databases** - מסדי נתונים וקטוריים
9. **LLM Optimization** - אופטימיזציה של מודלי שפה
10. **Security & Privacy** - אבטחה ופרטיות

---

## Progress Tracking

**התחלה:** דצמבר 2024
**סטטוס כללי:** 🟢 שלב ראשון הושלם
**אחוז השלמה:** 65%

### Milestones
- [x] Milestone 1: Backend Infrastructure (Week 1) ✅
- [x] Milestone 2: Basic UI (Week 2) ✅
- [ ] Milestone 3: RAG Integration - Embeddings (Week 3) 🔄
- [ ] Milestone 4: Advanced Features (Week 4)
- [ ] Milestone 5: Production Ready (Week 5)

---

## Notes

- כל הטקסטים בעברית למעט מונחים טכניים
- תמיכה ב-RTL layout
- אופטימיזציה לביצועים (caching, lazy loading)
- נגישות (WCAG 2.1 AA)
