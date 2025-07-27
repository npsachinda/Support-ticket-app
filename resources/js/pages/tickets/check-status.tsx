import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

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

export default function CheckStatus() {
    const [referenceNumber, setReferenceNumber] = useState('');
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setTicket(null);

        try {
            const response = await fetch(`/tickets/status/check?reference_number=${referenceNumber}`, {
                headers: {
                    Accept: 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Invalid reference number');
                return;
            }

            setTicket(data.ticket);
        } catch (error) {
            setError('An error occurred. Please try again.');
        }
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
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Link href="/">
                        <Button variant="outline" className="mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Back to Home
                        </Button>
                    </Link>
                    <div className="text-center">
                        <Heading>Check Ticket Status</Heading>
                        <p className="mt-2 text-gray-600">Enter your ticket reference number to check its status</p>
                    </div>
                </div>

                <Card className="mb-8 p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="reference">Reference Number</Label>
                            <Input
                                id="reference"
                                value={referenceNumber}
                                onChange={(e) => setReferenceNumber(e.target.value)}
                                placeholder="Enter your ticket reference number"
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full">
                            Check Status
                        </Button>
                    </form>
                </Card>

                <p className="min-w-[200px] leading-relaxed break-words whitespace-normal text-red-700">{error}</p>

                {ticket && (
                    <Card className="p-6">
                        <div className="space-y-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold">{ticket.summary}</h3>
                                    <p className="text-sm text-gray-500">Reference: {ticket.reference_number}</p>
                                </div>
                                <Badge className={getStatusColor(ticket.status)}>{ticket.status.replace('_', ' ').toUpperCase()}</Badge>
                            </div>

                            <div className="rounded-md bg-gray-50 p-4">
                                <h4 className="mb-2 font-medium">Description</h4>
                                <p className="whitespace-pre-wrap text-gray-700">{ticket.description}</p>
                            </div>

                            {ticket.replies.length > 0 && (
                                <div>
                                    <h4 className="mb-4 font-medium">Support Responses</h4>
                                    <div className="space-y-4">
                                        {ticket.replies.map((reply) => (
                                            <div key={reply.id} className="rounded-md border bg-white p-4">
                                                <div className="mb-2 flex items-start justify-between">
                                                    <span className="font-medium">{reply.agent.name}</span>
                                                    <span className="text-sm text-gray-500">{new Date(reply.created_at).toLocaleDateString()}</span>
                                                </div>
                                                <p className="whitespace-pre-wrap text-gray-700">{reply.message}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
