<?php

namespace App\Http\Controllers;

use App\Mail\TicketCreated;
use App\Mail\TicketReplied;
use App\Models\Customer;
use App\Models\Ticket;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class TicketController extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    public function __construct()
    {
        $this->middleware('auth')->except(['create', 'store', 'checkStatus']);
    }

    public function create()
    {
        return Inertia::render('tickets/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:100',
            'phone' => 'required|string|max:10',
            'summary' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $customer = Customer::firstOrCreate(
            ['email' => $request->email],
            [
                'name' => $request->name,
                'phone' => $request->phone,
            ]
        );

        $ticket = $customer->tickets()->create([
            'summary' => $request->summary,
            'description' => $request->description,
        ]);

        Mail::to($customer->email)->send(new TicketCreated($ticket));

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

        $ticket = Ticket::with(['replies.agent', 'customer'])
            ->where('reference_number', $request->reference_number)
            ->firstOrFail();

        return response()->json([
            'ticket' => $ticket
        ]);
    }

    public function index(Request $request)
    {
        $query = Ticket::with(['customer', 'agent'])
            ->when($request->search, function ($query, $search) {
                $query->search($search);
            })
            ->latest();

        return Inertia::render('tickets/index', [
            'tickets' => $query->paginate(10),
            'filters' => $request->only(['search']),
        ]);
    }

    public function show(Ticket $ticket)
    {
        $ticket->load(['customer', 'agent', 'replies.agent']);

        return Inertia::render('tickets/show', [
            'ticket' => $ticket,
        ]);
    }

    public function reply(Ticket $ticket, Request $request)
    {
        $request->validate([
            'message' => 'required|string',
        ]);

        $reply = $ticket->replies()->create([
            'message' => $request->message,
            'agent_id' => Auth::user()->agent->id,
        ]);

        $ticket->update(['status' => 'in_progress']);

        Mail::to($ticket->customer->email)->send(new TicketReplied($ticket, $reply));

        return back();
    }
}
