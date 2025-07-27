<?php

use App\Http\Controllers\TicketController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Landing page
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Guest ticket routes
Route::get('/tickets/create', [TicketController::class, 'create'])->name('tickets.create');
Route::post('/tickets', [TicketController::class, 'store'])->name('tickets.store');
Route::get('/tickets/check-status', function () {
    return Inertia::render('tickets/check-status', [
        'ticket' => null,
        'errors' => session()->get('errors') ? session()->get('errors')->getBag('default')->getMessages() : (object) []
    ]);
})->name('tickets.check-status');
Route::get('/tickets/status/check', [TicketController::class, 'checkStatus'])->name('tickets.status.check');

// Agent ticket routes
Route::middleware(['auth'])->group(function () {
    Route::get('/tickets', [TicketController::class, 'index'])->name('tickets.index');
    Route::get('/tickets/{ticket}', [TicketController::class, 'show'])->name('tickets.show');
    Route::post('/tickets/{ticket}/reply', [TicketController::class, 'reply'])->name('tickets.reply');

    Route::get('/settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::put('/settings/password', [PasswordController::class, 'update'])->name('password.update');
});

require __DIR__.'/auth.php';
