import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, UserX, AlertOctagon, History, ShieldAlert } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { adminApi } from '../../services/api';

export const AdminUserDetailsPage = () => {
    const { id } = useParams();
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchUser = React.useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await adminApi.getUserDetail(id);
            setUserData(res.data);
            setError('');
        } catch (err) {
            console.error("Failed to load user:", err);
            setError("Could not load user profile details.");
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const handleSuspendToggle = async () => {
        if (!userData) return;
        try {
            await adminApi.suspendUser(id);
            await fetchUser(); // reload to get new state
        } catch (err) {
            console.error("Failed to toggle suspension:", err);
            alert("Failed to suspend/unsuspend account.");
        }
    };

    const handleIssueStrike = async () => {
        if (!userData) return;
        try {
            await adminApi.strikeUser(id);
            await fetchUser(); // reload to get new strike count
        } catch (err) {
            console.error("Failed to issue strike:", err);
            alert("Failed to issue strike.");
        }
    };

    if (isLoading) return <div className="p-8 text-center text-slate-500">Loading user profile...</div>;
    if (error) return <div className="p-8 text-center text-rose-500 font-medium">{error}</div>;
    if (!userData) return null;

    // We don't have these coming from the backend yet, using dummy data for the UI
    const metrics = {
        activeListings: 4,
        completedTrades: 12,
        reportsFiled: 1,
        reportsReceived: 0
    };

    return (
        <div className="flex flex-col gap-6 w-full h-full pb-10">
            <div className="flex items-center gap-4 mb-2">
                <Link to="/admin/users" className="p-2 rounded-[4px] border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors bg-white shadow-sm">
                    <ArrowLeft className="w-4 h-4" />
                </Link>
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Return to Directory</span>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Operations Panel */}
                <div className="w-full lg:w-80 space-y-6">
                    <Card className="shadow-sm border-slate-200 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-fuchsia-500 to-indigo-500"></div>
                        <CardContent className="p-6">
                            <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xl font-black text-slate-700 mb-4">
                                {userData.name ? userData.name.substring(0, 2).toUpperCase() : 'US'}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">{userData.name}</h3>
                            <p className="text-sm text-slate-500 mt-1 mb-4 font-medium">{userData.email}</p>

                            <div className="flex items-center gap-2 mb-6">
                                <span className={`w-2 h-2 rounded-full ${userData.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">{userData.status}</span>
                                {userData.strikeCount > 0 && (
                                    <span className="text-xs font-bold text-rose-600 ml-2">[{userData.strikeCount} Strikes]</span>
                                )}
                            </div>

                            <div className="space-y-3 pt-6 border-t border-slate-100">
                                <Button
                                    onClick={handleSuspendToggle}
                                    variant="danger"
                                    className="w-full font-semibold text-xs tracking-wider uppercase"
                                    leftIcon={<UserX className="w-4 h-4" />}
                                >
                                    {userData.status === 'ACTIVE' ? 'Suspend Account' : 'Unsuspend Account'}
                                </Button>
                                <Button
                                    onClick={handleIssueStrike}
                                    variant="secondary"
                                    className="w-full font-semibold text-xs tracking-wider uppercase text-amber-700 border-amber-200 bg-amber-50 hover:bg-amber-100"
                                    leftIcon={<AlertOctagon className="w-4 h-4" />}
                                >
                                    Issue Strike (+1)
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-slate-200">
                        <CardContent className="p-6">
                            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Activity Overview</h4>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-slate-500 font-medium">Active Listings</p>
                                    <p className="text-xl font-black text-slate-900">{metrics.activeListings}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium">Completed Transactions</p>
                                    <p className="text-xl font-black text-indigo-600">{metrics.completedTrades}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100">
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase font-semibold">Reports Filed</p>
                                        <p className="font-bold text-slate-900">{metrics.reportsFiled}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase font-semibold">Reports Received</p>
                                        <p className="font-bold text-rose-600">{metrics.reportsReceived}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed Logs */}
                <div className="flex-1 space-y-6">
                    <Card className="shadow-sm border-slate-200 h-full">
                        <CardContent className="p-8">
                            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                                <History className="w-5 h-5 text-slate-400" />
                                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider">System Telemetry & Audit Log</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-px h-full bg-slate-200 relative -mr-px ml-2"></div>
                                    <div className="w-4 h-4 rounded-full bg-emerald-100 border border-emerald-500 flex items-center justify-center shrink-0 z-10 mt-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                    </div>
                                    <div className="pb-4">
                                        <p className="text-sm font-bold text-slate-900">Login Authorized</p>
                                        <p className="text-xs text-slate-500 mt-1 font-medium">Today, 08:32 AM • IP: 192.168.1.45</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-px h-full bg-slate-200 relative -mr-px ml-2"></div>
                                    <div className="w-4 h-4 rounded-full bg-indigo-100 border border-indigo-500 flex items-center justify-center shrink-0 z-10 mt-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                    </div>
                                    <div className="pb-4">
                                        <p className="text-sm font-bold text-slate-900">Created Listing: "Linear Algebra"</p>
                                        <p className="text-xs text-slate-500 mt-1 font-medium">Oct 24, 2026, 14:15 PM</p>
                                        <Link to="/books/BK-091">
                                            <Button variant="secondary" size="sm" className="mt-2 text-[10px] h-6 font-semibold">View Listing Snapshot</Button>
                                        </Link>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-px h-full bg-transparent relative -mr-px ml-2"></div>
                                    <div className="w-4 h-4 rounded-full bg-rose-100 border border-rose-500 flex items-center justify-center shrink-0 z-10 mt-1">
                                        <ShieldAlert className="w-2.5 h-2.5 text-rose-500" />
                                    </div>
                                    <div className="pb-0">
                                        <p className="text-sm font-bold text-rose-600">Warning Issued by Auto-Mod</p>
                                        <p className="text-xs text-slate-500 mt-1 font-medium">Oct 12, 2026, 09:00 AM • Flagged terminology in messages</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
