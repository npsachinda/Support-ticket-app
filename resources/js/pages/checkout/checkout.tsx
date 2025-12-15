import { useState } from 'react';

import AuthSimpleLayout from '@/layouts/auth/auth-simple-layout';
import { Button } from '@/components/ui/button';
import { router, usePage } from '@inertiajs/react';

export default function Checkout({ plan }: { plan: 'hobby' | 'enterprise' }) {
    const handleCheckout = (plan: 'hobby' | 'enterprise') => {
        console.log(plan);
    };

    return (
        <AuthSimpleLayout>
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-2xl font-bold">Checkout</h1>
                <Button onClick={() => handleCheckout(plan)}>Checkout</Button>
                <Button onClick={() => router.visit(route('pricing.index'))}>Back</Button>
            </div>
        </AuthSimpleLayout>
    );
}