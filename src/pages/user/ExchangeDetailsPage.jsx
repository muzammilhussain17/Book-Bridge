import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, RefreshCcw, Handshake, MessageSquare, CheckCircle, XCircle, Star, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Textarea } from '../../components/ui/Textarea';
import { exchangeApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const ExchangeDetailsPage = () => {
    const { id } = useParams();
    const { user } = useAuth();

    const [exchange, setExchange] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [isActionLoading, setIsActionLoading] = useState(false);

    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        const fetchExchange = async () => {
            try {
                setIsLoading(true);
                const numericId = id.replace('EX-', '');
                const res = await exchangeApi.getById(numericId);
                setExchange(res.data);
                setError('');
            } catch (err) {
                console.error("Failed to fetch exchange info", err);
                setError("Failed to load exchange details.");
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchExchange();
        }
    }, [id]);

    const handleAccept = async () => {
        try {
            setIsActionLoading(true);
            const res = await exchangeApi.accept(exchange.id);
            setExchange(res.data);
        } catch (err) {
            console.error(err);
            alert("Failed to accept proposal");
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleReject = async () => {
        try {
            setIsActionLoading(true);
            const res = await exchangeApi.reject(exchange.id);
            setExchange(res.data);
        } catch (err) {
            console.error(err);
            alert("Failed to decline proposal");
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleSubmitReview = () => {
        setIsSubmitted(true);
        setTimeout(() => {
            setIsReviewOpen(false);
        }, 1500);
    };

    if (isLoading) {
        return <div className="p-8 text-center text-slate-500">Loading exchange details...</div>;
    }

    if (error || !exchange) {
        return <div className="p-8 text-center text-rose-500">{error || 'Exchange not found.'}</div>;
    }

    const isInitiator = user && user.id === exchange.initiatorId;
    const isReceiver = user && user.id === exchange.receiverId;

    const myBook = isInitiator ? exchange.offeredBookTitle : exchange.requestedBookTitle;
    const theirBook = isInitiator ? exchange.requestedBookTitle : exchange.offeredBookTitle;
    const partner = isInitiator ? exchange.receiverName : exchange.initiatorName;

    return (
        <div className="flex flex-col gap-6 w-full h-full pb-10">
            <div className="flex items-center gap-4 mb-2">
                <Link to="/exchanges" className="p-2 rounded-[4px] border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors bg-white">
                    <ArrowLeft className="w-4 h-4" />
                </Link>
                <span className="text-sm font-medium text-slate-500">Back to Exchange Hub</span>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-start">
                <div className="flex-1 w-full space-y-6">
                    <Card className="shadow-sm border-amber-200">
                        <CardContent className="p-8">
                            <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
                                <div>
                                    <p className="text-sm font-semibold text-slate-500 tracking-wider uppercase mb-1">Proposal Identity</p>
                                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">EX-{exchange.id}</h1>
                                    <p className="text-sm text-slate-500 mt-1">Initiated {exchange.createdAt ? new Date(exchange.createdAt).toLocaleString() : 'N/A'}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-[4px] text-xs font-bold uppercase tracking-widest border mb-2
                                        ${(exchange.status === 'ACCEPTED' || exchange.status === 'COMPLETED') ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                            : exchange.status === 'REJECTED' ? 'bg-rose-50 text-rose-700 border-rose-200'
                                                : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                        {exchange.status}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                                {/* Trade Indicator Line */}
                                <div className="hidden md:flex absolute inset-y-0 left-1/2 -ml-4 items-center justify-center pointer-events-none">
                                    <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center z-10">
                                        <RefreshCcw className="w-4 h-4 text-slate-400" />
                                    </div>
                                </div>
                                <div className="hidden md:block absolute inset-y-0 left-1/2 w-px bg-slate-100 z-0"></div>

                                {/* My Side */}
                                <div className="pr-4">
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">You Offer</h3>
                                    <div className="p-5 bg-slate-50 border border-slate-200 rounded-[4px]">
                                        <p className="font-semibold text-slate-900 text-lg">{myBook}</p>
                                    </div>
                                </div>

                                {/* Their Side */}
                                <div className="pl-0 md:pl-4">
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">You Receive</h3>
                                    <div className="p-5 bg-indigo-50 border border-indigo-200 rounded-[4px]">
                                        <p className="font-semibold text-indigo-900 text-lg">{theirBook}</p>
                                        <p className="text-sm text-indigo-700 mt-1"><span className="text-indigo-400">Owner:</span> {partner}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardContent className="p-6">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">Proposal Message</h3>
                            <div className="flex gap-4 p-4 bg-slate-50 rounded-[4px] border border-slate-100">
                                <Handshake className="w-6 h-6 text-slate-400 shrink-0" />
                                <p className="text-sm text-slate-700 italic">"{exchange.message || 'No message provided.'}"</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="w-full lg:w-80 space-y-6">
                    <Card className="shadow-sm">
                        <CardContent className="p-6">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2 mb-6">Action & Status</h3>

                            <div className="space-y-3">
                                {(exchange.status === 'ACCEPTED' || exchange.status === 'COMPLETED') ? (
                                    <>
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
                                        <Button
                                            variant="ghost"
                                            className="w-full text-indigo-600 hover:bg-indigo-50"
                                            leftIcon={<MessageSquare className="w-4 h-4" />}
                                        >
                                            Message {partner.split(' ')[0]}
                                        </Button>
                                    </>
                                ) : exchange.status === 'REJECTED' ? (
                                    <div className="p-3 rounded-[4px] bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium text-center">
                                        This proposal was declined.
                                    </div>
                                ) : (
                                    // PENDING
                                    <>
                                        {isReceiver ? (
                                            <>
                                                <Button
                                                    onClick={handleAccept}
                                                    isLoading={isActionLoading}
                                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700"
                                                    leftIcon={<CheckCircle className="w-4 h-4" />}
                                                >
                                                    Accept Proposal
                                                </Button>
                                                <Button
                                                    onClick={handleReject}
                                                    isLoading={isActionLoading}
                                                    variant="secondary"
                                                    className="w-full text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                                                    leftIcon={<XCircle className="w-4 h-4" />}
                                                >
                                                    Decline
                                                </Button>
                                            </>
                                        ) : (
                                            <div className="p-3 rounded-[4px] bg-slate-50 border border-slate-200 text-slate-600 text-sm font-medium text-center">
                                                Waiting for {partner.split(' ')[0]} to respond.
                                            </div>
                                        )}

                                        <Button
                                            variant="ghost"
                                            className="w-full text-indigo-600 hover:bg-indigo-50"
                                            leftIcon={<MessageSquare className="w-4 h-4" />}
                                        >
                                            Discuss Terms
                                        </Button>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Modal isOpen={isReviewOpen} onClose={() => setIsReviewOpen(false)} title="Rate Exchange Experience">
                <div className="space-y-6">
                    <div className="flex flex-col items-center justify-center gap-2">
                        <p className="text-sm font-semibold text-slate-700 mb-2">How was your exchange with {partner}?</p>
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
                        placeholder="Was the book in the described condition? Was the handover smooth?"
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
