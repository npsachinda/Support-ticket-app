import { Button } from '@/components/ui/button';
import AuthSimpleLayout from '@/layouts/auth/auth-simple-layout';
import { router } from '@inertiajs/react';

 export default function Success({ message }: { message: string }) {
    return (
        <AuthSimpleLayout>
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-2xl font-bold">Your subscription has been created successfully</h1>
                <p className="text-sm text-muted-foreground">{message}</p>
                <Button onClick={() => router.visit(route('pricing.index'))}>Back</Button>
            </div>
        </AuthSimpleLayout>
    );
}