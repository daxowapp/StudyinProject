import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
            <Card className="max-w-md w-full text-center border-none shadow-xl">
                <CardHeader>
                    <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-green-700">Payment Successful!</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">
                        Thank you for your payment. Your application has been successfully submitted.
                    </p>
                    <div className="bg-muted p-4 rounded-lg text-sm">
                        <div className="flex justify-between mb-2">
                            <span>Transaction ID:</span>
                            <span className="font-mono">TXN-123456789</span>
                        </div>
                        <div className="flex justify-between font-bold">
                            <span>Amount Paid:</span>
                            <span>$260.00</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <Link href="/applications/1/status" className="w-full">
                        <Button className="w-full">Track Application</Button>
                    </Link>
                    <Link href="/dashboard" className="w-full">
                        <Button variant="ghost" className="w-full">Return to Dashboard</Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
