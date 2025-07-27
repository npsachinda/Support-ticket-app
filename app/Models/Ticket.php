<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Ticket extends Model
{
    protected $fillable = [
        'reference_number',
        'summary',
        'description',
        'status',
        'customer_id',
        'agent_id',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($ticket) {
            $ticket->reference_number = Str::random(10);
            $ticket->status = $ticket->status ?? 'new';
        });
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function agent(): BelongsTo
    {
        return $this->belongsTo(Agent::class);
    }

    public function replies(): HasMany
    {
        return $this->hasMany(TicketReply::class);
    }

    public function scopeSearch($query, $search)
    {
        return $query->whereHas('customer', function ($query) use ($search) {
            $query->where('name', 'like', "%{$search}%");
        });
    }

    public function scopeNew($query)
    {
        return $query->where('status', 'new');
    }
}
