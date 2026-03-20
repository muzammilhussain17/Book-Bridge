import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Eye, RefreshCcw, ArrowRightLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { exchangeApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const ExchangeListPage = () => {
    const { user } = useAuth();
    const [exchanges, setExchanges] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchExchanges = async () => {
            try {
                setIsLoading(true);
                const res = await exchangeApi.getAll();
                setExchanges(res.data || []);
                setError('');
            } catch (err) {
                console.error("Failed to fetch exchanges:", err);
                setError("Failed to load exchange hub.");
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchExchanges();
        }
    }, [user]);

    const activeRequests = exchanges.filter(ex => ex.status === 'PENDING').length;
    const successfulTrades = exchanges.filter(ex => ex.status === 'ACCEPTED').length;

    if (isLoading && exchanges.length === 0) {
        return <div className="p-8 text-center text-slate-500">Loading your exchanges...</div>;
    }

    return (
        <div className="flex flex-col gap-6 w-full h-full pb-10">
            <div className="border-b border-slate-200 pb-5">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Exchange Hub</h2>
                <p className="text-sm text-slate-500 mt-1">Manage your incoming and outgoing material exchange requests.</p>
            </div>

            {error && (
                <div className="bg-rose-50 text-rose-600 border border-rose-200 p-4 rounded-[4px] text-sm font-medium">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
                <Card className="shadow-sm bg-indigo-50/50 border-indigo-100">
                    <CardContent className="p-6">
                        <p className="text-xs font-bold text-indigo-800 uppercase tracking-widest mb-1">Active Requests</p>
                        <h3 className="text-3xl font-black text-indigo-900">{activeRequests}</h3>
                    </CardContent>
                </Card>
                <Card className="shadow-sm bg-emerald-50/50 border-emerald-100">
                    <CardContent className="p-6">
                        <p className="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-1">Successful Trades</p>
                        <h3 className="text-3xl font-black text-emerald-900">{successfulTrades}</h3>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-sm">
                <CardContent className="p-0">
                    <Table className="border-0 shadow-none">
                        <TableHeader className="bg-slate-50 border-b border-slate-200">
                            <TableRow className="border-0">
                                <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider h-11 w-32">Req ID / Date</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider h-11">Swap Details</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider h-11 w-40">Status</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider h-11 text-right w-24">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {exchanges.map((ex) => {
                                const isInitiator = user && user.id === ex.initiatorId;
                                const myBook = isInitiator ? ex.offeredBookTitle : ex.requestedBookTitle;
                                const theirBook = isInitiator ? ex.requestedBookTitle : ex.offeredBookTitle;
                                const partner = isInitiator ? ex.receiverName : ex.initiatorName;

                                return (
                                    <TableRow key={ex.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                        <TableCell>
                                            <div>
                                                <p className="font-semibold text-indigo-700 text-xs tracking-wider">EX-{ex.id}</p>
                                                <p className="text-xs text-slate-500 mt-1 font-medium">
                                                    {ex.createdAt ? new Date(ex.createdAt).toLocaleDateString() : 'N/A'}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-4">
                                                <div className="flex-1">
                                                    <p className="text-xs text-slate-500 mb-0.5">You Offer</p>
                                                    <p className="font-semibold text-slate-900 text-sm truncate max-w-[150px]">{myBook}</p>
                                                </div>
                                                <ArrowRightLeft className="w-4 h-4 text-slate-300" />
                                                <div className="flex-1">
                                                    <p className="text-xs text-slate-500 mb-0.5">{partner} Offers</p>
                                                    <p className="font-semibold text-slate-900 text-sm truncate max-w-[150px]">{theirBook}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-[2px] text-[10px] font-bold uppercase tracking-wider border ${ex.status === 'ACCEPTED' || ex.status === 'COMPLETED'
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                : ex.status === 'REJECTED' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                                                }`}>
                                                {ex.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link to={`/exchanges/${ex.id}`}>
                                                <Button variant="secondary" size="icon" className="w-8 h-8 rounded-[4px] text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 border-slate-200 hover:border-indigo-200" title="View Details">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {exchanges.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center py-16 px-4 bg-slate-50 border border-slate-200 border-dashed rounded-[4px]">
                    <RefreshCcw className="w-12 h-12 text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900">No active exchanges</h3>
                    <p className="text-sm text-slate-500 mt-1 max-w-sm text-center">You haven't initiated or received any trade requests.</p>
                </div>
            )}
        </div>
    );
};
