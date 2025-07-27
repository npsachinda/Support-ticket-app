@component('mail::message')
# New Reply to Your Support Ticket

Dear {{ $ticket->customer->name }},

A support agent has replied to your ticket:

**Reference Number:** {{ $ticket->reference_number }}
**Summary:** {{ $ticket->summary }}

**Agent's Reply:**
{{ $reply->message }}

You can check the full conversation and status of your ticket anytime by visiting our support portal and entering your reference number.

Thanks,<br>
{{ config('app.name') }}
@endcomponent