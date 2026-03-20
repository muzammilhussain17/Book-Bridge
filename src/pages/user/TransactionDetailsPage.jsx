import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Package, CheckCircle2, MessageSquare, Truck, Star } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Textarea } from '../../components/ui/Textarea';
import { transactionApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const TransactionDetailsPage = () => {
    const { id } = useParams();
    const { user } = useAuth();

    const [txn, setTxn] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [statusUpdating, setStatusUpdating] = useState(false);

    useEffect(() => {
        const fetchTxn = async () => {
            try {
                setIsLoading(true);
                const res = await transactionApi.getById(id.replace('TXN-', ''));
                setTxn(res.data);
                setError('');
            } catch (err) {
                console.error("Failed to fetch transaction:", err);
                setError("Failed to load transaction details.");
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchTxn();
        }
    }, [id]);

    const handleSubmitReview = () => {
        setIsSubmitted(true);
        setTimeout(() => {
            setIsReviewOpen(false);
        }, 1500);
    };

    const handleConfirmReceived = async () => {
        try {
            setStatusUpdating(true);
            const res = await transactionApi.updateStatus(txn.id, 'COMPLETED');
            setTxn(res.data);
        } catch (err) {
            console.error("Failed to update status", err);
            alert("Could not update transaction status");
        } finally {
            setStatusUpdating(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-12 text-slate-500">Loading transaction details...</div>;
    }

    if (error || !txn) {
        return <div className="p-8 text-rose-500 text-center">{error || 'Transaction not found'}</div>;
    }

    // Determine roles
    const isSeller = user && user.id === txn.sellerId;
    const isBuyer = user && user.id === txn.buyerId;
    const currentRole = isSeller ? 'Seller' : 'Buyer';
    const counterpartyRole = isSeller ? 'Buyer' : 'Seller';
    const counterpartyName = isSeller ? txn.buyerName : txn.sellerName;
    const typeLabel = isSeller ? 'Sale' : 'Purchase';
    const backLink = isSeller ? '/sales' : '/purchases';

    return (
        <div className="flex flex-col gap-6 w-full h-full pb-10">
            <div className="flex items-center gap-4 mb-2">
                <Link to={backLink} className="p-2 rounded-[4px] border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors bg-white">
                    <ArrowLeft className="w-4 h-4" />
                </Link>
                <span className="text-sm font-medium text-slate-500">Back to {typeLabel}s</span>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Main Info */}
                <div className="flex-1 w-full space-y-6">
                    <Card className="shadow-sm border-emerald-200">
                        <CardContent className="p-8">
                            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-6">
                                <div>
                                    <p className="text-sm font-semibold text-slate-500 tracking-wider uppercase mb-1">Transaction Identity</p>
                                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">TXN-{txn.id}</h1>
                                    <p className="text-sm text-slate-500 mt-1">{txn.createdAt ? new Date(txn.createdAt).toLocaleString() : 'N/A'}</p>
                                </div>
                                <div className="text-right">
                                    <span className="inline-flex items-center px-3 py-1 rounded-[4px] text-xs font-bold uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
                                        {txn.status || 'PENDING'}
                                    </span>
                                    <h2 className="text-3xl font-black text-emerald-700">Rs. {Number(txn.amount).toFixed(2)}</h2>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">Material</h3>
                                    <p className="font-semibold text-slate-900 text-lg">{txn.bookTitle}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">{counterpartyRole}</h3>
                                    <p className="font-semibold text-slate-900 text-lg">{counterpartyName}</p>

                                    <Button variant="secondary" size="sm" className="mt-3 text-xs" leftIcon={<MessageSquare className="w-3.5 h-3.5" />}>
                                        Message {counterpartyName.split(' ')[0]}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>

                {/* Timeline / Action */}
                <div className="w-full md:w-80 space-y-6">
                    <Card className="shadow-sm bg-slate-50">
                        <CardContent className="p-6">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2 mb-6">Status Timeline</h3>

                            <div className="space-y-6">
                                <div className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center z-10">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                        <div className="w-px h-full bg-emerald-200 my-1"></div>
                                    </div>
                                    <div className="pb-2">
                                        <p className="text-sm font-semibold text-slate-900 leading-none">Order Placed</p>
                                        <p className="text-xs text-slate-500 mt-1">{txn.createdAt ? new Date(txn.createdAt).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${txn.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                        <div className={`w-px h-full my-1 ${txn.status === 'COMPLETED' ? 'bg-emerald-200' : 'bg-transparent'}`}></div>
                                    </div>
                                    <div className="pb-2">
                                        <p className={`text-sm font-semibold leading-none ${txn.status === 'COMPLETED' ? 'text-slate-900' : 'text-slate-400'}`}>Transaction Completed</p>
                                        {txn.status === 'COMPLETED' && <p className="text-xs text-slate-500 mt-1">Status Confirmed</p>}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {txn.status === 'COMPLETED' ? (
                        <div className="space-y-3">
                            <Button className="w-full text-sm bg-slate-900 text-white hover:bg-slate-800" shadow="md">
                                Download Receipt
                            </Button>
                            {!isSubmitted ? (
                                <Button
                                    onClick={() => setIsReviewOpen(true)}
                                    variant="secondary"
                                    className="w-full text-sm font-semibold text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100"
                                    leftIcon={<Star className="w-4 h-4" />}>
                                    Leave a Review
                                </Button>
                            ) : (
                                <div className="p-3 rounded-[4px] bg-emerald-50 border border-emerald-200 flex items-center justify-center gap-2 text-emerald-700 text-sm font-bold">
                                    <CheckCircle2 className="w-4 h-4" /> Review Submitted
                                </div>
                            )}
                        </div>
                    ) : (
                        isBuyer && (
                            <Button
                                onClick={handleConfirmReceived}
                                isLoading={statusUpdating}
                                className="w-full text-sm bg-emerald-600 text-white hover:bg-emerald-700" shadow="md">
                                Confirm Material Received
                            </Button>
                        )
                    )}
                </div>
            </div>

            <Modal isOpen={isReviewOpen} onClose={() => setIsReviewOpen(false)} title="Rate Your Experience">
                <div className="space-y-6">
                    <div className="flex flex-col items-center justify-center gap-2">
                        <p className="text-sm font-semibold text-slate-700 mb-2">How was your transaction with {counterpartyName}?</p>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className="focus:outline-none transition-transform hover:scale-110"
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                >
                                    <Star
                                        className={`w-8 h-8 ${star <= (hoverRating || rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                                    />
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-slate-500 font-medium h-4 mt-1">
                            {rating === 1 && "Poor"}
                            {rating === 2 && "Fair"}
                            {rating === 3 && "Good"}
                            {rating === 4 && "Great"}
                            {rating === 5 && "Excellent"}
                        </p>
                    </div>

                    <Textarea
                        label="Share your thoughts (Optional)"
                        placeholder="Was the book in the described condition? Was communication prompt?"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        rows={4}
                    />

                    <div className="flex gap-3 pt-4 border-t border-slate-100">
                        <Button variant="ghost" className="flex-1" onClick={() => setIsReviewOpen(false)}>Cancel</Button>
                        <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white" disabled={rating === 0} onClick={handleSubmitReview}>Submit Review</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
