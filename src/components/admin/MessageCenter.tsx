import React, { useState } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

const MessageCenter = () => {
    // Convex hooks
    const messages = useQuery(api.messages.get) || [];
    const markRead = useMutation(api.messages.markRead);
    const deleteMessage = useMutation(api.messages.remove);

    const [selectedMessage, setSelectedMessage] = useState<any>(null);

    const handleDelete = async (id: any, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Delete this message?')) {
            try {
                await deleteMessage({ id });
                if (selectedMessage?._id === id) setSelectedMessage(null);
            } catch (error) {
                alert('Failed to delete');
            }
        }
    };

    const handleSelect = async (msg: any) => {
        setSelectedMessage(msg);
        if (!msg.read) {
            try {
                await markRead({ id: msg._id });
            } catch (error) {
                console.error("Failed to mark read");
            }
        }
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
    };

    return (
        <div className="flex h-full gap-6 animate-in fade-in duration-500">
            {/* List Panel */}
            <div className={`${selectedMessage ? 'hidden md:flex' : 'flex'} w-full md:w-1/3 flex-col bg-card-dark border border-white/10 rounded-2xl overflow-hidden`}>
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <h2 className="font-bold text-white">Inbox</h2>
                    <span className="text-xs font-bold px-2 py-1 rounded bg-primary text-black">
                        {(messages as any[]).filter(m => !m.read).length} New
                    </span>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-white/40">
                            <span className="material-symbols-outlined text-4xl mb-2">inbox</span>
                            <p>No messages yet</p>
                        </div>
                    ) : (
                        (messages as any[]).map((msg: any) => (
                            <div
                                key={msg._id}
                                onClick={() => handleSelect(msg)}
                                className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedMessage?._id === msg._id ? 'bg-primary/20 border-primary/50' : 'bg-black/20 border-transparent hover:bg-white/5'} relative group`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className={`font-bold ${!msg.read ? 'text-white' : 'text-white/60'}`}>{msg.name}</h4>
                                    <span className="text-[10px] text-white/40">{formatDate(msg.date)}</span>
                                </div>
                                <p className="text-sm text-white/50 truncate">{msg.message}</p>
                                {!msg.read && <div className="absolute top-4 right-2 w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(212,255,63,0.8)]"></div>}

                                <button
                                    onClick={(e) => handleDelete(msg._id, e)}
                                    className="absolute bottom-2 right-2 p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <span className="material-symbols-outlined text-sm">delete</span>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Detail Panel */}
            <div className={`${selectedMessage ? 'flex' : 'hidden md:flex'} w-full md:w-2/3 flex-col bg-black/20 border border-white/10 rounded-2xl overflow-hidden relative`}>
                {selectedMessage ? (
                    <>
                        <div className="absolute top-4 right-4 flex gap-2">
                            <button onClick={(e) => handleDelete(selectedMessage._id, e)} className="p-2 text-white/40 hover:text-red-400 transition-colors" title="Delete">
                                <span className="material-symbols-outlined">delete</span>
                            </button>
                            <button onClick={() => setSelectedMessage(null)} className="md:hidden p-2 text-white/40 hover:text-white transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="p-8 border-b border-white/5 bg-white/5">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-green-600 flex items-center justify-center text-black font-bold text-xl">
                                    {selectedMessage.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-display font-bold text-white">{selectedMessage.name}</h2>
                                    <p className="text-primary text-sm">{selectedMessage.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-white/40">
                                <span className="material-symbols-outlined text-sm">schedule</span>
                                {new Date(selectedMessage.date).toLocaleString()}
                            </div>
                        </div>

                        <div className="flex-1 p-8 overflow-y-auto">
                            <p className="text-lg text-white/80 leading-relaxed whitespace-pre-wrap font-serif">
                                {selectedMessage.message}
                            </p>

                            <div className="mt-12 pt-8 border-t border-white/10">
                                <a href={`mailto:${selectedMessage.email}`} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-primary transition-colors">
                                    <span className="material-symbols-outlined">reply</span>
                                    Reply via Email
                                </a>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-white/20">
                        <span className="material-symbols-outlined text-6xl mb-4">mark_email_unread</span>
                        <p className="text-xl font-display">Select a message to read</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessageCenter;
