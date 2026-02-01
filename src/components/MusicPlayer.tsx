import { useState, useEffect, useRef } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const MusicPlayer = () => {
    const location = useLocation();
    const isHome = location.pathname === '/';

    const bgMusicUrl = useQuery(api.settings.get, { key: "background_music_url" });
    const bgMusicEnabledStr = useQuery(api.settings.get, { key: "background_music_enabled" });
    const isEnabled = bgMusicEnabledStr === "true";

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    // ... stats ...

    // Initialize audio
    useEffect(() => {
        if (bgMusicUrl && isEnabled) {
            audioRef.current = new Audio(bgMusicUrl);
            audioRef.current.loop = true;
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [bgMusicUrl, isEnabled]);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play()
                .then(() => {
                    setIsPlaying(true);
                    setHasInteracted(true);
                })
                .catch(err => console.error("Audio play failed:", err));
        }
    };

    if (!isEnabled || !bgMusicUrl) return null;

    // Only render UI on Home page
    if (!isHome) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                className="fixed bottom-10 right-10 z-[100] flex flex-col items-center justify-center"
            >
                {/* Rotating Text Ring */}
                <div className="relative w-32 h-32 flex items-center justify-center group cursor-pointer" onClick={togglePlay}>
                    <motion.div
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    >
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                            <defs>
                                <path id="textPath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
                            </defs>
                            <text className="text-[10px] uppercase font-bold tracking-widest fill-white/40">
                                <textPath href="#textPath" startOffset="0%">
                                    DESIGN • STRATEGY • PRODUCT • VISION •
                                </textPath>
                            </text>
                        </svg>
                    </motion.div>

                    {/* Central Play Button / Disc */}
                    <div
                        className="relative w-16 h-16 flex items-center justify-center rounded-full bg-black border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-transform group-hover:scale-105"
                        title={isPlaying ? "Pause Music" : "Play Music"}
                    >
                        {/* Spinning Vinyl Effect */}
                        <div
                            className={`absolute inset-0 rounded-full overflow-hidden ${isPlaying ? 'animate-spin-slow' : ''}`}
                            style={{ animationDuration: '3s' }}
                        >
                            {/* Grooves */}
                            <div className="absolute inset-[2px] rounded-full border border-white/5 opacity-50"></div>
                            <div className="absolute inset-[6px] rounded-full border border-white/5 opacity-40"></div>
                            <div className="absolute inset-[10px] rounded-full border border-white/5 opacity-30"></div>

                            {/* Shine */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>

                        {/* Icon */}
                        <div className="relative z-10 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-xl">
                                {isPlaying ? 'pause' : 'play_arrow'}
                            </span>
                        </div>

                        {/* Playing Glow */}
                        {isPlaying && (
                            <div className="absolute inset-0 rounded-full border border-primary/30 animate-ping opacity-20 pointer-events-none"></div>
                        )}
                    </div>
                </div>

                {/* Tooltip hint - moved below or remove if too cluttered */}
                {!hasInteracted && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute -top-8 bg-black/80 backdrop-blur text-white text-[10px] py-1 px-3 rounded-full border border-white/10 whitespace-nowrap pointer-events-none"
                    >
                        Click to play
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence>
    );
};

export default MusicPlayer;
