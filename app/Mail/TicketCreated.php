<?php

namespace App\Mail;

use App\Models\Ticket;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TicketCreated extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Ticket $ticket)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Support Ticket Created - ' . $this->ticket->reference_number,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.tickets.created',
            with: [
                'ticket' => $this->ticket,
            ],
        );
    }
}
