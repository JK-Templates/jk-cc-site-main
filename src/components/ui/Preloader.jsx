import React from 'react';
import { motion } from 'framer-motion';

export default function Preloader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center"
    >
      <div className="relative w-32 h-32">
        {/* Outer Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border border-slate-800 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-4 border border-slate-700 rounded-full"
        />
        
        {/* Geometric Core */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
            rotate: [0, 45, 0]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
            <div className="w-12 h-12 bg-amber-500/20 rotate-45 backdrop-blur-md border border-amber-500/50" />
        </motion.div>
        
        {/* Loading Text */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-max text-center">
            <motion.p 
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-amber-500 text-xs tracking-[0.3em] font-medium"
            >
                INITIALIZING
            </motion.p>
        </div>
      </div>
    </motion.div>
  );
}