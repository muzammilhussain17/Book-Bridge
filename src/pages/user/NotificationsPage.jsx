import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Bell, ShieldCheck, HelpCircle, CheckCircle, Package } from 'lucide-react';
import { notificationApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const NotificationsPage = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            setIsLoading(true);
            const res = await notificationApi.getAll();
            setNotifications(res.data);
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchNotifications();
        }
    }, [user]);

    const handleMarkAllRead = async () => {
        try {
            await notificationApi.markAllRead();
            await fetchNotifications();
        } catch (err) {
            console.error("Failed to mark all as read", err);
        }
    };

    const handleMarkRead = async (id) => {
        try {
            await notificationApi.markRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            console.error("Failed to mark read", err);
        }
    };

    const getIcon = (type) => {
        switch (type?.toUpperCase()) {
            case 'SYSTEM': return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
            case 'TRADE': return <HelpCircle className="w-5 h-5 text-indigo-600" />;
            case 'EXCHANGE': return <HelpCircle className="w-5 h-5 text-indigo-600" />;
            case 'STATUS': return <CheckCircle className="w-5 h-5 text-emerald-600" />;
            case 'TRANSACTION': return <Package className="w-5 h-5 text-amber-600" />;
            default: return <Bell className="w-5 h-5 text-slate-600" />;
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full h-full pb-10 max-w-4xl mx-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-5">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Notifications</h2>
                    <p className="text-sm text-slate-500 mt-1">Updates on your transactions, exchanges, and account status.</p>
                </div>
                <Button variant="secondary" size="sm" onClick={handleMarkAllRead} disabled={isLoading || notifications.length === 0}>
                    Mark all as read
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-12 text-slate-500">Loading notifications...</div>
            ) : (
                <Card className="shadow-sm">
                    <CardContent className="p-0 divide-y divide-slate-100">
                        {notifications.map(notification => (
                            <div
                                key={notification.id}
                                className={`p-6 flex gap-4 transition-colors hover:bg-slate-50 ${!notification.isRead ? 'bg-indigo-50/20' : 'bg-white'}`}
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border ${!notification.isRead ? 'bg-white border-indigo-200 shadow-sm' : 'bg-slate-50 border-slate-200'}`}>
                                    {getIcon(notification.type)}
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className={`text-base tracking-tight ${!notification.isRead ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                                                {notification.title}
                                            </h4>
                                            {!notification.isRead && <span className="w-2 h-2 rounded-full bg-indigo-600"></span>}
                                        </div>
                                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-[4px] border border-slate-200">
                                            {notification.type}
                                        </span>
                                    </div>

                                    <p className={`text-sm mb-3 ${!notification.isRead ? 'text-slate-700 font-medium' : 'text-slate-600'}`}>
                                        {notification.message}
                                    </p>
                                    <p className="text-xs text-slate-400 font-medium">
                                        {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : ''}
                                    </p>
                                </div>

                                <div className="shrink-0 flex items-center">
                                    {!notification.isRead ? (
                                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => handleMarkRead(notification.id)}>Review</Button>
                                    ) : (
                                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-900" disabled>Dismissed</Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {notifications.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center py-16 px-4 bg-slate-50 border border-slate-200 border-dashed rounded-[4px]">
                    <Bell className="w-12 h-12 text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900">All caught up!</h3>
                    <p className="text-sm text-slate-500 mt-1 max-w-sm text-center">You have no new notifications right now.</p>
                </div>
            )}
        </div>
    );
};
