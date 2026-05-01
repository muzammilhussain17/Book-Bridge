import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// --- Axios Instance ---
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: inject JWT token on every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('bb_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

// Response interceptor: clear token if 401 Unauthorized
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('bb_token');
            localStorage.removeItem('bb_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ─────────────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────────────
export const authApi = {
    login: (data) => api.post('/api/auth/login', data),
    register: (data) => api.post('/api/auth/register', data),
    me: () => api.get('/api/auth/me'),
    logout: () => api.post('/api/auth/logout'),
};

// ─────────────────────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────────────────────
export const userApi = {
    getProfile: () => api.get('/api/users/profile'),
    updateProfile: (data) => api.put('/api/users/profile', data),
    changePassword: (data) => api.put('/api/users/security/password', data),
    getPublicProfile: (id) => api.get(`/api/users/${id}`),
    getRatings: (id) => api.get(`/api/ratings/user/${id}`),
    getAvgRating: (id) => api.get(`/api/ratings/user/${id}/average`),
};

// ─────────────────────────────────────────────────────────────
// BOOKS
// ─────────────────────────────────────────────────────────────
export const bookApi = {
    getAll: (params) => api.get('/api/books', { params }),
    getById: (id) => api.get(`/api/books/${id}`),
    getMyListings: () => api.get('/api/books/my-listings'),
    create: (data) => api.post('/api/books', data),
    update: (id, data) => api.put(`/api/books/${id}`, data),
    remove: (id) => api.delete(`/api/books/${id}`),
    uploadImages: (formData) => api.post('/api/books/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
};

// ─────────────────────────────────────────────────────────────
// TRANSACTIONS
// ─────────────────────────────────────────────────────────────
export const transactionApi = {
    checkout: (data) => api.post('/api/transactions/checkout', data),
    getPurchases: (params) => api.get('/api/transactions/purchases', { params }),
    getSales: (params) => api.get('/api/transactions/sales', { params }),
    getById: (id) => api.get(`/api/transactions/${id}`),
    updateStatus: (id, status) => api.put(`/api/transactions/${id}/status`, { status }),
};

// ─────────────────────────────────────────────────────────────
// EXCHANGES
// ─────────────────────────────────────────────────────────────
export const exchangeApi = {
    propose: (data) => api.post('/api/exchanges/propose', data),
    getAll: () => api.get('/api/exchanges'),
    getById: (id) => api.get(`/api/exchanges/${id}`),
    accept: (id) => api.post(`/api/exchanges/${id}/accept`),
    reject: (id) => api.post(`/api/exchanges/${id}/reject`),
};

// ─────────────────────────────────────────────────────────────
// MESSAGES
// ─────────────────────────────────────────────────────────────
export const messageApi = {
    getConversations: () => api.get('/api/messages/conversations'),
    getMessages: (conversationId) => api.get(`/api/messages/${conversationId}`),
    sendMessage: (conversationId, content) => api.post(`/api/messages/${conversationId}`, { content }),
};

// ─────────────────────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────────────────────
export const notificationApi = {
    getAll: () => api.get('/api/notifications'),
    getUnreadCount: () => api.get('/api/notifications/unread-count'),
    markRead: (id) => api.put(`/api/notifications/${id}/read`),
    markAllRead: () => api.post('/api/notifications/read-all'),
    remove: (id) => api.delete(`/api/notifications/${id}`),
};

// ─────────────────────────────────────────────────────────────
// RATINGS
// ─────────────────────────────────────────────────────────────
export const ratingApi = {
    submit: (data) => api.post('/api/ratings', data),
};

// ─────────────────────────────────────────────────────────────
// ADMIN
// ─────────────────────────────────────────────────────────────
export const adminApi = {
    // Users
    listUsers: (params) => api.get('/api/admin/users', { params }),
    getUserDetail: (id) => api.get(`/api/admin/users/${id}`),
    suspendUser: (id) => api.post(`/api/admin/users/${id}/suspend`),
    strikeUser: (id) => api.post(`/api/admin/users/${id}/strike`),
    // Books
    getQuarantine: (params) => api.get('/api/admin/books/quarantine', { params }),
    approveBook: (id) => api.post(`/api/admin/books/${id}/approve`),
    rejectBook: (id) => api.post(`/api/admin/books/${id}/reject`),
    // System
    getStats: () => api.get('/api/admin/system/stats'),
    getViolations: (params) => api.get('/api/admin/system/violations', { params }),
};

// ─────────────────────────────────────────────────────────────
// AI CHATBOT
// ─────────────────────────────────────────────────────────────
export const aiApi = {
    chat: (message, history) => api.post('/api/ai/chat', { message, history }),
};

export default api;
