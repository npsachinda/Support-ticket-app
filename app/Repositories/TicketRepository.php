<?php

namespace App\Repositories;

use App\Models\Ticket;
use App\Repositories\Interfaces\TicketRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class TicketRepository implements TicketRepositoryInterface
{
    public function __construct(protected Ticket $model)
    {
    }

    public function create(array $data): Ticket
    {
        return $this->model->create($data);
    }

    public function findByReference(string $reference): ?Ticket
    {
        return $this->model->where('reference_number', $reference)
            ->with(['replies.agent', 'customer'])
            ->first();
    }

    public function getAllPaginated(int $perPage = 10, array $with = []): LengthAwarePaginator
    {
        return $this->model->with($with)->latest()->paginate($perPage);
    }

    public function findById(int $id): ?Ticket
    {
        return $this->model->find($id);
    }

    public function update(Ticket $ticket, array $data): bool
    {
        return $ticket->update($data);
    }

    public function addReply(Ticket $ticket, array $replyData): void
    {
        $ticket->replies()->create($replyData);
    }

    public function searchByCustomerName(string $name, int $perPage = 10): LengthAwarePaginator
    {
        return $this->model->whereHas('customer', function ($query) use ($name) {
            $query->where('name', 'like', "%{$name}%");
        })->with(['customer', 'agent'])->latest()->paginate($perPage);
    }
}
