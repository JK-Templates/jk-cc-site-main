import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function GlobalAnimations({ currentPageName }) {
  useEffect(() => {
    // Add smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <>
      {/* Page Transition Overlay */}

      <motion.div
        key={currentPageName}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="fixed inset-0 pointer-events-none z-[50]"
        style={{
          background: 'linear-gradient(45deg, rgba(167, 139, 250, 0.02), rgba(236, 72, 153, 0.02), rgba(6, 182, 212, 0.02))',
          backdropFilter: 'blur(1px)',
        }}
      />
      
      {/* Floating Elements */}
      <div className="fixed inset-0 pointer-events-none z-[40] overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full opacity-30"

            style={{
              background: `linear-gradient(45deg, hsl(${(i * 45) % 360}, 100%, 60%), hsl(${(i * 45 + 45) % 360}, 100%, 60%))`,
              boxShadow: '0 0 6px currentColor',
              left: `${10 + (i * 12)}%`,
              top: `${20 + (i * 8)}%`,
            }}
            animate={{
              x: [0, 100, -50, 0],
              y: [0, -80, 60, 0],
              opacity: [0.1, 0.5, 0.1],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 8 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </div>
    </>
  );
}
