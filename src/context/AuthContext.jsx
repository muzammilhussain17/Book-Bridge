import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('bb_token');
        if (token) {
            // Validate token by fetching current user
            authApi.me()
                .then((res) => setUser(res.data))
                .catch(() => {
                    localStorage.removeItem('bb_token');
                    localStorage.removeItem('bb_user');
                })
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const res = await authApi.login({ email, password });
        const { token, user: userData } = res.data;
        localStorage.setItem('bb_token', token);
        localStorage.setItem('bb_user', JSON.stringify(userData));
        setUser(userData);
        return userData;
    };

    const register = async (name, email, password) => {
        await authApi.register({ name, email, password });
        // Removed auto-login logic to force user to explicitly log in.
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch (_) {
            // Token may already be invalid, proceed with local logout
        } finally {
            localStorage.removeItem('bb_token');
            localStorage.removeItem('bb_user');
            setUser(null);
        }
    };

    const updateProfile = (data) => {
        if (user) {
            const updatedUser = { ...user, ...data };
            setUser(updatedUser);
            localStorage.setItem('bb_user', JSON.stringify(updatedUser));
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile }}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};
