<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\Logger;

class LoggerServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton(Logger::class, function ($app) {
            return new Logger();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
