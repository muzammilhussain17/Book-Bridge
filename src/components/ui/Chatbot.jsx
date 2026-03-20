import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiApi } from '../../services/api';
import ReactMarkdown from 'react-markdown';

export const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm the Book Bridges Assistant powered by Gemini. How can I help you navigate the platform today? You can ask me how to sell, donate, or exchange books.", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isBotTyping, setIsBotTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, isBotTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isBotTyping) return;

        const userMsg = input.trim();
        const history = messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'model', content: m.text }));
        setMessages(prev => [...prev, { id: Date.now(), text: userMsg, sender: 'user' }]);
        setInput('');
        setIsBotTyping(true);

        try {
            const res = await aiApi.chat(userMsg, history);
            const botReply = res.data?.responseText || "I'm not sure, please try again.";
            setMessages(prev => [...prev, { id: Date.now() + 1, text: botReply, sender: 'bot' }]);
        } catch {
            setMessages(prev => [...prev, { id: Date.now() + 1, text: "Sorry, I'm having trouble connecting right now. Please try again shortly.", sender: 'bot' }]);
        } finally {
            setIsBotTyping(false);
        }
    };


    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white border border-slate-200 shadow-2xl rounded-2xl w-80 sm:w-96 mb-4 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-indigo-700 text-white p-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="bg-white/20 p-1.5 rounded-full">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm leading-tight">Book Bridges Assistant</h3>
                                    <p className="text-[10px] text-indigo-200">Online | Ready to help</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 bg-slate-50 p-4 overflow-y-auto h-[350px] max-h-[60vh] overscroll-contain flex flex-col gap-3 custom-scrollbar">
                            {messages.map(msg => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={msg.id}
                                    className={`flex gap-2 max-w-[85%] shrink-0 ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-indigo-100 text-indigo-700'}`}>
                                        {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                    </div>
                                    <div className={`p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-slate-900 text-white rounded-tr-sm shadow-sm' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm'}`}>
                                        {msg.sender === 'user' ? (
                                            msg.text
                                        ) : (
                                            <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-p:mb-2 last:prose-p:mb-0 prose-strong:font-bold prose-strong:text-indigo-900 prose-ul:my-2 prose-ul:pl-4 prose-li:my-0.5">
                                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                            {isBotTyping && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="self-start flex gap-2 max-w-[85%] shrink-0">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-indigo-100 text-indigo-700">
                                        <Bot className="w-4 h-4" />
                                    </div>
                                    <div className="p-3 rounded-2xl bg-white border border-slate-200 rounded-tl-sm shadow-sm flex gap-1.5 items-center">
                                        {[0, 0.2, 0.4].map((delay, i) => (
                                            <motion.span key={i} animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay }} className="w-1.5 h-1.5 bg-indigo-400 rounded-full block" />
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} className="h-1 shrink-0" />
                        </div>

                        {/* Input Area */}
                        <div className="p-3 bg-white border-t border-slate-100 shrink-0">
                            <form onSubmit={handleSend} className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    placeholder="Type your question..."
                                    className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                />
                                <button type="submit" disabled={!input.trim()} className="bg-indigo-700 text-white w-10 h-10 rounded-full flex items-center justify-center shrink-0 hover:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm">
                                    <Send className="w-4 h-4 ml-0.5" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bubble Button Container */}
            <div className="relative flex items-center justify-end">
                {/* Floating Tooltip */}
                <AnimatePresence>
                    {!isOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: 2, duration: 0.5 }}
                            className="absolute right-20 bg-indigo-900 text-white text-xs font-semibold px-4 py-2.5 rounded-2xl rounded-br-sm shadow-lg border border-indigo-700 whitespace-nowrap z-40 hidden sm:block"
                        >
                            Need help? Chat with me!
                            {/* Triangle pointer */}
                            <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-indigo-900 border-r border-t border-indigo-700 rotate-45"></div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="relative">
                    {/* Pulsing background ring */}
                    {!isOpen && (
                        <motion.div
                            animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.6, 0, 0.6]
                            }}
                            transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute inset-0 bg-indigo-400 rounded-full z-40"
                        />
                    )}

                    {/* Main Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        animate={!isOpen ? {
                            y: [0, -4, 0]
                        } : {}}
                        transition={!isOpen ? {
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        } : {}}
                        onClick={() => setIsOpen(!isOpen)}
                        className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-colors z-50 ${isOpen ? 'bg-slate-800 text-white hover:bg-slate-900' : 'bg-indigo-700 text-white hover:bg-indigo-800'}`}
                    >
                        {isOpen ? <X className="w-7 h-7" /> : <MessageCircle className="w-7 h-7" />}

                        {/* Unread indicator dot */}
                        {!isOpen && (
                            <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 border-2 border-white rounded-full"></span>
                        )}
                    </motion.button>
                </div>
            </div>
        </div>
    );
};
