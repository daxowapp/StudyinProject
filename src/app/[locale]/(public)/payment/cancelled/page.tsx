import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentCancelledPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
            <Card className="max-w-md w-full text-center border-none shadow-xl">
                <CardHeader>
                    <div className="mx-auto h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                        <XCircle className="h-8 w-8 text-red-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-red-700">Payment Cancelled</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">
                        Your payment was cancelled or failed. No charges were made.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        You can try again or contact support if you continue to experience issues.
                    </p>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <Link href="/applications/1" className="w-full">
                        <Button className="w-full">Try Again</Button>
                    </Link>
                    <Link href="/dashboard" className="w-full">
                        <Button variant="ghost" className="w-full">Return to Dashboard</Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
