import { SignIn } from '@clerk/clerk-react';

const Login = () => {
    return (
        <div className="min-h-screen bg-background-dark text-white flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute top-10 left-10 w-32 h-32 bg-primary/5 rounded-full blur-[60px] pointer-events-none"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="w-full max-w-md relative z-10 flex flex-col items-center">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-display font-bold mb-2 tracking-tight">Access Dashboard</h1>
                </div>

                <SignIn
                    appearance={{
                        elements: {
                            formButtonPrimary: 'bg-primary text-black hover:bg-primary/90',
                            card: 'bg-[#1A1A1A]/60 border border-white/10 backdrop-blur-xl',
                            headerTitle: 'text-white',
                            headerSubtitle: 'text-white/60',
                            socialButtonsBlockButton: 'text-white border-white/20 hover:bg-white/5',
                            formFieldLabel: 'text-white/70',
                            formFieldInput: 'bg-black/20 border-white/10 text-white placeholder-white/20',
                            footerActionLink: 'text-primary hover:text-primary/80'
                        }
                    }}
                    fallbackRedirectUrl="/admin"
                />
            </div>
        </div>
    );
};

export default Login;
