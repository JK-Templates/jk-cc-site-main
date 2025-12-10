
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const generateDreamPalette = () => {
    // Generate vivid, psychedelic colors
    const hueBase = Math.random() * 360;
    return [
        `hsl(${hueBase}, 100%, 60%)`,
        `hsl(${(hueBase + 90) % 360}, 100%, 60%)`,
        `hsl(${(hueBase + 180) % 360}, 100%, 60%)`,
        `hsl(${(hueBase + 270) % 360}, 100%, 60%)`,
        `hsl(${(hueBase + 45) % 360}, 100%, 50%)`,
    ];
};

const generateTransitionParticles = (count = 20) => {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 10,
        duration: Math.random() * 3 + 2,
    }));
};

export default function SiteTransition({ isActive, onComplete, targetUrl }) {
    const [dreamPalette, setDreamPalette] = useState([]);
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        if (isActive) {
            setDreamPalette(generateDreamPalette());
            setParticles(generateTransitionParticles(25));
        }
    }, [isActive]);

    useEffect(() => {
        if (isActive) {
            const timer = setTimeout(() => {
                onComplete();
                if (targetUrl) {
                    window.location.href = targetUrl;
                }
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isActive, onComplete, targetUrl]);

    if (!isActive) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] overflow-hidden"
            style={{
                background: 'linear-gradient(45deg, #0A0E27, #1A1B3A, #2D1B69)',
            }}
        >
            {/* Animated Background Layers */}
            <div className="absolute inset-0">
                {dreamPalette.map((color, index) => (

                    <motion.div
                        key={index}
                        className="absolute rounded-full blur-3xl"
                        style={{
                            width: `${Math.random() * 400 + 200}px`,
                            height: `${Math.random() * 400 + 200}px`,
                            backgroundColor: color,
                            opacity: 0.3,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            x: [0, 100, -50, 0],
                            y: [0, -80, 60, 0],
                            scale: [1, 1.3, 0.8, 1],
                            rotate: [0, 180, 360],
                        }}
                        transition={{
                            duration: 8 + index,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            {/* Transition Particles */}
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full"
                    style={{
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        background: `linear-gradient(45deg, ${dreamPalette[particle.id % dreamPalette.length] || '#A78BFA'}, ${dreamPalette[(particle.id + 1) % dreamPalette.length] || '#EC4899'})`,
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                    }}
                    animate={{
                        scale: [0, 2, 0],
                        opacity: [0, 1, 0],
                        rotate: [0, 360],
                        x: [0, Math.random() * 200 - 100],
                        y: [0, Math.random() * 200 - 100],
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}

            {/* Central Logo Animation */}
            <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                    className="relative"
                    initial={{ scale: 0, rotate: 0 }}
                    animate={{ 
                        scale: [0, 1.5, 2],
                        rotate: [0, 180, 360],
                    }}
                    transition={{ 
                        duration: 2,
                        ease: "easeInOut"
                    }}
                >
                    {/* Main Logo */}
                    <motion.div
                        className="w-32 h-32 rounded-xl flex items-center justify-center text-4xl font-bold text-slate-950 relative overflow-hidden"
                        style={{
                            background: `linear-gradient(135deg, ${dreamPalette[0] || '#A78BFA'}, ${dreamPalette[1] || '#EC4899'})`,
                            boxShadow: `0 0 50px ${dreamPalette[0] || '#A78BFA'}60`,
                        }}
                        animate={{
                            rotateY: [0, 180, 360],
                            rotateX: [0, 180, 0],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        K
                        
                        {/* Shimmer Effect */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            animate={{
                                x: ["-100%", "100%"],
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    </motion.div>

                    {/* Orbiting Elements */}
                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-4 h-4 rounded-full"

                            style={{
                                backgroundColor: dreamPalette[(i + 2) % dreamPalette.length] || '#06B6D4',
                                boxShadow: `0 0 10px ${dreamPalette[(i + 2) % dreamPalette.length] || '#06B6D4'}`,
                                left: '50%',
                                top: '50%',
                                transformOrigin: '0 0',
                                transform: `rotate(${i * 45}deg) translateX(80px)`,
                            }}
                            animate={{
                                rotate: [0, 360],
                                scale: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 2 + i * 0.2,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                        />
                    ))}
                </motion.div>
            </div>

            {/* Text Animation */}
            <motion.div
                className="absolute bottom-32 left-1/2 transform -translate-x-1/2 text-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ delay: 0.5 }}
            >
                <motion.h2
                    className="text-3xl font-bold text-white mb-4"
                    animate={{
                        textShadow: [
                            '0 0 10px rgba(167, 139, 250, 0.5)',
                            '0 0 20px rgba(236, 72, 153, 0.8)',
                            '0 0 30px rgba(6, 182, 212, 0.6)',
                            '0 0 20px rgba(167, 139, 250, 0.5)',
                        ],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    נכנס למצב Matrix LSD Mode
                </motion.h2>
                
                <motion.p
                    className="text-slate-300 text-lg"
                    animate={{
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    מעבר לעולם חדש...
                </motion.p>
            </motion.div>

            {/* Scan Lines Effect */}
            <div className="absolute inset-0 opacity-20">
                {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                        style={{ top: `${(i / 20) * 100}%` }}
                        animate={{
                            opacity: [0, 1, 0],
                            x: ["-100%", "100%"],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.1,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            {/* Noise Overlay */}
            <div 
                className="absolute inset-0 opacity-10 mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />
        </motion.div>
    );
}
