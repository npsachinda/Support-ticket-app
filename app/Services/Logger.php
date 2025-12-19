<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class Logger
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function log($message): string
    {
        Log::info($message);
        return "Logged: " . $message;
    }

    public function error($message): string
    {
        Log::error($message);
        return "Error: " . $message;
    }

    public function warning($message): string
    {
        Log::warning($message);
        return "Warning: " . $message;
    }

    public function debug($message): string
    {
        Log::debug($message);
        return "Debug: " . $message;
    }
}
