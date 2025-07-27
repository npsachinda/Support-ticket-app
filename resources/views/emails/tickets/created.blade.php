@component('mail::message')
# Support Ticket Created

Dear {{ $ticket->customer->name }},

Your support ticket has been created successfully. Please keep the reference number below for future inquiries:

**Reference Number:** {{ $ticket->reference_number }}

**Summary:** {{ $ticket->summary }}

**Description:**
{{ $ticket->description }}

You can check the status of your ticket anytime by visiting our support portal and entering your reference number.

Thank you for contacting us. We will get back to you as soon as possible.

Thanks,<br>
{{ config('app.name') }}
@endcomponent 