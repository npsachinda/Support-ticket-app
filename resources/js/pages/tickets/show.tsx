import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Heading from '@/components/heading';
import { Link } from '@inertiajs/react';

interface Props {
    ticket: {
        id: number;
        reference_number: string;
        summary: string;
        description: string;
        status: string;
        created_at: string;
        customer: {
            name: string;
            email: string;
        };
        replies?: Array<{
            id: number;
            message: string;
            created_at: string;
            agent: {
                name: string;
            };
        }>;
    };
}

export default function Show({ ticket }: Props) {
    const [replyMessage, setReplyMessage] = useState('');

    if (!ticket) {
        return <div>Loading...</div>;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/tickets/${ticket.id}/reply`, {
            message: replyMessage
        }, {
            onSuccess: () => setReplyMessage('')
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back button */}
            <Link href="/tickets">
                <Button variant="outline" className="mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Tickets
                </Button>
            </Link>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <Heading>{ticket.summary}</Heading>
                        <p className="text-sm text-gray-500 mt-1">Reference: {ticket.reference_number}</p>
                    </div>
                    <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                </div>

                <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Customer</h3>
                    <p className="text-sm">{ticket.customer.name}</p>
                    <p className="text-sm text-gray-500">{ticket.customer.email}</p>
                </div>

                <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                    <p className="text-sm whitespace-pre-wrap">{ticket.description}</p>
                </div>

                <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-4">Replies</h3>
                    {ticket.replies && ticket.replies.length > 0 ? (
                        <div className="space-y-4">
                            {ticket.replies.map((reply) => (
                                <div key={reply.id} className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="text-sm font-medium">{reply.agent.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(reply.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <p className="text-sm">{reply.message}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">No replies yet.</p>
                    )}
                </div>
            </div>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-4">Add Reply</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <textarea
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                            rows={4}
                            placeholder="Type your reply..."
                            required
                        />
                    </div>
                    <Button type="submit" disabled={!replyMessage.trim()}>
                        Send Reply
                    </Button>
                </form>
            </div>
        </div>
    );
}

function getStatusColor(status: string): string {
    switch (status) {
        case 'new':
            return 'bg-blue-100 text-blue-800';
        case 'in_progress':
            return 'bg-yellow-100 text-yellow-800';
        case 'resolved':
            return 'bg-green-100 text-green-800';
        case 'closed':
            return 'bg-gray-100 text-gray-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
} 