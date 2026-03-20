import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { BookOpen, Edit2, Trash2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { bookApi } from '../../services/api';

export const MyListingsPage = () => {
    const [listings, setListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchMyListings = async () => {
        try {
            setIsLoading(true);
            const res = await bookApi.getMyListings();
            setListings(res.data);
        } catch (err) {
            console.error("Failed to fetch listings:", err);
            setError("Failed to load your listings.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMyListings();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this listing?")) return;
        try {
            await bookApi.remove(id);
            setListings(prev => prev.filter(l => l.id !== id));
        } catch (err) {
            console.error(err);
            alert("Failed to delete listing.");
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full h-full pb-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-5 gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Active Library</h2>
                    <p className="text-sm text-slate-500 mt-1">Manage the materials you have listed on the network.</p>
                </div>
                <Link to="/books/create">
                    <Button shadow="sm" leftIcon={<BookOpen className="w-4 h-4" />}>
                        List New Material
                    </Button>
                </Link>
            </div>

            {error && (
                <div className="bg-rose-50 text-rose-600 p-4 rounded-[4px] border border-rose-200 text-sm font-medium">
                    {error}
                </div>
            )}

            <Card className="shadow-sm">
                <CardContent className="p-0">
                    <Table className="border-0 shadow-none">
                        <TableHeader className="bg-slate-50 border-b border-slate-200">
                            <TableRow className="border-0">
                                <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider h-11">Title</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider h-11 w-32">Type</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider h-11 w-32">Added</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider h-11 w-32">Status</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-600 uppercase tracking-wider h-11 text-right w-36">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-slate-500 font-medium">Loading listings...</TableCell>
                                </TableRow>
                            ) : listings.map((listing) => (
                                <TableRow key={listing.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                    <TableCell>
                                        <div>
                                            <p className="font-semibold text-slate-900 text-sm leading-tight">{listing.title}</p>
                                            <p className="text-xs text-slate-500 mt-1 font-medium">{listing.courseCode || 'N/A'}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm font-semibold text-slate-700">
                                            {listing.transactionType === 'SALE' ? `SALE (Rs. ${listing.price || '0.00'})` : listing.transactionType}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-xs text-slate-500 font-medium">
                                            {listing.createdAt ? new Date(listing.createdAt).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-[2px] text-[10px] font-bold uppercase tracking-wider border ${listing.status === 'ACTIVE'
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                            : listing.status === 'SOLD' || listing.status === 'EXCHANGED'
                                                ? 'bg-slate-100 text-slate-600 border-slate-200'
                                                : 'bg-amber-50 text-amber-700 border-amber-200'
                                            }`}>
                                            {listing.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {listing.status === 'ACTIVE' && (
                                                <>
                                                    <Button variant="secondary" size="icon" className="w-8 h-8 rounded-[4px] text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-100" title="Mark as Completed">
                                                        <CheckCircle className="w-4 h-4" />
                                                    </Button>
                                                    <Link to={`/books/edit/${listing.id}`}>
                                                        <Button variant="secondary" size="icon" className="w-8 h-8 rounded-[4px] text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border-indigo-100" title="Edit Listing">
                                                            <Edit2 className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                </>
                                            )}
                                            <Button variant="secondary" size="icon" className="w-8 h-8 rounded-[4px] text-rose-500 hover:text-rose-600 hover:bg-rose-50 border-rose-100" title="Delete Listing" onClick={() => handleDelete(listing.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {!isLoading && listings.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 px-4 bg-slate-50 border border-slate-200 border-dashed rounded-[4px]">
                    <BookOpen className="w-12 h-12 text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900">Your library is empty</h3>
                    <p className="text-sm text-slate-500 mt-1 max-w-sm text-center">You haven't listed any materials yet. Add textbooks to start exchanging with the campus network.</p>
                </div>
            )}
        </div>
    );
};
