import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';

export const RegisterPage = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const formData = new FormData(e.target);
        const firstName = formData.get('firstName');
        const lastName = formData.get('lastName');
        const email = formData.get('email');
        const password = formData.get('password');
        try {
            await register(`${firstName} ${lastName}`, email, password);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex justify-center items-center">
                        <div className="p-2 rounded-[4px] bg-white border border-slate-200 shadow-sm mb-4">
                            <BookOpen className="w-6 h-6 text-indigo-700" />
                        </div>
                    </Link>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                        Join the Network
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Create your academic library profile.
                    </p>
                </div>

                <Card>
                    <CardContent className="p-8">
                        <form className="space-y-4" onSubmit={handleRegister}>
                            {error && (
                                <div className="p-3 rounded-[4px] bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
                                    {error}
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="First Name" name="firstName" required placeholder="Jane" />
                                <Input label="Last Name" name="lastName" required placeholder="Doe" />
                            </div>

                            <Input label="Academic Email" name="email" type="email" required placeholder="student@university.edu" />
                            <Input label="Password" name="password" type="password" required placeholder="••••••••" />

                            <Button type="submit" className="w-full mt-4" disabled={isLoading}>
                                {isLoading ? 'Creating account...' : 'Create Account'}
                            </Button>
                        </form>

                        <div className="mt-6 relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-slate-500 text-xs font-medium uppercase">
                                    Or register with
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <Button variant="secondary" className="w-full text-sm">Google</Button>
                            <Button variant="secondary" className="w-full text-sm">GitHub</Button>
                        </div>
                    </CardContent>
                </Card>

                <p className="mt-6 text-center text-sm text-slate-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-indigo-700 hover:text-indigo-800 transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};
