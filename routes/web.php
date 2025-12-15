<?php

use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PricingController;
use Inertia\Inertia;
use Laravel\Cashier\Http\Controllers\WebhookController;

// Landing page
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Stripe Cashier webhook (used by Stripe / Stripe CLI)
Route::post('/stripe/webhook', [WebhookController::class, 'handleWebhook'])->name('cashier.webhook');

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

    Route::get('/pricing', [PricingController::class, 'index'])->name('pricing.index');
    Route::get('/checkout', [CheckoutController::class, 'checkout'])->name('checkout.checkout');
    Route::get('/checkout/success', [CheckoutController::class, 'success'])->name('checkout.success');
    Route::get('/checkout/cancel', [CheckoutController::class, 'cancel'])->name('checkout.cancel');

    Route::get('/settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::put('/settings/password', [PasswordController::class, 'update'])->name('password.update');
});

require __DIR__.'/auth.php';
