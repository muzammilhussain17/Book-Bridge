import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BookOpen, User, Star, MessageSquare, ArrowLeft, ShieldCheck, RefreshCcw, ShoppingBag, CreditCard, MapPin } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { bookApi } from '../../services/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url}`;
};

export const BookDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [book, setBook] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                setIsLoading(true);
                const res = await bookApi.getById(id);
                setBook(res.data);
                if (res.data.imageUrls && res.data.imageUrls.length > 0) {
                    setSelectedImage(getImageUrl(res.data.imageUrls[0]));
                } else if (res.data.imageUrl) {
                    setSelectedImage(getImageUrl(res.data.imageUrl));
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load book details.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchBook();
    }, [id]);

    const handleConfirmPurchase = () => {
        setIsProcessing(true);
        // Simulate API call and payment processing
        setTimeout(() => {
            setIsProcessing(false);
            setIsCheckoutOpen(false);
            navigate('/purchases');
        }, 1500);
    };

    if (isLoading) return <div className="p-8 text-center text-slate-500">Loading details...</div>;
    if (error || !book) return <div className="p-8 text-center text-rose-500">{error || 'Book not found.'}</div>;



    return (
        <div className="flex flex-col gap-6 w-full h-full pb-10">
            <div className="flex items-center gap-4 mb-2">
                <Link to="/books" className="p-2 rounded-[4px] border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors bg-white">
                    <ArrowLeft className="w-4 h-4" />
                </Link>
                <span className="text-sm font-medium text-slate-500">Back to Library Directory</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-2">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="shadow-sm">
                        <CardContent className="p-8">
                            <div className="flex flex-wrap gap-2 mb-6">
                                <span className={`inline-flex items-center px-2 py-1 rounded-[2px] text-xs font-bold uppercase border ${book.transactionType === 'SALE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                    book.transactionType === 'DONATION' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                                        'bg-amber-50 text-amber-700 border-amber-200'
                                    }`}>
                                    {book.transactionType}
                                </span>
                                <span className="inline-flex px-2 py-1 rounded-[2px] bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider border border-slate-200">
                                    {book.courseCode || 'N/A'}
                                </span>
                                <span className="inline-flex px-2 py-1 rounded-[2px] bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider border border-slate-200">
                                    {book.condition?.replace('_', ' ')}
                                </span>
                            </div>

                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">{book.title}</h1>
                            <p className="text-lg text-slate-600 mb-8">{book.author}</p>

                            <div className="w-full mb-8">
                                <div className="w-full h-64 bg-slate-50 border border-slate-200 rounded-[4px] flex items-center justify-center mb-3 overflow-hidden">
                                    {selectedImage ? (
                                        <img src={selectedImage} alt={book.title} className="w-full h-full object-contain" />
                                    ) : (
                                        <BookOpen className="w-16 h-16 text-slate-300" />
                                    )}
                                </div>
                                {book.imageUrls && book.imageUrls.length > 1 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {book.imageUrls.map((url, i) => (
                                            <div
                                                key={i}
                                                onClick={() => setSelectedImage(getImageUrl(url))}
                                                className={`h-20 bg-slate-50 border rounded-[4px] overflow-hidden cursor-pointer transition-all ${selectedImage === getImageUrl(url) ? 'border-indigo-600 ring-2 ring-indigo-100 ring-offset-1' : 'border-slate-200 hover:border-indigo-400'}`}
                                            >
                                                <img src={getImageUrl(url)} alt={`${book.title} view ${i + 1}`} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="prose prose-slate max-w-none">
                                <h3 className="text-lg font-semibold text-slate-900 mb-3 border-b border-slate-200 pb-2">Description</h3>
                                <p className="text-slate-600 leading-relaxed mb-6">{book.description || 'No description provided.'}</p>

                                <h3 className="text-lg font-semibold text-slate-900 mb-3 border-b border-slate-200 pb-2">Academic Details</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="block text-slate-500 mb-1">ISBN</span>
                                        <span className="font-medium text-slate-900">{book.isbn || 'Not specified'}</span>
                                    </div>
                                    <div>
                                        <span className="block text-slate-500 mb-1">Course Code</span>
                                        <span className="font-medium text-slate-900 uppercase">{book.courseCode || 'Not specified'}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card className="shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-slate-900 text-xl">
                                    {book.transactionType === 'SALE' ? `Rs. ${book.price?.toFixed(2) || '0.00'}` : book.transactionType === 'DONATION' ? 'Free (Donation)' : 'Trade Offer'}
                                </h3>
                            </div>

                            <div className="space-y-3 mb-6">
                                {book.transactionType === 'EXCHANGE' && (
                                    <Button className="w-full" leftIcon={<RefreshCcw className="w-4 h-4" />}>
                                        Propose Exchange
                                    </Button>
                                )}
                                {book.transactionType === 'SALE' && (
                                    <Button className="w-full" leftIcon={<ShoppingBag className="w-4 h-4" />} onClick={() => setIsCheckoutOpen(true)}>
                                        Purchase Book
                                    </Button>
                                )}
                                {book.transactionType === 'DONATION' && (
                                    <Button className="w-full" leftIcon={<ShoppingBag className="w-4 h-4" />} onClick={() => setIsCheckoutOpen(true)}>
                                        Claim Donation
                                    </Button>
                                )}
                                <Button variant="secondary" className="w-full" leftIcon={<MessageSquare className="w-4 h-4" />}>
                                    Message Student
                                </Button>
                            </div>

                            <p className="text-xs text-slate-500 text-center flex justify-center items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> All transactions secured via ID.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardContent className="p-6">
                            <h3 className="text-sm font-semibold text-slate-900 tracking-tight uppercase mb-4">Lister Profile</h3>
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-[4px] flex items-center justify-center font-bold text-lg flex-shrink-0 overflow-hidden">
                                    {book.ownerAvatar ? (
                                        <img src={book.ownerAvatar} alt={book.ownerName} className="w-full h-full object-cover" />
                                    ) : (
                                        book.ownerName?.charAt(0) || 'U'
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 flex items-center gap-1">
                                        {book.ownerName || 'Unknown User'}
                                        <ShieldCheck className="w-4 h-4 text-emerald-600" title="Verified Student" />
                                    </h4>
                                    <p className="text-xs text-slate-500 mt-0.5">Student</p>
                                    <div className="flex items-center gap-1 mt-1.5">
                                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                        <span className="text-xs font-semibold text-slate-900">5.0</span>
                                        <span className="text-xs text-slate-500">(1 reviews)</span>
                                    </div>
                                </div>
                            </div>
                            <Link to={`/profile/${book.ownerId}`}>
                                <Button variant="ghost" size="sm" className="w-full text-indigo-700 bg-indigo-50 hover:bg-indigo-100">
                                    View Academic Record
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Checkout Modal */}
            <Modal
                isOpen={isCheckoutOpen}
                onClose={() => !isProcessing && setIsCheckoutOpen(false)}
                title="Secure Checkout"
                maxWidth="max-w-lg"
            >
                <div className="space-y-6">
                    <div className="flex items-start gap-4 p-4 bg-slate-50 border border-slate-200 rounded-[4px]">
                        <BookOpen className="w-8 h-8 text-indigo-700 shrink-0 mt-1" />
                        <div>
                            <h4 className="font-bold text-slate-900 leading-tight">{book.title}</h4>
                            <p className="text-sm text-slate-500 mt-1">Listed by {book.ownerName || 'Unknown User'}</p>
                            <p className="text-lg font-black text-indigo-700 mt-2">
                                {book.transactionType === 'SALE' ? `Rs. ${book.price?.toFixed(2) || '0.00'}` : book.transactionType === 'DONATION' ? 'Free (Donation)' : 'Trade Offer'}
                            </p>
                        </div>
                    </div>

                    <div>
                        <h4 className="flex items-center gap-2 font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-2">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            Delivery Information
                        </h4>
                        <Textarea
                            label="Full Delivery Address"
                            placeholder="e.g. John Doe, 123 Main St, Apt 4B, City, ZIP..."
                            className="min-h-[80px]"
                        />
                    </div>

                    {book.transactionType !== 'DONATION' && (
                        <div>
                            <h4 className="flex items-center gap-2 font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-2">
                                <CreditCard className="w-4 h-4 text-slate-400" />
                                Payment Method
                            </h4>

                            <div className="mb-4">
                                <Select
                                    name="paymentMethod"
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    options={[
                                        { label: 'Credit/Debit Card (Online)', value: 'card' },
                                        { label: 'Cash on Delivery (COD)', value: 'cod' }
                                    ]}
                                />
                            </div>

                            {paymentMethod === 'card' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <Input label="Name on Card" placeholder="John Doe" />
                                    <Input label="Card Number" placeholder="**** **** **** 4242" />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Input label="Expiry (MM/YY)" placeholder="12/25" />
                                        <Input label="CVC" placeholder="***" type="password" />
                                    </div>
                                </div>
                            )}

                            {paymentMethod === 'cod' && (
                                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-[4px] text-sm text-indigo-800 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <p className="font-semibold mb-1">Pay at Delivery</p>
                                    <p className="opacity-90">Please have the exact amount in cash (Rs. {book.price?.toFixed(2) || '0.00'}) ready upon delivery at your specified address.</p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                        <Button variant="ghost" onClick={() => setIsCheckoutOpen(false)} disabled={isProcessing}>
                            Cancel
                        </Button>
                        <Button onClick={handleConfirmPurchase} isLoading={isProcessing}>
                            {book.transactionType === 'DONATION' ? 'Confirm Claim' : 'Confirm Order'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
