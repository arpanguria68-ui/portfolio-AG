
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import SiteHeader from '../components/SiteHeader';

const CATEGORIES = ['All', 'SaaS', 'Mobile', 'B2B', 'Fintech', 'Health', 'Gen AI apps', 'mobile apps', 'blog'];

const Gallery = () => {
    const convexProjects = useQuery(api.projects.list);
    const [activeFilter, setActiveFilter] = useState('All');

    const projects = convexProjects ?? [];
    const filteredProjects = projects.filter((project) => {
        if (activeFilter === 'All') return true;
        return (
            project.category === activeFilter ||
            project.tags?.includes(activeFilter)
        );
    });

    return (
        <div className="bg-background-dark text-white transition-colors duration-300 min-h-screen pb-32">
            <SiteHeader />
            <div className="h-20 w-full" />
            <main className="px-6 md:px-12 pb-24">
                <header className="flex justify-between items-end mb-8 pt-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-white/40 font-semibold mb-1">Selected Work</p>
                        <h1 className="text-4xl font-display font-extrabold tracking-tight">
                            Magical <br /> <span className="text-primary">Projects</span>
                        </h1>
                    </div>
                </header>

                <div className="flex gap-3 overflow-x-auto pb-6 -mx-6 px-6 no-scrollbar">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            type="button"
                            onClick={() => setActiveFilter(category)}
                            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-all ${
                                activeFilter === category
                                    ? 'bg-primary text-black border-primary'
                                    : 'bg-card-dark text-white/60 border-white/5 hover:border-white/20'
                            }`}
                        >
                            {category === 'All' ? 'All Work' : category}
                        </button>
                    ))}
                </div>

                {convexProjects === undefined ? (
                    <p className="text-white/40 text-center py-16">Loading projects...</p>
                ) : filteredProjects.length === 0 ? (
                    <p className="text-white/40 text-center py-16">No projects found for this filter.</p>
                ) : (
                    <div className="space-y-8">
                        {filteredProjects.map((project) => (
                            <Link
                                key={project._id}
                                to={`/project/${project._id}`}
                                className="group relative block"
                            >
                                <div className="rounded-3xl overflow-hidden mb-4 aspect-[4/5] relative glass-card border border-white/10">
                                    <img
                                        alt={project.title}
                                        className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-110"
                                        src={project.image}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                    <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
                                        {project.tags?.slice(0, 2).map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-3 py-1 bg-primary/90 text-black text-[10px] font-bold uppercase tracking-wider rounded-md"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-display font-bold mb-1">{project.title}</h3>
                                        <p className="text-white/50 text-sm">{project.description}</p>
                                    </div>
                                    <div className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                                        <span className="material-symbols-outlined text-sm">arrow_outward</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                <div className="mt-20 text-center pb-12">
                    <h4 className="text-2xl font-display font-bold mb-4">Want to see more?</h4>
                    <p className="text-white/50 mb-8 max-w-[280px] mx-auto text-sm leading-relaxed">
                        I&apos;m currently looking for new opportunities to build impactful products.
                    </p>
                    <a
                        className="inline-flex items-center gap-2 bg-primary text-black px-8 py-4 rounded-full font-bold text-sm tracking-wide shadow-xl shadow-primary/10"
                        href="/#contact-me"
                    >
                        GET IN TOUCH
                        <span className="material-symbols-outlined text-base">send</span>
                    </a>
                </div>
            </main>
        </div>
    );
};

export default Gallery;
