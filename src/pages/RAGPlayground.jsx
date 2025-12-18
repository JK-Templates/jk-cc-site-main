import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@base44/sdk';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Send, 
  Loader2, 
  Sparkles, 
  BookOpen, 
  Link as LinkIcon,
  AlertCircle,
  CheckCircle2,
  Search,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function RAGPlayground() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState(null);
  const [searchMode, setSearchMode] = useState('rag'); // 'rag', 'semantic', 'hybrid'

  // RAG Query Mutation
  const ragQueryMutation = useMutation({
    mutationFn: async (data) => {
      const { data: result } = await base44.functions.invoke('semanticSearch', {
        action: searchMode === 'rag' ? 'rag_query' : 
                searchMode === 'semantic' ? 'semantic_search' : 
                'hybrid_search',
        data: {
          query: data.query,
          contextLimit: 3,
          includeRelated: true,
          generateResponse: searchMode === 'rag'
        }
      });
      return result;
    },
    onSuccess: (data) => {
      setResponse(data);
      if (!data.hasContext && searchMode === 'rag') {
        toast.warning('לא נמצא הקשר רלוונטי', {
          description: 'פער הידע תועד למעקב'
        });
      }
    },
    onError: (error) => {
      toast.error('שגיאה בשאילתה', {
        description: error.message
      });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.error('נא להזין שאלה');
      return;
    }
    ragQueryMutation.mutate({ query });
  };

  const exampleQueries = [
    'מהן השיטות לאופטימיזציה של K-Means על Arduino?',
    'איך עובדת מערכת RAG?',
    'מהן המגבלות של Google Apps Script?',
    'מה ההבדל בין TinyML ל-Edge AI?',
    'כיצד ניתן לשלב No-Code עם AI?'
  ];

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-100 mb-2">
          RAG Playground
        </h1>
        <p className="text-slate-400 text-lg">
          בדוק את מערכת ה-RAG עם שאילתות בזמן אמת
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Query Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-100">שאילתה</CardTitle>
              <CardDescription>
                שאל שאלה והמערכת תחפש בזרעי הידע ותיצור תשובה מבוססת הקשר
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search Mode */}
              <Tabs value={searchMode} onValueChange={setSearchMode}>
                <TabsList className="grid w-full grid-cols-3 bg-slate-800">
                  <TabsTrigger value="rag" className="data-[state=active]:bg-slate-700">
                    <Sparkles className="w-4 h-4 ml-2" />
                    RAG מלא
                  </TabsTrigger>
                  <TabsTrigger value="semantic" className="data-[state=active]:bg-slate-700">
                    <Search className="w-4 h-4 ml-2" />
                    חיפוש סמנטי
                  </TabsTrigger>
                  <TabsTrigger value="hybrid" className="data-[state=active]:bg-slate-700">
                    <Zap className="w-4 h-4 ml-2" />
                    היברידי
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Query Input */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                  placeholder="לדוגמה: מהן השיטות לאופטימיזציה של מודלי ML על חומרה מוגבלת?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="min-h-[120px] bg-slate-800 border-slate-700 text-slate-100"
                />

                <Button
                  type="submit"
                  disabled={ragQueryMutation.isPending}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  size="lg"
                >
                  {ragQueryMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                      מחפש ומייצר תשובה...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 ml-2" />
                      שלח שאילתה
                    </>
                  )}
                </Button>
              </form>

              {/* Example Queries */}
              <div className="pt-4 border-t border-slate-800">
                <p className="text-sm text-slate-400 mb-3">שאלות לדוגמה:</p>
                <div className="flex flex-wrap gap-2">
                  {exampleQueries.map((example, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      onClick={() => setQuery(example)}
                      className="text-xs text-slate-300 hover:text-slate-100"
                    >
                      {example}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Response Section */}
          {response && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-slate-100 flex items-center gap-2">
                      {response.hasContext ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          תשובה
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-5 h-5 text-orange-500" />
                          לא נמצא הקשר
                        </>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {response.hasContext ? (
                      <>
                        {/* Generated Response */}
                        {response.response && (
                          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                            <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                              {response.response}
                            </p>
                          </div>
                        )}

                        {/* Context Sources */}
                        {response.contexts && response.contexts.length > 0 && (
                          <div>
                            <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                              <BookOpen className="w-4 h-4" />
                              מקורות ({response.contexts.length})
                            </h3>
                            <div className="space-y-3">
                              {response.contexts.map((context, i) => (
                                <ContextCard key={i} context={context} index={i} />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Related Seeds */}
                        {response.relatedSeeds && response.relatedSeeds.length > 0 && (
                          <div>
                            <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                              <LinkIcon className="w-4 h-4" />
                              זרעים קשורים ({response.relatedSeeds.length})
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {response.relatedSeeds.map((seed, i) => (
                                <Badge
                                  key={i}
                                  variant="outline"
                                  className="cursor-pointer hover:bg-slate-800"
                                  onClick={() => window.location.href = `/knowledge-seeds/${seed.related_seed_id}`}
                                >
                                  {seed.title}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <Alert className="bg-orange-900/20 border-orange-800">
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                        <AlertDescription className="text-orange-300">
                          {response.message || 'לא נמצא הקשר רלוונטי לשאילתה'}
                          <br />
                          <span className="text-sm text-orange-400">
                            {response.suggestion}
                          </span>
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          {/* How it Works */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-100 text-lg">איך זה עובד?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-400">
              <div>
                <h4 className="text-slate-300 font-medium mb-2">1. חיפוש סמנטי</h4>
                <p>המערכת ממירה את השאלה ל-embedding וקטורי ומחפשת זרעי ידע דומים</p>
              </div>
              <div>
                <h4 className="text-slate-300 font-medium mb-2">2. איחזור הקשר</h4>
                <p>מביאה את הזרעים הרלוונטיים ביותר (top-k) כהקשר</p>
              </div>
              <div>
                <h4 className="text-slate-300 font-medium mb-2">3. יצירת תשובה</h4>
                <p>LLM מייצר תשובה מבוססת על ההקשר שנמצא</p>
              </div>
              <div>
                <h4 className="text-slate-300 font-medium mb-2">4. ציטוט מקורות</h4>
                <p>התשובה כוללת הפניות למקורות המדויקים</p>
              </div>
            </CardContent>
          </Card>

          {/* Search Modes */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-100 text-lg">מצבי חיפוש</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-400">
              <div>
                <Badge variant="secondary" className="mb-2">RAG מלא</Badge>
                <p>חיפוש סמנטי + יצירת תשובה מלאה עם ציטוטים</p>
              </div>
              <div>
                <Badge variant="secondary" className="mb-2">חיפוש סמנטי</Badge>
                <p>רק חיפוש וקטורי, ללא יצירת תשובה</p>
              </div>
              <div>
                <Badge variant="secondary" className="mb-2">היברידי</Badge>
                <p>שילוב של חיפוש וקטורי וחיפוש טקסט מלא</p>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-800/50">
            <CardHeader>
              <CardTitle className="text-slate-100 text-lg">טיפים</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-300">
              <p>• היה ספציפי בשאלות שלך</p>
              <p>• השתמש במונחים טכניים רלוונטיים</p>
              <p>• נסה ניסוחים שונים אם לא מצאת תשובה</p>
              <p>• בדוק את המקורות לפרטים נוספים</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ContextCard({ context, index }) {
  return (
    <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors">
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          <Badge variant="secondary" className="bg-purple-900/30 text-purple-300 shrink-0">
            מקור {index + 1}
          </Badge>
          <div className="flex-1 space-y-2">
            <h4 className="text-slate-200 font-medium">{context.title}</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              {context.core_summary}
            </p>
            <div className="flex items-center gap-2 pt-2">
              <Badge variant="outline" className="text-xs">
                {context.category}
              </Badge>
              {context.similarity && (
                <Badge variant="outline" className="text-xs text-green-400 border-green-800">
                  דמיון: {(context.similarity * 100).toFixed(0)}%
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = `/knowledge-seeds/${context.seed_id}`}
                className="mr-auto text-xs text-purple-400 hover:text-purple-300"
              >
                צפה במקור
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
