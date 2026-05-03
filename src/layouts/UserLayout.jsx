import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    LayoutDashboard,
    Library,
    RefreshCcw,
    ShoppingBag,
    Star,
    MessageSquare,
    Bell,
    User,
    Settings,
    Menu,
    LogOut,
    ChevronLeft
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { NotificationDropdown } from '../components/ui/NotificationDropdown';

const USER_NAV_ITEMS = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: 'Browse Books', path: '/books', icon: <Library className="w-4 h-4" /> },
    { name: 'My Listings', path: '/my-listings', icon: <BookOpen className="w-4 h-4" /> },
    { name: 'Exchanges', path: '/exchanges', icon: <RefreshCcw className="w-4 h-4" /> },
    { name: 'Purchases', path: '/purchases', icon: <ShoppingBag className="w-4 h-4" /> },
    { name: 'Messages', path: '/messages', icon: <MessageSquare className="w-4 h-4" /> },
    { name: 'Ratings', path: '/ratings', icon: <Star className="w-4 h-4" /> },
];

const USER_SETTINGS_ITEMS = [
    { name: 'Profile', path: '/profile', icon: <User className="w-4 h-4" /> },
    { name: 'Security', path: '/security', icon: <Settings className="w-4 h-4" /> },
];

export const UserLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
    const location = useLocation();
    const { user, logout } = useAuth();

    // Fallback if user is somehow null but reached here
    const initials = user?.name ? user.name.substring(0, 2).toUpperCase() : 'US';

    const handleLogout = () => {
        logout();
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-slate-50 border-r border-slate-200">
            <div className="flex items-center justify-between h-14 px-4 border-b border-slate-200 text-slate-900 bg-white">
                <Link to="/dashboard" className={cn("flex items-center gap-2 overflow-hidden", !isSidebarOpen && "justify-center w-full")}>
                    <div className="p-1.5 rounded-[4px] bg-indigo-50 border border-indigo-100 shrink-0">
                        <BookOpen className="w-4 h-4 text-indigo-700" />
                    </div>
                    <AnimatePresence>
                        {isSidebarOpen && (
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                className="text-sm font-bold tracking-tight whitespace-nowrap"
                            >
                                Book Bridges
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto py-5 flex flex-col gap-1 px-3 custom-scrollbar">
                {USER_NAV_ITEMS.map((item) => {
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-[4px] transition-colors group relative",
                                isActive
                                    ? "text-indigo-700 bg-indigo-50 font-medium"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium",
                                !isSidebarOpen && "justify-center px-0"
                            )}
                        >
                            <div className={cn("flex items-center justify-center shrink-0")}>
                                {item.icon}
                            </div>
                            <AnimatePresence>
                                {isSidebarOpen && (
                                    <motion.span
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: "auto" }}
                                        exit={{ opacity: 0, width: 0 }}
                                        className="whitespace-nowrap text-sm"
                                    >
                                        {item.name}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>
                    );
                })}

                <div className="mt-8 mb-2">
                    {isSidebarOpen && <p className="px-3 text-xs font-semibold text-slate-400 tracking-wider">Settings</p>}
                </div>
                {USER_SETTINGS_ITEMS.map((item) => {
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-[4px] transition-colors group relative",
                                isActive
                                    ? "text-indigo-700 bg-indigo-50 font-medium"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium",
                                !isSidebarOpen && "justify-center px-0"
                            )}
                        >
                            <div className={cn("flex items-center justify-center shrink-0")}>
                                {item.icon}
                            </div>
                            <AnimatePresence>
                                {isSidebarOpen && (
                                    <motion.span
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: "auto" }}
                                        exit={{ opacity: 0, width: 0 }}
                                        className="whitespace-nowrap text-sm"
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
                        "flex items-center gap-3 px-3 py-2 w-full rounded-[4px] text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors font-medium group",
                        !isSidebarOpen && "justify-center px-0"
                    )}
                >
                    <LogOut className="w-4 h-4 flex-shrink-0 group-hover:-translate-x-0.5 transition-transform" />
                    {isSidebarOpen && <span className="whitespace-nowrap text-sm">Sign out</span>}
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
        <div className="flex h-[100dvh] overflow-hidden bg-white text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
            {/* Desktop Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 240 : 64 }}
                className="hidden md:block shrink-0 h-full relative z-30"
            >
                <SidebarContent />
            </motion.aside>

            {/* Mobile Sidebar */}
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
                            className="fixed inset-y-0 left-0 w-[240px] z-50 md:hidden shadow-xl"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-[100dvh] relative z-10 overflow-hidden bg-white">
                <header className="h-14 shrink-0 border-b border-slate-200 bg-white flex items-center justify-between px-4 sm:px-6 z-20">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="md:hidden p-1.5 rounded-[4px] border border-slate-200 text-slate-600 hover:bg-slate-50"
                        >
                            <Menu className="w-4 h-4" />
                        </button>
                        <h1 className="text-sm font-semibold tracking-tight text-slate-900 capitalize hidden sm:block">
                            {location.pathname === '/' ? 'Dashboard' : location.pathname.split('/')[1].replace('-', ' ')}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4 flex-1 justify-end">
                        <NotificationDropdown />
                        <div className="relative border-l border-slate-200 pl-4">
                            <button
                                onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
                                className="w-7 h-7 rounded-[4px] bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-xs border border-indigo-200 hover:bg-indigo-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                            >
                                {initials}
                            </button>

                            <AnimatePresence>
                                {isProfileMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden z-50 py-1"
                                    >
                                        <div className="px-4 py-2 border-b border-slate-100">
                                            <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || 'User'}</p>
                                            <p className="text-xs text-slate-500 truncate">{user?.email || 'user@campus.edu'}</p>
                                        </div>
                                        <Link to="/profile" onClick={() => setProfileMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                                            <User className="w-4 h-4" /> Profile Settings
                                        </Link>
                                        <Link to="/security" onClick={() => setProfileMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                                            <Settings className="w-4 h-4" /> Security
                                        </Link>
                                        <div className="border-t border-slate-100 my-1"></div>
                                        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 w-full text-left transition-colors">
                                            <LogOut className="w-4 h-4" /> Sign out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto relative custom-scrollbar bg-white">
                    <div className="p-4 md:p-6 lg:p-10 max-w-6xl mx-auto min-h-[calc(100vh-140px)]">
                        <Outlet />
                    </div>
                    {/* User Operational Footer */}
                    <footer className="border-t border-slate-200 bg-slate-50 px-4 md:px-6 lg:px-10 py-8">
                        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                            <div>
                                <h4 className="font-bold text-slate-900 mb-4 text-sm tracking-tight">Platform</h4>
                                <ul className="space-y-2 text-sm text-slate-500">
                                    <li><Link to="/dashboard" className="hover:text-indigo-700 transition-colors">Dashboard</Link></li>
                                    <li><Link to="/books" className="hover:text-indigo-700 transition-colors">Browse Library</Link></li>
                                    <li><Link to="/books/create" className="hover:text-indigo-700 transition-colors">List a Book</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 mb-4 text-sm tracking-tight">My Transactions</h4>
                                <ul className="space-y-2 text-sm text-slate-500">
                                    <li><Link to="/my-listings" className="hover:text-indigo-700 transition-colors">Active Listings</Link></li>
                                    <li><Link to="/purchases" className="hover:text-indigo-700 transition-colors">Purchase History</Link></li>
                                    <li><Link to="/sales" className="hover:text-indigo-700 transition-colors">Sales History</Link></li>
                                    <li><Link to="/exchanges" className="hover:text-indigo-700 transition-colors">Exchanges</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 mb-4 text-sm tracking-tight">Account Settings</h4>
                                <ul className="space-y-2 text-sm text-slate-500">
                                    <li><Link to="/profile" className="hover:text-indigo-700 transition-colors">Profile Details</Link></li>
                                    <li><Link to="/security" className="hover:text-indigo-700 transition-colors">Account Security</Link></li>
                                    <li><Link to="/ratings" className="hover:text-indigo-700 transition-colors">My Ratings</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 mb-4 text-sm tracking-tight">Support Tools</h4>
                                <ul className="space-y-2 text-sm text-slate-500">
                                    <li><Link to="/help" className="hover:text-indigo-700 transition-colors">Help Center</Link></li>
                                    <li><Link to="/contact" className="hover:text-indigo-700 transition-colors">Contact Admin</Link></li>
                                    <li><Link to="/faqs" className="hover:text-indigo-700 transition-colors">General FAQs</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-400">
                            <div>Book Bridges Academic Network</div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                All Systems Operational
                            </div>
                        </div>
                    </footer>
                </main>
            </div>
        </div>
    );
};
