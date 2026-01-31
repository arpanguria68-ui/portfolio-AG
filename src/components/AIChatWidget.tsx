import { useState, useEffect, useRef } from 'react';
import { useQuery, useAction, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

// Generate or retrieve session ID
const getSessionId = () => {
    const key = 'chat_session_id';
    let sessionId = localStorage.getItem(key);
    if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem(key, sessionId);
    }
    return sessionId;
};

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

const AIChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId] = useState(getSessionId);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Convex hooks
    const chatHistory = useQuery(api.chat.getHistory, { sessionId });
    const storeMessage = useMutation(api.chat.storeMessage);
    const sendToGemini = useAction(api.chat.sendToGemini);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, isLoading]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setIsLoading(true);

        try {
            // Store user message
            await storeMessage({
                sessionId,
                role: 'user',
                content: userMessage,
            });

            // Get AI response
            await sendToGemini({
                sessionId,
                message: userMessage,
            });
        } catch (error) {
            console.error('Chat error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const messages: Message[] = (chatHistory || []).map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        timestamp: msg.timestamp,
    }));

    return (
        <>
            {/* Chat Bubble Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-10 right-56 w-14 h-14 rounded-full shadow-lg z-50 flex items-center justify-center transition-all duration-300 ${isOpen
                    ? 'bg-white/10 backdrop-blur-md border border-white/20 rotate-0'
                    : 'bg-primary text-black hover:scale-110 hover:shadow-[0_0_30px_rgba(212,255,63,0.4)]'
                    }`}
            >
                <span className="material-symbols-outlined text-2xl">
                    {isOpen ? 'close' : 'smart_toy'}
                </span>
            </button>

            {/* Chat Panel */}
            <div
                className={`fixed bottom-28 right-56 w-[380px] max-w-[calc(100vw-48px)] h-[500px] max-h-[calc(100vh-150px)] bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden transition-all duration-300 ${isOpen
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 translate-y-4 pointer-events-none'
                    }`}
            >
                {/* Header */}
                <div className="p-4 border-b border-white/10 bg-gradient-to-r from-primary/10 to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary">smart_toy</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-white">AI Assistant</h3>
                            <p className="text-xs text-white/40">Powered by Gemini</p>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 && !isLoading && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-3xl text-primary">waving_hand</span>
                            </div>
                            <p className="text-white/60 text-sm">
                                Hi! I'm the AI assistant.<br />
                                Ask me anything about this portfolio!
                            </p>
                        </div>
                    )}

                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${msg.role === 'user'
                                    ? 'bg-primary text-black rounded-br-md'
                                    : 'bg-white/10 text-white rounded-bl-md'
                                    }`}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-bl-md">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-white/10">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask me anything..."
                            disabled={isLoading}
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 disabled:opacity-50"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className="w-12 h-12 rounded-xl bg-primary text-black flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                        >
                            <span className="material-symbols-outlined">send</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AIChatWidget;
