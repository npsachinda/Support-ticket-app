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
            do {
                $reference = strtoupper(Str::random(10));
            } while (static::where('reference_number', $reference)->exists());
            
            $ticket->reference_number = $reference;
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
        return $this->hasMany(TicketReply::class)->orderBy('created_at', 'asc');
    }

    public function scopeSearch($query, $search)
    {
        return $query->whereHas('customer', function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%");
        });
    }

    public function scopeNew($query)
    {
        return $query->where('status', 'new');
    }
}
