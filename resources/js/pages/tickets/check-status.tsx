import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
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

interface Props {
    ticket?: Ticket;
    errors: {
        reference_number?: string;
    };
}

export default function CheckStatus({ ticket, errors }: Props) {
    const [referenceNumber, setReferenceNumber] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/tickets/status/check', {
            reference_number: referenceNumber
        }, {
            preserveState: true
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new':
                return 'bg-blue-500 text-white';
            case 'in_progress':
                return 'bg-yellow-500 text-white';
            case 'resolved':
                return 'bg-green-500 text-white';
            case 'closed':
                return 'bg-gray-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <Heading>Check Ticket Status</Heading>
                <Link href="/">
                    <Button variant="outline">Back to Home</Button>
                </Link>
            </div>

            {!ticket && (
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
            )}

            <p className="text-red-700 break-words whitespace-normal leading-relaxed min-w-[200px]">
    {errors.reference_number}
</p>


            {ticket && (
                <Card className="p-6">
                    <div className="space-y-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-semibold">{ticket.summary}</h3>
                                <p className="text-sm text-gray-500">
                                    Reference: {ticket.reference_number}
                                </p>
                            </div>
                            <Badge className={getStatusColor(ticket.status)}>
                                {ticket.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-md">
                            <h4 className="font-medium mb-2">Description</h4>
                            <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
                        </div>

                        {ticket.replies && ticket.replies.length > 0 && (
                            <div>
                                <h4 className="font-medium mb-4">Replies</h4>
                                <div className="space-y-4">
                                    {ticket.replies.map((reply) => (
                                        <div key={reply.id} className="bg-white p-4 rounded-md border">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-medium">{reply.agent.name}</span>
                                                <span className="text-sm text-gray-500">
                                                    {new Date(reply.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 whitespace-pre-wrap">{reply.message}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </Card>
            )}
        </div>
    );
}
