import { useState, useEffect, useRef } from 'react';
import { useQuery, useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';

const SESSION_STORAGE_KEY = 'chat_session_id';

const getSessionId = () => {
    let sessionId = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
        localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
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
    const [honeypot, setHoneypot] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [sessionId] = useState(getSessionId);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const chatLimits = useQuery(api.chat.getLimits);
    const sessionStatus = useQuery(api.chat.getSessionStatus, { sessionId });
    const chatHistory = useQuery(api.chat.getHistory, { sessionId });
    const sendMessage = useAction(api.chat.sendMessage);

    const maxMessageLength = chatLimits?.maxMessageLength ?? 500;

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, isLoading]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        if (sessionStatus && !sessionStatus.allowed && sessionStatus.retryAfterMs > 0) {
            setErrorMessage('Please wait before sending another message.');
            return;
        }

        const userMessage = input.trim();
        setInput('');
        setIsLoading(true);
        setErrorMessage(null);

        try {
            await sendMessage({
                sessionId,
                content: userMessage,
                website: honeypot,
            });
        } catch (error) {
            console.error('Chat error:', error);
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : 'Failed to send message. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
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
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-5 right-[9.5rem] sm:bottom-8 sm:right-8 md:bottom-10 md:right-24 lg:right-56 w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg z-50 flex items-center justify-center transition-all duration-300 ${isOpen
                    ? 'bg-white/10 backdrop-blur-md border border-white/20 rotate-0'
                    : 'bg-primary text-black hover:scale-110 hover:shadow-[0_0_30px_rgba(212,255,63,0.4)]'
                    }`}
                aria-label={isOpen ? 'Close chat' : 'Open chat'}
            >
                <span className="material-symbols-outlined text-2xl">
                    {isOpen ? 'close' : 'smart_toy'}
                </span>
            </button>

            <div
                className={`fixed z-50 flex flex-col overflow-hidden transition-all duration-300
                    inset-x-4 bottom-[5.5rem] h-[min(70dvh,500px)] max-h-[min(70dvh,500px)]
                    sm:inset-x-auto sm:right-8 sm:bottom-28 sm:w-[380px] sm:h-[500px] sm:max-h-[calc(100dvh-150px)]
                    md:right-24 lg:right-56
                    bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl
                    ${isOpen
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 translate-y-4 pointer-events-none'
                    }`}
            >
                <div className="p-4 border-b border-white/10 bg-gradient-to-r from-primary/10 to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary">smart_toy</span>
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-bold text-white">AI Assistant</h3>
                            <p className="text-xs text-white/40">
                                Powered by Gemini
                                {sessionStatus && (
                                    <span className="text-white/25">
                                        {' '}· {sessionStatus.hourlyRemaining}/hr left
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>

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
                            key={`${msg.timestamp}-${index}`}
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

                <div className="p-4 border-t border-white/10">
                    {errorMessage && (
                        <p className="mb-3 text-xs text-red-400" role="alert">
                            {errorMessage}
                        </p>
                    )}
                    <input
                        type="text"
                        name="website"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                        className="hidden"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                    />
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask me anything..."
                            disabled={isLoading}
                            maxLength={maxMessageLength}
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 disabled:opacity-50"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className="w-12 h-12 rounded-xl bg-primary text-black flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                            aria-label="Send message"
                        >
                            <span className="material-symbols-outlined">send</span>
                        </button>
                    </div>
                    <p className="mt-2 text-[10px] text-white/25 text-right">
                        {input.length}/{maxMessageLength}
                    </p>
                </div>
            </div>
        </>
    );
};

export default AIChatWidget;
