
import { Reorder, useDragControls } from "framer-motion";
import type { Doc, Id } from "../../../convex/_generated/dataModel";

interface ExperienceItemProps {
    experience: Doc<"experiences">;
    updateExperience: (id: Id<"experiences">, updates: {
        title?: string;
        company?: string;
        description?: string;
        startDate?: string;
        endDate?: string;
        present?: boolean;
        visible?: boolean
    }) => void;
    removeExperience: (id: Id<"experiences">) => void;
}

export const ExperienceItem = ({ experience, updateExperience, removeExperience }: ExperienceItemProps) => {
    const dragControls = useDragControls();

    const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
        updateExperience(experience._id, { [field]: value });
    };

    return (
        <Reorder.Item
            value={experience}
            id={experience._id}
            dragListener={false}
            dragControls={dragControls}
            className={`rounded-2xl overflow-hidden transition-all duration-300 border ${experience.visible ? 'bg-card-dark border-white/10 shadow-lg' : 'bg-black/10 border-white/5 opacity-70'}`}
        >
            <div className="p-4 flex items-start gap-4">
                {/* Drag Handle */}
                <span
                    className="material-symbols-outlined text-white/20 cursor-grab hover:text-white transition-colors touch-none mt-2"
                    onPointerDown={(e) => dragControls.start(e)}
                    style={{ cursor: 'grab' }}
                >
                    drag_indicator
                </span>

                {/* Content */}
                <div className="flex-1 space-y-3">
                    <div className="flex gap-3">
                        <div className="flex-1 space-y-2">
                            <input
                                className="bg-transparent border-b border-white/10 w-full text-white font-bold placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors pb-1"
                                value={experience.title}
                                onChange={(e) => updateExperience(experience._id, { title: e.target.value })}
                                placeholder="Job Title"
                            />
                            <input
                                className="bg-transparent border-b border-white/10 w-full text-sm text-primary placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors pb-1"
                                value={experience.company}
                                onChange={(e) => updateExperience(experience._id, { company: e.target.value })}
                                placeholder="Company Name"
                            />
                        </div>

                        {/* Controls */}
                        <div className="flex flex-col gap-2">
                            <button
                                className={`relative w-12 h-7 rounded-full cursor-pointer transition-colors duration-300 ${experience.visible ? 'bg-primary' : 'bg-white/10'}`}
                                onClick={() => updateExperience(experience._id, { visible: !experience.visible })}
                                title={experience.visible ? "Visible" : "Hidden"}
                            >
                                <div className={`absolute top-1 left-1 bg-black w-5 h-5 rounded-full shadow-sm transition-transform duration-300 ${experience.visible ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </button>
                            <button
                                onClick={() => removeExperience(experience._id)}
                                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                                title="Delete"
                            >
                                <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="flex items-center gap-3 text-sm">
                        <input
                            type="text"
                            className="bg-black/20 border border-white/10 rounded px-2 py-1 text-white/60 focus:outline-none focus:border-primary/50 w-24 text-center"
                            value={experience.startDate}
                            onChange={(e) => handleDateChange('startDate', e.target.value)}
                            placeholder="Start (YYYY)"
                        />
                        <span className="text-white/20">-</span>
                        <div className="relative">
                            <input
                                type="text"
                                className={`bg-black/20 border border-white/10 rounded px-2 py-1 text-white/60 focus:outline-none focus:border-primary/50 w-24 text-center ${experience.present ? 'opacity-50 pointer-events-none' : ''}`}
                                value={experience.present ? "Present" : (experience.endDate || "")}
                                onChange={(e) => handleDateChange('endDate', e.target.value)}
                                placeholder="End (YYYY)"
                            />
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <div className={`w-4 h-4 rounded border border-white/20 flex items-center justify-center transition-colors ${experience.present ? 'bg-primary border-primary' : 'group-hover:border-white/40'}`}>
                                {experience.present && <span className="material-symbols-outlined text-[10px] text-black font-bold">check</span>}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={experience.present}
                                onChange={(e) => updateExperience(experience._id, { present: e.target.checked })}
                            />
                            <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors">Present</span>
                        </label>
                    </div>

                    {/* Description */}
                    <textarea
                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-sm text-white/70 focus:outline-none focus:border-primary/50 min-h-[80px] resize-y font-mono leading-relaxed"
                        value={experience.description}
                        onChange={(e) => updateExperience(experience._id, { description: e.target.value })}
                        placeholder="Description of role and achievements..."
                    />
                </div>
            </div>
        </Reorder.Item>
    );
};
