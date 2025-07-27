import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import Heading from '@/components/heading';

export default function Create() {
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
        <div className="max-w-2xl mx-auto p-4">
            <Heading>Create Support Ticket</Heading>

            {success && (
                <Alert className="mb-6 bg-green-50">
                    <p>{success.message}</p>
                    <p className="mt-2">
                        Your reference number is: <strong>{success.reference}</strong>
                        <br />
                        Please save this number to check your ticket status later.
                    </p>
                </Alert>
            )}

            <Card className="p-6">
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
            </Card>
        </div>
    );
} 