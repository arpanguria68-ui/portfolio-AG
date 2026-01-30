import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

// Fallback projects for when Convex is not connected
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
    return url;
};

const FALLBACK_PROJECTS = [
    {
        _id: '1',
        title: "NeoBank Finance",
        description: "Reimagining the mobile banking experience for Gen Z with AI-driven savings insights.",
        year: "2024",
        tags: ["Fintech", "Mobile App"],
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC60U7Xmg9DYXVNGKeFboA7uIhth4FdnoZFU48ciZyrKd56ebljcFEhJXJFz6wuc8M_lcRD-yqYnh1AvRbDWASzywpEd9nEAjGpIlpzMOJoZtjBu0q01a9DAXvfn1qeP4Wxlv_ZlMWrbg-pIPwvCmPm8ZFf_4CgUm3xdhu_8kmeAxswFu9J8Gv8jUKnSwWQ6wVneq5-aAsP8e-diDQ7-rNq4lT0CVP7zT27S2Cy1Jw2MydWVPVsJQQUetNIXm6jv138pLrix6jQ4MLS",
        sections: [
            { id: 1, type: 'hero', title: 'Overview', content: 'NeoBank Finance is a revolutionary mobile banking platform designed specifically for Gen Z users who demand seamless, intuitive financial experiences.' },
            { id: 2, type: 'problem', title: 'The Challenge', content: 'Traditional banking apps felt outdated and disconnected from the daily lives of young users. They struggled with complex interfaces, hidden fees, and lack of personalized insights.' },
            { id: 3, type: 'solution', title: 'Our Approach', content: 'We conducted extensive user research with 200+ participants aged 18-25 to understand their financial pain points and aspirations. This led to a design system focused on simplicity, transparency, and gamification.' },
            { id: 4, type: 'results', title: 'Impact', content: 'After launch, user engagement increased by 340%. App store rating jumped from 3.2 to 4.8 stars. Monthly active users grew 5x within 6 months.' }
        ]
    },
    {
        _id: '2',
        title: "DataViz Pro",
        description: "Enterprise analytics dashboard enabling real-time decision making for sales teams.",
        year: "2023",
        tags: ["SaaS", "Strategy"],
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuApIiN6GKo3BRo5bLrUOnA41JodEj1ORLhA-dXGI6zS13geEwKDcyvUQiOp9UXRpBhyUHA6MQNEAsQz7DSE2GqHkpXscJnoi6ujsZm5_I6M2uPmZ8ZSEW1gUWXwmeNORGR3fDYOdnMJd69S6LRbkBx7gvRJ9y-S6vyBJoA5teX4T9XQvhSlQuIzHqYk1E892m6CGCLBFKreBiCyY5Z1hvfSKVn63r2nw1q1dADLGMfs7XjavKn3sI7naqs8hTDcZQ5YbYplbM6CBIH9",
        sections: [
            { id: 1, type: 'hero', title: 'Overview', content: 'DataViz Pro transforms complex enterprise data into actionable insights through an intuitive dashboard interface.' },
            { id: 2, type: 'problem', title: 'The Challenge', content: 'Sales teams were drowning in spreadsheets and siloed data systems. Decision making was slow and often based on outdated information.' },
            { id: 3, type: 'solution', title: 'Our Approach', content: 'We built a unified data layer that connects to multiple enterprise systems, presenting real-time KPIs through customizable widgets and AI-powered recommendations.' },
            { id: 4, type: 'results', title: 'Impact', content: 'Sales cycle reduced by 23%. Team productivity increased by 45%. ROI achieved within first quarter of deployment.' }
        ]
    },
    {
        _id: '3',
        title: "Vitality Health",
        description: "Patient monitoring interface connecting doctors with real-time health metrics.",
        year: "2022",
        tags: ["Health", "UX Research"],
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBROlpKiNAqcPZejAh_NQ5ypzoOUdoIthvEF7mU5yEG1c4e8XKRu2q0BjJi9miOJ9iJ75FFXB-6u6lPToM35Cj_Lg8pxwkGhLApucrjrWT6PK5OKevCXiSsDN1Bd3ZfruNwSI8kNmptchDD88sooosPqs6Ihzk3h96_taeIGmhcNniUnT1y1_05XYnn-P2I8CTNH3Vtn1mJ-o8JQOfx8fQZCUVzqcxOcmrGP7YgnjLfVMn1Ducpn-WXM7MqTcPa2GG5LcPF1_C4mtBI",
        sections: [
            { id: 1, type: 'hero', title: 'Overview', content: 'Vitality Health bridges the gap between patients and healthcare providers through continuous monitoring and intelligent alerts.' },
            { id: 2, type: 'problem', title: 'The Challenge', content: 'Patients with chronic conditions needed constant monitoring, but traditional methods required frequent hospital visits and manual data entry.' },
            { id: 3, type: 'solution', title: 'Our Approach', content: 'We designed a seamless interface that integrates with wearable devices and home sensors, automatically transmitting vital data to healthcare providers.' },
            { id: 4, type: 'results', title: 'Impact', content: 'Hospital readmissions reduced by 35%. Patient satisfaction scores increased to 94%. Average response time to critical alerts: under 2 minutes.' }
        ]
    }
];

