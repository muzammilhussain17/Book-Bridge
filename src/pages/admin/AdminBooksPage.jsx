import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Database, Search, Edit2, Trash2, Filter } from 'lucide-react';
import { Input } from '../../components/ui/Input';

const BOOKS_DATA = [
    { id: 'BK-091', title: 'Introduction to Algorithms', author: 'Cormen, Leiserson, Rivest, Stein', isbn: '978-0262033848', currentListings: 12, category: 'Computer Science' },
    { id: 'BK-092', title: 'Campbell Biology', author: 'Urry, Cain, Minorsky', isbn: '978-0134093413', currentListings: 45, category: 'Biology' },
    { id: 'BK-093', title: 'Microeconomics', author: 'Paul Krugman, Robin Wells', isbn: '978-1319098780', currentListings: 8, category: 'Economics' },
];

export const AdminBooksPage = () => {
    const [books, setBooks] = useState(BOOKS_DATA);
    const [searchQuery, setSearchQuery] = useState('');

    const handleDelete = (id) => {
        setBooks(books.filter(book => book.id !== id));
    };

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.isbn.includes(searchQuery)
    );
    return (
        <div className="flex flex-col gap-6 w-full h-full pb-10">
            <div className="border-b border-slate-200 pb-5 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase flex items-center gap-3">
                        <Database className="w-6 h-6 text-indigo-600" />
                        Global Master Catalog
                    </h2>
                    <p className="text-sm text-slate-500 font-medium mt-2">Manage the canonical database of all textbook metadata used for listings.</p>
                </div>
                <Link to="/books/create">
                    <Button className="font-semibold text-xs uppercase tracking-widest">
                        + Add New Master Record
                    </Button>
                </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-2">
                <Input
                    placeholder="Search master catalog by ISBN, Title, or Author..."
                    className="w-full md:w-[400px] bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500"
                    leftIcon={<Search className="w-4 h-4 text-slate-400" />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="secondary" size="md" leftIcon={<Filter className="w-4 h-4" />} className="w-full md:w-auto font-semibold text-xs text-slate-700">
                    Filter Results
                </Button>
            </div>

            <Card className="shadow-sm border-slate-200">
                <CardContent className="p-0">
                    <Table className="border-0 shadow-none">
                        <TableHeader className="bg-slate-50 border-b border-slate-200">
                            <TableRow className="border-0">
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider h-12 w-24">Item ID</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider h-12">Metadata (Title / Author)</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider h-12 w-40">ISBN / Category</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider h-12 w-32 text-right">Active Listings</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider h-12 text-right w-32">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredBooks.map((book) => (
                                <TableRow key={book.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <TableCell>
                                        <span className="font-mono text-xs text-indigo-600 font-semibold">{book.id}</span>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm">{book.title}</p>
                                            <p className="text-xs text-slate-500 mt-1">{book.author}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="text-xs text-slate-600 font-medium">{book.isbn}</p>
                                            <span className="inline-block mt-1 bg-slate-100 border border-slate-200 text-slate-600 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-[2px]">
                                                {book.category}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className="font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-[2px] text-sm">
                                            {book.currentListings}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link to={`/books/edit/${book.id}`}>
                                                <Button variant="secondary" size="icon" className="w-8 h-8 rounded-[4px] text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border-slate-200" title="Edit Metadata">
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Button onClick={() => handleDelete(book.id)} variant="secondary" size="icon" className="w-8 h-8 rounded-[4px] text-rose-500 hover:text-rose-700 hover:bg-rose-50 border-slate-200" title="Delete Master Record">
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

            {filteredBooks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 px-4 bg-slate-50 border border-slate-200 border-dashed rounded-xl">
                    <Database className="w-12 h-12 text-slate-300 mb-4" />
                    <h3 className="text-lg font-bold text-slate-500">No Records Found</h3>
                    <p className="text-sm text-slate-400 mt-2">Try adjusting your search criteria.</p>
                </div>
            )}
        </div>
    );
};
