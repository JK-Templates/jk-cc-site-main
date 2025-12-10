import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Code, Palette, Globe, Wand2, Loader2, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProjectCard from '@/components/ui/ProjectCard';
import { GridSkeleton } from '@/components/ui/Skeletons';

export default function PortfolioPage() {
  const [filter, setFilter] = useState('all');
  const queryClient = useQueryClient();

  // Assistant State
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantInput, setAssistantInput] = useState({ description: "", category: "website" });
  const [generatedProject, setGeneratedProject] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list(),
  });

  const categories = [
    { id: 'all', label: 'הכל' },
    { id: 'website', label: 'אתרים', icon: Globe },
    { id: 'code', label: 'קוד ו-Git', icon: Github },
    { id: 'creative', label: 'יצירה', icon: Palette },
  ];

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Project.create(data),
    onSuccess: () => {
        queryClient.invalidateQueries(['projects']);
        setIsAssistantOpen(false);
        setGeneratedProject(null);
        setAssistantInput({ description: "", category: "website" });
    }
  });

  const handleGenerate = async () => {
      setIsGenerating(true);
      try {
          const { data } = await base44.functions.invoke('generateAI', {
              task: 'generate_project',
              parameters: assistantInput
          });
          if (data.output) {
              setGeneratedProject({
                  ...data.output,
                  category: assistantInput.category,
                  image_url: data.output.placeholder_image
              });
          }
      } catch (e) {
          console.error(e);
      } finally {
          setIsGenerating(false);
      }
  };

  const handleCreate = () => {
      if (!generatedProject) return;
      createMutation.mutate(generatedProject);
  };

  const filteredProjects = filter === 'all' 
    ? projects?.filter(p => p.category !== 'ai_video') 
    : projects?.filter(p => p.category === filter);

  return (
    <div className="pt-10">
      <header className="mb-16 text-center relative">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-amber-200">
          תיק עבודות
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto mb-8">
          אוסף נבחר של פרויקטים, קוד ויצירות המדגימים את היכולות הטכנולוגיות והיצירתיות.
        </p>

        {/* AI Assistant Dialog */}
        <Dialog open={isAssistantOpen} onOpenChange={setIsAssistantOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="border-amber-500/30 text-amber-500 hover:bg-amber-500/10 hover:text-amber-400 gap-2">
                    <Wand2 className="w-4 h-4" /> AI Project Assistant
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-950 border-slate-800 text-slate-100 sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-amber-400">
                        <Wand2 className="w-5 h-5" />
                        יוצר הפרויקטים (AI)
                    </DialogTitle>
                </DialogHeader>

                {!generatedProject ? (
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>קטגוריה</Label>
                            <Select 
                                value={assistantInput.category} 
                                onValueChange={(val) => setAssistantInput({...assistantInput, category: val})}
                            >
                                <SelectTrigger className="bg-slate-900 border-slate-700">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                                    <SelectItem value="website">אתרים</SelectItem>
                                    <SelectItem value="code">קוד ו-Git</SelectItem>
                                    <SelectItem value="creative">יצירה</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>תאור קצר של הפרויקט</Label>
                            <Textarea 
                                placeholder="למשל: אפליקציית ניהול משימות עם React ו-Node.js..."
                                className="bg-slate-900 border-slate-700 min-h-[100px]"
                                value={assistantInput.description}
                                onChange={(e) => setAssistantInput({...assistantInput, description: e.target.value})}
                            />
                        </div>
                        {/* Short Description Generator is implicit in the main generation, but let's add a specific enhancer if needed later. 
                            For now, the main generation handles it. 
                        */}
                        <Button 
                            onClick={handleGenerate} 
                            disabled={isGenerating || !assistantInput.description}
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                        >
                            {isGenerating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> חושב...</> : "צור הצעה לפרויקט"}
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4 py-4">
                        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-3">
                            <div>
                                <Label className="text-xs text-slate-500">כותרת</Label>
                                <Input 
                                    value={generatedProject.title} 
                                    onChange={(e) => setGeneratedProject({...generatedProject, title: e.target.value})}
                                    className="bg-slate-950 border-slate-700 mt-1"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <Label className="text-xs text-slate-500">תיאור</Label>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-5 text-[10px] text-amber-500 hover:text-amber-400 px-2"
                                        onClick={async () => {
                                            // Refine description only
                                            const { data } = await base44.functions.invoke('aiHelper', {
                                                action: 'project_description',
                                                data: generatedProject
                                            });
                                            if (data.result) {
                                                setGeneratedProject(prev => ({ ...prev, description: data.result }));
                                            }
                                        }}
                                    >
                                        <Wand2 className="w-3 h-3 mr-1" /> שפר ניסוח
                                    </Button>
                                </div>
                                <Textarea 
                                    value={generatedProject.description}
                                    onChange={(e) => setGeneratedProject({...generatedProject, description: e.target.value})}
                                    className="bg-slate-950 border-slate-700 mt-1"
                                />
                            </div>
                            <div>
                                <Label className="text-xs text-slate-500">טכנולוגיות</Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {generatedProject.technologies?.map((tech, i) => (
                                        <Badge key={i} variant="secondary" className="bg-slate-800">{tech}</Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button variant="ghost" onClick={() => setGeneratedProject(null)}>ביטול / נסה שוב</Button>
                            <Button onClick={handleCreate} disabled={createMutation.isPending} className="bg-green-600 hover:bg-green-700 text-white">
                                {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4 mr-2" /> שמור פרויקט</>}
                            </Button>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
      </header>

      {/* Filter Tabs */}
      <div className="flex justify-center mb-12 flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full transition-all border ${
              filter === cat.id
                ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:border-slate-600 hover:text-slate-200'
            }`}
          >
            {cat.icon && <cat.icon className="w-4 h-4" />}
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <GridSkeleton />
      ) : (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode='popLayout'>
                {filteredProjects?.map((project) => (
                    <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    >
                    <ProjectCard project={project} />
                    </motion.div>
                ))}
                </AnimatePresence>
            </div>

            {filteredProjects?.length === 0 && (
                <div className="text-center text-slate-500 py-20 border border-dashed border-slate-800 rounded-xl">
                <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>טרם נוספו פרויקטים למערכת.</p>
                </div>
            )}
        </>
      )}
    </div>
  );
}