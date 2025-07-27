import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import Heading from '@/components/heading';

interface Reply {
    id: number;
    message: string;
    created_at: string;
    agent: {
        name: string;
    };
}

interface Ticket {
    reference_number: string;
    summary: string;
    description: string;
    status: string;
    created_at: string;
    customer: {
        name: string;
        email: string;
    };
    replies: Reply[];
}

export default function Status() {
    const [referenceNumber, setReferenceNumber] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        router.get('/tickets/status/check', {
            reference_number: referenceNumber
        }, {
            preserveState: true,
            onError: (errors) => {
                setError(errors.reference_number || 'An error occurred. Please try again.');
            }
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new':
                return 'bg-blue-500';
            case 'in_progress':
                return 'bg-yellow-500';
            case 'resolved':
                return 'bg-green-500';
            case 'closed':
                return 'bg-gray-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <Heading>Check Ticket Status</Heading>

            <Card className="p-6 mb-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="reference">Reference Number</Label>
                        <Input
                            id="reference"
                            value={referenceNumber}
                            onChange={(e) => setReferenceNumber(e.target.value)}
                            placeholder="Enter your ticket reference number"
                        />
                    </div>

                    <Button type="submit" className="w-full">
                        Check Status
                    </Button>
                </form>
            </Card>

            {error && (
                <Alert className="mb-6 bg-red-50">
                    <p className="text-red-700">{error}</p>
                </Alert>
            )}

            {/* Back to Home button */}
            <div className="mt-4">
                <Button variant="outline" onClick={() => router.get('/')}>
                    Back to Home
                </Button>
            </div>
        </div>
    );
} 