<?php

namespace Tests\Unit;

use App\Models\Agent;
use App\Models\Customer;
use App\Models\Ticket;
use App\Models\User;
use App\Repositories\TicketRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TicketRepositoryTest extends TestCase
{
    use RefreshDatabase;

    private TicketRepository $repository;
    private Customer $customer;
    private Agent $agent;
    private Ticket $ticket;

    protected function setUp(): void
    {
        parent::setUp();

        $this->repository = new TicketRepository(new Ticket());

        // Create test data
        $user = User::factory()->create();
        $this->agent = Agent::create([
            'name' => $user->name,
            'email' => $user->email,
            'user_id' => $user->id,
        ]);

        $this->customer = Customer::create([
            'name' => 'Test Customer',
            'email' => 'test@example.com',
            'phone' => '1234567890',
        ]);

        $this->ticket = Ticket::create([
            'reference_number' => 'TEST123',
            'summary' => 'Test Summary',
            'description' => 'Test Description',
            'status' => 'new',
            'customer_id' => $this->customer->id,
        ]);
    }

    public function test_create_ticket(): void
    {
        $data = [
            'summary' => 'New Ticket',
            'description' => 'New Description',
            'customer_id' => $this->customer->id,
        ];

        $ticket = $this->repository->create($data);

        $this->assertInstanceOf(Ticket::class, $ticket);
        $this->assertEquals('New Ticket', $ticket->summary);
        $this->assertEquals('new', $ticket->status);
        $this->assertNotNull($ticket->reference_number);
    }

    public function test_find_by_reference(): void
    {
        $ticket = $this->repository->findByReference($this->ticket->reference_number);

        $this->assertNotNull($ticket);
        $this->assertEquals($this->ticket->id, $ticket->id);
    }

    public function test_get_all_paginated(): void
    {
        $tickets = $this->repository->getAllPaginated();

        $this->assertEquals(1, $tickets->count());
        $this->assertEquals($this->ticket->id, $tickets->first()->id);
    }

    public function test_find_by_id(): void
    {
        $ticket = $this->repository->findById($this->ticket->id);

        $this->assertNotNull($ticket);
        $this->assertEquals($this->ticket->id, $ticket->id);
    }

    public function test_update_ticket(): void
    {
        $result = $this->repository->update($this->ticket, [
            'status' => 'in_progress'
        ]);

        $this->assertTrue($result);
        $this->assertEquals('in_progress', $this->ticket->fresh()->status);
    }

    public function test_add_reply(): void
    {
        $this->repository->addReply($this->ticket, [
            'message' => 'Test Reply',
            'agent_id' => $this->agent->id,
        ]);

        $this->assertDatabaseHas('ticket_replies', [
            'ticket_id' => $this->ticket->id,
            'message' => 'Test Reply',
            'agent_id' => $this->agent->id,
        ]);
    }

    public function test_search_by_customer_name(): void
    {
        $tickets = $this->repository->searchByCustomerName($this->customer->name);

        $this->assertEquals(1, $tickets->count());
        $this->assertEquals($this->ticket->id, $tickets->first()->id);
    }

    public function test_search_by_customer_name_no_results(): void
    {
        $tickets = $this->repository->searchByCustomerName('Non Existent Customer');

        $this->assertEquals(0, $tickets->count());
    }
} 