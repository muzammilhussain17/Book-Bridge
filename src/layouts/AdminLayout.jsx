import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldAlert,
    LayoutDashboard,
    BookOpen,
    Users,
    AlertTriangle,
    BarChart3,
    Menu,
    ChevronLeft,
    LogOut,
    Bell
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { NotificationDropdown } from '../components/ui/NotificationDropdown';

const ADMIN_NAV_ITEMS = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: 'Books Approval', path: '/admin/books/approval', icon: <ShieldAlert className="w-4 h-4" /> },
    { name: 'Manage Books', path: '/admin/books', icon: <BookOpen className="w-4 h-4" /> },
    { name: 'Manage Users', path: '/admin/users', icon: <Users className="w-4 h-4" /> },
    { name: 'Violations', path: '/admin/violations', icon: <AlertTriangle className="w-4 h-4" /> },
    { name: 'System Stats', path: '/admin/stats', icon: <BarChart3 className="w-4 h-4" /> },
];

export const AdminLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
    const location = useLocation();
    const { user, logout } = useAuth();

    const initials = user?.name ? user.name.substring(0, 2).toUpperCase() : 'AD';

    const handleLogout = () => {
        logout();
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-slate-50 border-r border-slate-200">
            <div className="flex items-center justify-between h-14 px-4 border-b border-slate-200 bg-white">
                <div className={cn("flex items-center gap-2 overflow-hidden", !isSidebarOpen && "justify-center w-full")}>
                    <ShieldAlert className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <AnimatePresence>
                        {isSidebarOpen && (
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                className="text-xs font-bold text-slate-900 tracking-widest uppercase whitespace-nowrap"
                            >
                                Nexus Admin
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-1 px-3">
                {ADMIN_NAV_ITEMS.map((item) => {
                    const isActive = item.path === '/admin'
                        ? location.pathname === '/admin'
                        : location.pathname.startsWith(item.path);

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-[4px] transition-colors text-sm font-medium group relative",
                                isActive
                                    ? "text-emerald-700 bg-emerald-50"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
                                !isSidebarOpen && "justify-center px-0"
                            )}
                        >
                            <div className="flex items-center justify-center shrink-0">
                                {item.icon}
                            </div>
                            <AnimatePresence>
                                {isSidebarOpen && (
                                    <motion.span
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: "auto" }}
                                        exit={{ opacity: 0, width: 0 }}
                                        className="whitespace-nowrap"
                                    >
                                        {item.name}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>
                    );
                })}
            </div>

            <div className="p-3 border-t border-slate-200 bg-white">
                <button
                    onClick={handleLogout}
                    className={cn(
                        "flex items-center gap-3 px-3 py-2 w-full rounded-[4px] text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors text-sm font-medium",
                        !isSidebarOpen && "justify-center px-0"
                    )}
                >
                    <LogOut className="w-4 h-4 flex-shrink-0 group-hover:-translate-x-0.5 transition-transform" />
                    {isSidebarOpen && <span className="whitespace-nowrap">Terminate Session</span>}
                </button>
            </div>

            {/* Toggle button */}
            <button
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="hidden md:flex absolute top-4 -right-3 w-6 h-6 bg-white border border-slate-200 rounded-[4px] shadow-sm items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors z-20"
            >
                <ChevronLeft className={cn("w-3.5 h-3.5 transition-transform", !isSidebarOpen && "rotate-180")} />
            </button>
        </div>
    );

    return (
        <div className="flex h-[100dvh] overflow-hidden bg-white text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 240 : 64 }}
                className="hidden md:block shrink-0 h-full relative z-30"
            >
                <SidebarContent />
            </motion.aside>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-slate-900/20 z-40 md:hidden backdrop-blur-sm"
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed inset-y-0 left-0 w-[240px] z-50 md:hidden border-r border-slate-200 shadow-xl"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            <div className="flex-1 flex flex-col min-w-0 h-[100dvh] relative z-10 overflow-hidden bg-white">
                <header className="h-14 shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 z-20">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="md:hidden p-1.5 rounded-[4px] border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            <Menu className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <h1 className="text-xs font-bold text-slate-900 tracking-widest hidden sm:block uppercase">
                                {location.pathname === '/admin' ? 'System Overview' : location.pathname.split('/').pop().replace('-', ' ')}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 flex-1 justify-end">
                        <form onSubmit={(e) => { e.preventDefault(); const query = e.target.search.value; if (query) window.location.href = `/admin/books?q=${encodeURIComponent(query)}`; }} className="hidden sm:flex relative max-w-xs w-full mr-2">
                            <input
                                type="text"
                                name="search"
                                placeholder="Search system..."
                                className="w-full h-8 pl-8 pr-3 text-sm bg-slate-50 border border-slate-200 rounded-[4px] focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-2.5 top-2 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </form>
                        <NotificationDropdown />
                        <div className="relative border-l border-slate-200 pl-4">
                            <button
                                onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
                                className="w-7 h-7 rounded-[4px] bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold tracking-tighter hover:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
                            >
                                {initials}
                            </button>

                            <AnimatePresence>
                                {isProfileMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-[4px] shadow-lg border border-slate-200 overflow-hidden z-50 py-1"
                                    >
                                        <div className="px-4 py-2 border-b border-slate-100">
                                            <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || 'System Admin'}</p>
                                            <p className="text-xs text-slate-500 truncate">{user?.email || 'admin@bookbridges.edu'}</p>
                                        </div>
                                        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 w-full text-left transition-colors font-medium">
                                            <LogOut className="w-4 h-4" /> Terminate Session
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-8 relative custom-scrollbar bg-slate-50/50">
                    <div className="max-w-[1400px] mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};
