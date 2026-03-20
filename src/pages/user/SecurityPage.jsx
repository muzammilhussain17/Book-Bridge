import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ShieldCheck, KeyRound, Smartphone, AlertTriangle } from 'lucide-react';
import { userApi } from '../../services/api';

export const SecurityPage = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handlePasswordChange = async () => {
        setMessage('');
        setError('');

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('All fields are required.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('New password and confirm password do not match.');
            return;
        }

        try {
            setIsSaving(true);
            await userApi.changePassword({ currentPassword, newPassword });
            setMessage('Password updated successfully.');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            console.error("Failed to update password", err);
            setError(err.response?.data?.error || 'Failed to update password. Please check your current password.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full h-full pb-10 max-w-4xl">
            <div className="border-b border-slate-200 pb-5">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Security Settings</h2>
                <p className="text-sm text-slate-500 mt-1">Manage your password, 2FA, and authorized devices.</p>
            </div>

            <div className="space-y-6">
                <Card className="shadow-sm border-emerald-200">
                    <CardContent className="p-6 flex items-start gap-4">
                        <div className="p-3 bg-emerald-50 rounded-full shrink-0">
                            <ShieldCheck className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-1">Account Security Status</h3>
                            <p className="text-slate-600 text-sm">Your account is well-protected. Academic email is verified, and there are no recent suspicious logins.</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardContent className="p-8">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <KeyRound className="w-5 h-5 text-slate-400" />
                            Change Password
                        </h3>

                        {message && (
                            <div className="p-4 mb-6 text-sm rounded-[4px] border bg-emerald-50 text-emerald-700 border-emerald-200">
                                {message}
                            </div>
                        )}
                        {error && (
                            <div className="p-4 mb-6 text-sm rounded-[4px] border bg-rose-50 text-rose-700 border-rose-200">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4 max-w-md">
                            <Input
                                label="Current Password"
                                type="password"
                                placeholder="••••••••"
                                value={currentPassword}
                                onChange={e => setCurrentPassword(e.target.value)}
                            />
                            <Input
                                label="New Password"
                                type="password"
                                placeholder="••••••••"
                                helperText="Must be at least 8 characters long."
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                            />
                            <Input
                                label="Confirm New Password"
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                            />
                            <Button
                                className="mt-4"
                                onClick={handlePasswordChange}
                                disabled={isSaving || !currentPassword || !newPassword || !confirmPassword}
                            >
                                {isSaving ? 'Updating...' : 'Update Password'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardContent className="p-8">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Smartphone className="w-5 h-5 text-slate-400" />
                            Two-Factor Authentication (2FA)
                        </h3>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-4 border border-slate-200 rounded-[4px] bg-slate-50">
                            <div>
                                <h4 className="font-semibold text-slate-900">Authenticator App</h4>
                                <p className="text-sm text-slate-500 mt-1">Use an app like Google Authenticator or Authy to generate verification codes.</p>
                            </div>
                            <Button variant="secondary" className="shrink-0 bg-white" disabled>Coming Soon</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-rose-200">
                    <CardContent className="p-8">
                        <h3 className="text-lg font-bold text-rose-700 mb-6 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-rose-500" />
                            Danger Zone
                        </h3>
                        <p className="text-sm text-slate-600 mb-6">
                            Permanently delete your account and all associated data, including active listings and transaction history. This action cannot be undone.
                        </p>
                        <Button variant="danger" disabled>Delete Account (Disabled)</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
