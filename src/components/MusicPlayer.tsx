import { useState, useEffect, useRef } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { motion, AnimatePresence } from 'framer-motion';

const MusicPlayer = () => {
    const bgMusicUrl = useQuery(api.settings.get, { key: "background_music_url" });
    const bgMusicEnabledStr = useQuery(api.settings.get, { key: "background_music_enabled" });
    const isEnabled = bgMusicEnabledStr === "true";

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    // Initialize audio
    useEffect(() => {
        if (bgMusicUrl && isEnabled) {
            audioRef.current = new Audio(bgMusicUrl);
            audioRef.current.loop = true;

            // Try auto-play if possible (often blocked by browsers until interaction)
            // We'll rely on user click primarily
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

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-2"
            >
                {/* Tooltip hint */}
                {!hasInteracted && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="bg-black/80 backdrop-blur text-white text-[10px] py-1 px-3 rounded-full border border-white/10 mb-2 pointer-events-none"
                    >
                        Click to play
                    </motion.div>
                )}

                <button
                    onClick={togglePlay}
                    className="group relative w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full transition-all focus:outline-none"
                    title={isPlaying ? "Pause Music" : "Play Music"}
                >
                    {/* Vinyl Disc Background */}
                    <div
                        className={`absolute inset-0 rounded-full bg-neutral-900 border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)] overflow-hidden ${isPlaying ? 'animate-spin-slow' : ''}`}
                        style={{ animationDuration: '4s' }}
                    >
                        {/* Grooves */}
                        <div className="absolute inset-[2px] rounded-full border border-white/5 opacity-50"></div>
                        <div className="absolute inset-[6px] rounded-full border border-white/5 opacity-40"></div>
                        <div className="absolute inset-[10px] rounded-full border border-white/5 opacity-30"></div>

                        {/* Center Label */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-1/3 h-1/3 rounded-full bg-primary/20 flex items-center justify-center relative">
                                <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                            </div>
                        </div>

                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>

                    {/* Icon - Always upright thanks to being outside the spinning div */}
                    <div className="relative z-10 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-primary border border-white/5 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-sm md:text-base">
                            {isPlaying ? 'pause' : 'play_arrow'}
                        </span>
                    </div>

                    {/* Pulse effect when playing */}
                    {isPlaying && (
                        <div className="absolute inset-0 rounded-full border border-primary/30 animate-ping opacity-20 pointer-events-none"></div>
                    )}
                </button>
            </motion.div>
        </AnimatePresence>
    );
};

export default MusicPlayer;
