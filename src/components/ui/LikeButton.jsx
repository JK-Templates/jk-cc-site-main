import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { cn } from "@/lib/utils";

export default function LikeButton({ entityName, entityId, initialLikes = 0, className }) {
    const [likes, setLikes] = useState(initialLikes);
    const [isLiked, setIsLiked] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleLike = async (e) => {
        e.stopPropagation();
        if (isLiked) return; // Prevent spamming for now

        setIsLiked(true);
        setLikes(prev => prev + 1);
        setIsAnimating(true);

        // Optimistic UI, fire and forget
        base44.functions.invoke('interact', {
            entityName,
            entityId,
            action: 'like'
        });

        setTimeout(() => setIsAnimating(false), 1000);
    };

    return (
        <motion.button 
            onClick={handleLike}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className={cn("flex items-center gap-2 group transition-colors", className)}
        >
            <div className="relative">
                <Heart 
                    className={cn(
                        "w-5 h-5 transition-all duration-300",
                        isLiked ? "fill-red-500 text-red-500" : "text-slate-500 group-hover:text-red-400"
                    )} 
                />
                {isAnimating && (
                    <motion.div
                        initial={{ scale: 0, opacity: 1, y: 0 }}
                        animate={{ scale: 2, opacity: 0, y: -20 }}
                        className="absolute inset-0 z-10"
                    >
                        <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                    </motion.div>
                )}
            </div>
            <span className={cn(
                "text-sm font-medium tabular-nums",
                isLiked ? "text-slate-200" : "text-slate-500"
            )}>
                {likes}
            </span>
            </motion.button>
            );
}