import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Github, Linkedin, MapPin, AlertCircle, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

export default function ContactPage() {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = useMemo(() => {
    const trimmedName = formState.name.trim();
    const trimmedEmail = formState.email.trim();
    const trimmedMessage = formState.message.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return (
      trimmedName.length > 1 &&
      emailRegex.test(trimmedEmail) &&
      trimmedMessage.length > 5
    );
  }, [formState]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isFormValid) {
      setError('נא לוודא שהשדות מלאים וכתובת האימייל תקינה.');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        name: formState.name.trim(),
        email: formState.email.trim(),
        message: formState.message.trim(),
      };

      const { data, error: submissionError } = await base44.functions.invoke('contact', payload);

      if (submissionError || data?.error) {
        throw new Error(submissionError?.message || data?.error || 'שגיאה בשליחה');
      }

      setIsSubmitted(true);
      setFormState({ name: '', email: '', message: '' });
    } catch (err) {
      setError(err.message === 'Failed to fetch'
        ? 'השליחה נכשלה עקב בעיית רשת. אנא נסו שוב מאוחר יותר.'
        : err.message || 'אירעה שגיאה בלתי צפויה בעת השליחה.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-10 min-h-[80vh] flex flex-col items-center justify-center">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-amber-200">
          יצירת קשר
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          מעוניינים לשתף פעולה? יש לכם שאלה על אחד הפרויקטים?
          אני זמין לדיון על טכנולוגיה, פילוסופיה ומה שביניהם.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-12 w-full max-w-4xl">
        {/* Contact Info */}
        <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
        >
            <Card className="bg-slate-900/50 border-slate-800 p-8 h-full flex flex-col justify-center">
                <div className="space-y-8">
                    <div className="flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:border-amber-500/50 group-hover:text-amber-500 transition-colors">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-slate-200 font-bold">Email</h3>
                            <p className="text-slate-500">contact@jonykashi.cc</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:border-amber-500/50 group-hover:text-amber-500 transition-colors">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-slate-200 font-bold">Location</h3>
                            <p className="text-slate-500">Tel Aviv, Israel</p>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-800 flex gap-4">
                        <Button variant="outline" className="flex-1 border-slate-700 hover:bg-slate-800 hover:text-white gap-2">
                            <Github className="w-4 h-4" /> GitHub
                        </Button>
                        <Button variant="outline" className="flex-1 border-slate-700 hover:bg-slate-800 hover:text-white gap-2">
                            <Linkedin className="w-4 h-4" /> LinkedIn
                        </Button>
                    </div>
                </div>
            </Card>
        </motion.div>

        {/* Form */}
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
        >
            <Card className="bg-slate-950 border-slate-800 p-8">
                {isSubmitted ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-4">
                            <Send className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-100">ההודעה נשלחה!</h3>
                        <p className="text-slate-400">תודה שפנית אליי. אשתדל לחזור אליך בהקדם.</p>
                        <Button onClick={() => {
                          setIsSubmitted(false);
                          setError('');
                        }} variant="ghost" className="mt-4">
                            שלח הודעה נוספת
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">שם מלא</label>
                            <Input
                                placeholder="ישראל ישראלי" 
                                className="bg-slate-900 border-slate-800 focus:border-amber-500/50"
                                value={formState.name}
                                onChange={(e) => setFormState({...formState, name: e.target.value})}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">אימייל</label>
                            <Input 
                                type="email" 
                                placeholder="name@example.com" 
                                className="bg-slate-900 border-slate-800 focus:border-amber-500/50"
                                value={formState.email}
                                onChange={(e) => setFormState({...formState, email: e.target.value})}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">הודעה</label>
                            <Textarea 
                                placeholder="על מה נדבר?" 
                                className="bg-slate-900 border-slate-800 focus:border-amber-500/50 min-h-[150px]"
                                value={formState.message}
                                onChange={(e) => setFormState({...formState, message: e.target.value})}
                                required
                            />
                        </div>
                        {error && (
                          <div className="flex items-start gap-2 text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                            <AlertCircle className="w-4 h-4 mt-0.5" />
                            <p className="text-sm leading-relaxed">{error}</p>
                          </div>
                        )}
                        <Button
                          type="submit"
                          disabled={!isFormValid || isLoading}
                          className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                              <div className="flex items-center justify-center gap-2 w-full">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                שולח...
                              </div>
                            ) : 'שליחה'}
                        </Button>
                    </form>
                )}
            </Card>
        </motion.div>
      </div>
    </div>
  );
}