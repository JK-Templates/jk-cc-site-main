import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

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

export default function Preloader() {
    const [dreamPalette, setDreamPalette] = useState([]);

    useEffect(() => {
        setDreamPalette(generateDreamPalette());
    }, []);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center overflow-hidden"
        >
            {/* Animated Background */}
            <div className="absolute inset-0">
                {dreamPalette.slice(0, 3).map((color, index) => (
                    <motion.div
                        key={index}
                        className="absolute rounded-full blur-3xl opacity-30"
                        style={{
                            width: `${300 + index * 100}px`,
                            height: `${300 + index * 100}px`,
                            backgroundColor: color,
                            left: `${20 + index * 30}%`,
                            top: `${20 + index * 20}%`,
                        }}
                        animate={{
                            x: [0, 100, -50, 0],
                            y: [0, -80, 60, 0],
                            scale: [1, 1.2, 0.8, 1],
                        }}
                        transition={{
                            duration: 6 + index * 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            <div className="relative w-40 h-40 flex items-center justify-center">
                {/* Outer Orbiting Rings */}
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full border-2"
                        style={{
                            borderColor: dreamPalette[i] || '#A78BFA',
                            width: `${120 + i * 20}px`,
                            height: `${120 + i * 20}px`,
                        }}
                        animate={{
                            rotate: [0, 360],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 8 + i * 2,
                            repeat: Infinity,
                            ease: "linear",
                            delay: i * 0.5,
                        }}
                    />
                ))}

                {/* Inner Geometric Core */}
                <motion.div
                    animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.6, 1, 0.6],
                        rotate: [0, 90, 180, 270, 360]
                    }}
                    transition={{ 
                        duration: 4, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                    }}
                    className="relative w-16 h-16 flex items-center justify-center"
                >
                    {/* Central Diamond */}
                    <motion.div
                        className="w-8 h-8 backdrop-blur-md border-2 relative overflow-hidden"
                        style={{
                            backgroundColor: `${dreamPalette[0] || '#A78BFA'}40`,
                            borderColor: dreamPalette[0] || '#A78BFA',
                        }}
                        animate={{
                            rotate: [45, 135, 225, 315, 45],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-transparent via-white/30 to-transparent"
                            animate={{
                                x: ["-100%", "100%"],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    </motion.div>

                    {/* Orbiting Particles */}
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 rounded-full"
                            style={{
                                backgroundColor: dreamPalette[(i + 1) % dreamPalette.length] || '#EC4899',
                                boxShadow: `0 0 10px ${dreamPalette[(i + 1) % dreamPalette.length] || '#EC4899'}`,
                                left: '50%',
                                top: '50%',
                                transformOrigin: '0 0',
                                transform: `rotate(${i * 60}deg) translateX(50px)`,
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
                
                {/* Loading Text */}
                <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-max text-center">
                    <motion.p 
                        animate={{ 
                            opacity: [0.4, 1, 0.4],
                            textShadow: [
                                `0 0 10px ${dreamPalette[0] || '#A78BFA'}`,
                                `0 0 20px ${dreamPalette[1] || '#EC4899'}`,
                                `0 0 10px ${dreamPalette[2] || '#06B6D4'}`,
                            ]
                        }}
                        transition={{ 
                            duration: 2.5, 
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="text-lg tracking-[0.4em] font-bold"
                        style={{
                            color: dreamPalette[0] || '#A78BFA',
                        }}
                    >
                        INITIALIZING
                    </motion.p>
                    
                    <motion.div
                        className="mt-4 h-1 w-32 mx-auto rounded-full overflow-hidden"
                        style={{
                            backgroundColor: `${dreamPalette[0] || '#A78BFA'}20`,
                        }}
                    >
                        <motion.div
                            className="h-full rounded-full"
                            style={{
                                background: `linear-gradient(90deg, ${dreamPalette[0] || '#A78BFA'}, ${dreamPalette[1] || '#EC4899'}, ${dreamPalette[2] || '#06B6D4'})`,
                            }}
                            animate={{
                                x: ["-100%", "100%"],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    </motion.div>
                </div>
            </div>

            {/* Floating Particles */}
            {Array.from({ length: 15 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full"
                    style={{
                        backgroundColor: dreamPalette[i % dreamPalette.length] || '#A78BFA',
                        boxShadow: `0 0 6px ${dreamPalette[i % dreamPalette.length] || '#A78BFA'}`,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -100, 0],
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </motion.div>
    );
}
