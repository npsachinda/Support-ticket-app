<?php

namespace Tests\Unit;

use App\Models\Agent;
use App\Models\Customer;
use App\Models\Ticket;
use App\Models\User;
use App\Repositories\Interfaces\TicketRepositoryInterface;
use App\Services\TicketService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class TicketServiceTest extends TestCase
{
    use RefreshDatabase;

    private TicketService $ticketService;
    private TicketRepositoryInterface $ticketRepository;
    private Customer $customer;
    private Agent $agent;
    private Ticket $ticket;

    protected function setUp(): void
    {
        parent::setUp();
        Mail::fake();

        $this->ticketRepository = app(TicketRepositoryInterface::class);
        $this->ticketService = new TicketService($this->ticketRepository);

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

    public function test_create_ticket_with_new_customer(): void
    {
        $data = [
            'name' => 'New Customer',
            'email' => 'new@example.com',
            'phone' => '9876543210',
            'summary' => 'New Issue',
            'description' => 'Test Description',
        ];

        $ticket = $this->ticketService->createTicket($data);

        $this->assertDatabaseHas('customers', [
            'email' => 'new@example.com',
            'name' => 'New Customer',
            'phone' => '9876543210',
        ]);

        $this->assertDatabaseHas('tickets', [
            'id' => $ticket->id,
            'summary' => 'New Issue',
            'description' => 'Test Description',
            'status' => 'new',
        ]);

        Mail::assertSent(\App\Mail\TicketCreated::class, function ($mail) use ($data) {
            return $mail->hasTo($data['email']);
        });
    }

    public function test_create_ticket_with_existing_customer(): void
    {
        $data = [
            'name' => 'Test Customer',
            'email' => 'test@example.com',
            'phone' => '1234567890',
            'summary' => 'Another Issue',
            'description' => 'Another Description',
        ];

        $ticket = $this->ticketService->createTicket($data);

        $this->assertEquals($this->customer->id, $ticket->customer_id);
        $this->assertDatabaseCount('customers', 1);
    }

    public function test_get_ticket_by_reference(): void
    {
        $ticket = $this->ticketService->getTicketByReference($this->ticket->reference_number);

        $this->assertNotNull($ticket);
        $this->assertEquals($this->ticket->id, $ticket->id);
        $this->assertEquals($this->ticket->reference_number, $ticket->reference_number);
    }

    public function test_get_all_tickets(): void
    {
        $result = $this->ticketService->getAllTickets();

        $this->assertArrayHasKey('tickets', $result);
        $this->assertEquals(1, $result['tickets']->count());
    }

    public function test_search_tickets(): void
    {
        $result = $this->ticketService->searchTickets($this->customer->name);

        $this->assertArrayHasKey('tickets', $result);
        $this->assertEquals(1, $result['tickets']->count());
    }

    public function test_add_reply_to_ticket(): void
    {
        $replyData = [
            'message' => 'Test Reply',
            'agent_id' => $this->agent->id,
        ];

        $this->ticketService->addReply($this->ticket, $replyData);

        $this->assertDatabaseHas('ticket_replies', [
            'ticket_id' => $this->ticket->id,
            'message' => 'Test Reply',
            'agent_id' => $this->agent->id,
        ]);

        $this->assertEquals('in_progress', $this->ticket->fresh()->status);

        Mail::assertSent(\App\Mail\TicketReplied::class, function ($mail) {
            return $mail->hasTo($this->customer->email);
        });
    }
} 