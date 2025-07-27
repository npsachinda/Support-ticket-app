<?php

namespace App\Services;

use App\Mail\TicketCreated;
use App\Mail\TicketReplied;
use App\Models\Customer;
use App\Models\Ticket;
use App\Repositories\Interfaces\TicketRepositoryInterface;
use Illuminate\Support\Facades\Mail;

class TicketService
{
    public function __construct(
        protected TicketRepositoryInterface $ticketRepository
    ) {
    }

    public function createTicket(array $data): Ticket
    {
        $customer = Customer::firstOrCreate(
            ['email' => $data['email']],
            [
                'name' => $data['name'],
                'phone' => $data['phone'],
            ]
        );

        $ticket = $this->ticketRepository->create([
            'summary' => $data['summary'],
            'description' => $data['description'],
            'customer_id' => $customer->id,
        ]);

        Mail::to($customer->email)->send(new TicketCreated($ticket));

        return $ticket;
    }

    public function getTicketByReference(string $reference): ?Ticket
    {
        return $this->ticketRepository->findByReference($reference);
    }

    public function getAllTickets(int $perPage = 10): array
    {
        return [
            'tickets' => $this->ticketRepository->getAllPaginated($perPage, ['customer', 'agent']),
        ];
    }

    public function searchTickets(string $search, int $perPage = 10): array
    {
        if (empty($search)) {
            return $this->getAllTickets($perPage);
        }

        $tickets = $this->ticketRepository->searchByCustomerName($search, $perPage);

        return [
            'tickets' => $tickets
        ];
    }

    public function addReply(Ticket $ticket, array $replyData): void
    {
        $this->ticketRepository->addReply($ticket, $replyData);

        $reply = $ticket->replies()->latest()->first();
        Mail::to($ticket->customer->email)->send(new TicketReplied($ticket, $reply));
    }
}
