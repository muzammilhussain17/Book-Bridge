import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const PublicLayout = () => {
    return (
        <div className="min-h-screen flex flex-col pt-16 bg-slate-50">
            <header className="fixed top-0 inset-x-0 z-50 border-b border-slate-200 bg-white">
                <div className="w-full px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2.5 group shrink-0">
                        <div className="p-1.5 rounded-[4px] bg-indigo-50 border border-indigo-100 group-hover:bg-indigo-100 transition-colors">
                            <BookOpen className="w-5 h-5 text-indigo-700" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-indigo-700 transition-colors">
                            Book Bridges
                        </span>
                    </Link>
                    <nav className="flex items-center gap-3 md:gap-6">
                        <div className="hidden md:flex items-center gap-6">
                            <Link to="/help" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                                Help
                            </Link>
                            <Link to="/contact" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                                Contact
                            </Link>
                            <Link to="/faqs" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                                FAQs
                            </Link>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Link to="/login">
                                <button className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-full hover:bg-slate-50 hover:text-slate-900 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1">
                                    Log in
                                </button>
                            </Link>
                            <Link to="/register">
                                <button className="inline-flex items-center justify-center px-5 py-2 text-sm font-bold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ring-offset-white">
                                    Get Started
                                </button>
                            </Link>
                        </div>
                    </nav>
                </div>
            </header>

            <main className="flex-1 flex flex-col">
                <Outlet />
            </main>

            <footer className="border-t border-slate-200 bg-white pt-12 pb-8">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-2 mb-4 text-indigo-700">
                                <BookOpen className="w-6 h-6" />
                                <span className="text-xl font-bold tracking-tight text-slate-900">Book Bridges</span>
                            </div>
                            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
                                The premier academic exchange network. Connect with peers to securely and efficiently trade or sell course materials within your campus community.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-4">Support</h4>
                            <ul className="space-y-2 text-sm text-slate-500">
                                <li><Link to="/help" className="hover:text-indigo-600 transition-colors">Help Center</Link></li>
                                <li><Link to="/contact" className="hover:text-indigo-600 transition-colors">Contact Us</Link></li>
                                <li><Link to="/faqs" className="hover:text-indigo-600 transition-colors">FAQs</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-4">Account</h4>
                            <ul className="space-y-2 text-sm text-slate-500">
                                <li><Link to="/login" className="hover:text-indigo-600 transition-colors">Log In</Link></li>
                                <li><Link to="/register" className="hover:text-indigo-600 transition-colors">Create Account</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
                        <p>&copy; {new Date().getFullYear()} Book Bridges. Developed for clarity and focus.</p>
                        <div className="flex gap-4">
                            <Link to="#" className="hover:text-slate-600 transition-colors">Privacy Policy</Link>
                            <Link to="#" className="hover:text-slate-600 transition-colors">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
