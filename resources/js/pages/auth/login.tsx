import { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import AuthSimpleLayout from '@/layouts/auth/auth-simple-layout';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: false,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        router.post('/login', formData, {
            onError: (errors) => {
                setErrors(errors);
                setIsSubmitting(false);
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Link href="/">
                    <Button variant="outline" className="mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back to Home
                    </Button>
                </Link>

                <AuthSimpleLayout
                    title="Agent Login"
                    description="Sign in to access your support dashboard"
                >
                    <Card className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    autoComplete="username"
                                    onChange={handleChange}
                                    className={errors.email ? 'border-red-500' : ''}
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    autoComplete="current-password"
                                    onChange={handleChange}
                                    className={errors.password ? 'border-red-500' : ''}
                                />
                                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    id="remember"
                                    checked={formData.remember}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-primary border-gray-300 rounded"
                                />
                                <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
                                    Remember me
                                </label>
                            </div>

                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? 'Signing in...' : 'Sign in'}
                            </Button>
                        </form>
                    </Card>
                </AuthSimpleLayout>
            </div>
        </div>
    );
}
