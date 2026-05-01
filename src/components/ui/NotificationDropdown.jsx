import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell,
    ShieldCheck,
    CheckCircle,
    Package,
    RefreshCcw,
    X,
    Check,
    ChevronRight,
    Inbox,
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

const getIcon = (type) => {
    switch (type?.toUpperCase()) {
        case 'SYSTEM':
            return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
        case 'EXCHANGE':
            return <RefreshCcw className="w-4 h-4 text-violet-600" />;
        case 'STATUS':
            return <CheckCircle className="w-4 h-4 text-emerald-600" />;
        case 'TRANSACTION':
            return <Package className="w-4 h-4 text-amber-600" />;
        default:
            return <Bell className="w-4 h-4 text-slate-500" />;
    }
};

const getTypeBg = (type) => {
    switch (type?.toUpperCase()) {
        case 'SYSTEM': return 'bg-emerald-50 border-emerald-100';
        case 'EXCHANGE': return 'bg-violet-50 border-violet-100';
        case 'STATUS': return 'bg-emerald-50 border-emerald-100';
        case 'TRANSACTION': return 'bg-amber-50 border-amber-100';
        default: return 'bg-slate-50 border-slate-100';
    }
};

const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
};

export const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const {
        unreadCount,
        notifications,
        isLoading,
        fetchNotifications,
        markRead,
        markAllRead,
        removeNotification,
    } = useNotifications();

    // Load notifications when dropdown opens
    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen, fetchNotifications]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = (notification) => {
        if (!notification.isRead) {
            markRead(notification.id);
        }
        setIsOpen(false);
    };

    const displayedNotifications = notifications.slice(0, 6);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                id="notification-bell"
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-1.5 rounded-[4px] hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
            >
                <Bell className="w-4 h-4" />
                <AnimatePresence>
                    {unreadCount > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-rose-500 text-white text-[10px] font-bold rounded-full border-2 border-white px-1"
                        >
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </motion.span>
                    )}
                </AnimatePresence>
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 400 }}
                        className="absolute right-0 mt-2 w-[400px] max-h-[520px] bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-slate-900 tracking-tight">Notifications</h3>
                                {unreadCount > 0 && (
                                    <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-100 text-indigo-700 rounded-full">
                                        {unreadCount} new
                                    </span>
                                )}
                            </div>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllRead}
                                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
                                >
                                    <Check className="w-3 h-3" />
                                    Mark all read
                                </button>
                            )}
                        </div>

                        {/* Notification List */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {isLoading && notifications.length === 0 ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-xs text-slate-400 font-medium">Loading...</span>
                                    </div>
                                </div>
                            ) : displayedNotifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-14 px-6">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                                        <Inbox className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <p className="text-sm font-semibold text-slate-700">All caught up!</p>
                                    <p className="text-xs text-slate-400 mt-1">No notifications yet</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-50">
                                    {displayedNotifications.map((notification, index) => (
                                        <motion.div
                                            key={notification.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.04 }}
                                            className={`group relative flex gap-3 px-5 py-3.5 cursor-pointer transition-colors ${
                                                !notification.isRead
                                                    ? 'bg-indigo-50/40 hover:bg-indigo-50/70'
                                                    : 'hover:bg-slate-50'
                                            }`}
                                            onClick={() => handleNotificationClick(notification)}
                                        >
                                            {/* Unread indicator dot */}
                                            {!notification.isRead && (
                                                <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-indigo-600" />
                                            )}

                                            {/* Icon */}
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${getTypeBg(notification.type)}`}>
                                                {getIcon(notification.type)}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm leading-tight ${
                                                    !notification.isRead
                                                        ? 'font-semibold text-slate-900'
                                                        : 'font-medium text-slate-700'
                                                }`}>
                                                    {notification.title}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                                                    {notification.message}
                                                </p>
                                                <p className="text-[10px] text-slate-400 mt-1 font-medium">
                                                    {timeAgo(notification.createdAt)}
                                                </p>
                                            </div>

                                            {/* Dismiss button */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeNotification(notification.id);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 shrink-0 p-1 rounded-md hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-all"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                            <div className="border-t border-slate-100 bg-slate-50/50">
                                <Link
                                    to="/notifications"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-center gap-1.5 px-5 py-3 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50/50 transition-colors"
                                >
                                    View all notifications
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
