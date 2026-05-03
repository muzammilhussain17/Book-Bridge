import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';


export const RegisterPage = () => {
    const navigate = useNavigate();
    const { register, googleLogin, user: authenticatedUser } = useAuth();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Redirect if already authenticated
    React.useEffect(() => {
        if (authenticatedUser) {
            const path = authenticatedUser.role === 'ADMIN' ? '/admin' : '/dashboard';
            navigate(path, { replace: true });
        }
    }, [authenticatedUser, navigate]);


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

    const handleGoogleSuccess = async (tokenResponse) => {
        setError('');
        setIsLoading(true);
        try {
            await googleLogin(tokenResponse.access_token);
            // Redirection will be handled by the useEffect above
        } catch (err) {
            setError(err.response?.data?.message || 'Google registration failed');
            setIsLoading(false);
        }
    };

    const loginWithGoogle = useGoogleLogin({
        onSuccess: handleGoogleSuccess,
        onError: () => setError('Google registration failed')
    });


    return (
        <div className="min-h-[calc(100dvh-140px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
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
                    <CardContent className="p-6 sm:p-8">
                        <form className="space-y-4" onSubmit={handleRegister}>
                            {error && (
                                <div className="p-3 rounded-[4px] bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
                                    {error}
                                </div>
                            )}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                        <div className="mt-6">
                            <Button 
                                onClick={() => loginWithGoogle()}
                                variant="secondary" 
                                className="w-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2"
                                disabled={isLoading}
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.01.67-2.28 1.09-3.71 1.09-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="currentColor" d="M5.84 14.13c-.22-.67-.35-1.39-.35-2.13s.13-1.46.35-2.13V7.03H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.97l3.66-2.84z" />
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.03l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Register with Google
                            </Button>
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
