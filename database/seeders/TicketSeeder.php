<?php

namespace Database\Seeders;

use App\Models\Agent;
use App\Models\Customer;
use App\Models\Ticket;
use App\Models\TicketReply;
use Illuminate\Database\Seeder;

class TicketSeeder extends Seeder
{
    public function run(): void
    {
        $customers = Customer::all();
        $agents = Agent::all();
        $statuses = ['new', 'in_progress', 'resolved', 'closed'];

        // Create tickets for each customer
        foreach ($customers as $customer) {
            // Create 2-3 tickets per customer
            $numTickets = rand(2, 3);
            
            for ($i = 0; $i < $numTickets; $i++) {
                $status = $statuses[array_rand($statuses)];
                $agent = $status !== 'new' ? $agents->random() : null;
                
                $ticket = Ticket::create([
                    'summary' => $this->getRandomSummary(),
                    'description' => $this->getRandomDescription(),
                    'status' => $status,
                    'customer_id' => $customer->id,
                    'agent_id' => $agent?->id,
                ]);

                // Add replies for tickets that are not new
                if ($status !== 'new' && $agent) {
                    $numReplies = rand(1, 3);
                    for ($j = 0; $j < $numReplies; $j++) {
                        TicketReply::create([
                            'message' => $this->getRandomReply(),
                            'ticket_id' => $ticket->id,
                            'agent_id' => $agent->id,
                        ]);
                    }
                }
            }
        }
    }

    private function getRandomSummary(): string
    {
        $summaries = [
            'Cannot access my account',
            'Product not working as expected',
            'Need help with installation',
            'Billing issue',
            'Feature request',
            'Bug report',
            'Service unavailable',
            'Performance issues',
            'Need technical support',
            'Account upgrade request',
        ];

        return $summaries[array_rand($summaries)];
    }

    private function getRandomDescription(): string
    {
        $descriptions = [
            'I am unable to log in to my account. It keeps showing an error message.',
            'The product is not functioning as described in the documentation. Need assistance.',
            'Having trouble installing the software. Need step-by-step guidance.',
            'There appears to be an error in my recent billing statement.',
            'Would like to request a new feature that would improve workflow.',
            'Found a bug in the latest version. Steps to reproduce included.',
            'Cannot access the service since this morning. Is there an outage?',
            'The system is running very slowly. Need help optimizing.',
            'Need technical assistance with configuring advanced settings.',
            'Would like to upgrade my account to the premium plan.',
        ];

        return $descriptions[array_rand($descriptions)];
    }

    private function getRandomReply(): string
    {
        $replies = [
            'Thank you for reporting this issue. I\'ve checked your account and made the necessary adjustments.',
            'I understand your concern. Let me guide you through the process step by step.',
            'I\'ve investigated the issue and found the root cause. Here\'s what we need to do...',
            'I\'ve escalated this to our technical team. They will implement a fix soon.',
            'Thanks for the feedback. We\'ll consider this feature for our next release.',
            'I\'ve applied a temporary fix. Please try again and let me know if the issue persists.',
            'The service is back online now. Please try accessing it again.',
            'I\'ve optimized your settings. You should notice improved performance now.',
            'I\'ve updated your account settings as requested.',
            'Your account has been successfully upgraded. Enjoy the new features!',
        ];

        return $replies[array_rand($replies)];
    }
}
