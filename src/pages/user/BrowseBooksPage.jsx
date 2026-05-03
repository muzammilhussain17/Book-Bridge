import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Search, Filter, BookOpen, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { bookApi } from '../../services/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url}`;
};

export const BrowseBooksPage = () => {
    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [department, setDepartment] = useState('all');
    const [transactionType, setTransactionType] = useState('any');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [bookCondition, setBookCondition] = useState('any');
    const [sortBy, setSortBy] = useState('newest');

    const filters = useMemo(() => ({
        searchTerm, department, transactionType, minPrice, maxPrice, bookCondition, sortBy
    }), [searchTerm, department, transactionType, minPrice, maxPrice, bookCondition, sortBy]);

    const fetchBooks = async () => {
        try {
            setIsLoading(true);
            const apiParams = {
                search: filters.searchTerm,
                department: filters.department === 'all' ? null : filters.department,
                transactionType: filters.transactionType === 'any' ? null : filters.transactionType,
                minPrice: filters.minPrice,
                maxPrice: filters.maxPrice,
                condition: filters.bookCondition === 'any' ? null : filters.bookCondition,
                sortBy: filters.sortBy
            };
            const response = await bookApi.getAll(apiParams);
            setBooks(response.data.content || response.data || []);
        } catch (err) {
            console.error("Failed to load books:", err);
            setError('Failed to load library resources. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchBooks();
    }, [filters]);

    const [isFilterExpanded, setIsFilterExpanded] = useState(false);

    const filteredBooks = books;

    const handleClearFilters = () => {
        setSearchTerm('');
        setDepartment('all');
        setTransactionType('any');
        setMinPrice('');
        setMaxPrice('');
        setBookCondition('any');
        setSortBy('newest');
    };

    return (
        <div className="flex flex-col gap-6 w-full h-full pb-10">
            <div className="flex items-end justify-between border-b border-slate-200 pb-5">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Browse Library</h2>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Search the academic exchange network for textbooks.</p>
                </div>
            </div>

            <Card className="shadow-sm border-slate-200 z-10 relative">
                <CardContent className="p-5">
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <Input
                                label="Search Query"
                                placeholder="Search by title, author, or course code..."
                                leftIcon={<Search className="w-4 h-4" />}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="w-full md:w-48">
                            <Select
                                label="Department"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                options={[
                                    { label: 'All Departments', value: 'all' },
                                    { label: 'Computer Science', value: 'cs' },
                                    { label: 'Mathematics', value: 'math' },
                                    { label: 'Physics', value: 'physics' },
                                ]}
                            />
                        </div>
                        <div className="w-full md:w-48">
                            <Select
                                label="Transaction"
                                value={transactionType}
                                onChange={(e) => setTransactionType(e.target.value)}
                                options={[
                                    { label: 'Any Transaction', value: 'any' },
                                    { label: 'For Sale', value: 'sale' },
                                    { label: 'For Exchange', value: 'exchange' },
                                    { label: 'Free (Donation)', value: 'donate' },
                                ]}
                            />
                        </div>
                        <Button
                            variant="secondary"
                            className="w-full md:w-auto mt-4 md:mt-0"
                            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                        >
                            <Filter className="w-4 h-4 mr-2" />
                            {isFilterExpanded ? 'Less' : 'More'}
                        </Button>
                    </div>

                    <AnimatePresence>
                        {isFilterExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                className="overflow-hidden border-t border-slate-100 pt-4"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="col-span-1 md:col-span-2 flex flex-col sm:flex-row gap-4">
                                        <div className="flex-1">
                                            <Input
                                                label="Min Price (Rs.)"
                                                type="number"
                                                placeholder="0.00"
                                                value={minPrice}
                                                onChange={(e) => setMinPrice(e.target.value)}
                                                disabled={transactionType === 'exchange' || transactionType === 'donate'}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <Input
                                                label="Max Price (Rs.)"
                                                type="number"
                                                placeholder="100.00"
                                                value={maxPrice}
                                                onChange={(e) => setMaxPrice(e.target.value)}
                                                disabled={transactionType === 'exchange' || transactionType === 'donate'}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Select
                                            label="Condition"
                                            value={bookCondition}
                                            onChange={(e) => setBookCondition(e.target.value)}
                                            options={[
                                                { label: 'Any Condition', value: 'any' },
                                                { label: 'Like New', value: 'Like New' },
                                                { label: 'Good', value: 'Good' },
                                                { label: 'Acceptable', value: 'Acceptable' },
                                            ]}
                                        />
                                    </div>
                                    <div>
                                        <Select
                                            label="Sort By"
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            options={[
                                                { label: 'Newest First', value: 'newest' },
                                                { label: 'Price: Low to High', value: 'price_asc' },
                                                { label: 'Price: High to Low', value: 'price_desc' },
                                                { label: 'Title: A-Z', value: 'title_asc' },
                                            ]}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end mt-4">
                                    <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-slate-500 hover:text-rose-600">
                                        <X className="w-3.5 h-3.5 mr-1.5" />
                                        Clear Filters
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>

            {filteredBooks.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 bg-slate-50 border border-slate-200 border-dashed rounded-[4px]">
                    <Search className="w-10 h-10 text-slate-300 mb-4" />
                    <h3 className="text-lg font-bold text-slate-900">No books found</h3>
                    <p className="text-slate-500 mt-1 max-w-sm text-center text-sm">We couldn't find any resources matching your current filters. Try adjusting your search or clearing filters.</p>
                    <Button variant="secondary" className="mt-6" onClick={handleClearFilters}>
                        Clear All Filters
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredBooks.map(book => (
                        <Link key={book.id} to={`/books/${book.id}`} className="block group">
                            <Card className="h-full flex flex-col border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300">
                                <CardContent className="p-0 flex flex-col h-full">
                                    <div className="h-44 bg-slate-50 border-b border-slate-100 flex items-center justify-center overflow-hidden relative group-hover:bg-indigo-50/30 transition-colors">
                                        {book.imageUrl ? (
                                            <img src={getImageUrl(book.imageUrl)} alt={book.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <BookOpen className="w-16 h-16 text-slate-300 group-hover:text-indigo-200 transition-colors" />
                                        )}
                                        <div className="absolute top-3 left-3 flex gap-1.5">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-[2px] text-[10px] font-bold uppercase tracking-wider border shadow-sm ${book.transactionType === 'SALE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                book.transactionType === 'DONATION' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                                                    'bg-amber-50 text-amber-700 border-amber-200'
                                                }`}>
                                                {book.transactionType}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-bold text-slate-900 leading-tight mb-1 line-clamp-2 md:text-lg group-hover:text-indigo-700 transition-colors">{book.title}</h3>
                                            <p className="text-sm font-medium text-slate-500 mb-4">{book.author}</p>

                                            <div className="flex flex-wrap gap-2 mb-4">
                                                <span className="inline-flex px-2 py-0.5 rounded-[2px] bg-slate-100/50 text-slate-600 text-[11px] font-bold uppercase tracking-wider border border-slate-200">
                                                    {book.courseCode || 'N/A'}
                                                </span>
                                                <span className="inline-flex px-2 py-0.5 rounded-[2px] bg-slate-100/50 text-slate-600 text-[11px] font-bold uppercase tracking-wider border border-slate-200">
                                                    {book.condition?.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2">
                                            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                                {book.transactionType === 'SALE' ? 'Asking Price' : book.transactionType === 'DONATION' ? 'Free Pickup' : 'Willing to Trade'}
                                            </span>
                                            <span className="text-lg font-black tracking-tight text-slate-900">
                                                {book.transactionType === 'SALE' ? `Rs. ${book.price?.toFixed(2) || '0.00'}` : book.transactionType === 'DONATION' ? 'Free' : 'Trade'}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}

            {filteredBooks.length > 0 && (
                <div className="flex justify-center mt-6">
                    <Button variant="secondary" className="px-8 shadow-sm">Load More Resources</Button>
                </div>
            )}
        </div>
    );
};
