import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import Heading from '@/components/heading';

export default function Welcome() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        summary: '',
        description: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [success, setSuccess] = useState<{ message: string; reference: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setSuccess(null);

        try {
            const response = await fetch('/tickets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrors(data.errors || {});
                return;
            }

            setSuccess({
                message: data.message,
                reference: data.reference_number,
            });
            setFormData({
                name: '',
                email: '',
                phone: '',
                summary: '',
                description: '',
            });
        } catch (error) {
            setErrors({ general: 'An error occurred. Please try again.' });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="flex justify-between items-center py-6">
                    <div className="flex items-center">
                        <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
                        <span className="ml-2 text-xl font-bold">Support System</span>
                    </div>
                    <Link href="/login">
                        <Button variant="outline">Agent Login</Button>
                    </Link>
                </div>

                
                <div className="py-12">
                    <div className="text-center mb-12">
                        <Heading className="mb-4">Welcome to Our Support System</Heading>
                        <p className="text-lg text-gray-600">
                            Need help? Submit a ticket below and our support team will assist you.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        
                        <Card className="p-6">
                            {success ? (
                                <div className="text-center">
                                    <Alert className="mb-6 bg-green-50">
                                        <p>{success.message}</p>
                                        <p className="mt-2">
                                            Your reference number is: <strong>{success.reference}</strong>
                                            <br />
                                            Please save this number to check your ticket status later.
                                        </p>
                                    </Alert>
                                    <Button
                                        onClick={() => setSuccess(null)}
                                        className="mt-4"
                                    >
                                        Submit Another Ticket
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={errors.name ? 'border-red-500' : ''}
                                        />
                                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={errors.email ? 'border-red-500' : ''}
                                        />
                                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className={errors.phone ? 'border-red-500' : ''}
                                        />
                                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="summary">Summary</Label>
                                        <Input
                                            id="summary"
                                            name="summary"
                                            value={formData.summary}
                                            onChange={handleChange}
                                            className={errors.summary ? 'border-red-500' : ''}
                                        />
                                        {errors.summary && <p className="text-red-500 text-sm mt-1">{errors.summary}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="description">Description</Label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows={5}
                                            className={`w-full rounded-md border ${
                                                errors.description ? 'border-red-500' : 'border-gray-300'
                                            } shadow-sm focus:border-primary focus:ring-primary`}
                                        />
                                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                                    </div>

                                    <Button type="submit" className="w-full">
                                        Submit Ticket
                                    </Button>
                                </form>
                            )}
                        </Card>

                        
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Check Ticket Status</h3>
                                <p className="text-gray-600 mb-4">
                                    Already submitted a ticket? Check its status using your reference number.
                                </p>
                                <Link href={route('tickets.check-status')}>
                                    <Button variant="outline">Check Status</Button>
                                </Link>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                                <h3 className="text-lg font-semibold">Why Choose Our Support?</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start">
                                        <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Quick response times</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Professional support team</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Easy ticket tracking</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Email notifications</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
