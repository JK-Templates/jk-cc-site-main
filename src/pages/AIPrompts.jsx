import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Sparkles, Terminal, SortAsc, Wand2, Lightbulb, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LikeButton from '@/components/ui/LikeButton';
import { GridSkeleton } from '@/components/ui/Skeletons';
import { Settings2, History } from 'lucide-react';

export default function AIPromptsPage() {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantPrompt, setAssistantPrompt] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  const handleAssistantGenerate = async () => {
    setIsThinking(true);
    try {
        const { data } = await base44.functions.invoke('generateAI', {
            prompt: assistantPrompt,
            task: 'generate_prompt'
        });
        setGeneratedPrompt(data.output);
    } catch(e) {
        console.error(e);
    } finally {
        setIsThinking(false);
    }
  };

  const copyGenerated = () => {
      navigator.clipboard.writeText(generatedPrompt);
      setIsAssistantOpen(false);
      setGeneratedPrompt("");
      setAssistantPrompt("");
  };
  const { data: prompts, isLoading } = useQuery({
    queryKey: ['aiprompts'],
    queryFn: () => base44.entities.AIPrompt.list(),
  });

  return (
    <div className="pt-10">
      <header className="mb-16 text-center">
        <div className="inline-block p-3 rounded-full bg-amber-500/10 mb-4 border border-amber-500/20">
            <Sparkles className="w-8 h-8 text-amber-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-amber-200">
          הנדסת פרומפטים
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          ארכיון של פקודות, תהליכי מחשבה ותוצרים של אינטראקציה עם בינה מלאכותית.
          כאן מוצג הדיאלוג בין האדם למכונה.
        </p>
        
        <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4">
            <Dialog open={isAssistantOpen} onOpenChange={setIsAssistantOpen}>
                <DialogTrigger asChild>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white gap-2 shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all hover:scale-105">
                        <Wand2 className="w-4 h-4" />
                        AI Prompt Assistant
                    </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-950 border-slate-800 text-slate-100">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-purple-400">
                            <Wand2 className="w-5 h-5" />
                            עוזר כתיבת הפרומפטים
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <p className="text-sm text-slate-400">תאר לי בקצרה מה אתה רוצה ליצור, ואני אכתוב עבורך את הפרומפט המושלם.</p>
                        <Textarea 
                            placeholder="לדוגמה: תמונה ריאליסטית של חתול סייברפאנק בגשם..." 
                            className="bg-slate-900 border-slate-700 focus:border-purple-500"
                            value={assistantPrompt}
                            onChange={(e) => setAssistantPrompt(e.target.value)}
                        />
                        {generatedPrompt && (
                            <div className="p-4 bg-slate-900 rounded-lg border border-purple-500/30">
                                <p className="text-xs text-purple-400 mb-2">הפרומפט שנוצר:</p>
                                <p className="text-sm font-mono text-slate-300 whitespace-pre-wrap">{generatedPrompt}</p>
                            </div>
                        )}
                        <Button onClick={generatedPrompt ? copyGenerated : handleAssistantGenerate} className="w-full bg-purple-600 hover:bg-purple-700">
                            {isThinking ? "חושב..." : generatedPrompt ? "העתק וסגור" : "צור פרומפט"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <div className="flex items-center gap-2 bg-slate-900/50 p-1.5 rounded-lg border border-slate-800">
                <SortAsc className="w-4 h-4 text-slate-500 ml-2" />
                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[140px] bg-slate-950 border-slate-800 h-9">
                        <SelectValue placeholder="מיין לפי" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">הכי חדש</SelectItem>
                        <SelectItem value="oldest">הכי ישן</SelectItem>
                        <SelectItem value="likes">פופולריות</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
      </header>

      {isLoading ? (
        <GridSkeleton count={4} />
      ) : (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <AnimatePresence mode="popLayout">
                {prompts
                    ?.sort((a, b) => {
                        if (sortBy === 'likes') return (b.likes || 0) - (a.likes || 0);
                        if (sortBy === 'oldest') return new Date(a.created_date) - new Date(b.created_date);
                        return new Date(b.created_date) - new Date(a.created_date);
                    })
                    ?.map((prompt, index) => (
                        <PromptCard key={prompt.id} prompt={prompt} index={index} />
                    ))}
                </AnimatePresence>
            </div>

            {prompts?.length === 0 && (
                <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
                    <Terminal className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-500">טרם נוספו פרומפטים למאגר.</p>
                </div>
            )}
        </>
      )}
    </div>
  );
}

