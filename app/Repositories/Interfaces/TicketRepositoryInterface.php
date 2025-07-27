<?php

namespace App\Repositories\Interfaces;

use App\Models\Ticket;
use Illuminate\Pagination\LengthAwarePaginator;

interface TicketRepositoryInterface
{
    public function create(array $data): Ticket;
    public function findByReference(string $reference): ?Ticket;
    public function getAllPaginated(int $perPage = 10, array $with = []): LengthAwarePaginator;
    public function findById(int $id): ?Ticket;
    public function update(Ticket $ticket, array $data): bool;
    public function addReply(Ticket $ticket, array $replyData): void;
    public function searchByCustomerName(string $name, int $perPage = 10): LengthAwarePaginator;
}
