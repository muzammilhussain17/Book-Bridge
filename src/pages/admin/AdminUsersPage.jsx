import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Users, Search, Filter, Shield, MoreVertical } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { adminApi } from '../../services/api';

export const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuspendedOnly, setShowSuspendedOnly] = useState(false);
    const [roleFilter, setRoleFilter] = useState('All');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsLoading(true);
                // Can pass pagination params {page: 0, size: 50} here if desired
                const res = await adminApi.listUsers({ size: 100 });
                setUsers(res.data.content || []);
                setError('');
            } catch (err) {
                console.error("Failed to fetch users:", err);
                setError("Failed to load user directory.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user => {
        const nameStr = user.name || '';
        const emailStr = user.email || '';
        const idStr = user.id ? user.id.toString() : '';

        const matchesSearch = nameStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emailStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
            idStr.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = showSuspendedOnly ? user.status === 'SUSPENDED' : true;
        const matchesRole = roleFilter === 'All' ? true : user.role === roleFilter.toUpperCase();

        return matchesSearch && matchesStatus && matchesRole;
    });

    if (isLoading && users.length === 0) {
        return <div className="p-8 text-center text-slate-500">Loading directory...</div>;
    }

    return (
        <div className="flex flex-col gap-6 w-full h-full pb-10">
            <div className="border-b border-slate-200 pb-5">
                <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase flex items-center gap-3">
                    <Users className="w-6 h-6 text-fuchsia-600" />
                    Network Directory
                </h2>
                <p className="text-sm text-slate-500 font-medium mt-2">Manage user accounts, roles, and administrative sanctions.</p>
            </div>

            {error && (
                <div className="bg-rose-50 text-rose-600 border border-rose-200 p-4 rounded-[4px] text-sm font-medium">
                    {error}
                </div>
            )}

            <div className="flex items-center gap-4 mb-2">
                <Input
                    placeholder="Search by name, email, or user ID..."
                    className="w-[400px] bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500"
                    leftIcon={<Search className="w-4 h-4 text-slate-400" />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="flex gap-2">
                    <Button
                        onClick={() => setRoleFilter(prev => prev === 'All' ? 'Admin' : prev === 'Admin' ? 'User' : 'All')}
                        variant="secondary"
                        size="md"
                        leftIcon={<Filter className="w-4 h-4" />}
                        className={`font-semibold text-xs transition-colors ${roleFilter !== 'All' ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100' : 'text-slate-700'}`}
                    >
                        {roleFilter === 'All' ? 'Filter Accounts' : `Role: ${roleFilter}`}
                    </Button>
                    <Button
                        onClick={() => setShowSuspendedOnly(!showSuspendedOnly)}
                        variant="secondary"
                        size="md"
                        leftIcon={<Shield className="w-4 h-4" />}
                        className={`font-semibold text-xs transition-colors ${showSuspendedOnly ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100' : 'text-slate-700'}`}
                    >
                        {showSuspendedOnly ? 'All Users' : 'View Suspended'}
                    </Button>
                </div>
            </div>

            <Card className="shadow-sm border-slate-200">
                <CardContent className="p-0">
                    <Table className="border-0 shadow-none">
                        <TableHeader className="bg-slate-50 border-b border-slate-200">
                            <TableRow className="border-0">
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider h-12 w-24">User ID</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider h-12">Identity</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider h-12 w-32">Role</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider h-12 w-32">Status / Strikes</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider h-12 text-right w-24">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <TableCell>
                                        <span className="font-mono text-xs text-fuchsia-600 font-semibold">{user.id}</span>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                                            <p className="text-xs text-slate-500 mt-1">{user.email}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-block border text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-[2px] ${user.role === 'ADMIN' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <span className={`w-2 h-2 rounded-full ${user.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                            <span className="text-xs font-semibold text-slate-700">{user.status}</span>
                                            {user.strikeCount > 0 && (
                                                <span className="font-bold text-xs text-rose-600 ml-2">[{user.strikeCount}X]</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link to={`/admin/users/${user.id}`}>
                                            <Button variant="secondary" size="md" className="font-semibold text-xs transition-colors">
                                                Manage
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {filteredUsers.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center py-20 px-4 bg-slate-50 border border-slate-200 border-dashed rounded-xl">
                    <Users className="w-12 h-12 text-slate-300 mb-4" />
                    <h3 className="text-lg font-bold text-slate-500">No Users Found</h3>
                    <p className="text-sm text-slate-400 mt-2">No accounts match your current filters.</p>
                </div>
            )}
        </div>
    );
};
