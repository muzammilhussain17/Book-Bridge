import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Eye, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { transactionApi } from '../../services/api';

export const MySalesPage = () => {
    const [sales, setSales] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSales = async () => {
            try {
                setIsLoading(true);
                const res = await transactionApi.getSales();
                setSales(res.data.content || []);
                setError('');
            } catch (err) {
                console.error("Failed to fetch sales:", err);
                setError("Failed to load sales dashboard.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSales();
    }, []);

    const totalRevenue = sales.reduce((acc, curr) => {
        if (curr.status === 'COMPLETED') return acc + Number(curr.amount);
        return acc;
    }, 0);

    const completedSales = sales.filter(s => s.status === 'COMPLETED').length;
    const pendingDelivery = sales.filter(s => s.status !== 'COMPLETED' && s.status !== 'CANCELLED').length;

    if (isLoading && sales.length === 0) {
        return <div className="p-8 text-center text-slate-500">Loading your sales dashboard...</div>;
    }

    return (
        <div className="flex flex-col gap-6 w-full h-full pb-10">
            <div className="border-b border-slate-200 pb-5">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Sales Dashboard</h2>
                <p className="text-sm text-slate-500 mt-1">Manage and track the materials you've sold on Book Bridges.</p>
            </div>

            {error && (
                <div className="bg-rose-50 text-rose-600 border border-rose-200 p-4 rounded-[4px] text-sm font-medium">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
                <Card className="shadow-sm bg-indigo-50/50 border-indigo-100">
                    <CardContent className="p-6">
                        <p className="text-xs font-bold text-indigo-800 uppercase tracking-widest mb-1">Total Revenue</p>
                        <h3 className="text-3xl font-black text-indigo-900">Rs. {totalRevenue.toFixed(2)}</h3>
                    </CardContent>
                </Card>
                <Card className="shadow-sm bg-emerald-50/50 border-emerald-100">
                    <CardContent className="p-6">
                        <p className="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-1">Completed Sales</p>
                        <h3 className="text-3xl font-black text-emerald-900">{completedSales}</h3>
                    </CardContent>
                </Card>
                <Card className="shadow-sm bg-amber-50/50 border-amber-100">
                    <CardContent className="p-6">
                        <p className="text-xs font-bold text-amber-800 uppercase tracking-widest mb-1">Pending Delivery</p>
                        <h3 className="text-3xl font-black text-amber-900">{pendingDelivery}</h3>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-sm">
                <CardContent className="p-0">
                    <Table className="border-0 shadow-none">
                        <TableHeader className="bg-slate-50 border-b border-slate-200">
                            <TableRow className="border-0">
                                <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider h-11">Transaction ID / Date</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider h-11">Material / Buyer</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider h-11 w-36">Status</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider h-11 w-24 text-right">Earnings</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider h-11 text-right w-24">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sales.map((txn) => (
                                <TableRow key={txn.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                    <TableCell>
                                        <div>
                                            <p className="font-semibold text-indigo-700 text-xs tracking-wider">TXN-{txn.id}</p>
                                            <p className="text-xs text-slate-500 mt-1 font-medium">
                                                {txn.createdAt ? new Date(txn.createdAt).toLocaleDateString() : 'N/A'}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-semibold text-slate-900 text-sm">{txn.bookTitle}</p>
                                            <p className="text-xs text-slate-500 mt-1">Buyer: {txn.buyerName}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-[2px] text-[10px] font-bold uppercase tracking-wider border ${txn.status === 'COMPLETED'
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                            : 'bg-amber-50 text-amber-700 border-amber-200'
                                            }`}>
                                            {txn.status || 'PENDING'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className="font-bold text-emerald-700">+Rs. {Number(txn.amount).toFixed(2)}</span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link to={`/transactions/${txn.id}`}>
                                            <Button variant="secondary" size="icon" className="w-8 h-8 rounded-[4px] text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 border-slate-200 hover:border-indigo-200" title="View Details">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {sales.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center py-16 px-4 bg-slate-50 border border-slate-200 border-dashed rounded-[4px]">
                    <DollarSign className="w-12 h-12 text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900">No sales yet</h3>
                    <p className="text-sm text-slate-500 mt-1 max-w-sm text-center">List your unneeded materials to start earning.</p>
                </div>
            )}
        </div>
    );
};
