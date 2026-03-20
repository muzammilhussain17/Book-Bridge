import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Eye, ExternalLink, ShoppingBag, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { transactionApi } from '../../services/api';

export const MyPurchasesPage = () => {
    const [purchases, setPurchases] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                setIsLoading(true);
                const res = await transactionApi.getPurchases();
                setPurchases(res.data.content || []);
                setError('');
            } catch (err) {
                console.error("Failed to fetch purchases:", err);
                setError("Failed to load purchase history.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPurchases();
    }, []);

    if (isLoading && purchases.length === 0) {
        return <div className="p-8 text-center text-slate-500">Loading your purchases...</div>;
    }

    return (
        <div className="flex flex-col gap-6 w-full h-full pb-10">
            <div className="border-b border-slate-200 pb-5">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Purchase History</h2>
                <p className="text-sm text-slate-500 mt-1">Review the materials you have bought on the Book Bridges network.</p>
            </div>

            {error && (
                <div className="bg-rose-50 text-rose-600 border border-rose-200 p-4 rounded-[4px] text-sm font-medium">
                    {error}
                </div>
            )}

            <Card className="shadow-sm">
                <CardContent className="p-0">
                    <Table className="border-0 shadow-none">
                        <TableHeader className="bg-slate-50 border-b border-slate-200">
                            <TableRow className="border-0">
                                <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider h-11">Transaction ID / Date</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider h-11">Material / Seller</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider h-11 w-28">Status</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider h-11 w-24 text-right">Amount</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider h-11 text-right w-36">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {purchases.map((txn) => (
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
                                            <p className="text-xs text-slate-500 mt-1">Seller: {txn.sellerName}</p>
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
                                        <span className="font-bold text-slate-900">Rs. {Number(txn.amount).toFixed(2)}</span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link to={`/transactions/${txn.id}`}>
                                            <Button variant="secondary" size="sm" className="w-full text-[10px] uppercase font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-800 border-indigo-200 tracking-wider">
                                                Track Order
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {purchases.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center py-16 px-4 bg-slate-50 border border-slate-200 border-dashed rounded-[4px]">
                    <ShoppingBag className="w-12 h-12 text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900">No purchases yet</h3>
                    <p className="text-sm text-slate-500 mt-1 max-w-sm text-center">You haven't bought any materials on the network yet.</p>
                </div>
            )}
        </div>
    );
};
