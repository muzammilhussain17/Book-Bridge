import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, RefreshCcw, Star, ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { userApi, bookApi, exchangeApi, transactionApi } from '../../services/api';

export const UserDashboardPage = () => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    // Stats state
    const [stats, setStats] = useState({
        activeListings: 0,
        completedExchanges: 0,
        totalSales: 0,
        avgRating: 0
    });

    // Content state
    const [recentActivity, setRecentActivity] = useState([]);
    const [activeBooks, setActiveBooks] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);

                // Fetch data concurrently where possible
                const [
                    listingsRes,
                    exchangesRes,
                    salesRes,
                    ratingRes
                ] = await Promise.all([
                    bookApi.getMyListings(),
                    exchangeApi.getAll(),
                    transactionApi.getSales(),
                    user.id ? userApi.getAvgRating(user.id) : Promise.resolve({ data: 0 }),
                ]);

                // 1. Process Active Listings
                const listings = listingsRes.data || [];
                const availableListings = listings.filter(b => b.status === 'ACTIVE' || b.status === 'AVAILABLE');
                setActiveBooks(availableListings.slice(0, 5)); // Show top 5 in library

                // 2. Process Exchanges
                const exchanges = exchangesRes.data || [];
                const completedExchanges = exchanges.filter(e => e.status === 'COMPLETED').length;

                // 3. Process Sales
                const sales = salesRes.data?.content || [];
                const completedSales = sales.filter(s => s.status === 'COMPLETED');
                const totalSalesAmount = completedSales.reduce((sum, s) => sum + (s.priceRs || 0), 0);

                setStats({
                    activeListings: availableListings.length,
                    completedExchanges,
                    totalSales: totalSalesAmount,
                    avgRating: typeof ratingRes.data === 'number' ? ratingRes.data.toFixed(1) : 'New'
                });

                // 4. Construct Recent Activity Timeline (mocking compilation for now since we don't have a unified activity endpoint)
                // In a real app with high scale, you'd want a dedicated /api/users/activity endpoint.
                const activities = [];

                exchanges.slice(0, 2).forEach(e => {
                    activities.push({
                        title: `Exchange ${e.status.charAt(0) + e.status.slice(1).toLowerCase()}`,
                        time: new Date(e.updatedAt || e.createdAt).toLocaleDateString(),
                        desc: `Exchange request for book ID ${e.requestedBookId}`,
                        icon: <RefreshCcw className="w-4 h-4 text-slate-600" />,
                        bg: 'bg-slate-50',
                        date: new Date(e.updatedAt || e.createdAt)
                    });
                });

                completedSales.slice(0, 2).forEach(s => {
                    activities.push({
                        title: 'Book Sold',
                        time: new Date(s.updatedAt || s.createdAt).toLocaleDateString(),
                        desc: `Order #${s.id} completed.`,
                        icon: <ShoppingBag className="w-4 h-4 text-emerald-600" />,
                        bg: 'bg-emerald-50',
                        date: new Date(s.updatedAt || s.createdAt)
                    });
                });

                // Sort activities by date descending
                activities.sort((a, b) => b.date - a.date);
                setRecentActivity(activities.slice(0, 4));

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-20 w-full h-full">
                <p className="text-slate-500 animate-pulse font-medium">Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 w-full h-full pb-10">
            {/* Welcome Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-[4px] p-6 sm:p-8 border border-slate-200 shadow-sm">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-emerald-50 text-emerald-700 text-xs font-semibold mb-3 border border-emerald-100 uppercase tracking-wide">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Account Verified
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                        Welcome back, {user?.name || 'Scholar'}.
                    </h2>
                    <p className="text-slate-500 mt-2 text-sm sm:text-base">
                        Here is an overview of your campus activity and marketplace standing.
                    </p>
                </div>
                <div className="flex-shrink-0">
                    <Link to="/books/create">
                        <Button className="shadow-sm">
                            List a Book
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[
                    { label: 'Active Listings', value: stats.activeListings, icon: <BookOpen className="w-5 h-5 text-indigo-600" /> },
                    { label: 'Completed Exchanges', value: stats.completedExchanges, icon: <RefreshCcw className="w-5 h-5 text-emerald-600" /> },
                    { label: 'Total Sales', value: `Rs ${stats.totalSales}`, icon: <ShoppingBag className="w-5 h-5 text-indigo-600" /> },
                    { label: 'Academic Standing', value: stats.avgRating, icon: <Star className="w-5 h-5 text-amber-500" /> },
                ].map((stat, i) => (
                    <Card key={i} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-5 flex flex-col justify-between h-full">
                            <div className="flex items-start justify-between">
                                <div className={`p-2 rounded-[4px] bg-slate-50 border border-slate-100`}>
                                    {stat.icon}
                                </div>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</h3>
                                <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">{stat.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <Card className="lg:col-span-2 shadow-sm flex flex-col">
                    <CardHeader className="pb-4">
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Your latest interactions within the campus network.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 pb-2 border-t border-slate-100">
                        {recentActivity.length === 0 ? (
                            <div className="px-6 py-8 text-center text-slate-500">
                                <p className="text-sm">No recent activity found. Start exploring!</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {recentActivity.map((activity, i) => (
                                    <div key={i} className="flex gap-4 px-6 py-4 hover:bg-slate-50/50 transition-colors cursor-pointer">
                                        <div className={`w-10 h-10 rounded-[4px] ${activity.bg} border border-slate-200 flex items-center justify-center flex-shrink-0`}>
                                            {activity.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-slate-900">{activity.title}</h4>
                                            <p className="text-sm text-slate-500 mt-0.5">{activity.desc}</p>
                                            <p className="text-xs text-slate-400 mt-1.5 font-medium">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* My Active Listings */}
                <Card className="shadow-sm flex flex-col">
                    <CardHeader className="pb-4">
                        <CardTitle>Active Library</CardTitle>
                        <CardDescription>Books you are currently offering.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3 pt-4 border-t border-slate-100">
                        {activeBooks.length === 0 ? (
                            <div className="py-8 flex flex-col items-center justify-center text-slate-500 border border-slate-100 border-dashed rounded-[4px]">
                                <BookOpen className="w-8 h-8 text-slate-300 mb-2" />
                                <p className="text-sm">No active listings.</p>
                            </div>
                        ) : (
                            activeBooks.map((book, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 rounded-[4px] bg-white border border-slate-200 hover:border-slate-300 transition-colors">
                                    <div className="w-12 h-14 bg-slate-50 border border-slate-200 rounded-[4px] shrink-0 flex items-center justify-center">
                                        <BookOpen className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <div className="flex-1 min-w-0 py-0.5">
                                        <h4 className="text-sm font-semibold text-slate-900 truncate">{book.title}</h4>
                                        <p className="text-xs text-slate-500 truncate mt-0.5">{book.author}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-[2px] text-[10px] font-bold uppercase bg-slate-100 text-slate-600 border border-slate-200">
                                                {book.transactionType}
                                            </span>
                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-[2px] text-[10px] font-bold uppercase border bg-emerald-50 text-emerald-700 border-emerald-200">
                                                {book.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        <Link to="/my-listings">
                            <Button variant="secondary" className="w-full mt-2 text-xs">
                                Manage Library
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
