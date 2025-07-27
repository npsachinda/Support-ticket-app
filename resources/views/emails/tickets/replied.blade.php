@component('mail::message')
# New Reply to Your Support Ticket

**Ticket Reference:** {{ $ticket->reference_number }}  
**Summary:** {{ $ticket->summary }}

**Reply from {{ $reply->agent->name }}:**  
{{ $reply->message }}

@component('mail::button', ['url' => url("/tickets/status/check?reference_number={$ticket->reference_number}")])
View Ticket Status
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent