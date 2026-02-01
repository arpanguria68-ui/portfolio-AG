import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

const ChatHistoryCenter = () => {
    const sessions = useQuery(api.analytics.getChatSessions) || [];
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

    // Fetch messages for selected session
    const messages = useQuery(api.analytics.getChatMessages,
        selectedSessionId ? { sessionId: selectedSessionId } : "skip"
    );

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleString();
    };

    return (
        <div className="flex h-full gap-6 animate-in fade-in duration-500">
            {/* List Panel */}
            <div className={`${selectedSessionId ? 'hidden md:flex' : 'flex'} w-full md:w-1/3 flex-col bg-card-dark border border-white/10 rounded-2xl overflow-hidden`}>
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <h2 className="font-bold text-white">Chat Sessions</h2>
                    <span className="text-xs font-bold px-2 py-1 rounded bg-primary text-black">
                        {sessions.length} Total
                    </span>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                    {sessions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-white/40">
                            <span className="material-symbols-outlined text-4xl mb-2">forum</span>
                            <p>No chat history available.</p>
                        </div>
                    ) : (
                        sessions.map((session: any) => (
                            <div
                                key={session._id}
                                onClick={() => setSelectedSessionId(session.sessionId)}
                                className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedSessionId === session.sessionId ? 'bg-primary/20 border-primary/50' : 'bg-black/20 border-transparent hover:bg-white/5'} relative group`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-white truncate max-w-[150px]">Session {session.sessionId.slice(0, 8)}...</h4>
                                    <span className="text-[10px] text-white/40">{formatDate(session.lastMessageAt)}</span>
                                </div>
                                <p className="text-xs text-white/50">Started: {formatDate(session.createdAt)}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Transcript Panel */}
            <div className={`${selectedSessionId ? 'flex' : 'hidden md:flex'} w-full md:w-2/3 flex-col bg-black/20 border border-white/10 rounded-2xl overflow-hidden relative`}>
                {selectedSessionId ? (
                    <>
                        <div className="absolute top-4 right-4 md:hidden">
                            <button onClick={() => setSelectedSessionId(null)} className="p-2 text-white/40 hover:text-white transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-display font-bold text-white">Transcript</h2>
                                <p className="text-xs text-white/40 font-mono">{selectedSessionId}</p>
                            </div>
                        </div>

                        <div className="flex-1 p-6 overflow-y-auto space-y-4">
                            {!messages ? (
                                <div className="text-white/40 text-center">Loading transcript...</div>
                            ) : messages.length === 0 ? (
                                <div className="text-white/40 text-center">No messages in this session.</div>
                            ) : (
                                messages.map((msg: any) => (
                                    <div key={msg._id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user'
                                                ? 'bg-primary text-black rounded-tr-none'
                                                : 'bg-white/10 text-white rounded-tl-none'
                                            }`}>
                                            <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                                            <p className={`text-[10px] mt-2 ${msg.role === 'user' ? 'text-black/50' : 'text-white/30'}`}>
                                                {new Date(msg.timestamp).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-white/20">
                        <span className="material-symbols-outlined text-6xl mb-4">smart_toy</span>
                        <p className="text-xl font-display">Select a session to view transcript</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatHistoryCenter;