function PromptCard({ prompt, index }) {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [params, setParams] = useState({ temperature: 0.7, max_tokens: 500 });
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  
  // Refinement State
  const [refineInput, setRefineInput] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const [showRefine, setShowRefine] = useState(false);

  const handleRefine = async () => {
    if (!refineInput || !generatedOutput) return;
    setIsRefining(true);
    try {
        const { data } = await base44.functions.invoke('aiHelper', {
            action: 'refine_output',
            data: {
                original_prompt: prompt.prompt_text,
                current_output: generatedOutput.output,
                feedback: refineInput
            }
        });
        
        if (data.result) {
            const newOutput = { ...generatedOutput, output: data.result, timestamp: new Date() };
            setGeneratedOutput(newOutput);
            setHistory(prev => [newOutput, ...prev]);
            setRefineInput("");
            setShowRefine(false);
        }
    } catch (e) {
        console.error(e);
    } finally {
        setIsRefining(false);
    }
  };

  // Improvement State
  const [isImproving, setIsImproving] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleImprove = async () => {
    setIsImproving(true);
    setShowSuggestions(true);
    try {
        const { data } = await base44.functions.invoke('aiHelper', {
            action: 'improve_prompt',
            data: { prompt: prompt.prompt_text }
        });
        if (data.result && data.result.suggestions) {
            setSuggestions(data.result.suggestions);
        }
    } catch(e) {
        console.error(e);
    } finally {
        setIsImproving(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.prompt_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = async () => {
      setIsGenerating(true);
      try {
          // Determine if it's likely an image prompt based on tags or existing result
          const type = prompt.result_image || prompt.tags?.includes('Image') ? 'image' : 'text';
          
          const { data } = await base44.functions.invoke('generateAI', {
              prompt: prompt.prompt_text,
              type,
              parameters: params
          });
          
          if (data.output) {
              setGeneratedOutput(data);
              setHistory(prev => [data, ...prev]);
          }
      } catch (e) {
          console.error("Generation failed", e);
      } finally {
          setIsGenerating(false);
      }
  };

  const displayImage = generatedOutput?.type === 'image' ? generatedOutput.output : prompt.result_image;
  const displayText = generatedOutput?.type === 'text' ? generatedOutput.output : prompt.result_text;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="h-full"
    >
      <Card className="bg-slate-950 border-slate-800 h-full overflow-hidden flex flex-col group hover:border-purple-500/30 transition-all duration-500">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-start">
            <div>
                <h3 className="text-xl font-bold text-slate-200 mb-2">{prompt.title}</h3>
                {prompt.description && (
                    <p className="text-slate-400 text-sm mb-3 max-w-md">{prompt.description}</p>
                )}
                <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary" className="bg-purple-900/30 text-purple-300 border-purple-800/50">
                        {prompt.model_used || 'AI Model'}
                    </Badge>
                    {prompt.tags?.map(tag => (
                        <Badge key={tag} variant="outline" className="border-slate-700 text-slate-500 text-xs">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </div>
            <LikeButton entityName="AIPrompt" entityId={prompt.id} initialLikes={prompt.likes} />
        </div>

        {/* Content Body */}
        <div className="flex-grow flex flex-col md:flex-row">
            {/* Prompt Side */}
            <div className="p-6 flex-1 border-b md:border-b-0 md:border-l border-slate-800 relative bg-slate-950/80 flex flex-col">
                <div className="absolute top-4 left-4 flex gap-2">
                    <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-slate-500 hover:text-white"
                        onClick={handleCopy}
                        title="העתק פרומפט"
                    >
                        {copied ? <span className="text-xs font-bold text-green-500">✓</span> : <Copy className="w-4 h-4" />}
                    </Button>
                </div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">The Prompt</h4>
                <div className="font-mono text-sm text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto custom-scrollbar flex-grow relative">
                    {prompt.prompt_text}
                </div>

                {/* AI Improvement Suggestions */}
                <AnimatePresence>
                {showSuggestions && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-3 bg-purple-900/20 border border-purple-500/20 rounded-lg p-3 overflow-hidden">
                        <div className="flex justify-between items-center mb-2">
                            <h5 className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                                <Lightbulb className="w-3 h-3" /> הצעות לשיפור (AI)
                            </h5>
                            <Button variant="ghost" size="icon" className="h-4 w-4 text-purple-400/50" onClick={() => setShowSuggestions(false)}>×</Button>
                        </div>
                        {isImproving ? (
                            <div className="flex items-center gap-2 text-xs text-purple-300">
                                <Loader2 className="w-3 h-3 animate-spin" /> מנתח פרומפט...
                            </div>
                        ) : (
                            <ul className="space-y-2">
                                {suggestions?.map((sug, i) => (
                                    <li key={i} className="text-xs text-slate-300 bg-slate-900/50 p-2 rounded border border-slate-800 flex gap-2 cursor-pointer hover:bg-slate-800" onClick={() => navigator.clipboard.writeText(sug)}>
                                        <span className="text-purple-500 font-mono select-none">{i+1}.</span>
                                        {sug}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </motion.div>
                )}
                </AnimatePresence>
                
                {/* Advanced Controls Toggle */}
                <div className="mt-4 flex gap-2">
                     <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={handleImprove}
                        className={`text-xs flex-1 ${showSuggestions ? 'bg-purple-900/20 text-purple-300' : 'text-slate-500 hover:text-purple-400'}`}
                     >
                        <Wand2 className="w-3 h-3 mr-1" /> שפר (AI)
                     </Button>
                     <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowSettings(!showSettings)}
                        className={`text-xs flex-1 ${showSettings ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                     >
                        <Settings2 className="w-3 h-3 mr-1" /> הגדרות
                     </Button>
                     {history.length > 0 && (
                        <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setShowHistory(!showHistory)}
                            className={`text-xs flex-1 ${showHistory ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            <History className="w-3 h-3 mr-1" /> היסטוריה ({history.length})
                        </Button>
                     )}
                </div>

                {showSettings && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="bg-slate-900/50 p-3 rounded-lg mt-2 space-y-3 overflow-hidden">
                         <div className="space-y-1">
                            <label className="text-[10px] uppercase text-slate-500 font-bold flex justify-between">
                                Temperature <span>{params.temperature}</span>
                            </label>
                            <input 
                                type="range" 
                                min="0" max="1" step="0.1"
                                value={params.temperature}
                                onChange={(e) => setParams({...params, temperature: parseFloat(e.target.value)})}
                                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                         </div>
                         <div className="space-y-1">
                            <label className="text-[10px] uppercase text-slate-500 font-bold flex justify-between">
                                Max Tokens <span>{params.max_tokens}</span>
                            </label>
                            <input 
                                type="range" 
                                min="50" max="2000" step="50"
                                value={params.max_tokens}
                                onChange={(e) => setParams({...params, max_tokens: parseInt(e.target.value)})}
                                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                         </div>
                    </motion.div>
                )}

                {showHistory && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="bg-slate-900/50 p-3 rounded-lg mt-2 space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                        <h5 className="text-[10px] font-bold text-slate-500 uppercase">Generation History</h5>
                        {history.map((item, idx) => (
                            <div key={idx} className="text-xs p-2 bg-slate-950 rounded border border-slate-800 cursor-pointer hover:border-purple-500/30" onClick={() => setGeneratedOutput(item)}>
                                <div className="flex justify-between text-slate-500 mb-1">
                                    <span>{new Date(item.timestamp || Date.now()).toLocaleTimeString()}</span>
                                    <span>{item.type}</span>
                                </div>
                                <div className="text-slate-300 truncate">{item.output}</div>
                            </div>
                        ))}
                    </motion.div>
                )}

                <div className="pt-4 mt-2 border-t border-slate-800/50">
                    <Button 
                        onClick={handleRun} 
                        disabled={isGenerating}
                        variant="outline" 
                        className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300"
                    >
                        {isGenerating ? <span className="animate-pulse">Generating...</span> : (
                            <><Sparkles className="w-4 h-4 mr-2" /> נסה שוב (Generate)</>
                        )}
                    </Button>
                </div>
            </div>

            {/* Result Side */}
            <div className="flex-1 bg-slate-900/30 min-h-[250px]">
                {displayImage ? (
                    <div className="h-full relative overflow-hidden group/image">
                        <img 
                            src={displayImage} 
                            alt="Result" 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 to-transparent p-4">
                            <span className="text-xs font-bold text-white uppercase tracking-wider">Output</span>
                        </div>
                    </div>
                ) : displayText ? (
                    <div className="p-6 h-full">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">The Output</h4>
                        <div className="font-serif text-slate-300 italic leading-relaxed text-sm max-h-[300px] overflow-y-auto custom-scrollbar mb-4">
                            {displayText}
                        </div>
                        
                        <div className="mt-auto pt-4 border-t border-slate-800/50">
                             {!showRefine ? (
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => setShowRefine(true)}
                                    className="w-full text-xs text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
                                >
                                    <Sparkles className="w-3 h-3 mr-2" /> חדד תוצאה (Refine)
                                </Button>
                             ) : (
                                <div className="space-y-2">
                                    <Textarea 
                                        placeholder="מה לשנות? (למשל: תעשה את זה יותר קצר...)" 
                                        className="bg-slate-950 border-slate-800 text-xs min-h-[60px]"
                                        value={refineInput}
                                        onChange={(e) => setRefineInput(e.target.value)}
                                    />
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => setShowRefine(false)} className="flex-1 text-xs">ביטול</Button>
                                        <Button 
                                            size="sm" 
                                            onClick={handleRefine} 
                                            disabled={isRefining || !refineInput}
                                            className="flex-1 bg-purple-600 hover:bg-purple-700 text-xs"
                                        >
                                            {isRefining ? <Loader2 className="w-3 h-3 animate-spin" /> : "בצע חידוד"}
                                        </Button>
                                    </div>
                                </div>
                             )}
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center text-slate-600 p-6 text-center">
                        <p className="text-sm">לחץ על Generate כדי לראות תוצאה</p>
                    </div>
                )}
            </div>
        </div>
      </Card>
    </motion.div>
  );
}