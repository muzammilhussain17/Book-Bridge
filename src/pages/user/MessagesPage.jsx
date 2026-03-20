import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Search, Send, User, Reply, Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';
import { messageApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const MessagesPage = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoadingConv, setIsLoadingConv] = useState(true);
    const [isLoadingMsgs, setIsLoadingMsgs] = useState(false);

    const messagesEndRef = useRef(null);

    // Fetch conversations
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                setIsLoadingConv(true);
                const res = await messageApi.getConversations();
                setConversations(res.data);
                if (res.data.length > 0 && !activeId) {
                    setActiveId(res.data[0].id);
                }
            } catch (err) {
                console.error("Failed to fetch conversations", err);
            } finally {
                setIsLoadingConv(false);
            }
        };
        fetchConversations();
    }, []);

    // Fetch messages for active conversation
    useEffect(() => {
        const fetchMessages = async () => {
            if (!activeId) return;
            try {
                setIsLoadingMsgs(true);
                const res = await messageApi.getMessages(activeId);
                setMessages(res.data);
                // Fire and forget mark read
                messageApi.markRead(activeId).catch(console.error);
            } catch (err) {
                console.error("Failed to fetch messages", err);
            } finally {
                setIsLoadingMsgs(false);
                scrollToBottom();
            }
        };
        fetchMessages();
    }, [activeId]);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !activeId) return;
        try {
            const res = await messageApi.sendMessage(activeId, newMessage);
            setMessages(prev => [...prev, res.data]);
            setNewMessage('');
            scrollToBottom();
        } catch (err) {
            console.error("Failed to send message", err);
            alert("Could not send message");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const activeConv = conversations.find(c => c.id === activeId);

    return (
        <div className="flex flex-col gap-6 w-full h-[calc(100vh-140px)] min-h-[500px]">
            <div className="border-b border-slate-200 pb-5 shrink-0">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Messages</h2>
                <p className="text-sm text-slate-500 mt-1">Communicate securely with other students on the network.</p>
            </div>

            <Card className="shadow-sm flex-1 flex overflow-hidden">
                {/* Contacts Sidebar */}
                <div className="w-1/3 md:w-80 border-r border-slate-200 flex flex-col bg-white shrink-0">
                    <div className="p-4 border-b border-slate-200">
                        <Input
                            placeholder="Search messages..."
                            leftIcon={<Search className="w-4 h-4" />}
                            className="bg-slate-50"
                        />
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {isLoadingConv ? (
                            <div className="p-6 text-center text-slate-400 text-sm">Loading conversations...</div>
                        ) : conversations.length === 0 ? (
                            <div className="p-6 text-center text-slate-400 text-sm">No conversations yet</div>
                        ) : (
                            conversations.map(conv => {
                                const initials = conv.otherUserName ? conv.otherUserName.substring(0, 2).toUpperCase() : '??';
                                const isActive = activeId === conv.id;
                                return (
                                    <div
                                        key={conv.id}
                                        onClick={() => setActiveId(conv.id)}
                                        className={`p-4 border-b border-slate-100 cursor-pointer transition-colors flex items-start gap-3 ${isActive ? 'bg-indigo-50/50' : 'hover:bg-slate-50'}`}
                                    >
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 bg-slate-200 text-slate-700">
                                            {initials}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h4 className="text-sm font-semibold text-slate-700 tracking-tight truncate">
                                                    {conv.otherUserName}
                                                </h4>
                                                <span className="text-xs text-slate-400 shrink-0 ml-2">
                                                    {conv.createdAt ? new Date(conv.createdAt).toLocaleDateString() : ''}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 truncate">
                                                Click to view history
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-slate-50/50">
                    {!activeId ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                            <Inbox className="w-12 h-12 mb-4 text-slate-300" />
                            <p>Select a conversation to start messaging</p>
                        </div>
                    ) : (
                        <>
                            {/* Chat Header */}
                            <div className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 bg-slate-200 text-slate-700">
                                        {activeConv?.otherUserName ? activeConv.otherUserName.substring(0, 2).toUpperCase() : '??'}
                                    </div>
                                    <h3 className="font-bold text-slate-900 tracking-tight">{activeConv?.otherUserName}</h3>
                                </div>
                                <Link to={`/admin/users/${activeConv?.otherUserId}`}>
                                    <Button variant="secondary" size="sm" leftIcon={<User className="w-4 h-4" />}>
                                        View Profile
                                    </Button>
                                </Link>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col custom-scrollbar">
                                {isLoadingMsgs ? (
                                    <div className="text-center text-slate-400 text-sm">Loading messages...</div>
                                ) : messages.length === 0 ? (
                                    <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
                                        No messages yet. Say hello!
                                    </div>
                                ) : (
                                    messages.map((msg, idx) => {
                                        const isMe = user && msg.senderId === user.id;
                                        return isMe ? (
                                            <div key={msg.id} className="flex gap-3 max-w-[80%] ml-auto flex-row-reverse">
                                                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs text-white shrink-0">
                                                    ME
                                                </div>
                                                <div className="bg-indigo-600 border border-indigo-700 p-4 rounded-xl rounded-tr-none shadow-sm text-left">
                                                    <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                                    <span className="text-[10px] text-indigo-200 font-medium text-right block mt-2">
                                                        {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div key={msg.id} className="flex gap-3 max-w-[80%]">
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 bg-slate-200 text-slate-700">
                                                    {msg.senderName ? msg.senderName.substring(0, 2).toUpperCase() : '??'}
                                                </div>
                                                <div className="bg-white border border-slate-200 p-4 rounded-xl rounded-tl-none shadow-sm text-left">
                                                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                                    <span className="text-[10px] text-slate-400 font-medium block mt-2">
                                                        {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Chat Input */}
                            <div className="p-4 bg-white border-t border-slate-200 shrink-0">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Type a secure message..."
                                        className="bg-slate-50 flex-1"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                    />
                                    <Button
                                        className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white"
                                        size="icon"
                                        onClick={handleSendMessage}
                                        disabled={!newMessage.trim()}
                                    >
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </div>
                                <p className="text-xs text-slate-400 text-center mt-3 flex items-center justify-center gap-1 font-medium">
                                    <Reply className="w-3.5 h-3.5" /> Direct messages are encrypted and secure.
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </Card>
        </div>
    );
};
