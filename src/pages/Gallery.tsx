import { Link } from 'react-router-dom';

const Gallery = () => {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white transition-colors duration-300 min-h-screen pb-32">
            <div className="h-12 w-full"></div>
            <main className="px-6 pb-24">
                <header className="flex justify-between items-end mb-8">
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 font-semibold mb-1">Selected Work</p>
                        <h1 className="text-4xl font-display font-extrabold tracking-tight">
                            Magical <br /> <span className="text-primary">Projects</span>
                        </h1>
                    </div>
                    <button className="bg-slate-100 dark:bg-card-dark p-3 rounded-2xl border border-slate-200 dark:border-white/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-slate-700 dark:text-white">tune</span>
                    </button>
                </header>

                <div className="flex gap-3 overflow-x-auto pb-6 -mx-6 px-6 no-scrollbar">
                    <button className="bg-primary text-black px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap">All Work</button>
                    <button className="bg-slate-100 dark:bg-card-dark text-slate-600 dark:text-slate-400 px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap border border-slate-200 dark:border-white/5">UX Strategy</button>
                    <button className="bg-slate-100 dark:bg-card-dark text-slate-600 dark:text-slate-400 px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap border border-slate-200 dark:border-white/5">AI Products</button>
                    <button className="bg-slate-100 dark:bg-card-dark text-slate-600 dark:text-slate-400 px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap border border-slate-200 dark:border-white/5">Fintech</button>
                </div>

                <div className="space-y-8">
                    {/* Project 1 */}
                    <div className="group relative">
                        <div className="rounded-3xl overflow-hidden mb-4 aspect-[4/5] relative glass-card">
                            <img alt="Mobile banking interface project" className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFADJcH81M804o8Drv8nShqShY6SDmFUr4t0r7axVWBQydWb0kDgDi2REHbuw_e_dtURLQx8BZI-U1sX4jiSLX0AVvhOl2CFwZfEVRj6XXN9y_jTEDzfOhLEkArtBCyr8emBHgycrRdh4bELU2pyNvEoSuvFdqyaf6OrfTA2pWhzj4LMBy260nxXizJDpRO6B1lnD_i6T83gzlqaja0M7qffdEjmc-d363jdT_d1WExmIZcGUDaYhi-DuwlC5N0FNfi9_Y1Jp2qFJa" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                            <div className="absolute bottom-6 left-6 flex gap-2">
                                <span className="px-3 py-1 bg-primary/90 text-black text-[10px] font-bold uppercase tracking-wider rounded-md">UX Design</span>
                                <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded-md">Fintech</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-display font-bold mb-1">NeoWealth 2.0</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Revolutionizing personal asset management</p>
                            </div>
                            <div className="h-10 w-10 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-sm">arrow_outward</span>
                            </div>
                        </div>
                    </div>

                    {/* Project 2 */}
                    <div className="group relative">
                        <div className="rounded-3xl overflow-hidden mb-4 aspect-[4/5] relative glass-card">
                            <img alt="Data analytics dashboard mockup" className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPKlnfLSI7M-k0RXiDcT0RiySiNf6LfEHfamcBKlkQ_F3DUHflOjo_aRHaobrSWXfXOC0gvyd2YdqyDZQEU1SEMgBXVYBFIH2Q0nr6Nlm0uzlN4w__bhJEbCqbhjTxnhpY4PTDXIWzULOWV4D2qMzP7kMROZLYuouZ9Vn3UeY11JF9KE7ILyBztTzdb89fe1vejxnEZLu_3hHx1UqoqGy9ieAmfvlxrHpmHoaJlqf8lasBHW69-qm1nD0ACO8D54i8dVEgsxeETBPR" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                            <div className="absolute bottom-6 left-6 flex gap-2">
                                <span className="px-3 py-1 bg-primary/90 text-black text-[10px] font-bold uppercase tracking-wider rounded-md">AI Model</span>
                                <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded-md">Strategy</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-display font-bold mb-1">Sentient Analytics</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Predictive user behavior modeling</p>
                            </div>
                            <div className="h-10 w-10 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-sm">arrow_outward</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-20 text-center pb-12">
                    <h4 className="text-2xl font-display font-bold mb-4">Want to see more?</h4>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-[280px] mx-auto text-sm leading-relaxed">
                        I'm currently looking for new opportunities to build impactful products.
                    </p>
                    <a className="inline-flex items-center gap-2 bg-primary text-black px-8 py-4 rounded-full font-bold text-sm tracking-wide shadow-xl shadow-primary/10" href="mailto:hello@portz.design">
                        GET IN TOUCH
                        <span className="material-symbols-outlined text-base">send</span>
                    </a>
                </div>
            </main>

            {/* Bottom Nav */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-background-dark/80 backdrop-blur-xl border-t border-slate-200 dark:border-white/5 px-8 pt-4 pb-8 flex justify-between items-center z-50">
                <Link to="/" className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-600 hover:text-primary">
                    <span className="material-symbols-outlined text-2xl">home</span>
                    <span className="text-[10px] font-medium uppercase tracking-tighter">Home</span>
                </Link>
                <Link to="/gallery" className="flex flex-col items-center gap-1 text-primary">
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>grid_view</span>
                    <span className="text-[10px] font-medium uppercase tracking-tighter">Work</span>
                </Link>
                <Link to="/admin" className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-600 hover:text-primary">
                    <span className="material-symbols-outlined text-2xl">person</span>
                    <span className="text-[10px] font-medium uppercase tracking-tighter">Admin</span>
                </Link>
                <button className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-600 hover:text-primary">
                    <span className="material-symbols-outlined text-2xl">chat_bubble</span>
                    <span className="text-[10px] font-medium uppercase tracking-tighter">Connect</span>
                </button>
            </nav>
        </div>
    );
};

export default Gallery;
