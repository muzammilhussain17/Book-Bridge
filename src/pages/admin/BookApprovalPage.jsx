import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { ShieldAlert, CheckCircle2, XCircle, Search, Eye } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { adminApi } from '../../services/api';

export const BookApprovalPage = () => {
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchParams] = useSearchParams();
    const highlightId = searchParams.get('id');

    const fetchQuarantine = async () => {
        try {
            setIsLoading(true);
            const res = await adminApi.getQuarantine({ page: 0, size: 50 });
            setData(res.data.content || []);
            setError('');
        } catch (err) {
            console.error("Failed to fetch quarantine list:", err);
            setError("Could not load pending approvals");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchQuarantine();
    }, []);

    const handleAction = async (id, action) => {
        try {
            if (action === 'approve') {
                await adminApi.approveBook(id);
            } else if (action === 'reject') {
                await adminApi.rejectBook(id);
            }
            // Remove locally to avoid full refetch if you want, but refetching is safer for now
            setData(current => current.filter(item => item.id !== id));
        } catch (err) {
            console.error(`Failed to ${action} book:`, err);
            alert(`Failed to ${action} listing. Please try again.`);
        }
    };

    const filteredData = data.filter(item => {
        const titleStr = item.title || '';
        const sellerStr = item.ownerName || '';
        const idStr = item.id ? item.id.toString() : '';

        const matchesSearch = titleStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sellerStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
            idStr.toLowerCase().includes(searchQuery.toLowerCase());

        // We don't have a real riskScore from backend yet, so just ignore filter for now
        // or apply dummy logic. We'll ignore the explicit Critical/Low filter if not present.
        return matchesSearch;
    });

    if (isLoading && data.length === 0) {
        return <div className="p-8 text-center text-slate-500">Loading quarantine queue...</div>;
    }

    return (
        <div className="flex flex-col gap-6 w-full h-full pb-10">
            <div className="border-b border-slate-200 pb-5">
                <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase flex items-center gap-3">
                    <ShieldAlert className="w-6 h-6 text-rose-600" />
                    Quarantine Queue
                </h2>
                <p className="text-sm text-slate-500 font-medium mt-2">Approve or reject flagged material listings before they hit the public network.</p>
            </div>

            {error && (
                <div className="bg-rose-50 text-rose-600 border border-rose-200 p-4 rounded-[4px] text-sm font-medium">
                    {error}
                </div>
            )}

            <div className="flex items-center gap-4 mb-2">
                <Input
                    placeholder="Search queue by title, seller, or ID..."
                    className="max-w-md bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500"
                    leftIcon={<Search className="w-4 h-4 text-slate-400" />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <Card className="shadow-sm border-slate-200">
                <CardContent className="p-0">
                    <Table className="border-0 shadow-none">
                        <TableHeader className="bg-slate-50 border-b border-slate-200">
                            <TableRow className="border-0">
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider h-12">Listing / Seller</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider h-12 w-32">Timestamp</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider h-12 w-32">Auto-Mod</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider h-12 w-48">Status / Reason</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider h-12 text-right w-40">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.map((item) => (
                                <TableRow key={item.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${Number(highlightId) === item.id ? 'bg-indigo-50/50' : ''}`}>
                                    <TableCell>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm">{item.title}</p>
                                            <p className="text-xs text-slate-500 mt-1">{item.ownerName || 'Unknown Seller'}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-xs text-slate-500 font-medium">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-[2px] text-[10px] font-bold uppercase tracking-wider border bg-amber-50 text-amber-700 border-amber-200`}>
                                            Unverified
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-xs text-slate-600 font-semibold text-amber-600">Pending Review</span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link to={`/books/${item.id}`}>
                                                <Button variant="secondary" size="icon" className="w-8 h-8 rounded-[4px] text-slate-500 hover:text-slate-700 hover:bg-slate-100 border-slate-200" title="Inspect Listing">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Button onClick={() => handleAction(item.id, 'approve')} variant="secondary" size="icon" className="w-8 h-8 rounded-[4px] text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200" title="Approve">
                                                <CheckCircle2 className="w-4 h-4" />
                                            </Button>
                                            <Button onClick={() => handleAction(item.id, 'reject')} variant="secondary" size="icon" className="w-8 h-8 rounded-[4px] text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200" title="Reject & Delete">
                                                <XCircle className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {filteredData.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center py-20 px-4 bg-slate-50 border border-slate-200 border-dashed rounded-xl">
                    <ShieldAlert className="w-12 h-12 text-emerald-300 mb-4" />
                    <h3 className="text-lg font-bold text-emerald-600 uppercase tracking-widest">Queue Clear</h3>
                    <p className="text-sm text-slate-500 mt-2">No pending items in the quarantine queue.</p>
                </div>
            )}
        </div>
    );
};
