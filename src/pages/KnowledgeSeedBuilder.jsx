import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@base44/sdk';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Upload, FileText, Link as LinkIcon, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = [
  'TinyML/Edge AI',
  'No-Code/Low-Code',
  'Agentic Systems',
  'RAG Architecture',
  'Web Development',
  'Case Study',
  'Constraint Engineering',
  'Vector Databases',
  'LLM Optimization',
  'Security & Privacy'
];

export default function KnowledgeSeedBuilder() {
  const [inputType, setInputType] = useState('text');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState(null);
  const [generatedSeed, setGeneratedSeed] = useState(null);
  const [processingStep, setProcessingStep] = useState('');

  const queryClient = useQueryClient();

  // Generate seed mutation
  const generateSeedMutation = useMutation({
    mutationFn: async (data) => {
      setProcessingStep('מעבד תוכן...');
      
      let processedContent = data.content;
      let sourceType = 'text';
      let sourceUrl = null;

      // Process based on input type
      if (inputType === 'url') {
        setProcessingStep('מוריד תוכן מ-URL...');
        const { data: urlData } = await base44.functions.invoke('documentProcessor', {
          action: 'process_url',
          data: { url: data.url }
        });
        processedContent = urlData.text;
        sourceType = 'url';
        sourceUrl = data.url;
      } else if (inputType === 'file' && data.file) {
        setProcessingStep('מעבד קובץ...');
        // Upload file first
        const { data: uploadData } = await base44.storage
          .from('documents')
          .upload(`temp/${Date.now()}_${data.file.name}`, data.file);
        
        const fileUrl = base44.storage.from('documents').getPublicUrl(uploadData.path).data.publicUrl;
        
        const { data: fileData } = await base44.functions.invoke('documentProcessor', {
          action: 'process_file',
          data: {
            fileUrl,
            fileType: data.file.name.split('.').pop(),
            fileName: data.file.name
          }
        });
        processedContent = fileData.text;
        sourceType = data.file.name.split('.').pop();
      }

      // Generate seed
      setProcessingStep('מחלץ ידע מובנה...');
      const { data: seedData } = await base44.functions.invoke('knowledgeSeedGenerator', {
        action: 'generate_seed',
        data: {
          content: processedContent,
          sourceType,
          sourceUrl,
          category: data.category || null
        }
      });

      setProcessingStep('הושלם!');
      return seedData;
    },
    onSuccess: (data) => {
      setGeneratedSeed(data.seed);
      queryClient.invalidateQueries(['knowledge-seeds']);
      toast.success('זרע ידע נוצר בהצלחה!', {
        description: data.seed.title
      });
      setProcessingStep('');
    },
    onError: (error) => {
      toast.error('שגיאה ביצירת זרע ידע', {
        description: error.message
      });
      setProcessingStep('');
    }
  });

  const handleGenerate = () => {
    if (inputType === 'text' && !content.trim()) {
      toast.error('נא להזין תוכן');
      return;
    }
    if (inputType === 'url' && !url.trim()) {
      toast.error('נא להזין URL');
      return;
    }
    if (inputType === 'file' && !file) {
      toast.error('נא לבחור קובץ');
      return;
    }

    generateSeedMutation.mutate({
      content,
      url,
      file,
      category
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('הקובץ גדול מדי', {
          description: 'גודל מקסימלי: 10MB'
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl" dir="rtl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-100 mb-2">
          בונה זרעי ידע
        </h1>
        <p className="text-slate-400 text-lg">
          המר מקורות לא מובנים לקבצי זרע ידע מובנים למערכת RAG
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-100">מקור הידע</CardTitle>
            <CardDescription>בחר סוג קלט והזן את התוכן</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Input Type Tabs */}
            <Tabs value={inputType} onValueChange={setInputType}>
              <TabsList className="grid w-full grid-cols-3 bg-slate-800">
                <TabsTrigger value="text" className="data-[state=active]:bg-slate-700">
                  <FileText className="w-4 h-4 ml-2" />
                  טקסט
                </TabsTrigger>
                <TabsTrigger value="url" className="data-[state=active]:bg-slate-700">
                  <LinkIcon className="w-4 h-4 ml-2" />
                  URL
                </TabsTrigger>
                <TabsTrigger value="file" className="data-[state=active]:bg-slate-700">
                  <Upload className="w-4 h-4 ml-2" />
                  קובץ
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-4">
                <Textarea
                  placeholder="הדבק כאן את התוכן שברצונך להמיר לזרע ידע...

דוגמה: מאמר על TinyML, מדריך טכני, מקרה בוחן, וכו'"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[300px] bg-slate-800 border-slate-700 text-slate-100 font-mono text-sm"
                />
                <div className="text-sm text-slate-500">
                  {content.length} תווים | {content.split(/\s+/).filter(Boolean).length} מילים
                </div>
              </TabsContent>

              <TabsContent value="url" className="space-y-4">
                <div>
                  <input
                    type="url"
                    placeholder="https://example.com/article"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-sm text-slate-500 mt-2">
                    הזן URL של מאמר, מדריך או דף אינטרנט
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="file" className="space-y-4">
                <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center hover:border-slate-600 transition-colors">
                  <input
                    type="file"
                    id="file-upload"
                    accept=".txt,.pdf,.docx,.doc"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="w-12 h-12 text-slate-500 mb-4" />
                    {file ? (
                      <div className="text-slate-300">
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-slate-500">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="text-slate-300 mb-2">לחץ לבחירת קובץ</p>
                        <p className="text-sm text-slate-500">
                          TXT, PDF, DOCX (עד 10MB)
                        </p>
                      </>
                    )}
                  </label>
                </div>
              </TabsContent>
            </Tabs>

            {/* Category Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                קטגוריה (אופציונלי)
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                  <SelectValue placeholder="בחר קטגוריה או השאר ריק לזיהוי אוטומטי" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="">זיהוי אוטומטי</SelectItem>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={generateSeedMutation.isPending}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              size="lg"
            >
              {generateSeedMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                  {processingStep || 'מעבד...'}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 ml-2" />
                  צור זרע ידע
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-100">זרע ידע מובנה</CardTitle>
            <CardDescription>
              {generatedSeed ? 'זרע הידע נוצר בהצלחה' : 'התוצאה תופיע כאן'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!generatedSeed && !generateSeedMutation.isPending && (
              <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                <Sparkles className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-center">
                  הזן תוכן ולחץ על "צור זרע ידע"<br />
                  כדי להתחיל
                </p>
              </div>
            )}

            {generateSeedMutation.isPending && (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-16 h-16 text-purple-500 animate-spin mb-4" />
                <p className="text-slate-300 text-center">
                  {processingStep}
                </p>
              </div>
            )}

            {generatedSeed && (
              <div className="space-y-4">
                <Alert className="bg-green-900/20 border-green-800">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <AlertDescription className="text-green-300">
                    זרע הידע נוצר ונשמר במערכת
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  {/* Title */}
                  <div>
                    <label className="text-xs font-medium text-slate-400 uppercase">
                      כותרת
                    </label>
                    <p className="text-lg font-semibold text-slate-100 mt-1">
                      {generatedSeed.title}
                    </p>
                  </div>

                  {/* Category & Depth */}
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-purple-900/30 text-purple-300">
                      {generatedSeed.category}
                    </Badge>
                    <Badge variant="outline" className="border-slate-700 text-slate-400">
                      עומק טכני: {generatedSeed.technical_depth}/5
                    </Badge>
                  </div>

                  {/* Summary */}
                  <div>
                    <label className="text-xs font-medium text-slate-400 uppercase">
                      סיכום
                    </label>
                    <p className="text-slate-300 mt-1 leading-relaxed">
                      {generatedSeed.core_summary}
                    </p>
                  </div>

                  {/* Key Entities */}
                  <div>
                    <label className="text-xs font-medium text-slate-400 uppercase">
                      ישויות מפתח
                    </label>
                    <div className="mt-2 space-y-2">
                      {generatedSeed.key_entities.tools?.length > 0 && (
                        <div>
                          <span className="text-xs text-slate-500">כלים:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {generatedSeed.key_entities.tools.map((tool, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {tool}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {generatedSeed.key_entities.concepts?.length > 0 && (
                        <div>
                          <span className="text-xs text-slate-500">מושגים:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {generatedSeed.key_entities.concepts.map((concept, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {concept}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expansion Vectors */}
                  <div>
                    <label className="text-xs font-medium text-slate-400 uppercase">
                      וקטורי הרחבה
                    </label>
                    <ul className="mt-2 space-y-1 text-sm text-slate-300">
                      {generatedSeed.expansion_vectors?.map((vector, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-purple-400 ml-2">•</span>
                          {vector}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(generatedSeed, null, 2));
                        toast.success('הועתק ללוח');
                      }}
                      className="flex-1"
                    >
                      העתק JSON
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        window.location.href = `/knowledge-seeds/${generatedSeed.id}`;
                      }}
                      className="flex-1"
                    >
                      צפה בפרטים
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Info Section */}
      <Card className="mt-6 bg-slate-900/30 border-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-100 text-lg">מה זה זרע ידע?</CardTitle>
        </CardHeader>
        <CardContent className="text-slate-400 space-y-2 text-sm">
          <p>
            <strong className="text-slate-300">זרע ידע</strong> הוא קובץ מובנה המכיל מידע מחולץ ממקור לא מובנה (מאמר, מדריך, וכו').
          </p>
          <p>
            הזרע כולל: כותרת, סיכום, ישויות טכניות, פרטי יישום, וקטורי הרחבה (שאלות למחקר עתידי), והפניות צולבות.
          </p>
          <p>
            זרעי הידע משמשים כבסיס למערכת RAG (Retrieval-Augmented Generation) ומאפשרים חיפוש סמנטי ויצירת תשובות מבוססות הקשר.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
