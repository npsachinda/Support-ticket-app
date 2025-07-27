<?php

namespace App\Http\Controllers;

use App\Services\TicketService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Ticket;

class TicketController extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    public function __construct(
        protected TicketService $ticketService
    ) {
        $this->middleware('auth')->except(['create', 'store', 'checkStatus']);
    }

    public function create()
    {
        return inertia('tickets/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:100',
            'phone' => 'required|string|max:10',
            'summary' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $ticket = $this->ticketService->createTicket($validated);

        return back()->with([
            'message' => 'Ticket created successfully',
            'reference_number' => $ticket->reference_number,
        ]);
    }

    public function checkStatus(Request $request)
    {
        $request->validate([
            'reference_number' => 'required|string|exists:tickets,reference_number',
        ]);

        $ticket = $this->ticketService->getTicketByReference($request->reference_number);

        return inertia('tickets/status', [
            'ticket' => $ticket,
        ]);
    }

    public function index(Request $request)
    {
        $search = $request->get('search', '');
        
        if (!empty($search)) {
            return inertia('tickets/index', [
                ...$this->ticketService->searchTickets($search),
                'filters' => ['search' => $search]
            ]);
        }
        
        return inertia('tickets/index', [
            ...$this->ticketService->getAllTickets(),
            'filters' => ['search' => '']
        ]);
    }

    public function show(Ticket $ticket)
    {
        return inertia('tickets/show', [
            'ticket' => $ticket->load(['customer', 'replies.agent'])
        ]);
    }

    public function reply(int $id, Request $request)
    {
        $request->validate([
            'message' => 'required|string',
        ]);

        $ticket = $this->ticketService->getTicketByReference($id);

        $this->ticketService->addReply($ticket, [
            'message' => $request->message,
            'agent_id' => Auth::user()->agent->id,
        ]);

        return back();
    }
}
