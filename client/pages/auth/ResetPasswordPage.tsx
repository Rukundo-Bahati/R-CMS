import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Loader2, CheckCircle2, KeyRound, Mail, Eye, EyeOff } from 'lucide-react';
import { api } from '@/lib/api';

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState(searchParams.get('email') || '');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }
        if (otp.length < 6) {
            return setError('Please enter the 6-digit code');
        }

        setLoading(true);
        setError('');
        try {
            await api.auth.resetPassword({ email, otp, newPassword: password });
            setSuccess(true);
            setTimeout(() => navigate('/auth/login'), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md p-8 shadow-xl border-border bg-card/80 backdrop-blur-xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Reset Password</h1>
                    <p className="text-muted-foreground mt-2">Enter the verification code sent to your email.</p>
                </div>

                {success ? (
                    <div className="text-center py-8">
                        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-foreground">Success!</h3>
                        <p className="text-muted-foreground mt-2">
                            Your password has been updated successfully. <br />
                            Redirecting you to login...
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm rounded-lg">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-muted/50 border border-gray-200 dark:border-border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-foreground"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Verification Code</label>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    required
                                    maxLength={6}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-muted/50 border border-gray-200 dark:border-border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-foreground"
                                    placeholder="123456"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">New Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-muted/50 border border-gray-200 dark:border-border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-foreground"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-indigo-600 transition-colors focus:outline-none"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Confirm Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-muted/50 border border-gray-200 dark:border-border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-foreground"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-indigo-600 transition-colors focus:outline-none"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full py-6 mt-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg dark:shadow-none"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Update Password'}
                        </Button>
                    </form>
                )}
            </Card>
        </div>
    );
}
