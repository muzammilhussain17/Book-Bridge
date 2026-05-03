import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, UploadCloud, BookOpen, Info, X } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { bookApi } from '../../services/api';

export const EditBookPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [images, setImages] = useState([]); // holds new File objects
    const [existingImages, setExistingImages] = useState([]); // holds existing URLs

    const [originalPrice, setOriginalPrice] = useState('');
    const [transactionType, setTransactionType] = useState('SALE');
    const [formData, setFormData] = useState({
        title: '', author: '', isbn: '', condition: '', course: '', description: '',
    });

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const res = await bookApi.getById(id);
                const book = res.data;
                setFormData({
                    title: book.title,
                    author: book.author,
                    isbn: book.isbn || '',
                    condition: book.condition,
                    course: book.courseCode || '',
                    description: book.description || ''
                });
                setTransactionType(book.transactionType);
                if (book.price) {
                    setOriginalPrice((book.price * 2).toFixed(2));
                }
                if (book.imageUrls && book.imageUrls.length > 0) {
                    setExistingImages(book.imageUrls);
                } else if (book.imageUrl) {
                    setExistingImages([book.imageUrl]);
                }
                setIsLoading(false);
            } catch (err) {
                console.error(err);
                setError("Failed to load listing details.");
                setIsLoading(false);
            }
        };
        fetchListing();
    }, [id]);

    const calculatedPrice = originalPrice && !isNaN(originalPrice)
        ? (parseFloat(originalPrice) * 0.5).toFixed(2)
        : '0.00';

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (existingImages.length + images.length + files.length > 4) {
            setError('You can only have up to 4 images total.');
            return;
        }
        setError('');
        setImages((prev) => [...prev, ...files].slice(0, 4));
    };

    const removeNewImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index) => {
        setExistingImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            let uploadedUrls = [];
            if (images.length > 0) {
                const uploadData = new FormData();
                images.forEach(img => uploadData.append('images', img));
                const uploadRes = await bookApi.uploadImages(uploadData);
                uploadedUrls = uploadRes.data;
            }

            const finalImageUrls = [...existingImages, ...uploadedUrls];

            const reqData = {
                title: formData.title,
                author: formData.author,
                isbn: formData.isbn,
                condition: formData.condition,
                courseCode: formData.course,
                description: formData.description,
                transactionType: transactionType,
                price: transactionType === 'DONATION' || transactionType === 'EXCHANGE' ? 0.00 : parseFloat(calculatedPrice),
                category: 'Textbook',
                imageUrl: finalImageUrls.length > 0 ? finalImageUrls[0] : null,
                imageUrls: finalImageUrls
            };

            await bookApi.update(id, reqData);
            navigate('/my-listings');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || err.response?.data?.error || 'Failed to update listing.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="p-8 text-center text-slate-500">Loading editor...</div>;

    return (
        <div className="flex flex-col gap-6 w-full h-full pb-10">
            <div className="flex items-center gap-4 border-b border-slate-200 pb-5">
                <div className="flex-1">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Edit Listing</h2>
                    <p className="text-sm text-slate-500 mt-1">Update the details for your public material listing.</p>
                </div>
            </div>

            {error && (
                <div className="bg-rose-50 text-rose-600 p-4 rounded-[4px] border border-rose-200 text-sm font-medium">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="shadow-sm">
                        <CardContent className="p-6 sm:p-8 space-y-6">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2">Material Details</h3>

                            <Input label="Title" name="title" value={formData.title} onChange={handleChange} required />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <Input label="Author(s)" name="author" value={formData.author} onChange={handleChange} required />
                                <Input label="ISBN-13" name="isbn" value={formData.isbn} onChange={handleChange} />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <Select
                                    label="Condition"
                                    name="condition"
                                    value={formData.condition}
                                    onChange={handleChange}
                                    options={[
                                        { label: 'New (Sealed)', value: 'NEW' },
                                        { label: 'Like New (No markings)', value: 'LIKE_NEW' },
                                        { label: 'Good (Minor wear/markings)', value: 'GOOD' },
                                        { label: 'Fair (Noticeable wear)', value: 'FAIR' },
                                        { label: 'Poor (Heavy wear)', value: 'POOR' },
                                    ]}
                                    required
                                />
                                <Input label="Course Code" name="course" value={formData.course} onChange={handleChange} required />
                            </div>

                            <Textarea
                                label="Description & Notes"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="min-h-[120px]"
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="shadow-sm border-indigo-200">
                        <CardContent className="p-6 space-y-6 bg-slate-50/50">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2">Listing Type & Pricing</h3>

                            <Select
                                label="Transaction Preference"
                                name="transactionType"
                                value={transactionType}
                                onChange={(e) => setTransactionType(e.target.value)}
                                options={[
                                    { label: 'Sale Only', value: 'SALE' },
                                    { label: 'Exchange Only', value: 'EXCHANGE' },
                                    { label: 'Donate (Free)', value: 'DONATION' },
                                ]}
                            />

                            {transactionType !== 'EXCHANGE' && transactionType !== 'DONATION' && (
                                <>
                                    <Input
                                        label="Original Retail Price (Rs)"
                                        name="originalPrice"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={originalPrice}
                                        onChange={(e) => setOriginalPrice(e.target.value)}
                                        required
                                    />

                                    <div className="bg-indigo-50 border border-indigo-100 rounded-[4px] p-4 text-sm">
                                        <div className="flex items-start gap-2 text-indigo-800 mb-2">
                                            <Info className="w-4 h-4 mt-0.5 shrink-0" />
                                            <p className="font-semibold leading-tight">Platform Rule: 50% Markdown</p>
                                        </div>
                                        <p className="text-indigo-700 leading-relaxed mb-3">
                                            To ensure fair access to education, all listed books are automatically priced at exactly 50% of their original retail value.
                                        </p>
                                        <div className="flex items-center justify-between pt-3 border-t border-indigo-200/50">
                                            <span className="font-bold text-indigo-900">Your Listing Price:</span>
                                            <span className="text-lg font-black text-indigo-700">Rs {calculatedPrice}</span>
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="pt-2">
                                <label className="text-sm font-medium text-slate-700 block mb-2">
                                    Manage Images (Max 4 Total)
                                </label>

                                {(existingImages.length > 0 || images.length > 0) && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                        {existingImages.map((url, i) => (
                                            <div key={`existing-${i}`} className="relative group rounded-[4px] border border-slate-200 overflow-hidden bg-slate-50 h-24">
                                                <img src={url} alt="Existing" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeExistingImage(i)}
                                                    className="absolute top-1 right-1 p-1 bg-white/90 text-slate-700 hover:text-rose-600 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                        {images.map((img, i) => (
                                            <div key={`new-${i}`} className="relative group rounded-[4px] border border-indigo-200 overflow-hidden bg-indigo-50 h-24">
                                                <img src={URL.createObjectURL(img)} alt="New" className="w-full h-full object-cover opacity-80" />
                                                <span className="absolute bottom-1 left-1 bg-indigo-600 text-white text-[9px] px-1 rounded uppercase font-bold">New</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewImage(i)}
                                                    className="absolute top-1 right-1 p-1 bg-white/90 text-slate-700 hover:text-rose-600 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {existingImages.length + images.length < 4 && (
                                    <div className="relative w-full h-32 border-2 border-dashed border-slate-200 rounded-[4px] bg-white flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer group">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-[0]"
                                        />
                                        <UploadCloud className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform text-indigo-400" />
                                        <span className="text-xs font-medium">Click to add more images</span>
                                        <span className="text-[10px] text-slate-400 mt-1">{4 - (existingImages.length + images.length)} slots remaining</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Button type="submit" className="w-full h-12 text-sm shadow-md" isLoading={isSubmitting}>
                        Save Changes
                    </Button>
                    <Link to="/my-listings" className="block text-center mt-4">
                        <Button type="button" variant="ghost" disabled={isSubmitting} className="w-full text-slate-500 hover:text-slate-900">
                            Cancel
                        </Button>
                    </Link>
                </div>
            </form>
        </div>
    );
};
