import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@base44/sdk';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Calendar, 
  Eye, 
  Download,
  Trash2,
  ExternalLink,
  Sparkles,
  Network
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  'הכל',
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

export default function KnowledgeSeeds() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('הכל');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('grid');

  const queryClient = useQueryClient();

  // Fetch seeds
  const { data: seeds, isLoading } = useQuery({
    queryKey: ['knowledge-seeds', selectedCategory, sortBy],
    queryFn: async () => {
      let query = base44.from('knowledge_seeds').select('*');

      // Filter by category
      if (selectedCategory !== 'הכל') {
        query = query.eq('category', selectedCategory);
      }

      // Sort
      switch (sortBy) {
        case 'recent':
          query = query.order('created_at', { ascending: false });
          break;
        case 'popular':
          query = query.order('usage_count', { ascending: false });
          break;
        case 'quality':
          query = query.order('quality_score', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  // Fetch statistics
  const { data: stats } = useQuery({
    queryKey: ['knowledge-stats'],
    queryFn: async () => {
      const { data, error } = await base44
        .from('category_coverage')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  // Delete seed mutation
  const deleteSeedMutation = useMutation({
    mutationFn: async (seedId) => {
      const { error } = await base44
        .from('knowledge_seeds')
        .delete()
        .eq('id', seedId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['knowledge-seeds']);
      toast.success('זרע הידע נמחק בהצלחה');
    },
    onError: (error) => {
      toast.error('שגיאה במחיקת זרע הידע', {
        description: error.message
      });
    }
  });

  // Filter seeds by search query
  const filteredSeeds = seeds?.filter(seed => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      seed.title.toLowerCase().includes(query) ||
      seed.core_summary.toLowerCase().includes(query) ||
      seed.category.toLowerCase().includes(query)
    );
  });

  const handleExportJSON = (seed) => {
    const dataStr = JSON.stringify(seed, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `seed_${seed.source_id}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('קובץ JSON הורד בהצלחה');
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-100 mb-2">
          זרעי ידע
        </h1>
        <p className="text-slate-400 text-lg">
          ניהול וצפייה בכל זרעי הידע במערכת
        </p>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-800/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">סך הכל זרעים</p>
                  <p className="text-3xl font-bold text-slate-100">
                    {seeds?.length || 0}
                  </p>
                </div>
                <Sparkles className="w-10 h-10 text-purple-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-800/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">קטגוריות</p>
                  <p className="text-3xl font-bold text-slate-100">
                    {stats.length}
                  </p>
                </div>
                <Filter className="w-10 h-10 text-blue-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/20 to-green-800/10 border-green-800/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">שימושים</p>
                  <p className="text-3xl font-bold text-slate-100">
                    {stats.reduce((sum, s) => sum + (s.total_usage || 0), 0)}
                  </p>
                </div>
                <TrendingUp className="w-10 h-10 text-green-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-900/20 to-orange-800/10 border-orange-800/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">איכות ממוצעת</p>
                  <p className="text-3xl font-bold text-slate-100">
                    {(stats.reduce((sum, s) => sum + (s.avg_quality || 0), 0) / stats.length).toFixed(1)}
                  </p>
                </div>
                <Eye className="w-10 h-10 text-orange-400 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card className="mb-6 bg-slate-900/50 border-slate-800">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
              <Input
                placeholder="חפש לפי כותרת, תוכן או קטגוריה..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 bg-slate-800 border-slate-700 text-slate-100"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px] bg-slate-800 border-slate-700 text-slate-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[200px] bg-slate-800 border-slate-700 text-slate-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="recent">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 ml-2" />
                    לפי תאריך
                  </div>
                </SelectItem>
                <SelectItem value="popular">
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 ml-2" />
                    לפי פופולריות
                  </div>
                </SelectItem>
                <SelectItem value="quality">
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 ml-2" />
                    לפי איכות
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Seeds Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-slate-900/50 border-slate-800 animate-pulse">
              <CardHeader>
                <div className="h-6 bg-slate-800 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-800 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-800 rounded"></div>
                  <div className="h-4 bg-slate-800 rounded"></div>
                  <div className="h-4 bg-slate-800 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredSeeds?.length === 0 ? (
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="py-12 text-center">
            <Sparkles className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg mb-2">לא נמצאו זרעי ידע</p>
            <p className="text-slate-500 text-sm mb-4">
              {searchQuery ? 'נסה לשנות את החיפוש' : 'התחל ביצירת זרע ידע ראשון'}
            </p>
            <Button
              onClick={() => window.location.href = '/knowledge-seed-builder'}
              className="bg-purple-600 hover:bg-purple-700"
            >
              צור זרע ידע
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredSeeds?.map((seed, index) => (
              <motion.div
                key={seed.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <SeedCard 
                  seed={seed} 
                  onDelete={() => deleteSeedMutation.mutate(seed.id)}
                  onExport={() => handleExportJSON(seed)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function SeedCard({ seed, onDelete, onExport }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all group">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-slate-100 text-lg mb-2 line-clamp-2">
              {seed.title}
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-purple-900/30 text-purple-300 text-xs">
                {seed.category}
              </Badge>
              <Badge variant="outline" className="border-slate-700 text-slate-400 text-xs">
                עומק: {seed.technical_depth}/5
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed">
          {seed.core_summary}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {seed.usage_count || 0} שימושים
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(seed.created_at).toLocaleDateString('he-IL')}
          </div>
        </div>

        {/* Expansion Vectors Preview */}
        {seed.expansion_vectors?.length > 0 && (
          <div className="pt-2 border-t border-slate-800">
            <p className="text-xs text-slate-500 mb-2">וקטורי הרחבה:</p>
            <ul className="space-y-1">
              {seed.expansion_vectors.slice(0, 2).map((vector, i) => (
                <li key={i} className="text-xs text-slate-400 flex items-start">
                  <span className="text-purple-400 ml-1">•</span>
                  <span className="line-clamp-1">{vector}</span>
                </li>
              ))}
              {seed.expansion_vectors.length > 2 && (
                <li className="text-xs text-slate-500">
                  +{seed.expansion_vectors.length - 2} נוספים
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.href = `/knowledge-seeds/${seed.id}`}
            className="flex-1 text-xs"
          >
            <ExternalLink className="w-3 h-3 ml-1" />
            פרטים
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="text-xs"
          >
            <Download className="w-3 h-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="text-xs text-red-400 hover:text-red-300 hover:border-red-800"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