const CaseStudy = () => {
    const { id } = useParams<{ id: string }>();

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Try to get project from Convex
    const convexProjects = useQuery(api.projects.list);
    const projects = (convexProjects && convexProjects.length > 0) ? convexProjects : FALLBACK_PROJECTS;

    // Find the project by ID (or index for fallback)
    const project = projects.find((p: any) => p._id === id) ||
        FALLBACK_PROJECTS[parseInt(id || '1') - 1] ||
        FALLBACK_PROJECTS[0];

    // Get sections (fallback data has sections, Convex might not)
    const sections = (project as any).sections || [
        { id: 1, type: 'hero', title: 'Overview', content: project.description },
        { id: 2, type: 'problem', title: 'The Challenge', content: 'This project addressed key user pain points and business objectives.' },
        { id: 3, type: 'solution', title: 'Our Approach', content: 'We used a user-centered design process to deliver impactful results.' },
        { id: 4, type: 'results', title: 'Impact', content: 'The project delivered measurable improvements across all key metrics.' }
    ];

    return (
        <div className="bg-background-dark text-white min-h-screen">
            {/* Hero Section - Matches LivePreview */}
            <div className="relative min-h-[70vh] flex flex-col justify-end overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent"></div>
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
                </div>

                {/* Back Navigation */}
                <Link
                    to="/"
                    className="absolute top-6 left-6 z-20 flex items-center gap-2 text-white/80 hover:text-primary transition-colors group"
                >
                    <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    <span className="text-sm font-medium">Back to Portfolio</span>
                </Link>

                {/* Content */}
                <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 pb-16">
                    <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 bg-primary text-black">
                        Case Study
                    </span>
                    <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
                        {project.title}
                    </h1>
                    <p className="text-xl text-white/70 max-w-2xl mb-8">
                        {project.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-lg">calendar_today</span>
                            <span className="text-white/60">{project.year}</span>
                        </div>
                        <div className="flex gap-2">
                            {project.tags.map((tag: string) => (
                                <span key={tag} className="px-3 py-1 bg-white/10 border border-white/10 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sections - Matching LivePreview Layout */}
            <div className="max-w-5xl mx-auto px-6 md:px-12 py-20 space-y-24">
                {sections.map((section: any, index: number) => (
                    <div key={section.id || index} className="animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${index * 100}ms` }}>
                        {/* Section Header - Matches LivePreview */}
                        <div className="flex items-center gap-6 mb-10">
                            <div className="h-px flex-1 bg-white/10"></div>
                            <div className="flex items-center gap-3">
                                <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${section.type === 'hero' ? 'bg-primary/20 text-primary' :
                                    section.type === 'problem' ? 'bg-red-500/20 text-red-400' :
                                        section.type === 'solution' ? 'bg-blue-500/20 text-blue-400' :
                                            section.type === 'results' ? 'bg-green-500/20 text-green-400' :
                                                'bg-white/10 text-white/60'
                                    }`}>
                                    <span className="material-symbols-outlined">
                                        {section.type === 'hero' ? 'web_asset' :
                                            section.type === 'problem' ? 'error' :
                                                section.type === 'solution' ? 'lightbulb' :
                                                    section.type === 'results' ? 'trending_up' :
                                                        'article'}
                                    </span>
                                </span>
                                <h2 className="text-2xl font-display font-bold uppercase tracking-widest text-primary">
                                    {section.title}
                                </h2>
                            </div>
                            <div className="h-px flex-1 bg-white/10"></div>
                        </div>

                        {/* Content */}
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
                                <div className="w-full aspect-video rounded-xl overflow-hidden border border-white/10 bg-black/50 my-8">
                                    <iframe
                                        src={getEmbedUrl(section.content.trim(), section.content.includes('figma') ? 'figma' : section.content.includes('miro') ? 'miro' : 'video')}
                                        className="w-full h-full"
                                        frameBorder="0"
                                        allowFullScreen
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    />
                                </div>
                            ) : (
                                <div className="prose prose-lg prose-invert max-w-none">
                                    <p className="text-xl leading-relaxed text-white/80 whitespace-pre-wrap">
                                        {section.content}
                                    </p>
                                </div>
                            )
                        )}

                        {/* Visual Placeholder - Matches LivePreview */}
                        {['problem', 'solution', 'results'].includes(section.type) && (
                            <div className="mt-12 rounded-2xl overflow-hidden aspect-video relative group bg-gradient-to-br from-white/5 to-white/0 border border-white/10">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <span className="material-symbols-outlined text-6xl text-white/10 mb-4">image</span>
                                        <p className="text-sm text-white/30 font-medium">{section.title} Visual</p>
                                    </div>
                                </div>
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Footer Navigation */}
            <div className="border-t border-white/10 py-16">
                <div className="max-w-5xl mx-auto px-6 md:px-12">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <Link to="/" className="flex items-center gap-3 text-white/60 hover:text-primary transition-colors group">
                            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
                            <span>Back to Portfolio</span>
                        </Link>
                        <div className="text-center">
                            <p className="text-sm text-white/40">Designed with ❤️ using Stitch Portfolio</p>
                        </div>
                        <a href="/#contact-me" className="flex items-center gap-3 px-6 py-3 bg-primary text-black rounded-full font-bold hover:scale-105 transition-transform">
                            <span>Start a Project</span>
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CaseStudy;
