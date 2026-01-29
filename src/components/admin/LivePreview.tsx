

interface LivePreviewProps {
    data: any;
    template: 'default' | 'ghibli' | 'glass';
}

const LivePreview: React.FC<LivePreviewProps> = ({ data, template }) => {

    // Render logic based on template
    const getContainerClass = () => {
        switch (template) {
            case 'ghibli': return 'font-serif bg-[#F5F2EA] text-[#4A4A4A]';
            case 'glass': return 'font-sans bg-slate-900 text-white bg-[url("https://lh3.googleusercontent.com/aida-public/AB6AXuB6yuHvqE5qXXMbwSMRN0x7cEdo7FCjz3CXF9tbh97E5rV0EDdJLP_y7Bv59AlGPnUej_WAo5OVrdCCEOCtfqBIJ_aVHbMOO-tFfvZ_FRvFQms2Azfd3ABT03MiRhgAeSHD8WQuOpEI2WN5UTkC2MGptQsZwR5cNm-Oa8_SNSxAhjXIqMeiqnkp5xVwO6-xiFOvHdK-x41_GEE8-hDmNnFzyuutcrHxrYf2DKggc-j4rraWpvEjZaBSUrqx9sjm_L115EOr8RZD4j6J")] bg-cover bg-fixed';
            default: return 'font-sans bg-white text-slate-900 dark:bg-[#111] dark:text-white';
        }
    };

    return (
        <div className={`w-full h-full overflow-y-auto no-scrollbar rounded-2xl border border-white/10 shadow-2xl transition-all duration-500 ${getContainerClass()}`}>

            {/* Hero Section Preview */}
            <div className="relative min-h-[300px] flex flex-col justify-end p-8">
                {template === 'glass' && <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0"></div>}

                <div className="relative z-10">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 ${template === 'ghibli' ? 'bg-[#E67E22] text-white' : 'bg-primary text-black'}`}>
                        Case Study
                    </span>
                    <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${template === 'ghibli' ? 'font-serif' : 'font-display'}`}>
                        {data.title || "Untitled Project"}
                    </h1>
                    <div className="flex items-center gap-4 text-sm opacity-80">
                        <span>{new Date().getFullYear()}</span>
                        <span>•</span>
                        <span>Product Design</span>
                    </div>
                </div>
            </div>

            {/* Sections Preview */}
            <div className="p-8 space-y-12">
                {data.sections.map((section: any) => (
                    <div key={section.id} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* Section Header */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className={`h-px flex-1 ${template === 'ghibli' ? 'bg-[#4A4A4A]/20' : 'bg-current opacity-10'}`}></div>
                            <h3 className={`text-xl font-bold uppercase tracking-widest ${template === 'ghibli' ? 'text-[#E67E22]' : 'text-primary'}`}>
                                {section.title}
                            </h3>
                            <div className={`h-px flex-1 ${template === 'ghibli' ? 'bg-[#4A4A4A]/20' : 'bg-current opacity-10'}`}></div>
                        </div>

                        {/* Content Render */}
                        <div className="prose dark:prose-invert max-w-none">
                            <p className="text-lg leading-relaxed opacity-90 whitespace-pre-wrap">
                                {section.content}
                            </p>
                        </div>

                        {/* Mock Media Render if applicable */}
                        {['problem', 'solution', 'results'].includes(section.type) && (
                            <div className={`mt-8 rounded-xl overflow-hidden aspect-video relative group ${template === 'ghibli' ? 'border-4 border-white shadow-[8px_8px_0_rgba(0,0,0,0.1)]' : 'bg-white/5 border border-white/10'}`}>
                                <div className="absolute inset-0 flex items-center justify-center text-current opacity-20 bg-pattern-grid">
                                    <span className="material-symbols-outlined text-4xl">image</span>
                                </div>
                                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg text-xs text-white font-mono">
                                    {section.title} Visual
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Footer Mock */}
            <div className="p-8 border-t border-current/10 opacity-60 text-center text-sm">
                <p>Designed with ❤️ using Stitch Portfolio</p>
            </div>
        </div>
    );
};

export default LivePreview;
