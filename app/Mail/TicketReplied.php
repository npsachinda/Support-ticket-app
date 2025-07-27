<?php

namespace App\Mail;

use App\Models\Ticket;
use App\Models\TicketReply;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TicketReplied extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Ticket $ticket,
        public TicketReply $reply
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Reply to Your Support Ticket - ' . $this->ticket->reference_number,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.tickets.replied',
            with: [
                'ticket' => $this->ticket,
                'reply' => $this->reply,
            ],
        );
    }
} 