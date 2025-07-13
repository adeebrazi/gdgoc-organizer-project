
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Calendar, Lock } from 'lucide-react';
import type { DepartmentStatus } from '@/components/department-checklist';
import { Suspense } from 'react';
import { AppHeader } from '@/components/app-header';


function PaymentForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const departmentId = searchParams.get('departmentId');
    const amount = searchParams.get('amount');

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!departmentId) return;

        try {
            const studentId = localStorage.getItem('studentId');
            if (studentId) {
                const storageKey = `departmentStatusState_${studentId}`;
                const storedState = localStorage.getItem(storageKey);
                if (storedState) {
                    const state: Record<string, DepartmentStatus> = JSON.parse(storedState);
                    state[departmentId] = 'ready_to_apply';
                    localStorage.setItem(storageKey, JSON.stringify(state));
                }
            }
        } catch (error) {
            console.error("Failed to update localStorage", error);
        }

        router.push('/dashboard');
    };

    if (!departmentId || !amount) {
        return (
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Invalid Payment Request</CardTitle>
                    <CardDescription>
                        Department ID or amount is missing. Please go back and try again.
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
                </CardFooter>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-md">
            <form onSubmit={handlePayment}>
                <CardHeader>
                    <CardTitle>Secure Payment</CardTitle>
                    <CardDescription>
                        Clearing dues of ₹{Number(amount).toFixed(2)}. Please enter your payment details.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="card-number">Card Number</Label>
                        <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="card-number" placeholder="0000 0000 0000 0000" className="pl-10" required />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input id="expiry" placeholder="MM/YY" className="pl-10" required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cvc">CVC</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input id="cvc" placeholder="123" className="pl-10" required />
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full">
                        Pay ₹{Number(amount).toFixed(2)}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}


export default function PaymentPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
           <AppHeader/>
           <Suspense fallback={<div>Loading...</div>}>
             <PaymentForm />
           </Suspense>
        </div>
    );
}
