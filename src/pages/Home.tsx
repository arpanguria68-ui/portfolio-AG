import { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

import { GlowBorderCard } from '../components/ui/glow-border-card';
import { FlipFadeText } from '../components/ui/flip-fade-text';
import MusicPlayer from '../components/MusicPlayer';
import ToolIcon from '../components/ToolIcon';

const FALLBACK_PROJECTS = [
    {
        _id: '1' as any,
        title: "NeoBank Finance",
        description: "Reimagining the mobile banking experience for Gen Z with AI-driven savings insights.",
        year: "2024",
        tags: ["Fintech", "Mobile App"],
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC60U7Xmg9DYXVNGKeFboA7uIhth4FdnoZFU48ciZyrKd56ebljcFEhJXJFz6wuc8M_lcRD-yqYnh1AvRbDWASzywpEd9nEAjGpIlpzMOJoZtjBu0q01a9DAXvfn1qeP4Wxlv_ZlMWrbg-pIPwvCmPm8ZFf_4CgUm3xdhu_8kmeAxswFu9J8Gv8jUKnSwWQ6wVneq5-aAsP8e-diDQ7-rNq4lT0CVP7zT27S2Cy1Jw2MydWVPVsJQQUetNIXm6jv138pLrix6jQ4MLS",
        link: "/gallery"
    },
    {
        _id: '2' as any,
        title: "DataViz Pro",
        description: "Enterprise analytics dashboard enabling real-time decision making for sales teams.",
        year: "2023",
        tags: ["SaaS", "Strategy"],
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuApIiN6GKo3BRo5bLrUOnA41JodEj1ORLhA-dXGI6zS13geEwKDcyvUQiOp9UXRpBhyUHA6MQNEAsQz7DSE2GqHkpXscJnoi6ujsZm5_I6M2uPmZ8ZSEW1gUWXwmeNORGR3fDYOdnMJd69S6LRbkBx7gvRJ9y-S6vyBJoA5teX4T9XQvhSlQuIzHqYk1E892m6CGCLBFKreBiCyY5Z1hvfSKVn63r2nw1q1dADLGMfs7XjavKn3sI7naqs8hTDcZQ5YbYplbM6CBIH9",
        link: "#"
    },
    {
        _id: '3' as any,
        title: "Vitality Health",
        description: "Patient monitoring interface connecting doctors with real-time health metrics.",
        year: "2022",
        tags: ["Health", "UX Research"],
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBROlpKiNAqcPZejAh_NQ5ypzoOUdoIthvEF7mU5yEG1c4e8XKRu2q0BjJi9miOJ9iJ75FFXB-6u6lPToM35Cj_Lg8pxwkGhLApucrjrWT6PK5OKevCXiSsDN1Bd3ZfruNwSI8kNmptchDD88sooosPqs6Ihzk3h96_taeIGmhcNniUnT1y1_05XYnn-P2I8CTNH3Vtn1mJ-o8JQOfx8fQZCUVzqcxOcmrGP7YgnjLfVMn1Ducpn-WXM7MqTcPa2GG5LcPF1_C4mtBI",
        link: "#"
    }
];

const Home = () => {

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [projectFilter, setProjectFilter] = useState('All');
    const [projectSort, setProjectSort] = useState('Newest');

    // Convex queries and mutations
    const convexProjects = useQuery(api.projects.list);
    const convexProfile = useQuery(api.profile.get);
    const convexSkills = useQuery(api.skills.list);
    const convexTools = useQuery(api.tools.list);
    const convexMedia = useQuery(api.media.list);
    const convexResumes = useQuery(api.resumes.list);
    const convexSocials = useQuery(api.socials.list);
    const convexExperiences = useQuery(api.experiences.list);
    const [showCvMenu, setShowCvMenu] = useState(false);

    // Profile data with fallbacks
    const profileImage = convexProfile?.profileImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuBmUw9mOGIBUUKTMjLGS3PuCvlZ6tOEkE7Pk4fTqTPRNbyAi8VcOwUJT_Tg7nKQJEJPQUfHhYixf-vDAK5kti7OjS5PBRpTcXy4CYgV5yqLq_8BD9a7D6poQMOIRzQwjPwPy0xUcU4theBgi44FCwTIHWKslp6S1l-DXQD8bGxXSPF7jUS7Jpf1Tx1yTiWGknjjykiWzFMhOmjljznoIL3K1-gKiPmbYu6R0ghqGG3mgw4aBRoYAihl0sZ7Rayj8fsM5dyG5Rpjaupp";
    const headline = convexProfile?.headline || "Bridging the gap between user needs and business goals.";
    const bio = convexProfile?.bio || "I'm <b>Arpan Guria</b>, a Product Manager with a background in UI/UX Design.<br/><br/>I specialize in translating complex data into intuitive, engaging products. My approach combines analytical rigor with creative problem-solving.";

    // Highlights: use Convex media or fallback, limit to 6
    const FALLBACK_HIGHLIGHTS = [
        {
            _id: 'h1' as any,
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuC60U7Xmg9DYXVNGKeFboA7uIhth4FdnoZFU48ciZyrKd56ebljcFEhJXJFz6wuc8M_lcRD-yqYnh1AvRbDWASzywpEd9nEAjGpIlpzMOJoZtjBu0q01a9DAXvfn1qeP4Wxlv_ZlMWrbg-pIPwvCmPm8ZFf_4CgUm3xdhu_8kmeAxswFu9J8Gv8jUKnSwWQ6wVneq5-aAsP8e-diDQ7-rNq4lT0CVP7zT27S2Cy1Jw2MydWVPVsJQQUetNIXm6jv138pLrix6jQ4MLS",
            title: "Agile Strategy Session",
            subtitle: "San Francisco, 2023",
            category: "Workshop"
        },
        {
            _id: 'h2' as any,
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuApIiN6GKo3BRo5bLrUOnA41JodEj1ORLhA-dXGI6zS13geEwKDcyvUQiOp9UXRpBhyUHA6MQNEAsQz7DSE2GqHkpXscJnoi6ujsZm5_I6M2uPmZ8ZSEW1gUWXwmeNORGR3fDYOdnMJd69S6LRbkBx7gvRJ9y-S6vyBJoA5teX4T9XQvhSlQuIzHqYk1E892m6CGCLBFKreBiCyY5Z1hvfSKVn63r2nw1q1dADLGMfs7XjavKn3sI7naqs8hTDcZQ5YbYplbM6CBIH9",
            title: "Advanced CSPO",
            subtitle: "Scrum Alliance",
            category: "Certification"
        },
        {
            _id: 'h3' as any,
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBROlpKiNAqcPZejAh_NQ5ypzoOUdoIthvEF7mU5yEG1c4e8XKRu2q0BjJi9miOJ9iJ75FFXB-6u6lPToM35Cj_Lg8pxwkGhLApucrjrWT6PK5OKevCXiSsDN1Bd3ZfruNwSI8kNmptchDD88sooosPqs6Ihzk3h96_taeIGmhcNniUnT1y1_05XYnn-P2I8CTNH3Vtn1mJ-o8JQOfx8fQZCUVzqcxOcmrGP7YgnjLfVMn1Ducpn-WXM7MqTcPa2GG5LcPF1_C4mtBI",
            title: "Future of Fintech",
            subtitle: "TechWeek NY",
            category: "Keynote"
        },
    ];
    const highlights = (convexMedia && convexMedia.length > 0)
        ? convexMedia.slice(0, 6).map(m => ({
            _id: m._id,
            url: m.url,
            title: m.title || m.name,
            subtitle: m.subtitle || '',
            category: m.category || 'Highlight'
        }))
        : FALLBACK_HIGHLIGHTS;

    // Skills: filter visible, order by order field, limit to 6
    const SKILLS_LIMIT = 6;
    const skills = (convexSkills ?? [])
        .filter(s => s.visible)
        .sort((a, b) => a.order - b.order)
        .slice(0, SKILLS_LIMIT);

    const createMessage = useMutation(api.messages.create);

    // Use Convex projects if available, else fallback
    const projects = (convexProjects && convexProjects.length > 0) ? convexProjects : FALLBACK_PROJECTS;

    const filteredProjects = projects.filter(p => {
        if (projectFilter === 'All') return true;
        // Fallback for legacy projects without category: check tags or allow if category not set
        return p.category === projectFilter || (!p.category && p.tags.includes(projectFilter));
    }).sort((a, b) => {
        if (projectSort === 'Newest') {
            return parseInt(b.year) - parseInt(a.year);
        }
        if (projectSort === 'Newest (Date)') {
            // Defaults to 0 if creationDate is undefined
            return (b.creationDate || 0) - (a.creationDate || 0);
        }
        if (projectSort === 'Oldest') return parseInt(a.year) - parseInt(b.year);
        if (projectSort === 'A-Z') return a.title.localeCompare(b.title);
        return 0;
    });

    const CATEGORIES = ['All', 'SaaS', 'Mobile', 'B2B', 'Fintech', 'Health', 'Gen AI apps', 'mobile apps', 'blog'];
    // const uniqueTags = ['All', ...Array.from(new Set(projects.flatMap(p => p.tags)))];

    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');

        try {
            await createMessage(formData);
            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
            setTimeout(() => setStatus('idle'), 3000);
        } catch (error) {
            console.error(error);
            setStatus('idle');
        }
    };

    return (
        <div className="bg-background-dark text-white font-sans antialiased selection:bg-primary selection:text-black min-h-screen">
            {/* Header */}
            <header className="fixed top-0 left-0 w-full z-50 glass-strong px-6 md:px-12 py-4 flex items-center justify-between transition-all duration-300">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black font-bold font-display text-sm">
                        AG
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {/* CV Dropdown */}
                    {convexResumes && convexResumes.filter(r => r.visible).length > 0 && (
                        <div className="relative">
                            <button
                                onClick={() => setShowCvMenu(!showCvMenu)}
                                className="px-4 py-2 rounded-full border border-white/10 text-xs font-medium uppercase tracking-wider hover:bg-white hover:text-black transition-all flex items-center gap-2"
                            >
                                <span>Download CV</span>
                                <span className="material-symbols-outlined text-[16px]">expand_more</span>
                            </button>

                            {showCvMenu && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-card-dark border border-white/10 rounded-xl shadow-xl overflow-hidden py-1 z-50">
                                    {convexResumes.filter(r => r.visible).sort((a, b) => a.order - b.order).map(cv => (
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

                    <button className="w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-primary transition-colors hover:bg-white/5">
                        <span className="material-symbols-outlined text-[20px]">light_mode</span>
                    </button>
                    <Link to="/login" className="px-4 py-2 rounded-full border border-white/10 text-xs font-medium uppercase tracking-wider hover:bg-white hover:text-black transition-all flex items-center gap-2">
                        <span>Login</span>
                        <span className="material-symbols-outlined text-[16px]">lock</span>
                    </Link>
                </div>
            </header>

            <main className="relative">
                {/* Hero Section */}
                <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 bg-smoke-pattern bg-cover bg-center bg-no-repeat pt-20" id="hero">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
                    <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center relative z-10">
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                <span className="text-primary font-medium text-xs tracking-[0.2em] uppercase">Available for work</span>
                            </div>


                            <h1 className="text-7xl md:text-8xl lg:text-9xl font-display font-bold leading-[0.9] tracking-tighter flex flex-col items-start">
                                <span>Product</span>
                                <FlipFadeText
                                    words={["Manager", "Designer", "Strategist"]}
                                    className="justify-start min-h-0 py-2"
                                    textClassName="text-primary text-7xl md:text-8xl lg:text-9xl font-display font-bold leading-[0.9] tracking-tighter text-left"
                                    interval={3000}
                                />
                                <span className="text-transparent stroke-white" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.5)' }}>Portfolio</span>
                            </h1>
                            <p className="text-white/60 max-w-md leading-relaxed mt-4 text-lg">
                                Leading Global Digital Transformation and Scalable Product Strategy
                            </p>
                            <div className="flex gap-4 mt-8">
                                <a className="px-8 py-4 bg-primary text-black rounded-full font-bold flex items-center justify-center gap-2 group transition-all hover:scale-105" href="#contact-me">
                                    Start a Project
                                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-bounce">
                        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
                        <span className="material-symbols-outlined">keyboard_arrow_down</span>
                    </div>
                </section>

                {/* My Story Section */}
                <section className="px-6 md:px-12 py-20 lg:py-32 relative bg-background-dark border-t border-white/5" id="my-story">
                    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                        <div className="relative max-w-md mx-auto md:max-w-none w-full">
                            <GlowBorderCard
                                aspectRatio="4/5"
                                animationDuration={4}
                                className="grayscale contrast-125 group"
                            >
                                <img
                                    alt="Arpan Guria Portrait"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    src={profileImage}
                                />
                            </GlowBorderCard>
                            <div className="absolute -bottom-6 -right-2 md:-right-6 md:bottom-6">
                                <div className="w-24 h-24 md:w-32 md:h-32 bg-card-dark border border-white/10 rounded-full flex items-center justify-center animate-[spin_10s_linear_infinite] shadow-xl">
                                    <span className="text-[7px] md:text-[9px] uppercase font-bold tracking-[0.15em] text-center text-white/80 leading-tight">
                                        Design • Strategy • Product • Vision •
                                    </span>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary md:text-2xl">person</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <span className="text-primary font-display text-lg mb-2 block">My Story</span>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium leading-tight mb-8">
                                {headline.split(' ').map((word, i) => (
                                    <Fragment key={i}>
                                        {word}{' '}
                                    </Fragment>
                                ))}
                            </h2>
                            <p className="text-white/60 leading-relaxed mb-8 text-base md:text-lg" dangerouslySetInnerHTML={{ __html: bio }}></p>
                            <div className="flex gap-4 flex-wrap">
                                {convexSocials && convexSocials.filter(s => s.visible).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((social) => (
                                    <a
                                        key={social._id}
                                        className={`w-12 h-12 flex items-center justify-center rounded-full glass hover:bg-white hover:text-black transition-all group ${social.bgColor || ''}`}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title={social.platform}
                                    >
                                        {social.logo ? (
                                            <img src={social.logo} alt={social.platform} className="w-6 h-6 object-contain rounded-full" />
                                        ) : (
                                            <span className="material-symbols-outlined text-xl text-white/70 group-hover:text-black transition-colors">
                                                {social.icon}
                                            </span>
                                        )}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Magic Toolbox Section */}
                <section className="px-6 md:px-12 py-20 lg:py-32 bg-[#0F0F0F] relative overflow-hidden" id="magic-toolbox">
                    <div className="absolute top-0 right-0 w-64 h-64 md:w-[500px] md:h-[500px] bg-primary/5 rounded-full blur-[80px]"></div>
                    <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
                        <div>
                            <div className="mb-10">
                                <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Magic <span className="text-primary">Toolbox</span></h2>
                                <p className="text-white/50 text-base">Technologies & Methodologies I use daily.</p>
                            </div>
                            <div className="flex flex-col gap-8 mb-12">
                                {skills.length > 0 ? (
                                    skills.map((skill) => (
                                        <div key={skill._id} className="space-y-3">
                                            <div className="flex justify-between text-sm font-medium tracking-wider uppercase">
                                                <span>{skill.name}</span>
                                                <span className="text-primary">{skill.value}%</span>
                                            </div>
                                            <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(212,255,63,0.5)] transition-all duration-500"
                                                    style={{ width: `${skill.value}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    /* Fallback hardcoded skills if none in database */
                                    <>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm font-medium tracking-wider uppercase">
                                                <span>Product Strategy</span>
                                                <span className="text-primary">95%</span>
                                            </div>
                                            <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary w-[95%] rounded-full shadow-[0_0_10px_rgba(212,255,63,0.5)]"></div>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm font-medium tracking-wider uppercase">
                                                <span>UI/UX Design</span>
                                                <span className="text-primary">88%</span>
                                            </div>
                                            <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary w-[88%] rounded-full"></div>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm font-medium tracking-wider uppercase">
                                                <span>Data Analysis</span>
                                                <span className="text-primary">75%</span>
                                            </div>
                                            <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary w-[75%] rounded-full"></div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                            {(convexTools && convexTools.length > 0 ? convexTools : [
                                { icon: "design_services", name: "Figma", bgColor: "bg-blue-600", _id: "f1" },
                                { icon: "view_kanban", name: "Jira", bgColor: "bg-blue-500", _id: "f2" },
                                { icon: "analytics", name: "Mixpanel", bgColor: "bg-purple-600", _id: "f3" },
                                { icon: "code", name: "Python", bgColor: "bg-yellow-500", _id: "f4" }
                            ]).map((tool, i) => (
                                <div key={tool._id || i} className="aspect-square glass rounded-2xl flex flex-col items-center justify-center gap-4 hover:bg-white/5 transition-colors group relative overflow-hidden">
                                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity ${tool.bgColor || 'bg-white/5'}`}></div>
                                    <div className="relative z-10 text-white/70 group-hover:text-white transition-colors">
                                        <ToolIcon icon={tool.icon} className="text-4xl w-9 h-9" />
                                    </div>
                                    <span className="text-xs opacity-50 uppercase tracking-widest relative z-10">{tool.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Magical Projects Section */}
                <section className="py-24 lg:py-32 bg-background-dark border-t border-white/5 relative overflow-hidden" id="magical-projects">
                    <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="max-w-7xl mx-auto px-6 md:px-12">
                        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <h2 className="text-4xl md:text-5xl font-display font-bold leading-[0.9]">
                                    Selected <br />
                                    <span className="text-primary">Masterpieces</span>
                                </h2>
                                <p className="text-white/40 text-sm md:text-base max-w-xs mt-4">Explore recent product launches and case studies.</p>
                            </div>

                            {/* Sort Control - Cleaned up */}
                            <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-xl border border-white/5 backdrop-blur-sm">
                                <span className="text-[10px] uppercase font-bold text-white/30 px-3 select-none">Sort</span>
                                {['Newest', 'Newest (Date)', 'Oldest', 'A-Z'].map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => setProjectSort(option as any)}
                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${projectSort === option ? 'bg-primary text-black shadow-[0_0_10px_rgba(212,255,63,0.3)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Filters - Full width row */}
                        <div className="mb-12 flex flex-wrap gap-2">
                            {CATEGORIES.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => setProjectFilter(tag)}
                                    className={`px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all border ${projectFilter === tag ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'bg-transparent border-white/10 text-white/40 hover:border-white/30 hover:text-white'}`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>

                        {/* Grid for desktop, Scroll for mobile */}
                        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 overflow-x-auto md:overflow-visible gap-6 pb-8 md:pb-0 snap-x snap-mandatory no-scrollbar items-stretch">
                            {filteredProjects.map((project, index) => (
                                <div key={project._id} className="min-w-[85vw] md:min-w-0 snap-center flex flex-col">
                                    <Link to={`/project/${project._id || index + 1}`} className="bg-card-dark rounded-[32px] overflow-hidden border border-white/10 flex flex-col h-full group relative transition-transform hover:-translate-y-2 duration-500">
                                        <div className="relative h-[280px] w-full overflow-hidden bg-[#1A1A1A]">
                                            <img alt={project.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700" src={project.image} />
                                            <div className="absolute inset-0 bg-gradient-to-t from-card-dark via-transparent to-transparent"></div>
                                            <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full">
                                                <span className="text-[10px] font-bold text-white uppercase tracking-wider">{project.year}</span>
                                            </div>
                                        </div>
                                        <div className="p-6 pt-2 flex flex-col flex-grow justify-between relative z-10">
                                            <div>
                                                <h3 className="text-2xl font-display font-bold text-white mb-2 leading-tight">{project.title}</h3>
                                                <p className="text-white/50 text-sm leading-relaxed mb-6">{project.description}</p>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {project.tags.map(tag => (
                                                    <span key={tag} className="px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-full text-[10px] font-bold uppercase tracking-wider">{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>

                </section>

                {/* My Journey Section */}
                <section className="px-6 md:px-12 py-24 lg:py-32 bg-[#0D0D0D] relative overflow-hidden" id="my-journey">
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="relative max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto z-10">
                        <h2 className="text-3xl md:text-5xl font-display font-bold mb-16 text-center">My <span className="text-primary">Journey</span></h2>

                        {/* Timeline Container */}
                        <div className="relative">
                            <div className="absolute left-[100px] md:left-1/2 md:-ml-[1px] top-2 bottom-0 w-[2px] bg-[#1A1A1A] rounded-full overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary via-primary/40 to-white/5 shadow-[0_0_15px_rgba(212,255,63,0.5)]"></div>
                            </div>

                            {/* Dynamic Timeline Items */}
                            {convexExperiences && convexExperiences.filter(e => e.visible).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((experience, index) => (
                                <div key={experience._id} className="flex flex-col md:flex-row gap-0 md:gap-12 group mb-12 relative items-start md:items-center justify-between">
                                    {/* Date (Left on Desktop) */}
                                    <div className="w-[100px] md:w-1/2 pr-6 md:pr-0 md:text-right flex flex-col md:block items-end pt-1 flex-shrink-0">
                                        <span className={`font-bold text-sm md:text-lg tracking-wide ${experience.present ? 'text-primary' : 'text-white'}`}>
                                            {experience.present ? 'Present' : experience.endDate}
                                        </span>
                                        <span className="text-white/30 text-[10px] md:text-xs font-display font-medium mt-0.5 md:block">
                                            {experience.startDate}
                                        </span>
                                    </div>

                                    {/* Dot */}
                                    <div className="absolute left-[100px] md:left-1/2 top-[0.6rem] md:top-1/2 md:-translate-y-1/2 -translate-x-1/2 z-10">
                                        {experience.present ? (
                                            <div className="w-4 h-4 rounded-full bg-primary shadow-[0_0_15px_rgba(212,255,63,0.8)] flex items-center justify-center relative">
                                                <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-60"></div>
                                                <div className="w-1.5 h-1.5 bg-black rounded-full relative z-10"></div>
                                            </div>
                                        ) : (
                                            <div className="w-3 h-3 rounded-full bg-[#0D0D0D] border-2 border-white/20 group-hover:border-primary/60 group-hover:scale-125 transition-all duration-300 shadow-[0_0_0_4px_#0D0D0D]"></div>
                                        )}
                                    </div>

                                    {/* Card (Right on Desktop) */}
                                    <div className="flex-1 pl-6 md:pl-0 md:w-1/2 min-w-0">
                                        <div className={`glass p-5 rounded-2xl border ${experience.present ? 'border-white/10 glow-border' : 'border-white/5'} group-hover:bg-white/5 transition-all duration-300 relative`}>
                                            {experience.present && (
                                                <div className="absolute top-3 right-3 opacity-50">
                                                    <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[9px] font-bold uppercase tracking-wider border border-primary/20">Active</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-4 mb-3">
                                                <div className={`w-10 h-10 rounded-xl ${experience.present ? 'bg-white/5 border border-white/5 text-primary shadow-inner' : 'bg-white/5 text-white/40'} flex items-center justify-center`}>
                                                    <span className="material-symbols-outlined text-[20px]">{experience.present ? 'workspace_premium' : 'work'}</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-display font-bold text-white leading-tight">{experience.title}</h3>
                                                    <p className="text-white/40 text-[10px] uppercase tracking-wider mt-0.5 font-medium">{experience.company}</p>
                                                </div>
                                            </div>
                                            <p className={`text-white/60 text-xs leading-relaxed ${experience.present ? 'border-l-2 border-primary/20 pl-3' : ''}`}>
                                                {experience.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Visual Highlights Section */}
                <section className="px-6 md:px-12 py-24 bg-[#0F0F0F] relative overflow-hidden" id="visual-highlights">
                    <div className="absolute top-1/2 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-12">
                            <h2 className="text-3xl md:text-5xl font-display font-bold leading-tight">
                                Visual <span className="text-primary">Highlights</span>
                            </h2>
                            <p className="text-white/40 text-sm md:text-base mt-4 max-w-sm">Snapshots from recent workshops, certifications, and speaking engagements.</p>
                        </div>
                        {/* Grid for desktop, Scroll for mobile */}
                        <div className="flex md:grid md:grid-cols-3 overflow-x-auto md:overflow-visible gap-6 pb-8 md:pb-0 snap-x snap-mandatory no-scrollbar items-stretch">
                            {highlights.map((highlight) => (
                                <div key={highlight._id} className="min-w-[75vw] md:min-w-0 snap-center flex flex-col">
                                    <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden group border border-white/10">
                                        <img
                                            alt={highlight.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                                            src={highlight.url}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                                        {highlight.category && (
                                            <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white/80 uppercase tracking-wider border border-white/10">
                                                {highlight.category}
                                            </div>
                                        )}
                                        <div className="absolute bottom-5 left-5 right-5">
                                            <h4 className="text-white font-display font-bold text-lg leading-tight mb-1">{highlight.title}</h4>
                                            {highlight.subtitle && (
                                                <p className="text-white/50 text-xs">{highlight.subtitle}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Me Section */}
                <section className="px-6 md:px-12 py-20 lg:py-32 bg-background-dark border-t border-white/5" id="contact-me">
                    <div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-16 items-start">
                            <div className="text-center md:text-left">
                                <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Let's work <br /><span className="text-primary">together</span></h2>
                                <p className="text-white/50 text-base mb-8">Have an idea? Let's build something amazing. I'm currently available for freelance projects and consultation.</p>

                                <div className="hidden md:flex flex-col gap-4 text-left">
                                    <div className="flex items-center gap-3 text-white/70">
                                        <span className="material-symbols-outlined text-primary">mail</span>
                                        <span>arpanguria68@gmail.com</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-white/70">
                                        <span className="material-symbols-outlined text-primary">call</span>
                                        <span>+91 8092864293</span>
                                    </div>
                                </div>
                            </div>

                            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                                <div className="group">
                                    <label className="text-xs uppercase tracking-wider font-bold text-white/40 mb-2 block group-focus-within:text-primary transition-colors">Name</label>
                                    <input
                                        required
                                        name="name"
                                        className="w-full bg-transparent border-0 border-b border-white/20 py-2 text-white focus:ring-0 focus:border-primary transition-colors placeholder:text-white/10 outline-none"
                                        placeholder="John Doe"
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="group">
                                    <label className="text-xs uppercase tracking-wider font-bold text-white/40 mb-2 block group-focus-within:text-primary transition-colors">Email</label>
                                    <input
                                        required
                                        name="email"
                                        className="w-full bg-transparent border-0 border-b border-white/20 py-2 text-white focus:ring-0 focus:border-primary transition-colors placeholder:text-white/10 outline-none"
                                        placeholder="john@example.com"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="group">
                                    <label className="text-xs uppercase tracking-wider font-bold text-white/40 mb-2 block group-focus-within:text-primary transition-colors">Message</label>
                                    <textarea
                                        required
                                        name="message"
                                        className="w-full bg-transparent border-0 border-b border-white/20 py-2 text-white focus:ring-0 focus:border-primary transition-colors placeholder:text-white/10 resize-none outline-none"
                                        placeholder="Tell me about your project..."
                                        rows={3}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    ></textarea>
                                </div>
                                <button
                                    disabled={status === 'sending' || status === 'success'}
                                    className={`mt-4 w-full py-4 text-black rounded-full font-bold flex items-center justify-center gap-2 group transition-all ${status === 'success' ? 'bg-green-400' : 'bg-white hover:bg-primary'}`}
                                    type="submit"
                                >
                                    {status === 'sending' ? 'Sending...' : status === 'success' ? 'Message Sent!' : 'Send Message'}
                                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">{status === 'success' ? 'check' : 'send'}</span>
                                </button>
                            </form>
                        </div>

                        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex gap-6">
                                <a className="text-white/40 hover:text-primary transition-colors" href="https://www.linkedin.com/in/arpan-guria/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                            </div>
                            <p className="text-[10px] text-white/20 uppercase tracking-widest">© 2026 Arpan Guria</p>
                        </div>
                    </div>
                </section>
            </main>

            {/* Marquee Footer */}
            <div className="py-4 bg-primary text-black font-bold text-[10px] uppercase tracking-widest flex whitespace-nowrap overflow-hidden border-t border-black">
                <div className="flex gap-12 animate-marquee">
                    {[1, 2, 3, 4].map((_, i) => (
                        <Fragment key={i}>
                            <div className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">star</span> PRODUCT STRATEGY</div>
                            <div className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">star</span> UX DESIGN</div>
                            <div className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">star</span> AGILE LEADERSHIP</div>
                            <div className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">star</span> DATA ANALYTICS</div>
                        </Fragment>
                    ))}
                </div>
            </div>

            <MusicPlayer />
        </div >
    );
};

export default Home;
