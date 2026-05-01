import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { notificationApi } from '../services/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

const POLL_INTERVAL = 30000; // 30 seconds

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const intervalRef = useRef(null);

    const fetchUnreadCount = useCallback(async () => {
        if (!user) return;
        try {
            const res = await notificationApi.getUnreadCount();
            setUnreadCount(res.data.count);
        } catch (err) {
            console.error('Failed to fetch unread count', err);
        }
    }, [user]);

    const fetchNotifications = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const res = await notificationApi.getAll();
            setNotifications(res.data);
            const unread = res.data.filter(n => !n.isRead).length;
            setUnreadCount(unread);
        } catch (err) {
            console.error('Failed to fetch notifications', err);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    const markRead = useCallback(async (id) => {
        try {
            await notificationApi.markRead(id);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Failed to mark notification as read', err);
        }
    }, []);

    const markAllRead = useCallback(async () => {
        try {
            await notificationApi.markAllRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error('Failed to mark all as read', err);
        }
    }, []);

    const removeNotification = useCallback(async (id) => {
        try {
            const notification = notifications.find(n => n.id === id);
            await notificationApi.remove(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
            if (notification && !notification.isRead) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (err) {
            console.error('Failed to remove notification', err);
        }
    }, [notifications]);

    // Start polling when user is logged in
    useEffect(() => {
        if (user) {
            fetchUnreadCount();
            intervalRef.current = setInterval(fetchUnreadCount, POLL_INTERVAL);
        } else {
            setUnreadCount(0);
            setNotifications([]);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [user, fetchUnreadCount]);

    return (
        <NotificationContext.Provider value={{
            unreadCount,
            notifications,
            isLoading,
            fetchNotifications,
            fetchUnreadCount,
            markRead,
            markAllRead,
            removeNotification,
        }}>
            {children}
        </NotificationContext.Provider>
    );
};
