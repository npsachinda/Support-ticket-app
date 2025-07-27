import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Heading from '@/components/heading';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';

interface Customer {
    name: string;
    email: string;
}

interface Ticket {
    id: number;
    reference_number: string;
    summary: string;
    status: string;
    created_at: string;
    customer: Customer;
}

interface Props {
    tickets: {
        data: Ticket[];
        current_page: number;
        last_page: number;
    };
    filters: {
        search: string;
    };
}

export default function Index({ tickets, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        window.location.href = `/tickets?search=${encodeURIComponent(search)}`;
    };

    const handleLogout = () => {
        router.post('/logout');
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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white shadow dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
                            <span className="ml-2 text-xl font-bold dark:text-white">Support System</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <AppearanceToggleDropdown />
                            <Button variant="outline" onClick={handleLogout}>
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-6">
                    <Heading className="dark:text-white">Support Tickets</Heading>
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <Input
                            type="search"
                            placeholder="Search by customer name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="dark:bg-gray-700 dark:text-white"
                        />
                        <Button type="submit">Search</Button>
                    </form>
                </div>

                <div className="bg-white shadow-sm rounded-lg overflow-hidden dark:bg-gray-800">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                        Reference
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                        Summary
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                        Customer
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                        Created
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                {tickets.data.map((ticket) => (
                                    <tr key={ticket.id} className={ticket.status === 'new' ? 'bg-blue-50 dark:bg-blue-900/20' : ''}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {ticket.reference_number}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                            {ticket.summary}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            <div>{ticket.customer.name}</div>
                                            <div className="text-xs">{ticket.customer.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge className={getStatusColor(ticket.status)}>
                                                {ticket.status.replace('_', ' ').toUpperCase()}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(ticket.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <Link
                                                href={`/tickets/${ticket.id}`}
                                                className="text-primary hover:text-primary-dark dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                View Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {tickets.last_page > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                        {tickets.current_page > 1 && (
                            <Link href={`/tickets?page=${tickets.current_page - 1}&search=${search}`}>
                                <Button variant="outline">Previous</Button>
                            </Link>
                        )}
                        {tickets.current_page < tickets.last_page && (
                            <Link href={`/tickets?page=${tickets.current_page + 1}&search=${search}`}>
                                <Button variant="outline">Next</Button>
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
} 