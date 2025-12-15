<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Plan;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function checkout(Request $request)
    {
        $plan = Plan::where('name', $request->plan)->first();
        if (!$plan) {
            return redirect()->route('pricing.index')->with('error', 'Plan not found');
        }
        $price = $plan->stripe_price_id;

        return $request->user()
        ->newSubscription('default', $price)
        ->trialDays(5)
        ->allowPromotionCodes()
        ->checkout([
            'success_url' => route('checkout.success'),
            'cancel_url' => route('checkout.cancel'),
        ]);
    }

    /**
     * Success callback from Stripe
     * @return \Inertia\Response
     */ 
    public function success(Request $request)
    {
        return Inertia::render('checkout/success', [
            'message' => 'Subscription created successfully',
        ]);
    }
}
