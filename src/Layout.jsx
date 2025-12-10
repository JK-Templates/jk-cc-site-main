import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthProvider } from '@/components/auth/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, Book, Zap, Home, Mail, PenTool, Film } from 'lucide-react';
import { Toaster } from 'sonner';
import SeoHead from '@/components/SeoHead';
import { createPageUrl } from '@/utils';
import { SITE_MODES, loadSiteMode, persistSiteModeOverride } from '@/config/siteMode';

import Preloader from '@/components/ui/Preloader';
import CustomCursor from '@/components/ui/CustomCursor';
import ParticleBackground from '@/components/ui/ParticleBackground';
import SiteTransition from '@/components/ui/SiteTransition';
import GlobalAnimations from '@/components/ui/global-animations.css.jsx';
import '@/components/ui/global-animations.css';

const NavItem = ({ to, icon: Icon, label, isActive, onClick, color }) => (
  <Link
    to={createPageUrl(to)}
    onClick={onClick}
    className={`group relative overflow-hidden flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-500`}
    style={{
        color: isActive ? color : undefined,
        borderColor: isActive ? color : 'transparent',
        borderWidth: '1px',
        boxShadow: isActive ? `0 0 15px ${color}40` : 'none',
        backgroundColor: isActive ? `${color}10` : 'transparent'
    }}
  >
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300`} style={{ backgroundColor: color }} />
    <Icon className={`w-4 h-4 transition-colors duration-300 ${!isActive ? 'text-slate-400 group-hover:text-slate-200' : 'text-current'}`} />
    <span className={`font-medium tracking-wide transition-colors duration-300 ${!isActive ? 'text-slate-400 group-hover:text-slate-200' : 'text-current'}`}>{label}</span>
  </Link>
);

const generateDreamPalette = () => {
    // Generate vivid, psychedelic colors
    const hueBase = Math.random() * 360;
    return [
        `hsl(${hueBase}, 100%, 60%)`,
        `hsl(${(hueBase + 90) % 360}, 100%, 60%)`,
        `hsl(${(hueBase + 180) % 360}, 100%, 60%)`,
        `hsl(${(hueBase + 270) % 360}, 100%, 60%)`,
        `hsl(${(hueBase + 45) % 360}, 100%, 50%)`, // Accent
    ];
};

const groundedPalette = [
  '#0ea5e9',
  '#6366f1',
  '#22c55e',
  '#fbbf24',
  '#f97316',
];

export default function Layout({ children, currentPageName }) {

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitionActive, setIsTransitionActive] = useState(false);
  const [siteMode, setSiteMode] = useState(loadSiteMode);
  const isLsdMode = siteMode === SITE_MODES.LSD;
  const [dreamPalette, setDreamPalette] = useState(() =>
    isLsdMode ? generateDreamPalette() : groundedPalette
  );
  const location = useLocation();


  const handleLogoClick = (e) => {
    e.preventDefault();
    setIsTransitionActive(true);
  };

  const handleTransitionComplete = () => {
    setIsTransitionActive(false);
  };

  useEffect(() => {
    // New dream every load when in LSD mode; grounded palette for normal mode
    setDreamPalette(isLsdMode ? generateDreamPalette() : groundedPalette);

    // Simulate initial loading sequence
    const timer = setTimeout(() => setIsLoading(false), 800);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => {
        window.removeEventListener('scroll', handleScroll);
        clearTimeout(timer);
    };
  }, [isLsdMode]);

  // Smooth scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Optional: Shift palette slightly on navigation for "lucid dream" continuity
    if (isLsdMode && dreamPalette.length > 0) {
        // Shift colors
        setDreamPalette(prev => [...prev.slice(1), prev[0]]);
    }
  }, [location.pathname, isLsdMode, dreamPalette.length]);

  const toggleSiteMode = () => {
    const nextMode = isLsdMode ? SITE_MODES.NORMAL : SITE_MODES.LSD;
    setSiteMode(nextMode);
    persistSiteModeOverride(nextMode);
  };

  const navItems = [
    { to: 'Home', icon: Home, label: 'ראשי' },
    { to: 'Portfolio', icon: Globe, label: 'תיק עבודות' },
    { to: 'Codex', icon: Book, label: 'קודקס' },
    { to: 'AIPrompts', icon: Zap, label: 'AI Prompts' },
    { to: 'AIVideos', icon: Film, label: 'סרטוני AI' },
    { to: 'Blog', icon: PenTool, label: 'בלוג' },
    { to: 'Contact', icon: Mail, label: 'צור קשר' },
  ];

  const primaryColor = dreamPalette[0] || '#f59e0b'; // Default to amber if palette not ready
  const secondaryColor = dreamPalette[1] || '#8b5cf6'; // Default to violet

  return (
    <AuthProvider>
    <div
      dir="rtl"
      className={`min-h-screen text-slate-200 font-sans overflow-x-hidden ${
        isLsdMode ? 'bg-slate-950' : 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950'
      }`}
    >
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-amber-500 focus:text-black top-0 right-0">
        דלג לתוכן העיקרי
      </a>
      <SeoHead />
      {isLsdMode && <CustomCursor color={primaryColor} />}
      
      <AnimatePresence>
        {isLoading && <Preloader color={primaryColor} />}
      </AnimatePresence>

      {/* LSD Dream Background */}
      {isLsdMode && dreamPalette.length > 0 && (
        <>
          <ParticleBackground colors={dreamPalette} />
          <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
              {/* Animated Dream Blobs */}
              <motion.div
                  animate={{
                      scale: [1, 1.2, 0.8, 1],
                      x: [0, 100, -50, 0],
                      y: [0, -50, 50, 0],
                      opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] mix-blend-screen"
                  style={{ backgroundColor: dreamPalette[0] }}
              />
              <motion.div
                  animate={{
                      scale: [1.2, 0.9, 1.1, 1.2],
                      x: [0, -100, 50, 0],
                      y: [0, 50, -100, 0],
                      opacity: [0.2, 0.4, 0.2]
                  }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] rounded-full blur-[120px] mix-blend-screen"
                  style={{ backgroundColor: dreamPalette[1] }}
              />
              <motion.div
                  animate={{
                      scale: [0.8, 1.1, 0.9, 0.8],
                      x: [0, 50, -50, 0],
                      rotate: [0, 180, 360]
                  }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute top-[40%] left-[30%] w-[400px] h-[400px] rounded-full blur-[100px] mix-blend-screen"
                  style={{ backgroundColor: dreamPalette[2], opacity: 0.15 }}
              />
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay" />
          </div>
        </>
      )}

      {/* Navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
          isScrolled 
            ? 'bg-slate-950/40 backdrop-blur-xl border-white/10 py-3 shadow-lg' 
            : 'bg-transparent border-transparent py-6'
        }`}
        style={{
            borderColor: isScrolled ? `${primaryColor}20` : 'transparent'
        }}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">


          <a href="https://test.jonykashi.cc" className="flex items-center gap-2 group" onClick={handleLogoClick}>
            <motion.div 
                whileHover={{ 
                    rotate: [0, 180, 360],
                    scale: [1, 1.2, 1],
                    filter: [
                        "blur(0px) brightness(1)",
                        "blur(1px) brightness(1.3)",
                        "blur(0px) brightness(1)"
                    ]
                }}
                whileTap={{ scale: 0.9 }}
                animate={{
                    filter: [
                        "blur(0px)",
                        "blur(0.5px)",
                        "blur(0px)"
                    ]
                }}
                transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="relative w-8 h-8 rounded-sm flex items-center justify-center text-slate-950 font-bold text-lg shadow-lg transition-all overflow-hidden"
                style={{ 
                    background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                    boxShadow: `0 0 20px ${primaryColor}40`
                }}
            >
              {/* Animated background overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent"
                animate={{
                    x: ["-100%", "100%"],
                    rotate: [0, 45]
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: "easeInOut"
                }}
              />
              <span className="relative z-10">K</span>
            </motion.div>
            <span 
                className="text-xl font-bold bg-clip-text text-transparent transition-all duration-500"
                style={{ 
                    backgroundImage: `linear-gradient(to right, #f8fafc, ${primaryColor})` 
                }}
            >
              JONY KASHI
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">

            {navItems.map((item, index) => (
              <NavItem
                key={item.to}
                {...item}
                isActive={currentPageName === item.to}
                onClick={() => {}}
                color={dreamPalette[(index % dreamPalette.length)] || primaryColor}
              />
            ))}
            <button
              type="button"
              onClick={toggleSiteMode}
              className="ml-3 px-3 py-2 text-xs font-semibold rounded-lg border border-white/10 text-slate-300 hover:text-white hover:border-white/30 transition"
            >
              מצב: {isLsdMode ? 'LSD' : 'רגיל'}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-slate-400 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            className="fixed inset-0 z-40 bg-slate-950/90 backdrop-blur-xl pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-4">
              {navItems.map((item, index) => (
                <NavItem
                  key={item.to}
                  {...item}
                  isActive={currentPageName === item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  color={dreamPalette[(index % dreamPalette.length)] || primaryColor}
                />
              ))}
              <button
                type="button"
                onClick={() => {
                  toggleSiteMode();
                  setIsMobileMenuOpen(false);
                }}
                className="mt-4 px-4 py-3 rounded-lg border border-white/10 text-left text-sm text-slate-200 bg-slate-900/40 hover:border-white/30 transition"
              >
                מעבר למצב {isLsdMode ? 'רגיל' : 'LSD'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main id="main-content" className="relative z-10 pt-24 min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20, filter: "blur(8px)", scale: 0.98 }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
            exit={{ opacity: 0, y: -20, filter: "blur(8px)", scale: 1.02 }}
            transition={{ 
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="container mx-auto px-6 pb-20"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      
      <Toaster 
        position="top-center"
        theme="dark"
        toastOptions={{
          className: 'bg-slate-900/80 backdrop-blur-md border-slate-800 text-slate-100',
        }}
      />


      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/50 py-12 bg-slate-950/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 text-center text-slate-500">
          <p>© {new Date().getFullYear()} Jonathan Kashi. All Rights Reserved.</p>
          <div className="flex justify-center gap-6 mt-4">
             <a href="#" className="transition-colors hover:text-slate-200" style={{ color: primaryColor }}>LinkedIn</a>
             <a href="#" className="transition-colors hover:text-slate-200" style={{ color: primaryColor }}>GitHub</a>
             <a href="#" className="transition-colors hover:text-slate-200" style={{ color: primaryColor }}>Email</a>
          </div>
        </div>
      </footer>


      {/* Site Transition Overlay */}
      <SiteTransition 
        isActive={isTransitionActive}
        onComplete={handleTransitionComplete}
        targetUrl="https://test.jonykashi.cc"
      />

      {/* Global Animations */}
      <GlobalAnimations currentPageName={currentPageName} />
    </div>
    </AuthProvider>
  );
}
