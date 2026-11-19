import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

const SiteHeader = () => {
    const convexResumes = useQuery(api.resumes.list);
    const [showCvMenu, setShowCvMenu] = useState(false);

    return (
        <header className="fixed top-0 left-0 w-full z-50 glass-strong px-4 sm:px-6 md:px-12 py-3 sm:py-4 flex items-center justify-between gap-2 transition-all duration-300">
            <Link to="/" className="flex items-center gap-2 shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black font-bold font-display text-sm">
                    AG
                </div>
            </Link>
            <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
                {convexResumes && convexResumes.filter((r) => r.visible).length > 0 && (
                    <div className="relative">
                        <button
                            onClick={() => setShowCvMenu(!showCvMenu)}
                            className="px-2.5 sm:px-4 py-2 rounded-full border border-white/10 text-xs font-medium uppercase tracking-wider hover:bg-white hover:text-black transition-all flex items-center gap-1.5 sm:gap-2"
                            aria-label="Download CV"
                        >
                            <span className="material-symbols-outlined text-[18px] sm:hidden">description</span>
                            <span className="hidden sm:inline">Download CV</span>
                            <span className="material-symbols-outlined text-[16px] hidden sm:inline">expand_more</span>
                        </button>

                        {showCvMenu && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-card-dark border border-white/10 rounded-xl shadow-xl overflow-hidden py-1 z-50">
                                {convexResumes
                                    .filter((r) => r.visible)
                                    .sort((a, b) => a.order - b.order)
                                    .map((cv) => (
                                        <a
                                            key={cv._id}
                                            href={cv.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block px-4 py-3 text-sm text-white/70 hover:bg-primary hover:text-black transition-colors flex items-center gap-2"
                                            onClick={() => setShowCvMenu(false)}
                                        >
                                            <span className="material-symbols-outlined text-xs">open_in_new</span>
                                            {cv.label}
                                        </a>
                                    ))}
                            </div>
                        )}
                    </div>
                )}

                <button
                    type="button"
                    className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center text-white/70 hover:text-primary transition-colors hover:bg-white/5 shrink-0"
                    aria-label="Toggle theme"
                >
                    <span className="material-symbols-outlined text-[20px]">light_mode</span>
                </button>
                <Link
                    to="/login"
                    className="px-2.5 sm:px-4 py-2 rounded-full border border-white/10 text-xs font-medium uppercase tracking-wider hover:bg-white hover:text-black transition-all flex items-center gap-1.5 sm:gap-2 shrink-0"
                >
                    <span className="hidden sm:inline">Login</span>
                    <span className="material-symbols-outlined text-[16px]">lock</span>
                </Link>
            </div>
        </header>
    );
};

export default SiteHeader;
