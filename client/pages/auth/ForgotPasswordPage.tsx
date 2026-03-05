import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Loader2, ArrowLeft, Send } from 'lucide-react';
import { api } from '@/lib/api';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.auth.forgotPassword(email);
            setSuccess(true);
            // After 2 seconds, redirect to reset password page passing the email
            setTimeout(() => {
                navigate(`/auth/reset-password?email=${encodeURIComponent(email)}`);
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md p-8 shadow-xl border-border bg-card/80 backdrop-blur-xl">
                <div className="mb-8">
                    <Link to="/auth/login" className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 mb-6 group">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to login
                    </Link>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Forgot password?</h1>
                    <p className="text-muted-foreground mt-2">No worries, we'll send you a reset code via email.</p>
                </div>

                {success ? (
                    <div className="text-center py-4">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Send className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">Code Sent!</h3>
                        <p className="text-muted-foreground mt-2 mb-8">
                            We've sent a 6-digit reset code to <br />
                            <span className="font-semibold text-foreground">{email}</span>
                        </p>
                        <p className="text-sm text-gray-400 animate-pulse">Redirecting to reset page...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm rounded-lg">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-muted/50 border border-gray-200 dark:border-border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-foreground"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full py-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg dark:shadow-none"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Send Reset Code'}
                        </Button>
                    </form>
                )}
            </Card>
        </div>
    );
}
