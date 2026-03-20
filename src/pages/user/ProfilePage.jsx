import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { useAuth } from '../../context/AuthContext';
import { Camera, Mail, MapPin, GraduationCap } from 'lucide-react';
import { userApi } from '../../services/api';

export const ProfilePage = () => {
    const { user } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    const handleSave = async () => {
        try {
            setIsSaving(true);
            setMessage('');
            await userApi.updateProfile({ name });
            setMessage('Profile updated successfully! Refresh to see changes globally.');
        } catch (err) {
            console.error('Failed to update profile', err);
            setMessage('Failed to update profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full h-full pb-10">
            <div className="border-b border-slate-200 pb-5">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Academic Profile</h2>
                <p className="text-sm text-slate-500 mt-1">Manage your public presence on the Book Bridges network.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="space-y-6">
                    <Card className="shadow-sm">
                        <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                            <div className="relative mb-6">
                                <div className="w-32 h-32 rounded-full bg-indigo-100 text-indigo-700 font-bold text-4xl flex items-center justify-center border-4 border-white shadow-sm">
                                    {name ? name.substring(0, 2).toUpperCase() : 'US'}
                                </div>
                                <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-colors">
                                    <Camera className="w-5 h-5" />
                                </button>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">{name || 'Scholar'}</h3>
                            <p className="text-sm text-slate-500 mt-1">Computer Science Major</p>

                            <div className="w-full mt-6 space-y-3 pb-6 border-b border-slate-100 text-left">
                                <p className="text-sm flex items-center gap-3 text-slate-600">
                                    <Mail className="w-4 h-4 text-slate-400" />
                                    {user?.email || 'scholar@campus.edu'}
                                </p>
                                <p className="text-sm flex items-center gap-3 text-slate-600">
                                    <GraduationCap className="w-4 h-4 text-slate-400" />
                                    Class of 2026
                                </p>
                                <p className="text-sm flex items-center gap-3 text-slate-600">
                                    <MapPin className="w-4 h-4 text-slate-400" />
                                    North Campus Dorms
                                </p>
                            </div>

                            <div className="w-full pt-6 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xl font-black text-slate-900">12</p>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1">Exchanges</p>
                                </div>
                                <div>
                                    <p className="text-xl font-black text-slate-900">4.8</p>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1">Rating</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <Card className="shadow-sm">
                        <CardContent className="p-6 sm:p-8">
                            <h3 className="text-lg font-bold text-slate-900 mb-6">Personal Information</h3>
                            {message && (
                                <div className={`p-4 mb-6 text-sm rounded-[4px] border ${message.includes('success') ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                                    {message}
                                </div>
                            )}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                                <Input
                                    label="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <Input
                                    label="Academic Email"
                                    type="email"
                                    value={user?.email || ''}
                                    disabled
                                    helperText="Verified with University System"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <Input label="Major / Department" defaultValue="Computer Science" disabled />
                                <Select
                                    label="Expected Graduation Year"
                                    defaultValue="2026"
                                    disabled
                                    options={[
                                        { label: '2024', value: '2024' },
                                        { label: '2025', value: '2025' },
                                        { label: '2026', value: '2026' },
                                        { label: '2027', value: '2027' },
                                        { label: 'Graduate/PhD', value: 'grad' },
                                    ]}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardContent className="p-6 sm:p-8">
                            <h3 className="text-lg font-bold text-slate-900 mb-6">Default Logistics Preferences</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Select
                                    label="Preferred Payment Method"
                                    defaultValue="cash"
                                    disabled
                                    options={[
                                        { label: 'Cash (In-person)', value: 'cash' },
                                        { label: 'Venmo/CashApp', value: 'digital' },
                                        { label: 'Campus Dining Dollars', value: 'dining' },
                                    ]}
                                />
                                <Select
                                    label="Preferred Meetup Location"
                                    defaultValue="library"
                                    disabled
                                    options={[
                                        { label: 'Main Library', value: 'library' },
                                        { label: 'Student Union', value: 'union' },
                                        { label: 'North Campus Quad', value: 'quad' },
                                        { label: 'Other (Specify per trade)', value: 'other' },
                                    ]}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-3">
                        <Button variant="ghost" disabled={isSaving}>Cancel</Button>
                        <Button onClick={handleSave} disabled={isSaving || !name.trim()}>
                            {isSaving ? 'Saving...' : 'Save Profile Changes'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
