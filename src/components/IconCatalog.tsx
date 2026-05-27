import React, { useMemo, useState } from 'react';
import ToolIcon, { BRAND_ICONS, DEVELOPER_ICON_NAMES } from './ToolIcon';

interface IconCatalogProps {
    selectedIcon: string;
    onSelectIcon: (icon: string) => void;
    showBrandOnly?: boolean;
}

export const ICON_CATEGORIES = {
    'Languages': ['Python', 'JavaScript', 'TypeScript', 'Java', 'Cpp', 'Go', 'Rust', 'PHP', 'Ruby', 'Csharp', 'Swift', 'Kotlin', 'R', 'Scala', 'Elixir', 'Haskell', 'Clojure', 'Groovy', 'Objective-C', 'Dart'],
    'Frameworks & Libraries': ['React', 'Angular', 'Vue', 'Svelte', 'Next', 'Nuxt', 'Gatsby', 'Django', 'Flask', 'FastAPI', 'Laravel', 'Rails', 'Spring', 'ASP', 'Express', 'Node', 'Fastify', 'Remix', 'Solid', 'Qwik'],
    'Cloud & Hosting': ['AWS', 'Azure', 'GoogleCloud', 'Heroku', 'Vercel', 'Netlify', 'DigitalOcean', 'Linode', 'Render', 'Railway', 'Replit'],
    'Databases': ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Firebase', 'Supabase', 'GraphQL', 'MariaDB', 'Cassandra', 'CouchDB', 'Elasticsearch', 'Neo4j', 'DynamoDB', 'Oracle'],
    'DevOps & CI/CD': ['Docker', 'Kubernetes', 'GitHub', 'GitLab', 'Bitbucket', 'Jenkins', 'CircleCI', 'Travis', 'GitHubActions', 'Terraform', 'Ansible', 'Prometheus', 'Grafana'],
    'Design Tools': ['Figma', 'AdobeXD', 'Sketch', 'InVision', 'Adobe', 'Photoshop', 'Illustrator', 'XD', 'Framer'],
    'Developer Tools': ['VSCode', 'WebStorm', 'Sublime', 'Vim', 'Git', 'Postman', 'Insomnia', 'Linux', 'MacOS', 'Windows'],
    'Testing': ['Jest', 'Mocha', 'Cypress', 'Playwright', 'Selenium', 'Vitest', 'Testing Library'],
    'Package Managers': ['NPM', 'Yarn', 'PNPM', 'Pip', 'Maven', 'Gradle', 'Cargo', 'Composer'],
    'CMS & Static': ['WordPress', 'Strapi', 'ContentFul', 'Sanity', 'Hugo', 'Jekyll', 'Eleventy', 'Astro'],
};

const IconCatalog: React.FC<IconCatalogProps> = ({ selectedIcon, onSelectIcon, showBrandOnly = false }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    // Filter brand icons
    const brandIcons = useMemo(() => {
        const brandKeys = Object.keys(BRAND_ICONS).filter(key => key.startsWith('brand-'));
        if (!searchTerm) return brandKeys;
        return brandKeys.filter(key => 
            key.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    // Filter developer icons
    const filteredDeveloperIcons = useMemo(() => {
        if (showBrandOnly) return [];
        
        let icons = DEVELOPER_ICON_NAMES;
        
        if (searchTerm) {
            icons = icons.filter(icon =>
                icon.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (activeCategory) {
            const categoryIcons = ICON_CATEGORIES[activeCategory as keyof typeof ICON_CATEGORIES] || [];
            icons = icons.filter(icon =>
                categoryIcons.some(cat => icon.toLowerCase().includes(cat.toLowerCase()))
            );
        }

        return icons;
    }, [searchTerm, activeCategory, showBrandOnly]);

    return (
        <div className="space-y-4">
            {/* Search Input */}
            <input
                type="text"
                placeholder="Search icons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50"
            />

            {/* Category Tabs */}
            {!showBrandOnly && (
                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                    <button
                        onClick={() => setActiveCategory(null)}
                        className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-all ${
                            activeCategory === null
                                ? 'bg-primary text-black'
                                : 'bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                    >
                        All
                    </button>
                    {Object.keys(ICON_CATEGORIES).map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-all ${
                                activeCategory === category
                                    ? 'bg-primary text-black'
                                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            )}

            {/* Brand Icons Section */}
            {brandIcons.length > 0 && (
                <div>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-white/40 mb-2">
                        Custom Brands ({brandIcons.length})
                    </h4>
                    <div className="grid grid-cols-6 gap-2">
                        {brandIcons.map((icon) => (
                            <button
                                key={icon}
                                onClick={() => onSelectIcon(icon)}
                                className={`aspect-square rounded-lg flex items-center justify-center transition-all ${
                                    selectedIcon === icon
                                        ? 'bg-primary text-black ring-2 ring-primary'
                                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                                }`}
                                title={icon.replace('brand-', '')}
                            >
                                <ToolIcon icon={icon} className="w-4 h-4" />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Developer Icons Section */}
            {filteredDeveloperIcons.length > 0 && (
                <div>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-white/40 mb-2">
                        Developer Icons ({filteredDeveloperIcons.length})
                    </h4>
                    <div className="grid grid-cols-6 gap-2 max-h-96 overflow-y-auto">
                        {filteredDeveloperIcons.map((icon) => (
                            <button
                                key={icon}
                                onClick={() => onSelectIcon(icon)}
                                className={`aspect-square rounded-lg flex items-center justify-center transition-all ${
                                    selectedIcon === icon
                                        ? 'bg-primary text-black ring-2 ring-primary'
                                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                                }`}
                                title={icon}
                            >
                                <ToolIcon icon={icon} className="w-4 h-4" />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* No Results */}
            {brandIcons.length === 0 && filteredDeveloperIcons.length === 0 && (
                <div className="text-center py-8 text-white/40">
                    <span className="material-symbols-outlined text-4xl mb-2 block">search_off</span>
                    No icons found matching "{searchTerm}"
                </div>
            )}
        </div>
    );
};

export default IconCatalog;
