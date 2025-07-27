import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Heading from '@/components/heading';

interface Agent {
    name: string;
}

interface Reply {
    id: number;
    message: string;
    created_at: string;
    agent: Agent;
}

interface Customer {
    name: string;
    email: string;
    phone: string;
}

interface Ticket {
    id: number;
    reference_number: string;
    summary: string;
    description: string;
    status: string;
    created_at: string;
    customer: Customer;
    replies: Reply[];
}

interface Props {
    ticket: Ticket;
}

export default function Show({ ticket }: Props) {
    const [replyMessage, setReplyMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await fetch(`/tickets/${ticket.id}/reply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ message: replyMessage }),
            });

            // Refresh the page to show the new reply
            window.location.reload();
        } catch (error) {
            console.error('Failed to submit reply:', error);
        } finally {
            setIsSubmitting(false);
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
        <div className="p-4">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <Heading>{ticket.summary}</Heading>
                    <p className="text-gray-500">Reference: {ticket.reference_number}</p>
                </div>
                <Badge className={getStatusColor(ticket.status)}>
                    {ticket.status.replace('_', ' ').toUpperCase()}
                </Badge>
            </div>

            <Card className="p-6 mb-6">
                <div className="space-y-4">
                    <div>
                        <h3 className="font-medium mb-2">Customer Details</h3>
                        <div className="text-gray-700">
                            <p>Name: {ticket.customer.name}</p>
                            <p>Email: {ticket.customer.email}</p>
                            <p>Phone: {ticket.customer.phone}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-medium mb-2">Description</h3>
                        <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
                    </div>
                </div>
            </Card>

            <div className="space-y-6">
                <Card className="p-6">
                    <h3 className="font-medium mb-4">Reply to Ticket</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <textarea
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                            rows={4}
                            className="w-full rounded-md border border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                            placeholder="Type your reply here..."
                            required
                        />
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Sending...' : 'Send Reply'}
                        </Button>
                    </form>
                </Card>

                {ticket.replies.length > 0 && (
                    <Card className="p-6">
                        <h3 className="font-medium mb-4">Previous Replies</h3>
                        <div className="space-y-4">
                            {ticket.replies.map((reply) => (
                                <div key={reply.id} className="bg-gray-50 p-4 rounded-md">
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
                    </Card>
                )}
            </div>
        </div>
    );
} 