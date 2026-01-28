import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Mock login delay
        setTimeout(() => {
            setIsLoading(false);
            navigate('/admin');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background-dark text-white flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute top-10 left-10 w-32 h-32 bg-primary/5 rounded-full blur-[60px] pointer-events-none"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-gradient-to-tr from-primary to-emerald-400 rounded-2xl mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(212,255,63,0.3)] mb-6">
                        <span className="material-symbols-outlined text-black text-3xl font-bold">verified_user</span>
                    </div>
                    <h1 className="text-4xl font-display font-bold mb-2 tracking-tight">Welcome Back</h1>
                    <p className="text-white/40 text-sm">Enter your credentials to access the admin panel.</p>
                </div>

                <div className="glass-card p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl bg-[#1A1A1A]/60">
                    <form onSubmit={handleLogin} className="flex flex-col gap-5">
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider font-bold text-white/50 ml-1">Email Address</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">mail</span>
                                </span>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-black/40 transition-all font-sans"
                                    placeholder="admin@stitch.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider font-bold text-white/50 ml-1">Password</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">lock_open</span>
                                </span>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-black/40 transition-all font-sans"
                                    placeholder="••••••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="mt-4 w-full bg-primary text-black font-display font-bold text-lg py-4 rounded-xl hover:shadow-[0_0_20px_rgba(212,255,63,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                            ) : (
                                <>
                                    <span>Sign In Dashboard</span>
                                    <span className="material-symbols-outlined text-xl">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-8 text-white/20 text-xs">
                    Protected by Stitch Secure Systems © 2024
                </p>
            </div>
        </div>
    );
};

export default Login;
