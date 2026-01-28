import React, { useState } from 'react';
import LivePreview from './LivePreview';
import { api } from '../../lib/api';

interface CaseStudyEditorProps {
    onBack: () => void;
    initialData?: any;
}

const CaseStudyEditor: React.FC<CaseStudyEditorProps> = ({ onBack, initialData }) => {
    const [title, setTitle] = useState(initialData?.title || "Reimagining User Onboarding");
    const [slug, setSlug] = useState(initialData?.slug || "user-onboarding-2024");
    const [template, setTemplate] = useState<'default' | 'ghibli' | 'glass'>('glass');
    const [isSaving, setIsSaving] = useState(false);

    const [sections, setSections] = useState([
        { id: 1, type: 'hero', title: 'Hero Section', content: 'Main headline and intro text...', collapsed: true, icon: 'web_asset', isEnabled: true },
        { id: 2, type: 'problem', title: 'The Problem', content: 'Users were dropping off significantly...', collapsed: false, icon: 'error', isEnabled: true },
        { id: 3, type: 'figma', title: 'Design System', content: 'https://figma.com/file/...', collapsed: true, icon: 'design_services', isEnabled: true },
    ]);

    const [showAddMenu, setShowAddMenu] = useState(false);

    const toggleSection = (id: number) => {
        setSections(sections.map(s => s.id === id ? { ...s, collapsed: !s.collapsed } : s));
    };

    const toggleEnable = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setSections(sections.map(s => s.id === id ? { ...s, isEnabled: !s.isEnabled } : s));
    };

    const addSection = (type: string) => {
        const icons: any = { video: 'play_circle', figma: 'design_services', miro: 'board', gallery: 'grid_view', document: 'description', text: 'article' };
        const titles: any = { video: 'Video Demo', figma: 'Figma Prototype', miro: 'Miro Board', gallery: 'Image Gallery', document: 'Project Files', text: 'New Section' };

        setSections([...sections, {
            id: Date.now(),
            type,
            title: titles[type],
            content: '',
            collapsed: false,
            icon: icons[type] || 'article',
            isEnabled: true
        }]);
        setShowAddMenu(false);
    };

    const handleFileUpload = async (sectionId: number, files: FileList | null) => {
        if (!files || files.length === 0) return;
        const file = files[0];
        try {
            const url = await api.uploadFile(file);
            setSections(sections.map(s => s.id === sectionId ? { ...s, content: url } : s));
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed");
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const projectData = {
                title,
                description: sections.map(s => s.content).join('\n\n'), // Simple aggregation for now
                year: '2024',
                tags: ['Case Study', template],
                image: 'https://placehold.co/600x400', // Placeholder
                link: `/projects/${slug}`,
                sections: sections
            };

            await api.createProject(projectData);
            alert('Project saved successfully!');
            onBack(); // Return to grid
        } catch (error) {
            console.error("Failed to save project", error);
            alert('Failed to save project');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="animate-in slide-in-from-right duration-300 w-full h-[calc(100vh-100px)] flex flex-col md:flex-row gap-6 pb-4">

            {/* Left Panel: Editor */}
            <div className="flex-1 flex flex-col bg-card-dark/50 border border-white/10 rounded-2xl overflow-hidden h-full">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/5 bg-background-dark">
                    <div className="flex items-center gap-3">
                        <button onClick={onBack} className="text-white flex size-8 shrink-0 items-center justify-center rounded-full hover:bg-white/10 transition-colors">
                            <span className="material-symbols-outlined text-xl">arrow_back_ios_new</span>
                        </button>
                        <h2 className="text-white font-bold">Edit Case Study</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            value={template}
                            onChange={(e) => setTemplate(e.target.value as any)}
                            className="bg-black/40 border border-white/10 text-xs text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary/50"
                        >
                            <option value="default">Default Theme</option>
                            <option value="ghibli">Ghibli Style</option>
                            <option value="glass">Modern Glass</option>
                        </select>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex h-8 px-4 items-center justify-center rounded-full bg-primary text-[#141811] text-xs font-bold hover:shadow-[0_0_15px_rgba(128,242,13,0.2)] transition-all disabled:opacity-50"
                        >
                            {isSaving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>

                {/* Scrollable Editor Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">

                    {/* Meta Data */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex flex-col gap-2">
                            <span className="text-white text-xs font-bold ml-1 uppercase tracking-wider opacity-60">Title</span>
                            <input
                                className="w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white focus:border-primary focus:outline-none transition-all"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </label>
                        <label className="flex flex-col gap-2">
                            <span className="text-white text-xs font-bold ml-1 uppercase tracking-wider opacity-60">Slug</span>
                            <input
                                className="w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white font-mono focus:border-primary focus:outline-none transition-all"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                            />
                        </label>
                    </div>

                    {/* Section Manager */}
                    <div className="pb-10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider opacity-60">Project Sections</h3>
                            <button className="text-[10px] font-bold text-primary uppercase hover:underline">Reorder</button>
                        </div>

                        <div className="flex flex-col gap-3">
                            {sections.map((section) => (
                                <div key={section.id} className={`group relative flex flex-col rounded-xl bg-[#141414] border transition-all duration-300 ${!section.collapsed ? 'border-primary/30 ring-1 ring-primary/20' : 'border-white/5 hover:border-white/10'} ${!section.isEnabled ? 'opacity-50' : ''}`}>
                                    {/* Header */}
                                    <div
                                        className="flex items-center gap-3 p-3 cursor-pointer select-none"
                                        onClick={() => toggleSection(section.id)}
                                    >
                                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${!section.collapsed ? 'bg-primary/20 text-primary' : 'bg-white/5 text-white/40'}`}>
                                            <span className="material-symbols-outlined text-lg">{section.icon}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-white truncate">{section.title}</span>
                                                <span className="text-[10px] uppercase font-bold text-white/20 border border-white/10 px-1.5 rounded">{section.type}</span>
                                            </div>
                                        </div>

                                        {/* Enable/Disable Toggle */}
                                        <div onClick={(e) => toggleEnable(section.id, e)} className={`relative flex h-5 w-9 cursor-pointer items-center rounded-full transition-colors ${section.isEnabled ? 'bg-primary' : 'bg-white/10'}`}>
                                            <div className={`h-3.5 w-3.5 rounded-full bg-black shadow-sm transition-transform ${section.isEnabled ? 'translate-x-[18px]' : 'translate-x-[3px]'}`}></div>
                                        </div>

                                        <span className="material-symbols-outlined text-white/20 cursor-grab active:cursor-grabbing ml-2">drag_indicator</span>
                                    </div>

                                    {/* Editor Body */}
                                    {!section.collapsed && section.isEnabled && (
                                        <div className="p-3 pt-0 animate-in slide-in-from-top-1">
                                            <div className="h-px bg-white/5 w-full mb-3"></div>

                                            {/* Logic per type */}
                                            {['hero', 'problem', 'solution', 'results', 'text'].includes(section.type) && (
                                                <>
                                                    {/* AI Toolbar */}
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex gap-1">
                                                            <button className="p-1.5 rounded hover:bg-white/10 text-white/50 hover:text-white transition-colors"><span className="material-symbols-outlined text-[16px]">format_bold</span></button>
                                                            <button className="p-1.5 rounded hover:bg-white/10 text-white/50 hover:text-white transition-colors"><span className="material-symbols-outlined text-[16px]">format_list_bulleted</span></button>
                                                            <button className="p-1.5 rounded hover:bg-white/10 text-white/50 hover:text-white transition-colors"><span className="material-symbols-outlined text-[16px]">add_link</span></button>
                                                        </div>
                                                        <button className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 text-[10px] font-bold transition-colors">
                                                            <span className="material-symbols-outlined text-[12px]">auto_awesome</span>
                                                            Enhance
                                                        </button>
                                                    </div>
                                                    <textarea
                                                        className="w-full resize-none rounded-lg bg-black/40 p-3 text-sm leading-relaxed text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-primary/50 min-h-[150px] font-sans"
                                                        defaultValue={section.content}
                                                        onChange={(e) => {
                                                            const newSections = [...sections];
                                                            const idx = newSections.findIndex(s => s.id === section.id);
                                                            newSections[idx].content = e.target.value;
                                                            setSections(newSections);
                                                        }}
                                                    />
                                                </>
                                            )}

                                            {/* Embed Inputs (Figma, Miro, Video) */}
                                            {['figma', 'miro', 'video'].includes(section.type) && (
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-xs font-bold text-white/40 uppercase">Embed URL</label>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-white/20">link</span>
                                                        <input
                                                            className="w-full rounded-lg bg-black/40 border border-white/10 py-2.5 pl-10 pr-4 text-sm text-white focus:border-primary focus:outline-none transition-all placeholder-white/20"
                                                            placeholder={`Paste ${section.type} link here...`}
                                                            value={section.content}
                                                            onChange={(e) => {
                                                                const newSections = [...sections];
                                                                const idx = newSections.findIndex(s => s.id === section.id);
                                                                newSections[idx].content = e.target.value;
                                                                setSections(newSections);
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="mt-2 rounded-lg bg-black/20 border border-white/5 aspect-video flex items-center justify-center text-white/20 text-xs">
                                                        {section.content ? "Preview Loaded" : "Preview will appear here"}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Gallery / Document Placeholders */}
                                            {['gallery', 'document'].includes(section.type) && (
                                                <label className="border border-dashed border-white/10 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors cursor-pointer">
                                                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(section.id, e.target.files)} />
                                                    {section.content ? (
                                                        <>
                                                            <span className="material-symbols-outlined text-3xl text-primary mb-2">check_circle</span>
                                                            <p className="text-sm font-bold text-white">File Uploaded</p>
                                                            <p className="text-xs text-white/40 mt-1 truncate max-w-[200px]">{section.content}</p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="material-symbols-outlined text-3xl text-white/20 mb-2">{section.type === 'gallery' ? 'add_photo_alternate' : 'upload_file'}</span>
                                                            <p className="text-sm font-bold text-white">Upload {section.type === 'gallery' ? 'Images' : 'Files'}</p>
                                                            <p className="text-xs text-white/40 mt-1">Drag & drop or click to browse</p>
                                                        </>
                                                    )}
                                                </label>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="relative mt-4">
                            {!showAddMenu ? (
                                <button
                                    onClick={() => setShowAddMenu(true)}
                                    className="w-full py-3 border border-dashed border-white/20 rounded-xl text-xs font-bold text-white/40 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-base">add_circle</span>
                                    Add Section
                                </button>
                            ) : (
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 bg-card-dark border border-white/10 rounded-xl p-2 animate-in fade-in slide-in-from-top-2">
                                    {[
                                        { id: 'text', label: 'Text Block', icon: 'article' },
                                        { id: 'video', label: 'Video Embed', icon: 'play_circle' },
                                        { id: 'figma', label: 'Figma Design', icon: 'design_services' },
                                        { id: 'miro', label: 'Miro Board', icon: 'board' },
                                        { id: 'gallery', label: 'Image Gallery', icon: 'grid_view' },
                                        { id: 'document', label: 'Files / Docs', icon: 'description' }
                                    ].map(item => (
                                        <button
                                            key={item.id}
                                            onClick={() => addSection(item.id)}
                                            className="flex flex-col items-center gap-1.5 p-3 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-primary text-xl">{item.icon}</span>
                                            <span className="text-[10px] font-bold text-white">{item.label}</span>
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setShowAddMenu(false)}
                                        className="col-span-full mt-2 py-2 text-xs text-white/40 hover:text-white"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel: Live Preview */}
            <div className="hidden md:flex flex-1 bg-black/20 rounded-2xl overflow-hidden border border-white/5 relative">
                <div className="absolute top-4 right-4 z-20 flex gap-2">
                    <div className="bg-black/60 backdrop-blur text-white/60 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 border border-white/10">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Live Preview
                    </div>
                </div>
                <LivePreview data={{ title, slug, sections }} template={template} />
            </div>
        </div>
    );
};

export default CaseStudyEditor;
