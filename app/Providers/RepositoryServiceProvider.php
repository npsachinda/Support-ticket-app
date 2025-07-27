<?php

namespace App\Providers;

use App\Repositories\Interfaces\TicketRepositoryInterface;
use App\Repositories\TicketRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(TicketRepositoryInterface::class, TicketRepository::class);
    }
}
