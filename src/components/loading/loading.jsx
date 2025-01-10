import React from 'react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const Loading = () => {
    const [progress, setProgress] = useState(0);
    const [loadingText, setLoadingText] = useState('SugoiHub');

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                return prev + 1;
            });
        }, 50);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const texts = ["SugoiHub"]
        let index = 0;

        const timer = setInterval(() => {
            index = (index + 1) % texts.length;
            setLoadingText(texts[index]);
        }, 2000);

        return () => clearInterval(timer);
    }, []);

    const hexagonPoints = "M50,0 L93.3,25 L93.3,75 L50,100 L6.7,75 L6.7,25 Z";

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-200">
            <div className="relative">
                {/* Main Container */}
                <motion.div
                    className="flex flex-col items-center gap-8"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Hexagon Loader */}
                    <div className="relative w-40 h-40">
                        <motion.svg
                            viewBox="0 0 100 100"
                            className="absolute inset-0 w-full h-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                            <motion.path
                                d={hexagonPoints}
                                fill="none"
                                stroke="url(#gradient)"
                                strokeWidth="3"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#3B82F6" />
                                    <stop offset="100%" stopColor="#8B5CF6" />
                                </linearGradient>
                            </defs>
                        </motion.svg>

                        {/* Inner rotating circles */}
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute inset-0 border-2 border-blue-500/30 rounded-full"
                                animate={{
                                    rotate: 360,
                                    scale: [1, 1.2, 1],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    delay: i * 0.4,
                                    ease: "linear"
                                }}
                            />
                        ))}

                        {/* Center dot */}
                        <motion.div
                            className="absolute top-1/2 left-1/2 w-2 h-2 -ml-1 -mt-1 bg-blue-500 rounded-full"
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    </div>

                    {/* Progress Text */}
                    <div className="text-xl font-bold text-center space-y-2">
                        <motion.div
                            className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {loadingText}
                        </motion.div>
                        <div className="text-blue-400">{progress}%</div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-80 h-2 bg-gray-200/20 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 relative"
                            style={{ width: `${progress}%` }}
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Moving light effect */}
                            <motion.div
                                className="absolute top-0 right-0 w-20 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                animate={{
                                    x: ['-100%', '100%'],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                            />
                        </motion.div>
                    </div>

                    {/* Animated Dots */}
                    <div className="flex gap-2">
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"
                                animate={{
                                    y: [-8, 0, -8],
                                    opacity: [0.5, 1, 0.5],
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    delay: i * 0.1,
                                    ease: "easeInOut"
                                }}
                            />
                        ))}
                    </div>

                    {/* Orbital Particles */}
                    <div className="absolute inset-0">
                        {[...Array(12)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
                                animate={{
                                    rotate: 360,
                                }}
                                style={{
                                    left: '50%',
                                    top: '50%',
                                    transformOrigin: `${Math.cos(i * 30) * 80}px ${Math.sin(i * 30) * 80}px`,
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "linear",
                                    delay: i * 0.1
                                }}
                            />
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Loading;