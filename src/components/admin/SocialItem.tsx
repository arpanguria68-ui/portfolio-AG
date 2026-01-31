import { Reorder, useDragControls } from "framer-motion";
import type { Doc, Id } from "../../../convex/_generated/dataModel";

interface SocialItemProps {
    social: Doc<"socialLinks">;
    updateSocialHandle: (id: Id<"socialLinks">, handle: string) => void;
    toggleSocialVisibility: (id: Id<"socialLinks">, visible: boolean) => void;
    removeSocial: (id: Id<"socialLinks">) => void;
}

export const SocialItem = ({ social, updateSocialHandle, toggleSocialVisibility, removeSocial }: SocialItemProps) => {
    const dragControls = useDragControls();

    return (
        <Reorder.Item
            value={social}
            id={social._id}
            dragListener={false}
            dragControls={dragControls}
            className={`rounded-2xl overflow-hidden transition-all duration-300 border ${social.visible ? 'bg-card-dark border-white/10 shadow-lg' : 'bg-black/10 border-white/5 opacity-70'}`}
        >
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span
                        className="material-symbols-outlined text-white/20 cursor-grab hover:text-white transition-colors touch-none"
                        onPointerDown={(e) => dragControls.start(e)}
                        style={{ cursor: 'grab' }}
                    >
                        drag_indicator
                    </span>
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full shadow-inner ${social.bgColor} ${social.color}`}>
                        <span className="material-symbols-outlined text-xl">{social.icon}</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-sm text-white leading-tight">{social.platform}</h3>
                        <p className="text-[10px] text-white/40 uppercase tracking-wider">Social Profile</p>
                    </div>
                </div>

                <button
                    className={`relative w-12 h-7 rounded-full cursor-pointer transition-colors duration-300 ${social.visible ? 'bg-primary' : 'bg-white/10'}`}
                    onClick={() => toggleSocialVisibility(social._id, social.visible)}
                >
                    <div className={`absolute top-1 left-1 bg-black w-5 h-5 rounded-full shadow-sm transition-transform duration-300 ${social.visible ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </button>
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
        </Reorder.Item>
    );
};
