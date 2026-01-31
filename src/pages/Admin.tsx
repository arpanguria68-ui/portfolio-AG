import { useState, useEffect } from 'react';
import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import { Link } from 'react-router-dom';
import CaseStudyEditor from '../components/admin/CaseStudyEditor';
import MessageCenter from '../components/admin/MessageCenter';
import { uploadImage, uploadMultipleImages, formatFileSize } from '../lib/cloudinary';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    // Project Filter Modal State
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [selectedExpertise, setSelectedExpertise] = useState(['UX Design']);
    const [selectedIndustry, setSelectedIndustry] = useState(['Healthtech']);

    // ===== CONVEX QUERIES =====
    const convexProjects = useQuery(api.projects.list);
    const convexSkills = useQuery(api.skills.list);
    const convexSocials = useQuery(api.socials.list);
    const convexMedia = useQuery(api.media.list);
    const convexProfile = useQuery(api.profile.get);
    const convexTools = useQuery(api.tools.list);

    // ===== CONVEX MUTATIONS =====
    const updateSkill = useMutation(api.skills.update);
    const createSkill = useMutation(api.skills.create);
    const removeSkillMutation = useMutation(api.skills.remove);

    const updateSocial = useMutation(api.socials.update);
    const createSocial = useMutation(api.socials.create);
    const removeSocialMutation = useMutation(api.socials.remove);

    const upsertProfile = useMutation(api.profile.upsert);

    // Media mutations
    const createMedia = useMutation(api.media.create);
    const removeMedia = useMutation(api.media.remove);
    const updateMedia = useMutation(api.media.update);

    // Tools mutations
    const createTool = useMutation(api.tools.create);
    const removeToolMutation = useMutation(api.tools.remove);
    const deleteProject = useMutation(api.projects.remove);

    // ===== LOCAL STATE FOR EDITING =====
    const [headline, setHeadline] = useState("");
    const [bio, setBio] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [profileSaved, setProfileSaved] = useState(false);
    const [profileImage, setProfileImage] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    // Skill modal state
    const [showAddSkillModal, setShowAddSkillModal] = useState(false);
    const [newSkillName, setNewSkillName] = useState("");
    const [newSkillValue, setNewSkillValue] = useState(75);

    // Tool modal state
    const [showAddToolModal, setShowAddToolModal] = useState(false);
    const [newToolName, setNewToolName] = useState("");
    const [newToolIcon, setNewToolIcon] = useState("code");
    const [newToolColor, setNewToolColor] = useState("bg-blue-500");

    // Media edit modal state
    const [editingMedia, setEditingMedia] = useState<{
        id: Id<"media">;
        name: string;
        title: string;
        subtitle: string;
        category: string;
    } | null>(null);

    // ===== SETTINGS STATE =====
    const [geminiKeyInput, setGeminiKeyInput] = useState("");
    const [isSavingKey, setIsSavingKey] = useState(false);
    const [selectedModel, setSelectedModel] = useState("gemini-1.5-flash"); // Default
    const setGeminiKey = useMutation(api.settings.set);
    const isGeminiKeySet = useQuery(api.settings.isSet, { key: "gemini_api_key" });
    const savedModel = useQuery(api.settings.get, { key: "gemini_model" });
    const testConnection = useAction(api.settings.testGeminiConnection);

    // Sync saved model when loaded
    useEffect(() => {
        if (savedModel) {
            setSelectedModel(savedModel);
        }
    }, [savedModel]);

    const handleSaveGeminiKey = async () => {
        setIsSavingKey(true);
        try {
            // Only save key if entered (to avoid clearing it if just changing model)
            if (geminiKeyInput.trim()) {
                await setGeminiKey({ key: "gemini_api_key", value: geminiKeyInput.trim() });
                setGeminiKeyInput(""); // Clear input after save for security
            }

            // Always save model
            await setGeminiKey({ key: "gemini_model", value: selectedModel });

            alert("Settings saved successfully!");
        } catch (error) {
            console.error("Failed to save settings:", error);
            alert("Failed to save settings.");
        } finally {
            setIsSavingKey(false);
        }
    };

    // Sync profile from Convex
    useEffect(() => {
        if (convexProfile) {
            setHeadline(convexProfile.headline || "");
            setBio(convexProfile.bio || "");
            setProfileImage(convexProfile.profileImage || "");
        }
    }, [convexProfile]);

    // Derived data with fallbacks
    const projects = convexProjects ?? [];
    const skills = convexSkills ?? [];
    const socials = convexSocials ?? [];
    const mediaItems = convexMedia ?? [];
    const tools = convexTools ?? [];

    // ===== SKILL HANDLERS =====
    const handleSkillChange = async (id: Id<"skills">, newValue: number) => {
        await updateSkill({ id, value: newValue });
    };

    const toggleSkillVisibility = async (id: Id<"skills">, currentVisible: boolean) => {
        await updateSkill({ id, visible: !currentVisible });
    };

    const addSkill = async () => {
        if (!newSkillName.trim()) return;
        await createSkill({
            name: newSkillName.trim(),
            value: newSkillValue,
            visible: true,
        });
        setNewSkillName("");
        setNewSkillValue(75);
        setShowAddSkillModal(false);
    };

    const handleDeleteProject = async (id: Id<"projects">, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
            try {
                await deleteProject({ id });
            } catch (error) {
                console.error("Failed to delete project:", error);
                alert("Failed to delete project. Please try again.");
            }
        }
    };

    const removeSkill = async (id: Id<"skills">) => {
        if (confirm("Are you sure you want to delete this skill?")) {
            await removeSkillMutation({ id });
        }
    };

    // ===== TOOL HANDLERS =====
    const addTool = async () => {
        if (!newToolName.trim()) return;
        await createTool({
            name: newToolName.trim(),
            icon: newToolIcon,
            bgColor: newToolColor,
        });
        setNewToolName("");
        setNewToolIcon("code");
        setNewToolColor("bg-blue-500");
        setShowAddToolModal(false);
    };

    const removeTool = async (id: Id<"tools">) => {
        await removeToolMutation({ id });
    };

    // ===== SOCIAL HANDLERS =====
    const toggleSocialVisibility = async (id: Id<"socialLinks">, currentVisible: boolean) => {
        await updateSocial({ id, visible: !currentVisible });
    };

    const updateSocialHandle = async (id: Id<"socialLinks">, val: string) => {
        await updateSocial({ id, handle: val, url: val });
    };

    const removeSocial = async (id: Id<"socialLinks">) => {
        await removeSocialMutation({ id });
    };

    const addSocial = async () => {
        await createSocial({
            platform: 'Custom Link',
            handle: 'https://',
            url: 'https://',
            icon: 'link',
            visible: true,
            color: 'text-white',
            bgColor: 'bg-white/10'
        });
    };

    // ===== PROFILE HANDLERS =====
    const saveProfile = async () => {
        try {
            setIsSaving(true);
            setProfileSaved(false);
            await upsertProfile({ headline, bio, profileImage: profileImage || undefined });
            setProfileSaved(true);
            setTimeout(() => setProfileSaved(false), 3000);
        } catch (error) {
            console.error('Failed to save profile:', error);
            alert('Failed to save profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    // ===== UPLOAD HANDLERS =====
    const handleUploadProfileImage = async () => {
        try {
            setIsUploading(true);
            const result = await uploadImage({
                folder: 'portfolio/profile',
                cropping: true,
                aspectRatio: 4 / 5,
            });
            setProfileImage(result.url);
            // Auto-save profile with new image
            await upsertProfile({ headline, bio, profileImage: result.url });
            setProfileSaved(true);
            setTimeout(() => setProfileSaved(false), 3000);
        } catch (error) {
            if ((error as Error).message !== 'Upload cancelled') {
                console.error('Failed to upload profile image:', error);
                alert('Failed to upload image. Please try again.');
            }
        } finally {
            setIsUploading(false);
        }
    };

    const handleUploadMedia = async () => {
        try {
            setIsUploading(true);
            const results = await uploadMultipleImages({
                folder: 'portfolio/media',
                maxFiles: 10,
            });

            // Save each uploaded image to Convex
            for (const img of results) {
                await createMedia({
                    name: img.name,
                    url: img.url,
                    publicId: img.publicId,
                    size: formatFileSize(img.size),
                    format: img.format,
                    width: img.width,
                    height: img.height,
                    status: 'unused',
                });
            }
        } catch (error) {
            if ((error as Error).message !== 'Upload cancelled') {
                console.error('Failed to upload media:', error);
                alert('Failed to upload images. Please try again.');
            }
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteMedia = async (id: Id<"media">) => {
        if (confirm('Are you sure you want to delete this image?')) {
            try {
                await removeMedia({ id });
            } catch (error) {
                console.error('Failed to delete media:', error);
                alert('Failed to delete image. Please try again.');
            }
        }
    };

    const openMediaEdit = (item: typeof mediaItems[0]) => {
        setEditingMedia({
            id: item._id,
            name: item.name,
            title: item.title || '',
            subtitle: item.subtitle || '',
            category: item.category || '',
        });
    };

    const saveMediaEdit = async () => {
        if (!editingMedia) return;
        try {
            console.log('Saving media edit:', editingMedia);
            await updateMedia({
                id: editingMedia.id,
                title: editingMedia.title || undefined,
                subtitle: editingMedia.subtitle || undefined,
                category: editingMedia.category || undefined,
            });
            console.log('Media edit saved successfully');
            setEditingMedia(null);
        } catch (error) {
            console.error('Failed to update media:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            alert(`Failed to save changes: ${errorMessage}`);
        }
    };

    // ===== FILTER HANDLERS =====
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

    // Project Editor State
    const [projectFilter, setProjectFilter] = useState('All');
    const [viewMode, setViewMode] = useState<'grid' | 'editor'>('grid');
    const [editingProject, setEditingProject] = useState<any>(null);

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
                        {['dashboard', 'messages', 'projects', 'story', 'toolbox', 'highlights', 'settings'].map((tab) => (
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
                                                    tab === 'toolbox' ? 'construction' :
                                                        tab === 'settings' ? 'settings' : 'image'}
                                </span>
                                <span className="capitalize">{tab === 'highlights' ? 'Media Library' : tab}</span>
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="mt-auto p-6 border-t border-white/10">
                    <Link to="/" className="flex items-center gap-3 text-white/60 hover:text-primary transition-colors text-sm font-medium bg-white/5 hover:bg-primary/10 px-4 py-3 rounded-xl">
                        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                        <span>View Site</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto h-screen no-scrollbar relative z-10 pb-24 md:pb-0">
                {/* Mobile Header */}
                <header className="md:hidden sticky top-0 z-30 bg-background-dark/95 backdrop-blur-md border-b border-white/10 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link to="/" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-primary hover:bg-primary/10 transition-all">
                            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                        </Link>
                        <h2 className="font-display font-bold text-lg">Admin</h2>
                    </div>
                    <Link to="/" className="text-xs font-bold text-white/40 hover:text-primary transition-colors flex items-center gap-1">
                        <span>View Site</span>
                        <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </Link>
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
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">psychology</span>
                                        Professional Skills
                                        <span className="text-sm font-normal text-white/40">({skills.length} skills)</span>
                                    </h3>
                                    <button
                                        onClick={() => setShowAddSkillModal(true)}
                                        className="px-4 py-2 bg-primary/10 text-primary font-bold rounded-full hover:bg-primary hover:text-black transition-all flex items-center gap-2 text-sm"
                                    >
                                        <span className="material-symbols-outlined text-lg">add</span>
                                        Add Skill
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {skills.map((skill) => (
                                        <div key={skill._id} className={`bg-black/20 rounded-2xl p-4 border transition-all ${skill.visible ? 'border-white/10' : 'border-white/5 opacity-60'}`}>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-white/20 cursor-grab hover:text-white transition-colors">drag_indicator</span>
                                                    <span className="font-bold">{skill.name}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-primary font-bold">{skill.value}%</span>
                                                    <button onClick={() => toggleSkillVisibility(skill._id, skill.visible)} className="text-white/40 hover:text-white transition-colors">
                                                        <span className="material-symbols-outlined">{skill.visible ? 'visibility' : 'visibility_off'}</span>
                                                    </button>
                                                    <button onClick={() => removeSkill(skill._id)} className="text-white/40 hover:text-red-400 transition-colors">
                                                        <span className="material-symbols-outlined">delete</span>
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
                                                    onChange={(e) => handleSkillChange(skill._id, parseInt(e.target.value))}
                                                    className="absolute inset-0 w-full opacity-0 cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    {skills.length === 0 && (
                                        <div className="text-center py-8 text-white/40">
                                            <span className="material-symbols-outlined text-4xl mb-2 block">psychology_alt</span>
                                            No skills added yet. Click "Add Skill" to get started.
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-card-dark/50 border border-white/10 rounded-3xl p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">terminal</span>
                                        Software Stack
                                        <span className="text-sm font-normal text-white/40">({tools.length} tools)</span>
                                    </h3>
                                    <button
                                        onClick={() => setShowAddToolModal(true)}
                                        className="px-4 py-2 bg-primary/10 text-primary font-bold rounded-full hover:bg-primary hover:text-black transition-all flex items-center gap-2 text-sm"
                                    >
                                        <span className="material-symbols-outlined text-lg">add</span>
                                        Add Tool
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {tools.map((tool) => (
                                        <div key={tool._id} className="aspect-square bg-black/20 border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-white/5 hover:border-primary/50 cursor-pointer group transition-all relative">
                                            <button
                                                onClick={() => removeTool(tool._id)}
                                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-white/40 hover:text-red-400 transition-all"
                                            >
                                                <span className="material-symbols-outlined text-lg">close</span>
                                            </button>
                                            <div className={`w-10 h-10 rounded-lg ${tool.bgColor} flex items-center justify-center text-white shadow-lg`}>
                                                <span className="material-symbols-outlined text-xl">{tool.icon}</span>
                                            </div>
                                            <span className="text-xs font-bold text-white/60 group-hover:text-white">{tool.name}</span>
                                        </div>
                                    ))}

                                    {tools.length === 0 && (
                                        <div className="col-span-full text-center py-8 text-white/40">
                                            <span className="material-symbols-outlined text-4xl mb-2 block">terminal</span>
                                            No tools added yet. Click "Add Tool" to add your software stack.
                                        </div>
                                    )}
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
                                <button onClick={handleUploadMedia} className="h-12 w-12 rounded-full bg-primary text-black flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                                    <span className="material-symbols-outlined text-2xl">add</span>
                                </button>
                            </div>

                            <div
                                onClick={handleUploadMedia}
                                className="mb-8 p-8 border-2 border-dashed border-white/10 rounded-3xl bg-white/5 hover:bg-white/10 hover:border-primary/50 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 group"
                            >
                                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    {isUploading ? (
                                        <span className="material-symbols-outlined text-3xl animate-spin">sync</span>
                                    ) : (
                                        <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                                    )}
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-bold text-white">{isUploading ? 'Uploading...' : 'Upload New Images'}</p>
                                    <p className="text-sm text-white/40">Click to select images. JPG, PNG, WebP up to 10MB.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {mediaItems.map((item) => (
                                    <div key={item._id} className="group relative bg-card-dark/50 rounded-2xl p-2 border border-white/10 hover:border-primary/50 transition-all flex flex-col gap-3">
                                        <div className="relative aspect-square rounded-xl overflow-hidden bg-black/50">
                                            <img src={item.url} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${item.status === 'used' ? 'bg-black/60 text-primary border-primary/20' : 'bg-black/60 text-white/40 border-white/10'}`}>
                                                {item.status}
                                            </div>
                                            <button
                                                onClick={() => handleDeleteMedia(item._id)}
                                                className="absolute top-2 left-2 w-8 h-8 rounded-full bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                                title="Delete image"
                                            >
                                                <span className="material-symbols-outlined text-sm">delete</span>
                                            </button>
                                            <button
                                                onClick={() => openMediaEdit(item)}
                                                className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-primary/80 text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary"
                                                title="Edit details"
                                            >
                                                <span className="material-symbols-outlined text-sm">edit</span>
                                            </button>
                                        </div>
                                        <div className="px-2 pb-2">
                                            <p className="text-sm font-bold truncate mb-1" title={item.title || item.name}>{item.title || item.name}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-white/30">{item.size}</span>
                                                {item.category && (
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold uppercase">{item.category}</span>
                                                )}
                                            </div>
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
                                    <button
                                        onClick={() => window.open('/', '_blank')}
                                        className="px-6 py-2 border border-white/10 hover:bg-white/5 rounded-full font-bold text-sm transition-all flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined">visibility</span>
                                        <span className="hidden md:inline">Preview</span>
                                    </button>
                                    <button
                                        onClick={saveProfile}
                                        disabled={isSaving}
                                        className={`px-6 py-2 font-bold rounded-full transition-all flex items-center gap-2 ${profileSaved
                                            ? 'bg-green-500 text-white'
                                            : 'bg-primary text-black hover:shadow-[0_0_20px_rgba(212,255,63,0.4)]'
                                            } ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        <span className="material-symbols-outlined">
                                            {isSaving ? 'sync' : profileSaved ? 'check_circle' : 'check'}
                                        </span>
                                        <span className="hidden md:inline">
                                            {isSaving ? 'Saving...' : profileSaved ? 'Saved!' : 'Save'}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            <section className="mb-12">
                                <div className="flex items-center justify-between mb-4">
                                    <label className="text-xs uppercase tracking-wider font-bold text-white/40">Profile Image</label>
                                    <span className="text-[10px] text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">{profileSaved ? 'Saved' : ''}</span>
                                </div>
                                <div className="glass p-8 rounded-3xl border border-white/10 flex flex-col items-center justify-center bg-card-dark/30">
                                    <div className="relative group cursor-pointer w-[180px]" onClick={handleUploadProfileImage}>
                                        <div className="aspect-[4/5] rounded-2xl overflow-hidden relative border-2 border-white/10 group-hover:border-primary/50 transition-colors shadow-2xl">
                                            <img
                                                alt="Profile Preview"
                                                className="w-full h-full object-cover filter brightness-90 group-hover:brightness-50 transition-all duration-300"
                                                src={profileImage || convexProfile?.profileImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuBmUw9mOGIBUUKTMjLGS3PuCvlZ6tOEkE7Pk4fTqTPRNbyAi8VcOwUJT_Tg7nKQJEJPQUfHhYixf-vDAK5kti7OjS5PBRpTcXy4CYgV5yqLq_8BD9a7D6poQMOIRzQwjPwPy0xUcU4theBgi44FCwTIHWKslp6S1l-DXQD8bGxXSPF7jUS7Jpf1Tx1yTiWGknjjykiWzFMhOmjljznoIL3K1-gKiPmbYu6R0ghqGG3mgw4aBRoYAihl0sZ7Rayj8fsM5dyG5Rpjaupp"}
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                {isUploading ? (
                                                    <span className="material-symbols-outlined text-3xl text-primary animate-spin">sync</span>
                                                ) : (
                                                    <span className="material-symbols-outlined text-3xl text-primary">cloud_upload</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="absolute -bottom-3 -right-3">
                                            <button className="w-10 h-10 rounded-full bg-primary text-black flex items-center justify-center shadow-lg border-4 border-[#161616] hover:scale-110 transition-transform" type="button">
                                                <span className="material-symbols-outlined text-lg">edit</span>
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-white/30 mt-6 text-center">Click to upload a new image. <br />Recommended: 800x1000px JPG/PNG.</p>
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
                                        <div key={social._id} className={`rounded-2xl overflow-hidden transition-all duration-300 border ${social.visible ? 'bg-card-dark border-white/10 shadow-lg' : 'bg-black/10 border-white/5 opacity-70'}`}>
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

                                                <div
                                                    className={`relative w-12 h-7 rounded-full cursor-pointer transition-colors duration-300 ${social.visible ? 'bg-primary' : 'bg-white/10'}`}
                                                    onClick={() => toggleSocialVisibility(social._id, social.visible)}
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
                                                    onChange={(e) => updateSocialHandle(social._id, e.target.value)}
                                                    placeholder="https://..."
                                                />
                                                <button onClick={() => removeSocial(social._id)} className="text-white/20 hover:text-red-400 transition-colors" title="Remove Link">
                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add Button */}
                                    <button
                                        className="mt-2 w-full py-4 border border-dashed border-white/20 rounded-2xl flex items-center justify-center gap-2 text-white/40 hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all group"
                                        type="button"
                                        onClick={() => addSocial()}
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
                                    key={editingProject?._id || 'new-project'}
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
                                            .filter(p => projectFilter === 'All' || (p.tags && p.tags.includes(projectFilter)))
                                            .map((project) => (
                                                <article key={project._id} className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-card-dark/50 hover:border-primary/50 transition-all duration-300">
                                                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/50">
                                                        <div
                                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                                            style={{ backgroundImage: `url('${project.image}')` }}
                                                        ></div>
                                                        <div className="absolute top-3 left-3">
                                                            <span className="inline-flex items-center rounded-lg bg-black/60 backdrop-blur-md px-2 py-1 text-[10px] uppercase tracking-wider font-bold text-primary border border-white/10">
                                                                {project.tags?.[0] || 'Project'}
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
                                                            <button
                                                                onClick={(e) => handleDeleteProject(project._id, e)}
                                                                className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                                                                title="Delete"
                                                            >
                                                                <span className="material-symbols-outlined">delete</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-1.5 p-4">
                                                        <h3 className="text-base font-bold leading-snug text-white line-clamp-1">{project.title}</h3>
                                                        <div className="flex items-center gap-2 text-xs text-white/40 font-medium">
                                                            <span>{project.tags?.[0] || 'Project'}</span>
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

                    {/* Settings / AI Config */}
                    {activeTab === 'settings' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
                            {/* AI Configuration Section */}
                            <div className="bg-card-dark/50 border border-white/10 rounded-3xl p-8 mb-8">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                                        <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">Gemini API Connection</h3>
                                        <p className="text-sm text-white/40">Powered by Google Generative AI</p>
                                    </div>
                                    <div className={`ml-auto px-3 py-1 rounded-full text-xs font-bold border ${isGeminiKeySet ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                        {isGeminiKeySet ? 'CONNECTED' : 'NOT CONFIGURED'}
                                    </div>
                                </div>

                                <p className="text-white/60 text-sm mb-6 leading-relaxed">
                                    To enable the AI Chat Assistant on your portfolio, you need to provide a Google Gemini API Key.
                                    The key is stored securely and used only for chat functionality.
                                </p>

                                {/* Test Connection Feature */}
                                <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
                                    <h4 className="text-sm font-bold text-white mb-2">Connection Status</h4>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={async () => {
                                                try {
                                                    const result = await testConnection({});
                                                    if (result.success) {
                                                        alert("Success! " + result.message);
                                                    } else {
                                                        alert("Error: " + result.message);
                                                    }
                                                } catch (e) {
                                                    alert("Failed to run test. Check console.");
                                                    console.error(e);
                                                }
                                            }}
                                            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-sm">wifi_tethering</span>
                                            Test API Connection
                                        </button>
                                        <p className="text-xs text-white/40">
                                            Click to verify your API Key and Model selection.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="text-xs uppercase tracking-wider font-bold text-white/40 mb-2 block">API Key</label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                value={geminiKeyInput}
                                                onChange={(e) => setGeminiKeyInput(e.target.value)}
                                                placeholder={isGeminiKeySet ? "•••••••••••••••••••••••••" : "Enter your AIza..."}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 font-mono transition-all"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-white/20">key</span>
                                        </div>
                                        <p className="mt-2 text-xs text-white/30">
                                            Get your key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google AI Studio</a>.
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-xs uppercase tracking-wider font-bold text-white/40 mb-2 block">AI Model</label>
                                        <div className="relative">
                                            <select
                                                value={selectedModel}
                                                onChange={(e) => setSelectedModel(e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 appearance-none cursor-pointer"
                                            >
                                                <option value="gemini-2.5-flash-lite">Gemini 2.5 Flash Lite (Recommend: 10 RPM)</option>
                                                <option value="gemini-2.5-flash">Gemini 2.5 Flash (5 RPM)</option>
                                                <option value="gemini-3-flash">Gemini 3 Flash (Preview - 5 RPM)</option>
                                                <option value="gemini-1.5-flash">Gemini 1.5 Flash (Standard)</option>
                                            </select>
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-white/20 pointer-events-none">expand_more</span>
                                        </div>
                                        <p className="mt-2 text-xs text-white/30">
                                            Select a model available in your plan. 'Lite' version has the highest free quota.
                                        </p>
                                    </div>

                                    <button
                                        onClick={handleSaveGeminiKey}
                                        disabled={isSavingKey}
                                        className="w-full py-3 bg-primary text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(212,255,63,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isSavingKey ? (
                                            <span className="material-symbols-outlined animate-spin">sync</span>
                                        ) : (
                                            <span className="material-symbols-outlined">save</span>
                                        )}
                                        {isSavingKey ? 'Saving...' : 'Save Configuration'}
                                    </button>
                                </div>
                            </div>
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

            {/* Add Skill Modal */}
            {showAddSkillModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-card-dark border border-white/10 rounded-3xl p-8 w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">psychology</span>
                                Add New Skill
                            </h3>
                            <button
                                onClick={() => setShowAddSkillModal(false)}
                                className="text-white/40 hover:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-xs uppercase tracking-wider font-bold text-white/40 mb-2 block">
                                    Skill Name
                                </label>
                                <input
                                    type="text"
                                    value={newSkillName}
                                    onChange={(e) => setNewSkillName(e.target.value)}
                                    placeholder="e.g. UI/UX Design"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50"
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="text-xs uppercase tracking-wider font-bold text-white/40 mb-2 block">
                                    Proficiency Level: <span className="text-primary">{newSkillValue}%</span>
                                </label>
                                <div className="relative h-3 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-200"
                                        style={{ width: `${newSkillValue}%` }}
                                    ></div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={newSkillValue}
                                        onChange={(e) => setNewSkillValue(parseInt(e.target.value))}
                                        className="absolute inset-0 w-full opacity-0 cursor-pointer"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={addSkill}
                                disabled={!newSkillName.trim()}
                                className="w-full py-3 bg-primary text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(212,255,63,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined">add</span>
                                Add Skill
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Tool Modal */}
            {showAddToolModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-card-dark border border-white/10 rounded-3xl p-8 w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">terminal</span>
                                Add New Tool
                            </h3>
                            <button
                                onClick={() => setShowAddToolModal(false)}
                                className="text-white/40 hover:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-xs uppercase tracking-wider font-bold text-white/40 mb-2 block">
                                    Tool Name
                                </label>
                                <input
                                    type="text"
                                    value={newToolName}
                                    onChange={(e) => setNewToolName(e.target.value)}
                                    placeholder="e.g. Figma"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50"
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="text-xs uppercase tracking-wider font-bold text-white/40 mb-2 block">
                                    Icon (Material Symbol)
                                </label>
                                <div className="grid grid-cols-6 gap-2">
                                    {["code", "design_services", "view_kanban", "analytics", "cloud", "terminal", "description", "storage", "api", "psychology", "integration_instructions", "developer_mode"].map((icon) => (
                                        <button
                                            key={icon}
                                            onClick={() => setNewToolIcon(icon)}
                                            className={`aspect-square rounded-lg flex items-center justify-center transition-all ${newToolIcon === icon ? 'bg-primary text-black' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
                                        >
                                            <span className="material-symbols-outlined text-lg">{icon}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs uppercase tracking-wider font-bold text-white/40 mb-2 block">
                                    Background Color
                                </label>
                                <div className="grid grid-cols-6 gap-2">
                                    {["bg-blue-500", "bg-purple-600", "bg-pink-500", "bg-orange-500", "bg-green-500", "bg-red-500", "bg-gray-800", "bg-black", "bg-indigo-600", "bg-cyan-500", "bg-amber-500", "bg-emerald-600"].map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setNewToolColor(color)}
                                            className={`aspect-square rounded-lg ${color} transition-all ${newToolColor === color ? 'ring-2 ring-primary ring-offset-2 ring-offset-card-dark' : 'hover:opacity-80'}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 bg-black/20 rounded-xl flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-lg ${newToolColor} flex items-center justify-center text-white shadow-lg`}>
                                    <span className="material-symbols-outlined text-2xl">{newToolIcon}</span>
                                </div>
                                <div>
                                    <div className="text-xs text-white/40 uppercase tracking-wider">Preview</div>
                                    <div className="font-bold">{newToolName || "Tool Name"}</div>
                                </div>
                            </div>

                            <button
                                onClick={addTool}
                                disabled={!newToolName.trim()}
                                className="w-full py-3 bg-primary text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(212,255,63,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined">add</span>
                                Add Tool
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Media Edit Modal */}
            {editingMedia && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-card-dark border border-white/10 rounded-3xl p-8 w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">image</span>
                                Edit Highlight Details
                            </h3>
                            <button
                                onClick={() => setEditingMedia(null)}
                                className="text-white/40 hover:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs uppercase tracking-wider font-bold text-white/40 mb-2 block">
                                    Title (shown on Visual Highlights)
                                </label>
                                <input
                                    type="text"
                                    value={editingMedia.title}
                                    onChange={(e) => setEditingMedia({ ...editingMedia, title: e.target.value })}
                                    placeholder={editingMedia.name}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50"
                                />
                            </div>

                            <div>
                                <label className="text-xs uppercase tracking-wider font-bold text-white/40 mb-2 block">
                                    Subtitle (e.g. location, date)
                                </label>
                                <input
                                    type="text"
                                    value={editingMedia.subtitle}
                                    onChange={(e) => setEditingMedia({ ...editingMedia, subtitle: e.target.value })}
                                    placeholder="e.g. San Francisco, 2023"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50"
                                />
                            </div>

                            <div>
                                <label className="text-xs uppercase tracking-wider font-bold text-white/40 mb-2 block">
                                    Category
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {["Workshop", "Certification", "Keynote", "Conference", "Award", "Other"].map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setEditingMedia({ ...editingMedia, category: cat })}
                                            className={`px-3 py-2 rounded-lg font-bold text-sm transition-all ${editingMedia.category === cat ? 'bg-primary text-black' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={saveMediaEdit}
                                className="w-full py-3 bg-primary text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(212,255,63,0.4)] transition-all flex items-center justify-center gap-2 mt-4"
                            >
                                <span className="material-symbols-outlined">save</span>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
