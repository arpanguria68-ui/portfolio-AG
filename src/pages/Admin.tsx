import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Link } from 'react-router-dom';
import CaseStudyEditor from '../components/admin/CaseStudyEditor';
import MessageCenter from '../components/admin/MessageCenter';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [skills, setSkills] = useState([
        { id: 1, name: 'Product Strategy', value: 95, visible: true },
        { id: 2, name: 'UI/UX Design', value: 88, visible: true },
        { id: 3, name: 'Data Analysis', value: 75, visible: true },
        { id: 4, name: 'User Research', value: 60, visible: false },
        { id: 5, name: 'Agile Leadership', value: 85, visible: true },
    ]);

    // Project Filter Modal State
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [selectedExpertise, setSelectedExpertise] = useState(['UX Design']);
    const [selectedIndustry, setSelectedIndustry] = useState(['Healthtech']);

    const handleSkillChange = (id: number, newValue: number) => {
        setSkills(skills.map(skill => skill.id === id ? { ...skill, value: newValue } : skill));
    };

    const toggleSkillVisibility = (id: number) => {
        setSkills(skills.map(skill => skill.id === id ? { ...skill, visible: !skill.visible } : skill));
    };

    const toggleExpertise = (expert: string) => {
        if (selectedExpertise.includes(expert)) {
            setSelectedExpertise(selectedExpertise.filter(e => e !== expert));
        } else {
            setSelectedExpertise([...selectedExpertise, expert]);
        }
    };

    const toggleIndustry = (ind: string) => {
        if (selectedIndustry.includes(ind)) {
            setSelectedIndustry(selectedIndustry.filter(i => i !== ind));
        } else {
            setSelectedIndustry([...selectedIndustry, ind]);
        }
    };

    // Mock Image Data
    const mediaItems = [
        { id: 1, name: 'hero-banner_v2.jpg', size: '2.4 MB', status: 'used', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-uuybjdzT7X7JSQGKP_nX9iR3MjEQizIVej1f8SrvB6zP7UDAVCdAGqweyKZXhulJkWfIWF3WtwrQM6F5tDlJrsePWJdl1wnrfZI0ArL5AVlMJbJbu2xevQtQuTCz1Su4WxwxpO0_EHrYw_uPzTx-DwaXTwP-CvfhSgAGXut8BG6cP2xuZ4TAEOiqNl_3IRxXR_9YMtD78DRoQ8uCCnuD4TGVP82saCQswG6WNrMqGkxZdjUnC0ttkPABd4-dnYjeMYEAu3g-6X2a' },
        { id: 2, name: 'mountains-bg.png', size: '1.8 MB', status: 'unused', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMaFZcvWxSITw0IVYfzQp6cv0DckQl0uKRV3MF-i1Cg7qFq_44YYYpgjbCgkhwQKVbKzqjiSi8bkB6ItgqNNJdbLeVBkcBPs91X75EQSsFIqFYGbxUMwszNaR_RF6PkqlX_Q8eyJRuWhh-XlzS56nRD_ncsUGMdzw-NZt5PiO6tpN3clHl4IL1BmouY4g3jmPFLCj98X5jxWcApELdgnCYa81mIwZV5PYrzu--Vv-zdzQTup4sW6t1K0fNV2VimBGXqfcN8ve0AU4a' },
        { id: 3, name: 'retro-tech-v1.jpg', size: '4.1 MB', status: 'used', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTKiwY05c5klIgyVOtXya0YH8NxnYupt4JfO5isfGI47Pe-bgUnwadwj7jRm4H43cUpAP5tKcpcrTVBwhIGTs4VtSbVZNuQqCkGGbbWpdp3NxVDxErY_gBWzfXOPPbzviWMhW1ESHqhsUO-1QWdISeJzh9zLfsZNVGTU99bRbmqzOQoRJxMnjZXJgQjnkG3agIW-g6AeLwNDp9T4C4p7bV9ECTjVkEdJ0qZGMMtaqNBB5k67mMik_YJkP5k7VzWU7E8qRxp5Ox5Gv5' },
        { id: 4, name: 'arch-shadows.png', size: '900 KB', status: 'unused', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2RQ2V03gzV_ebvMM89hYHV_q1JTbN-QGM-_B2gBIK3f690VZqBORhH8Fk2XcmuZtXI_cpRefCRCqTl0VnwwiarEzexD9-ED5FXFXvUw31V5j7HAH0-y_I_G1W84cPoAZ74IokBbplnGHmZoXEJ5zOfQM8Ld_QcJRJWh3PxRUmHdrHQGiwWUdjhbJtpfZkR6T2-O-JBfsYacejTTYbpE3fsjfyksKPhq_faq9Q5U29503PFQb8QC7AS0S2nmNRVu0EfDJr7YMhKPcc' },
        { id: 5, name: 'portrait-alpha.jpg', size: '3.2 MB', status: 'used', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8BhxOXycDkoih3t6clQyIw5p6zfE3eSQDQkS6Ip-ZGISEx86fGz8GFR_noggh0296-lKq-6Ge4vSvTLsAjsjxX9PcOYOjzmkOgftoaub0EAQPtLFuzbzcLaS9kFuKsMgJzXQI4I63RxUEKWsH922-v-b2w66IzqQtWu_UnMg0EQEUDTQVrilqJivT86V6NLZ7iL6YLrviw6aR9SHLwzwt1qFTMmI15V_Ct2L_bsCa78_N24-kAUPPenhYT4QVBWLomtlUmstoa2EU' },
        { id: 6, name: 'office-space-draft.jpg', size: '5.5 MB', status: 'unused', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlyvgxZbDBQ8gXD9AkV0Xw_icOMcRyXwjc0vYBic3NkqQPqrRD0m81X-QNGcfPA7hrUj5uNiFKivQA__kMGZLdWLLqbtBU07WZpvF-YG646LhAzjjmjnlqvlMPEN4RzTu_VZF1VFmgRArs4zizKvYUyxsD7jee0YC5XK9-iuY2ySVBEwY0hE-iMuwF9uVz3PK7NtMVNeP2A373tMF6g1d974VWWyNtrvuQxiDuE9BprvcQr_EyOEv_roByl_0keXw96wLW4Y7VsAWs' },
    ];

    // Story Editor State
    const [headline, setHeadline] = useState("Bridging the gap between user needs and business goals.");
    const [bio, setBio] = useState("I'm Alexander, a Product Manager with a background in UI/UX Design. I specialize in translating complex data into intuitive, engaging products. My approach combines analytical rigor with creative problem-solving.");
    const [socials, setSocials] = useState([
        { id: 1, platform: 'LinkedIn', handle: 'https://linkedin.com/in/alexportz', icon: 'business_center', visible: true, color: 'text-[#0077b5]', bgColor: 'bg-[#0077b5]/10' },
        { id: 2, platform: 'GitHub', handle: 'https://github.com/alexportz', icon: 'terminal', visible: true, color: 'text-white', bgColor: 'bg-white/10' },
        { id: 3, platform: 'Twitter / X', handle: 'https://x.com/alexportz', icon: 'campaign', visible: false, color: 'text-white', bgColor: 'bg-white/5' }
    ]);

    // Project Editor State
    const [projectFilter, setProjectFilter] = useState('All');
    const [viewMode, setViewMode] = useState<'grid' | 'editor'>('grid');
    const [editingProject, setEditingProject] = useState<any>(null);

    const [projects, setProjects] = useState<any[]>([]);

    useEffect(() => {
        api.getProjects().then(setProjects).catch(console.error);
    }, []);

    const toggleSocialVisibility = (id: number) => {
        setSocials(socials.map(s => s.id === id ? { ...s, visible: !s.visible } : s));
    };

    const updateSocialHandle = (id: number, val: string) => {
        setSocials(socials.map(s => s.id === id ? { ...s, handle: val } : s));
    };

    const removeSocial = (id: number) => {
        setSocials(socials.filter(s => s.id !== id));
    };

    return (
        <div className="bg-background-dark text-white font-sans antialiased min-h-screen flex flex-col md:flex-row relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 flex-col border-r border-white/10 bg-card-dark/50 backdrop-blur-xl h-screen sticky top-0 z-40">
                {/* ... (sidebar content remains same) ... */}
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-black font-bold font-display text-lg">
                            AP
                        </div>
                        <div>
                            <h2 className="font-display font-bold text-lg leading-tight">Admin<span className="text-primary">.</span></h2>
                            <p className="text-white/40 text-xs">Content Manager</p>
                        </div>
                    </div>

                    <nav className="flex flex-col gap-2">
                        {['dashboard', 'messages', 'projects', 'story', 'toolbox', 'highlights'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab ? 'bg-primary text-black font-bold' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                            >
                                <span className="material-symbols-outlined text-[20px]">
                                    {tab === 'dashboard' ? 'dashboard' :
                                        tab === 'messages' ? 'mail' :
                                            tab === 'projects' ? 'work' :
                                                tab === 'story' ? 'person' :
                                                    tab === 'toolbox' ? 'construction' : 'image'}
                                </span>
                                <span className="capitalize">{tab === 'highlights' ? 'Media Library' : tab}</span>
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="mt-auto p-6 border-t border-white/10">
                    <Link to="/" className="flex items-center gap-3 text-white/40 hover:text-white transition-colors text-sm font-medium">
                        <span className="material-symbols-outlined text-[20px]">logout</span>
                        <span>Logout</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto h-screen no-scrollbar relative z-10 pb-24 md:pb-0">
                {/* Mobile Header */}
                <header className="md:hidden sticky top-0 z-30 bg-background-dark/95 backdrop-blur-md border-b border-white/10 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black font-bold font-display text-sm">
                            AP
                        </div>
                        <h2 className="font-display font-bold text-lg">Admin</h2>
                    </div>
                </header>

                <div className="p-6 md:p-12 max-w-7xl mx-auto">
                    {/* Dashboard View */}
                    {activeTab === 'dashboard' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <header className="mb-10">
                                <h1 className="text-3xl md:text-3xl font-display font-bold mb-2">Welcome Back, <span className="text-primary">Alexander</span></h1>
                                <p className="text-white/40">Here's what's happening with your portfolio today.</p>
                            </header>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                                <div className="glass p-6 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-primary/50 transition-colors">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <span className="material-symbols-outlined text-6xl text-primary">visibility</span>
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-2">Total Visits</p>
                                        <h3 className="text-4xl font-display font-bold">12.4k</h3>
                                        <span className="text-primary text-xs font-bold bg-primary/10 px-2 py-1 rounded-full mt-2 inline-block">+12% this week</span>
                                    </div>
                                </div>
                                <div className="glass p-6 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-primary/50 transition-colors">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <span className="material-symbols-outlined text-6xl text-primary">work</span>
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-2">Active Projects</p>
                                        <h3 className="text-4xl font-display font-bold">8</h3>
                                        <span className="text-white/40 text-xs mt-2 inline-block">3 Featured</span>
                                    </div>
                                </div>
                                <div className="glass p-6 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-primary/50 transition-colors">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <span className="material-symbols-outlined text-6xl text-primary">mail</span>
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-2">Messages</p>
                                        <h3 className="text-4xl font-display font-bold">5</h3>
                                        <span className="text-primary text-xs font-bold bg-primary/10 px-2 py-1 rounded-full mt-2 inline-block">2 New</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Message Center View */}
                    {activeTab === 'messages' && (
                        <div className="h-[calc(100vh-100px)] animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <MessageCenter />
                        </div>
                    )}

                    {/* Magic Toolbox Editor */}
                    {activeTab === 'toolbox' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
                            {/* ... toolbox code ... */}
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-3xl font-display font-bold mb-2">Magic <span className="text-primary">Toolbox</span></h2>
                                    <p className="text-white/40">Manage your skills and software stack.</p>
                                </div>
                                <button className="px-6 py-2 bg-primary text-black font-bold rounded-full hover:shadow-[0_0_20px_rgba(212,255,63,0.4)] transition-all flex items-center gap-2">
                                    <span className="material-symbols-outlined">save</span>
                                    <span>Save Changes</span>
                                </button>
                            </div>

                            <div className="bg-card-dark/50 border border-white/10 rounded-3xl p-8 mb-8">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">psychology</span>
                                    Professional Skills
                                </h3>
                                <div className="space-y-6">
                                    {skills.map((skill) => (
                                        <div key={skill.id} className={`bg-black/20 rounded-2xl p-4 border transition-all ${skill.visible ? 'border-white/10' : 'border-white/5 opacity-60'}`}>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-white/20 cursor-grab hover:text-white transition-colors">drag_indicator</span>
                                                    <span className="font-bold">{skill.name}</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-primary font-bold">{skill.value}%</span>
                                                    <button onClick={() => toggleSkillVisibility(skill.id)} className={`text-white/40 hover:text-white transition-colors`}>
                                                        <span className="material-symbols-outlined">{skill.visible ? 'visibility' : 'visibility_off'}</span>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="relative h-2 bg-white/5 rounded-full overflow-hidden group hover:h-4 transition-all duration-300">
                                                <div
                                                    className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-300"
                                                    style={{ width: `${skill.value}%` }}
                                                ></div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={skill.value}
                                                    onChange={(e) => handleSkillChange(skill.id, parseInt(e.target.value))}
                                                    className="absolute inset-0 w-full opacity-0 cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-card-dark/50 border border-white/10 rounded-3xl p-8">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">terminal</span>
                                    Software Stack
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {[
                                        { icon: "design_services", label: "Figma", bg: "bg-black" },
                                        { icon: "view_kanban", label: "Jira", bg: "bg-blue-600" },
                                        { icon: "description", label: "Notion", bg: "bg-gray-800" },
                                        { icon: "analytics", label: "Amplitude", bg: "bg-purple-600" },
                                        { icon: "code", label: "VS Code", bg: "bg-blue-500" },
                                        { icon: "cloud", label: "AWS", bg: "bg-orange-500" },
                                    ].map((tool, i) => (
                                        <div key={i} className="aspect-square bg-black/20 border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-white/5 hover:border-primary/50 cursor-pointer group transition-all relative">
                                            <div className={`w-10 h-10 rounded-lg ${tool.bg} flex items-center justify-center text-white shadow-lg`}>
                                                <span className="material-symbols-outlined text-xl">{tool.icon}</span>
                                            </div>
                                            <span className="text-xs font-bold text-white/60 group-hover:text-white">{tool.label}</span>
                                        </div>
                                    ))}

                                    <button className="aspect-square bg-transparent border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-all group">
                                        <span className="material-symbols-outlined text-3xl text-white/20 group-hover:text-primary transition-colors">add_circle</span>
                                        <span className="text-xs font-bold text-white/20 group-hover:text-primary transition-colors uppercase tracking-wider">Add New</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Media Library Editor */}
                    {activeTab === 'highlights' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
                            {/* ... media library content ... */}
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-3xl font-display font-bold mb-2">Media <span className="text-primary">Library</span></h2>
                                    <p className="text-white/40">Manager your project images and highlights.</p>
                                </div>
                                <button className="h-12 w-12 rounded-full bg-primary text-black flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                                    <span className="material-symbols-outlined text-2xl">add</span>
                                </button>
                            </div>

                            <div className="mb-8 p-8 border-2 border-dashed border-white/10 rounded-3xl bg-white/5 hover:bg-white/10 hover:border-primary/50 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 group">
                                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-bold text-white">Upload New Image</p>
                                    <p className="text-sm text-white/40">Tap or drop files here. JPG, PNG up to 5MB.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {mediaItems.map((item) => (
                                    <div key={item.id} className="group relative bg-card-dark/50 rounded-2xl p-2 border border-white/10 hover:border-primary/50 transition-all flex flex-col gap-3">
                                        <div className="relative aspect-square rounded-xl overflow-hidden bg-black/50">
                                            <img src={item.url} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${item.status === 'used' ? 'bg-black/60 text-primary border-primary/20' : 'bg-black/60 text-white/40 border-white/10'}`}>
                                                {item.status}
                                            </div>
                                        </div>
                                        <div className="px-2 pb-2">
                                            <p className="text-sm font-bold truncate mb-1" title={item.name}>{item.name}</p>
                                            <span className="text-xs text-white/30">{item.size}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Story Editor */}
                    {activeTab === 'story' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
                            {/* ... story editor content ... */}
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-3xl font-display font-bold mb-2">My <span className="text-primary">Story</span></h2>
                                    <p className="text-white/40">Edit your profile, bio, and social links.</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-6 py-2 border border-white/10 hover:bg-white/5 rounded-full font-bold text-sm transition-all flex items-center gap-2">
                                        <span className="material-symbols-outlined">visibility</span>
                                        <span className="hidden md:inline">Preview</span>
                                    </button>
                                    <button className="px-6 py-2 bg-primary text-black font-bold rounded-full hover:shadow-[0_0_20px_rgba(212,255,63,0.4)] transition-all flex items-center gap-2">
                                        <span className="material-symbols-outlined">check</span>
                                        <span className="hidden md:inline">Save</span>
                                    </button>
                                </div>
                            </div>

                            <section className="mb-12">
                                <div className="flex items-center justify-between mb-4">
                                    <label className="text-xs uppercase tracking-wider font-bold text-white/40">Profile Image</label>
                                    <span className="text-[10px] text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">Saved</span>
                                </div>
                                <div className="glass p-8 rounded-3xl border border-white/10 flex flex-col items-center justify-center bg-card-dark/30">
                                    <div className="relative group cursor-pointer w-[180px]">
                                        <div className="aspect-[4/5] rounded-2xl overflow-hidden relative border-2 border-white/10 group-hover:border-primary/50 transition-colors shadow-2xl">
                                            <img alt="Profile Preview" className="w-full h-full object-cover filter brightness-90 group-hover:brightness-50 transition-all duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmUw9mOGIBUUKTMjLGS3PuCvlZ6tOEkE7Pk4fTqTPRNbyAi8VcOwUJT_Tg7nKQJEJPQUfHhYixf-vDAK5kti7OjS5PBRpTcXy4CYgV5yqLq_8BD9a7D6poQMOIRzQwjPwPy0xUcU4theBgi44FCwTIHWKslp6S1l-DXQD8bGxXSPF7jUS7Jpf1Tx1yTiWGknjjykiWzFMhOmjljznoIL3K1-gKiPmbYu6R0ghqGG3mgw4aBRoYAihl0sZ7Rayj8fsM5dyG5Rpjaupp" />
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <span className="material-symbols-outlined text-3xl text-primary">crop</span>
                                            </div>
                                        </div>
                                        <div className="absolute -bottom-3 -right-3">
                                            <button className="w-10 h-10 rounded-full bg-primary text-black flex items-center justify-center shadow-lg border-4 border-[#161616] hover:scale-110 transition-transform" type="button">
                                                <span className="material-symbols-outlined text-lg">edit</span>
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-white/30 mt-6 text-center">Tap image to adjust crop. <br />Recommended: 800x1000px JPG/PNG.</p>
                                </div>
                            </section>

                            <section className="mb-12">
                                <div className="flex justify-between items-end mb-3">
                                    <label className="text-xs uppercase tracking-wider font-bold text-white/40">Headline</label>
                                    <span className="text-[10px] text-white/30 font-mono">{headline.length}/80</span>
                                </div>
                                <div className="relative group">
                                    <textarea
                                        className="w-full bg-card-dark border border-white/10 rounded-2xl p-4 text-xl font-display font-medium text-white placeholder:text-white/20 focus:outline-none focus:border-primary transition-all resize-none leading-tight shadow-inner"
                                        rows={3}
                                        value={headline}
                                        onChange={(e) => setHeadline(e.target.value)}
                                        maxLength={80}
                                    />
                                    <div className="absolute bottom-3 right-3 opacity-0 group-focus-within:opacity-100 transition-opacity">
                                        <span className="material-symbols-outlined text-primary text-sm animate-pulse">edit</span>
                                    </div>
                                </div>
                            </section>

                            <section className="mb-12">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-xs uppercase tracking-wider font-bold text-white/40">Bio / About Me</label>
                                </div>
                                <div className="glass rounded-2xl border border-white/10 overflow-hidden focus-within:border-primary/50 transition-all bg-card-dark/50">
                                    <textarea
                                        className="w-full bg-transparent border-0 p-4 text-base text-white/80 leading-relaxed focus:outline-none h-48 resize-none placeholder:text-white/20"
                                        placeholder="Tell your story..."
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                    />
                                </div>
                            </section>

                            <section className="pb-8">
                                <label className="text-xs uppercase tracking-wider font-bold text-white/40 mb-4 block">Social Links</label>
                                <div className="flex flex-col gap-4">
                                    {socials.map((social) => (
                                        <div key={social.id} className={`rounded-2xl overflow-hidden transition-all duration-300 border ${social.visible ? 'bg-card-dark border-white/10 shadow-lg' : 'bg-black/10 border-white/5 opacity-70'}`}>
                                            <div className="p-4 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full shadow-inner ${social.bgColor} ${social.color}`}>
                                                        <span className="material-symbols-outlined text-xl">{social.icon}</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-sm text-white leading-tight">{social.platform}</h3>
                                                        <p className="text-[10px] text-white/40 uppercase tracking-wider">Social Profile</p>
                                                    </div>
                                                </div>

                                                {/* Toggle Switch */}
                                                <div
                                                    className={`relative w-12 h-7 rounded-full cursor-pointer transition-colors duration-300 ${social.visible ? 'bg-primary' : 'bg-white/10'}`}
                                                    onClick={() => toggleSocialVisibility(social.id)}
                                                >
                                                    <div className={`absolute top-1 left-1 bg-black w-5 h-5 rounded-full shadow-sm transition-transform duration-300 ${social.visible ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                                </div>
                                            </div>

                                            {/* Input Area */}
                                            <div className={`bg-black/20 px-4 py-3 border-t border-white/5 flex items-center gap-3 transition-colors ${social.visible ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                                                <span className="material-symbols-outlined text-white/20 text-lg">link</span>
                                                <input
                                                    className="bg-transparent border-0 p-0 text-sm text-white w-full focus:outline-none placeholder:text-white/20 font-mono"
                                                    value={social.handle}
                                                    onChange={(e) => updateSocialHandle(social.id, e.target.value)}
                                                    placeholder="https://..."
                                                />
                                                <button onClick={() => removeSocial(social.id)} className="text-white/20 hover:text-red-400 transition-colors" title="Remove Link">
                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add Button */}
                                    <button
                                        className="mt-2 w-full py-4 border border-dashed border-white/20 rounded-2xl flex items-center justify-center gap-2 text-white/40 hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all group"
                                        type="button"
                                        onClick={() => setSocials([...socials, {
                                            id: Date.now(),
                                            platform: 'Custom Link',
                                            handle: 'https://',
                                            icon: 'link',
                                            visible: true,
                                            color: 'text-white',
                                            bgColor: 'bg-white/10'
                                        }])}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-colors">
                                            <span className="material-symbols-outlined text-lg">add</span>
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-wider">Add Custom Link</span>
                                    </button>
                                </div>
                            </section>
                        </div>
                    )}

                    {/* Projects Editor */}
                    {activeTab === 'projects' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">

                            {/* Conditional Rendering: Grid vs Editor */}
                            {viewMode === 'editor' ? (
                                <CaseStudyEditor
                                    onBack={() => {
                                        setViewMode('grid');
                                        setEditingProject(null);
                                    }}
                                    initialData={editingProject}
                                />
                            ) : (
                                <>
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h2 className="text-3xl font-display font-bold mb-2">My <span className="text-primary">Projects</span></h2>
                                            <p className="text-white/40">Manage your portfolio showcase.</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
                                                    <span className="material-symbols-outlined text-lg">search</span>
                                                </span>
                                                <input
                                                    type="text"
                                                    placeholder="Search projects..."
                                                    className="bg-white/5 border border-white/10 rounded-full py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 hidden md:block"
                                                />
                                                <button
                                                    onClick={() => setShowFilterModal(true)}
                                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/5 text-white/60 flex items-center justify-center hover:bg-white/10 hover:text-primary transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-base">tune</span>
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setEditingProject(null);
                                                    setViewMode('editor');
                                                }}
                                                className="h-12 w-12 md:w-auto md:px-6 md:py-2 md:rounded-full rounded-full bg-primary text-black font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(212,255,63,0.3)] transition-all"
                                            >
                                                <span className="material-symbols-outlined text-2xl md:text-xl">add</span>
                                                <span className="hidden md:inline">Add Project</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Filter Modal Overlay */}
                                    {showFilterModal && (
                                        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-[2px] animate-in fade-in duration-200">
                                            <div
                                                className="relative w-full max-w-md bg-[#1a1a1a] rounded-t-[32px] shadow-2xl flex flex-col max-h-[90vh] animate-in slide-in-from-bottom border-t border-white/10"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {/* Drag Handle Area */}
                                                <div className="w-full flex justify-center pt-3 pb-1">
                                                    <div className="h-1.5 w-12 rounded-full bg-white/20"></div>
                                                </div>

                                                {/* Header */}
                                                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                                                    <h2 className="text-white text-lg font-bold tracking-tight">Filter Projects</h2>
                                                    <button
                                                        onClick={() => setShowFilterModal(false)}
                                                        className="text-white/60 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                                                    >
                                                        <span className="material-symbols-outlined">close</span>
                                                    </button>
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 overflow-y-auto px-6 pt-2 pb-24 no-scrollbar">
                                                    {/* Expertise */}
                                                    <div className="mt-6">
                                                        <h3 className="text-white/60 text-xs font-bold uppercase tracking-wider mb-4">Expertise</h3>
                                                        <div className="flex flex-wrap gap-3">
                                                            {['UX Design', 'Product Strategy', 'Data Analytics', 'User Research', 'Prototyping'].map(expert => (
                                                                <button
                                                                    key={expert}
                                                                    onClick={() => toggleExpertise(expert)}
                                                                    className={`flex items-center justify-center h-9 px-4 rounded-full transition-all active:scale-95 border ${selectedExpertise.includes(expert) ? 'bg-primary border-primary' : 'bg-transparent border-white/20 hover:border-primary/50'}`}
                                                                >
                                                                    <span className={`text-sm font-semibold ${selectedExpertise.includes(expert) ? 'text-[#1a1a1a]' : 'text-white'}`}>{expert}</span>
                                                                    {selectedExpertise.includes(expert) && <span className="material-symbols-outlined text-[#1a1a1a] text-[16px] ml-1.5 font-bold">check</span>}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="h-px w-full bg-white/5 my-8"></div>

                                                    {/* Industry */}
                                                    <div>
                                                        <h3 className="text-white/60 text-xs font-bold uppercase tracking-wider mb-4">Industry</h3>
                                                        <div className="flex flex-wrap gap-3">
                                                            {['Fintech', 'Healthtech', 'SaaS', 'E-commerce', 'EdTech', 'Cybersecurity'].map(ind => (
                                                                <button
                                                                    key={ind}
                                                                    onClick={() => toggleIndustry(ind)}
                                                                    className={`flex items-center justify-center h-9 px-4 rounded-full transition-all active:scale-95 border ${selectedIndustry.includes(ind) ? 'bg-primary border-primary' : 'bg-transparent border-white/20 hover:border-primary/50'}`}
                                                                >
                                                                    <span className={`text-sm font-semibold ${selectedIndustry.includes(ind) ? 'text-[#1a1a1a]' : 'text-white'}`}>{ind}</span>
                                                                    {selectedIndustry.includes(ind) && <span className="material-symbols-outlined text-[#1a1a1a] text-[16px] ml-1.5 font-bold">check</span>}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="h-px w-full bg-white/5 my-8"></div>

                                                    {/* Date Range */}
                                                    <div className="pb-4">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <h3 className="text-white/60 text-xs font-bold uppercase tracking-wider">Timeframe</h3>
                                                            <span className="text-primary text-xs font-medium">2021 - Present</span>
                                                        </div>
                                                        <div className="relative h-12 w-full flex items-center">
                                                            <div className="absolute h-1 w-full bg-white/10 rounded-full"></div>
                                                            <div className="absolute h-1 left-[20%] right-[10%] bg-primary rounded-full"></div>
                                                            <div className="absolute h-6 w-6 bg-primary border-4 border-[#1a1a1a] rounded-full shadow-lg left-[20%] -translate-x-3 cursor-pointer"></div>
                                                            <div className="absolute h-6 w-6 bg-primary border-4 border-[#1a1a1a] rounded-full shadow-lg right-[10%] translate-x-3 cursor-pointer"></div>
                                                        </div>
                                                        <div className="flex justify-between text-white/40 text-[10px] uppercase font-bold mt-1">
                                                            <span>2018</span>
                                                            <span>2024</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Footer */}
                                                <div className="absolute bottom-0 left-0 w-full bg-[#1a1a1a]/95 backdrop-blur-md border-t border-white/5 p-6 pt-4 pb-8">
                                                    <div className="flex gap-4 items-center">
                                                        <button
                                                            onClick={() => { setSelectedExpertise([]); setSelectedIndustry([]); }}
                                                            className="flex-1 py-3.5 px-6 rounded-full text-white/80 font-semibold text-sm hover:bg-white/5 transition-colors"
                                                        >
                                                            Clear All
                                                        </button>
                                                        <button
                                                            onClick={() => setShowFilterModal(false)}
                                                            className="flex-[2] py-3.5 px-6 rounded-full bg-primary text-[#1a1a1a] font-bold text-sm shadow-[0_0_15px_rgba(128,242,13,0.3)] hover:shadow-[0_0_20px_rgba(128,242,13,0.5)] transition-all flex items-center justify-center gap-2"
                                                        >
                                                            Apply Filters
                                                            <span className="bg-[#1a1a1a]/10 px-2 py-0.5 rounded-full text-xs">{selectedExpertise.length + selectedIndustry.length}</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Click outside to close */}
                                            <div className="absolute inset-0 z-[-1]" onClick={() => setShowFilterModal(false)}></div>
                                        </div>
                                    )}

                                    {/* Filters Tab (Pills) */}
                                    <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
                                        {['All', 'SaaS', 'Mobile', 'B2B', 'Fintech', 'Health'].map((filter) => (
                                            <button
                                                key={filter}
                                                onClick={() => setProjectFilter(filter)}
                                                className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${projectFilter === filter
                                                    ? 'bg-white text-black'
                                                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                                                    }`}
                                            >
                                                {filter}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Projects Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                                        {projects
                                            .filter(p => projectFilter === 'All' || p.category === projectFilter)
                                            .map((project) => (
                                                <article key={project.id} className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-card-dark/50 hover:border-primary/50 transition-all duration-300">
                                                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/50">
                                                        <div
                                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                                            style={{ backgroundImage: `url('${project.image}')` }}
                                                        ></div>
                                                        <div className="absolute top-3 left-3">
                                                            <span className="inline-flex items-center rounded-lg bg-black/60 backdrop-blur-md px-2 py-1 text-[10px] uppercase tracking-wider font-bold text-primary border border-white/10">
                                                                {project.category}
                                                            </span>
                                                        </div>

                                                        {/* Overlay Actions */}
                                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                                                            <button
                                                                onClick={() => {
                                                                    setEditingProject(project);
                                                                    setViewMode('editor');
                                                                }}
                                                                className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform"
                                                                title="Edit"
                                                            >
                                                                <span className="material-symbols-outlined">edit</span>
                                                            </button>
                                                            <button className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors" title="Delete">
                                                                <span className="material-symbols-outlined">delete</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-1.5 p-4">
                                                        <h3 className="text-base font-bold leading-snug text-white line-clamp-1">{project.title}</h3>
                                                        <div className="flex items-center gap-2 text-xs text-white/40 font-medium">
                                                            <span>{project.role}</span>
                                                            <span className="h-1 w-1 rounded-full bg-white/20"></span>
                                                            <span>{project.year}</span>
                                                        </div>
                                                    </div>
                                                </article>
                                            ))}

                                        {/* Add New Placeholder Card (visible if filtering All) */}
                                        {projectFilter === 'All' && (
                                            <button
                                                onClick={() => {
                                                    setEditingProject(null);
                                                    setViewMode('editor');
                                                }}
                                                className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-white/10 bg-transparent min-h-[280px] hover:bg-white/5 hover:border-primary/50 transition-all group"
                                            >
                                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:text-primary group-hover:scale-110 transition-all">
                                                    <span className="material-symbols-outlined text-3xl">add</span>
                                                </div>
                                                <div className="text-center">
                                                    <span className="font-bold text-white/50 group-hover:text-white transition-colors">Start New Project</span>
                                                    <p className="text-xs text-white/20 mt-1">SaaS, Mobile, Web...</p>
                                                </div>
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 w-full bg-background-dark/95 backdrop-blur-md border-t border-white/10 z-50 px-6 py-4 flex justify-between items-center text-xs font-medium">
                {['dashboard', 'projects', 'story', 'highlights', 'settings'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex flex-col items-center gap-1 ${activeTab === tab ? 'text-primary' : 'text-white/40'}`}
                    >
                        <span className="material-symbols-outlined text-xl">
                            {tab === 'dashboard' ? 'dashboard' :
                                tab === 'projects' ? 'work' :
                                    tab === 'story' ? 'person' :
                                        tab === 'highlights' ? 'image' : 'settings'}
                        </span>
                        <span className="capitalize">{tab === 'highlights' ? 'Media' : tab}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default Admin;
