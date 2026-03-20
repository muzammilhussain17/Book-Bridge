import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, TrendingUp, Users, DollarSign, Activity, MessageSquare, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { cn } from '../../lib/utils';
import { adminApi } from '../../services/api';

export const AdminDashboardPage = () => {
    const [stats, setStats] = useState({
        totalBooks: 0,
        activeUsers: 0,
        revenue: 0,
        suspendedUsers: 0
    });
    const [quarantineBooks, setQuarantineBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                const [statsRes, quarantineRes] = await Promise.all([
                    adminApi.getStats(),
                    adminApi.getQuarantine({ page: 0, size: 5 })
                ]);
                setStats(statsRes.data);
                setQuarantineBooks(quarantineRes.data.content || []);
            } catch (err) {
                console.error("Failed to load dashboard data:", err);
                setError("Failed to load dashboard data from the server.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const STATS = [
        { title: 'Total Books Listed', value: stats.totalBooks.toLocaleString(), change: '+12%', icon: <BookOpen className="w-5 h-5 text-indigo-700" />, trend: 'text-emerald-600' },
        { title: 'Active Students', value: stats.activeUsers.toLocaleString(), change: '+5%', icon: <Users className="w-5 h-5 text-emerald-600" />, trend: 'text-emerald-600' },
        { title: 'Suspended Accounts', value: stats.suspendedUsers.toLocaleString(), change: '0%', icon: <AlertCircle className="w-5 h-5 text-rose-500" />, trend: 'text-rose-600' },
        { title: 'System Uptime', value: '99.9%', change: '+0.1%', icon: <TrendingUp className="w-5 h-5 text-emerald-600" />, trend: 'text-emerald-600' },
    ];

    if (isLoading) return <div className="p-8 text-center text-slate-500">Loading dashboard...</div>;

    return (
        <div className="flex flex-col gap-6 w-full h-full pb-10">
            <div className="flex items-end justify-between border-b border-slate-200 pb-5">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Platform Analytics</h2>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Global metrics and real-time infrastructure diagnostics.</p>
                </div>
            </div>

            {error && (
                <div className="bg-rose-50 text-rose-600 border border-rose-200 p-4 rounded-[4px] text-sm font-medium">
                    {error}
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {STATS.map((stat, i) => (
                    <Card key={i} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-5 relative flex flex-col justify-between h-full">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-2 bg-slate-50 border border-slate-100 rounded-[4px]`}>
                                    {stat.icon}
                                </div>
                                <div className={`flex items-center gap-1 text-xs font-bold ${stat.trend} bg-slate-50 px-2 py-1 rounded-[4px] border border-slate-100`}>
                                    {stat.change}
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{stat.title}</p>
                                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</h3>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <Card className="lg:col-span-2 shadow-sm relative overflow-hidden flex flex-col">
                    <CardHeader className="border-b border-slate-100 pb-4 bg-white z-10">
                        <CardTitle>Pending Approvals (Recent)</CardTitle>
                        <CardDescription className="text-xs mt-1">Newly listed materials awaiting administrative verification</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 z-10 flex-1">
                        <Table className="border-0 shadow-none">
                            <TableHeader className="bg-slate-50 border-b border-slate-200">
                                <TableRow className="border-0">
                                    <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider h-10 w-[40%]">Book Title</TableHead>
                                    <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider h-10 w-[30%]">User</TableHead>
                                    <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider h-10 w-[20%]">Date</TableHead>
                                    <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider h-10 w-[10%] text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {quarantineBooks.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-slate-500 font-medium">No pending approvals.</TableCell>
                                    </TableRow>
                                ) : quarantineBooks.map((book) => (
                                    <TableRow key={book.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <TableCell className="font-semibold text-slate-900 py-3 text-sm">{book.title}</TableCell>
                                        <TableCell className="text-slate-600 text-sm">{book.ownerName}</TableCell>
                                        <TableCell className="text-slate-500 text-xs font-medium">
                                            {book.createdAt ? new Date(book.createdAt).toLocaleDateString() : 'N/A'}
                                        </TableCell>
                                        <TableCell className="text-right py-3">
                                            <Link to={`/admin/books/approval?id=${book.id}`}>
                                                <span className="inline-flex cursor-pointer hover:bg-indigo-100 items-center px-2 py-1 rounded-[2px] text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 transition-colors">
                                                    Review
                                                </span>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {quarantineBooks.length > 0 && (
                            <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
                                <Link to="/admin/books/approval" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">View All Approvals &rarr;</Link>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* System Health */}
                <Card className="shadow-sm border-slate-200 flex flex-col">
                    <CardHeader className="border-b border-slate-100 pb-4 bg-white">
                        <CardTitle>System Diagnostics</CardTitle>
                        <CardDescription className="text-xs mt-1">Real-time status of critical infrastructure</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-5 flex-1 flex flex-col justify-between">
                        <div className="space-y-4">
                            {[
                                { name: 'Database Cluser', status: 'Operational', icon: <Activity className="w-4 h-4 text-emerald-600" /> },
                                { name: 'Image Storage', status: 'Operational', icon: <Activity className="w-4 h-4 text-emerald-600" /> },
                                { name: 'Search Index', status: 'Operational', icon: <Activity className="w-4 h-4 text-emerald-500" /> },
                                { name: 'Email Gateway', status: 'Operational', icon: <MessageSquare className="w-4 h-4 text-emerald-600" /> },
                            ].map((service, i) => (
                                <div key={i} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-[4px] text-slate-700">
                                            {service.icon}
                                        </div>
                                        <p className="text-sm font-semibold text-slate-900">{service.name}</p>
                                    </div>
                                    <span className={cn(
                                        "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-[2px] border",
                                        service.status === 'Operational'
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                            : 'bg-amber-50 text-amber-700 border-amber-200'
                                    )}>
                                        {service.status}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-5 border-t border-slate-100">
                            <div className="w-full h-20 bg-slate-50 border border-slate-200 rounded-[4px] overflow-hidden relative flex items-end">
                                {/* Minimal chart indicator */}
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-indigo-100" style={{ clipPath: 'polygon(0 100%, 0 50%, 10% 30%, 20% 60%, 30% 20%, 40% 70%, 50% 10%, 60% 80%, 70% 40%, 80% 90%, 90% 30%, 100% 60%, 100% 100%)' }}></div>
                                <div className="absolute top-2 left-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Network Load</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
