import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
    Bell,
    ShieldCheck,
    CheckCircle,
    Package,
    RefreshCcw,
    Trash2,
    Check,
    Filter,
    Inbox,
    Mail,
    MailOpen,
    X,
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';

const FILTER_TABS = [
    { key: 'ALL', label: 'All', icon: Bell },
    { key: 'EXCHANGE', label: 'Exchanges', icon: RefreshCcw },
    { key: 'TRANSACTION', label: 'Transactions', icon: Package },
    { key: 'STATUS', label: 'Status', icon: CheckCircle },
    { key: 'SYSTEM', label: 'System', icon: ShieldCheck },
];

const getIcon = (type) => {
    switch (type?.toUpperCase()) {
        case 'SYSTEM':
            return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
        case 'EXCHANGE':
            return <RefreshCcw className="w-5 h-5 text-violet-600" />;
        case 'STATUS':
            return <CheckCircle className="w-5 h-5 text-emerald-600" />;
        case 'TRANSACTION':
            return <Package className="w-5 h-5 text-amber-600" />;
        default:
            return <Bell className="w-5 h-5 text-slate-500" />;
    }
};

const getTypeStyle = (type) => {
    switch (type?.toUpperCase()) {
        case 'SYSTEM': return { bg: 'bg-emerald-50', border: 'border-emerald-100', badge: 'bg-emerald-100 text-emerald-700' };
        case 'EXCHANGE': return { bg: 'bg-violet-50', border: 'border-violet-100', badge: 'bg-violet-100 text-violet-700' };
        case 'STATUS': return { bg: 'bg-emerald-50', border: 'border-emerald-100', badge: 'bg-emerald-100 text-emerald-700' };
        case 'TRANSACTION': return { bg: 'bg-amber-50', border: 'border-amber-100', badge: 'bg-amber-100 text-amber-700' };
        default: return { bg: 'bg-slate-50', border: 'border-slate-100', badge: 'bg-slate-100 text-slate-700' };
    }
};

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const NotificationsPage = () => {
    const { user } = useAuth();
    const {
        notifications,
        isLoading,
        fetchNotifications,
        markRead,
        markAllRead,
        removeNotification,
        unreadCount,
    } = useNotifications();

    const [activeFilter, setActiveFilter] = useState('ALL');
    const [readFilter, setReadFilter] = useState('ALL'); // ALL | UNREAD | READ

    useEffect(() => {
        if (user) {
            fetchNotifications();
        }
    }, [user, fetchNotifications]);

    const filteredNotifications = notifications.filter(n => {
        const typeMatch = activeFilter === 'ALL' || n.type?.toUpperCase() === activeFilter;
        const readMatch = readFilter === 'ALL'
            || (readFilter === 'UNREAD' && !n.isRead)
            || (readFilter === 'READ' && n.isRead);
        return typeMatch && readMatch;
    });

    return (
        <div className="flex flex-col gap-6 w-full h-full pb-10 max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                            <Bell className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Notifications</h2>
                            <p className="text-sm text-slate-500 mt-0.5">
                                {unreadCount > 0
                                    ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                                    : 'All caught up!'}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={markAllRead}
                        disabled={isLoading || unreadCount === 0}
                        className="flex items-center gap-1.5"
                    >
                        <Check className="w-3.5 h-3.5" />
                        Mark all read
                    </Button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
                <div className="flex items-center gap-1 flex-wrap bg-slate-50 p-1 rounded-lg border border-slate-200">
                    {FILTER_TABS.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeFilter === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveFilter(tab.key)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                                    isActive
                                        ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                                        : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                                }`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
                    {[
                        { key: 'ALL', label: 'All', icon: Filter },
                        { key: 'UNREAD', label: 'Unread', icon: Mail },
                        { key: 'READ', label: 'Read', icon: MailOpen },
                    ].map(tab => {
                        const Icon = tab.icon;
                        const isActive = readFilter === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setReadFilter(tab.key)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                                    isActive
                                        ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                                        : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                                }`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Notification Count */}
            <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-400 tracking-wide">
                    {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
                </p>
            </div>

            {/* Notification List */}
            {isLoading && notifications.length === 0 ? (
                <div className="flex justify-center py-16">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm text-slate-400 font-medium">Loading notifications...</span>
                    </div>
                </div>
            ) : filteredNotifications.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-20 px-4 bg-slate-50 border border-slate-200 border-dashed rounded-xl"
                >
                    <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-4 shadow-sm">
                        <Inbox className="w-7 h-7 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">
                        {activeFilter !== 'ALL' || readFilter !== 'ALL' ? 'No matching notifications' : 'All caught up!'}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1.5 max-w-sm text-center">
                        {activeFilter !== 'ALL' || readFilter !== 'ALL'
                            ? 'Try adjusting your filters to see more notifications.'
                            : 'You have no notifications right now. New ones will appear here.'}
                    </p>
                    {(activeFilter !== 'ALL' || readFilter !== 'ALL') && (
                        <Button
                            variant="secondary"
                            size="sm"
                            className="mt-4"
                            onClick={() => { setActiveFilter('ALL'); setReadFilter('ALL'); }}
                        >
                            Clear filters
                        </Button>
                    )}
                </motion.div>
            ) : (
                <Card className="shadow-sm overflow-hidden">
                    <CardContent className="p-0">
                        <AnimatePresence mode="popLayout">
                            {filteredNotifications.map((notification, index) => {
                                const style = getTypeStyle(notification.type);
                                return (
                                    <motion.div
                                        key={notification.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0, padding: 0 }}
                                        transition={{
                                            delay: index * 0.03,
                                            exit: { duration: 0.2 },
                                        }}
                                        className={`group flex gap-4 p-5 border-b border-slate-100 last:border-b-0 transition-colors ${
                                            !notification.isRead
                                                ? 'bg-indigo-50/30 hover:bg-indigo-50/50'
                                                : 'bg-white hover:bg-slate-50/80'
                                        }`}
                                    >
                                        {/* Icon */}
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${style.bg} ${style.border}`}>
                                            {getIcon(notification.type)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-3 mb-1">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <h4 className={`text-sm tracking-tight truncate ${
                                                        !notification.isRead
                                                            ? 'font-bold text-slate-900'
                                                            : 'font-semibold text-slate-700'
                                                    }`}>
                                                        {notification.title}
                                                    </h4>
                                                    {!notification.isRead && (
                                                        <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                                                    )}
                                                </div>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${style.badge}`}>
                                                    {notification.type || 'GENERAL'}
                                                </span>
                                            </div>

                                            <p className={`text-sm mb-2 leading-relaxed ${
                                                !notification.isRead ? 'text-slate-700' : 'text-slate-500'
                                            }`}>
                                                {notification.message}
                                            </p>

                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-slate-400 font-medium">
                                                    {formatDate(notification.createdAt)}
                                                </span>

                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {!notification.isRead && (
                                                        <button
                                                            onClick={() => markRead(notification.id)}
                                                            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                                                            title="Mark as read"
                                                        >
                                                            <Check className="w-3.5 h-3.5" />
                                                            Read
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => removeNotification(notification.id)}
                                                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-500 hover:bg-rose-50 rounded-md transition-colors"
                                                        title="Delete notification"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </CardContent>
                </Card>
            )}

            {/* Email Notification Info */}
            <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-indigo-50/80 to-violet-50/80 rounded-xl border border-indigo-100">
                <div className="w-9 h-9 rounded-lg bg-white border border-indigo-100 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-slate-800">Email Notifications</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        Important notifications are also sent to your email address. You'll receive emails for exchange proposals, 
                        transaction updates, and book approval status changes.
                    </p>
                </div>
            </div>
        </div>
    );
};
