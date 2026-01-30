

interface LivePreviewProps {
    data: any;
    template: 'default' | 'ghibli' | 'glass';
}

const LivePreview: React.FC<LivePreviewProps> = ({ data, template }) => {

    // Render logic based on template
    const getContainerClass = () => {
        switch (template) {
            case 'ghibli': return 'font-serif bg-[#F5F2EA] text-[#4A4A4A]';
            case 'glass': return `font-sans bg-slate-900 text-white bg-[url('${data.image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"}')] bg-cover bg-fixed`;
            default: return 'font-sans bg-white text-slate-900 dark:bg-[#111] dark:text-white';
        }
    };

    const getEmbedUrl = (url: string, type: string) => {
        if (!url) return '';

        if (type === 'video') {
            if (url.includes('youtube.com/watch?v=')) {
                return url.replace('watch?v=', 'embed/');
            }
            if (url.includes('youtu.be/')) {
                return url.replace('youtu.be/', 'youtube.com/embed/');
            }
        }

        if (type === 'figma') {
            return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`;
        }

        if (type === 'miro') {
            const boardIdMatch = url.match(/miro\.com\/app\/board\/([^\/]+)/);
            if (boardIdMatch && boardIdMatch[1]) {
                return `https://miro.com/app/live-embed/${boardIdMatch[1]}/?moveToViewport=-500,-500,1000,1000`;
            }
        }

        return url;
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
                        <span>{data.year || new Date().getFullYear()}</span>
                        <span>•</span>
                        <div className="flex gap-2">
                            {data.tags && data.tags.length > 0 ? (
                                data.tags.map((tag: string) => (
                                    <span key={tag} className="uppercase tracking-wider">{tag}</span>
                                ))
                            ) : (
                                <span>Product Design</span>
                            )}
                        </div>
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
                        {/* Content Render */}
                        {['video', 'figma', 'miro'].includes(section.type) ? (
                            <div className="w-full aspect-video rounded-xl overflow-hidden border border-white/10 bg-black/50">
                                {section.content ? (
                                    <iframe
                                        src={getEmbedUrl(section.content, section.type)}
                                        className="w-full h-full"
                                        frameBorder="0"
                                        allowFullScreen
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/20">
                                        <div className="text-center">
                                            <span className="material-symbols-outlined text-4xl mb-2">
                                                {section.type === 'video' ? 'play_circle' : section.type === 'figma' ? 'design_services' : 'board'}
                                            </span>
                                            <p className="text-sm">Enter {section.type} URL</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : section.type === 'gallery' ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {(() => {
                                    try {
                                        const images = JSON.parse(section.content || '[]');
                                        return images.map((img: string, i: number) => (
                                            <div key={i} className="aspect-square rounded-xl overflow-hidden bg-white/5">
                                                <img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                            </div>
                                        ));
                                    } catch (e) {
                                        return <div className="col-span-full text-center text-white/40 py-8">No images in gallery</div>;
                                    }
                                })()}
                            </div>
                        ) : (
                            section.type === 'text' && (section.content.trim().match(/^(https?:\/\/(?:www\.)?(?:figma\.com|youtube\.com|youtu\.be|miro\.com)\/.*)$/i)) ? (
                                <div className="w-full aspect-video rounded-xl overflow-hidden border border-white/10 bg-black/50">
                                    <iframe
                                        src={getEmbedUrl(section.content.trim(), section.content.includes('figma') ? 'figma' : section.content.includes('miro') ? 'miro' : 'video')}
                                        className="w-full h-full"
                                        frameBorder="0"
                                        allowFullScreen
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    />
                                    <div className="absolute top-2 right-2 bg-black/80 text-white/50 text-[10px] px-2 py-1 rounded-full backdrop-blur pointer-events-none">
                                        Auto-Embed
                                    </div>
                                </div>
                            ) : (
                                <div className="prose dark:prose-invert max-w-none">
                                    <p className="text-lg leading-relaxed opacity-90 whitespace-pre-wrap">
                                        {section.content}
                                    </p>
                                </div>
                            )
                        )}

                        {/* Mock Media Render - Only for text-based problem/solution/results */}
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
