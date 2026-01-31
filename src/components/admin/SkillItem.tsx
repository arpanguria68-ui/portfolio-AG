import { Reorder, useDragControls } from "framer-motion";
import type { Doc, Id } from "../../../convex/_generated/dataModel";

interface SkillItemProps {
    skill: Doc<"skills">;
    handleSkillChange: (id: Id<"skills">, value: number) => void;
    toggleSkillVisibility: (id: Id<"skills">, visible: boolean) => void;
    removeSkill: (id: Id<"skills">) => void;
}

export const SkillItem = ({ skill, handleSkillChange, toggleSkillVisibility, removeSkill }: SkillItemProps) => {
    const dragControls = useDragControls();

    return (
        <Reorder.Item
            value={skill}
            id={skill._id}
            dragListener={false}
            dragControls={dragControls}
            className={`bg-black/20 rounded-2xl p-4 border transition-all ${skill.visible ? 'border-white/10' : 'border-white/5 opacity-60'}`}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <span
                        className="material-symbols-outlined text-white/20 cursor-grab hover:text-white transition-colors touch-none"
                        onPointerDown={(e) => dragControls.start(e)}
                        style={{ cursor: 'grab' }}
                    >
                        drag_indicator
                    </span>
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
        </Reorder.Item>
    );
};
