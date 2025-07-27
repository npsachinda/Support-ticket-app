<?php

namespace Tests\Feature;

use App\Models\Agent;
use App\Models\Customer;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TicketManagementTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Agent $agent;
    private Customer $customer;
    private Ticket $ticket;

    protected function setUp(): void
    {
        parent::setUp();

        // Create test user and agent
        $this->user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);

        $this->agent = Agent::create([
            'name' => $this->user->name,
            'email' => $this->user->email,
            'user_id' => $this->user->id,
        ]);

        // Create test customer
        $this->customer = Customer::create([
            'name' => 'Test Customer',
            'email' => 'customer@example.com',
            'phone' => '1234567890',
        ]);

        // Create test ticket
        $this->ticket = Ticket::create([
            'reference_number' => 'TEST123',
            'summary' => 'Test Ticket',
            'description' => 'Test Description',
            'status' => 'new',
            'customer_id' => $this->customer->id,
        ]);
    }

    public function test_guest_can_create_ticket(): void
    {
        $response = $this->post('/tickets', [
            'name' => 'New Customer',
            'email' => 'new@example.com',
            'phone' => '9876543210',
            'summary' => 'New Issue',
            'description' => 'Detailed description of the issue',
        ]);

        $response->assertStatus(302); // Redirect back
        $this->assertDatabaseHas('customers', ['email' => 'new@example.com']);
        $this->assertDatabaseHas('tickets', ['summary' => 'New Issue']);
    }

    public function test_guest_cannot_access_agent_routes(): void
    {
        $this->get('/tickets')->assertRedirect('/login');
        $this->get("/tickets/{$this->ticket->id}")->assertRedirect('/login');
        $this->post("/tickets/{$this->ticket->id}/reply")->assertRedirect('/login');
    }
} 