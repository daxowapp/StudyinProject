'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    CreditCard,
    Upload,
    CheckCircle2,
    AlertCircle,
    Clock,
    DollarSign,
    FileText,
    Loader2,
    X,
    RotateCcw
} from 'lucide-react';
import Image from 'next/image';
import { uploadPaymentReceipt, resetPaymentStatus } from '../actions';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { Price } from '@/components/currency/Price';

interface PaymentRequestCardProps {
    transaction: {
        id: string;
        amount: number;
        currency: string;
        description?: string;
        status: string;
        deadline?: string;
        receipt_url?: string;
        created_at: string;
    };
}

export function PaymentRequestCard({ transaction }: PaymentRequestCardProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
            if (!validTypes.includes(file.type)) {
                toast.error('Please upload a JPG, PNG, or PDF file');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size must be less than 5MB');
                return;
            }

            setSelectedFile(file);

            // Create preview for images
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviewUrl(reader.result as string);
                };
                reader.readAsDataURL(file);
            } else {
                setPreviewUrl(null);
            }
        }
    };

    const handleUploadReceipt = async () => {
        if (!selectedFile) {
            toast.error('Please select a file');
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const result = await uploadPaymentReceipt(transaction.id, formData);

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success('Receipt uploaded successfully! Awaiting verification.');
                setTimeout(() => window.location.reload(), 1500);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to upload receipt");
        } finally {
            setIsUploading(false);
        }
    };

    const handleCardPayment = async () => {
        setIsProcessing(true);
        try {
            // Call our checkout API to create a Stripe Checkout Session
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    applicationId: transaction.id,
                    amount: transaction.amount,
                    currency: transaction.currency.toLowerCase(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create checkout session');
            }

            // Redirect to Stripe Checkout
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error('No checkout URL received');
            }
        } catch (err) {
            console.error(err);
            toast.error((err as Error).message || "Payment failed");
            setIsProcessing(false);
        }
    };

    const isOverdue = transaction.deadline && new Date(transaction.deadline) < new Date();
    const isPending = transaction.status === 'pending';
    const isCompleted = transaction.status === 'completed';
    const isPendingVerification = transaction.status === 'pending_verification';

    return (
        <Card className={`border-l-4 ${isCompleted ? 'border-l-green-500 bg-green-50/50' :
            isPendingVerification ? 'border-l-blue-500 bg-blue-50/50' :
                isOverdue ? 'border-l-red-500 bg-red-50/50' :
                    'border-l-orange-500 bg-orange-50/50'
            }`}>
            <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-100' :
                            isPendingVerification ? 'bg-blue-100' :
                                'bg-orange-100'
                            }`}>
                            {isCompleted ? (
                                <CheckCircle2 className="w-6 h-6 text-green-600" />
                            ) : isPendingVerification ? (
                                <Clock className="w-6 h-6 text-blue-600" />
                            ) : (
                                <DollarSign className="w-6 h-6 text-orange-600" />
                            )}
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <CardTitle className="text-xl">Payment Request</CardTitle>
                                {isCompleted && (
                                    <Badge className="bg-green-600 text-white">
                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                        Paid
                                    </Badge>
                                )}
                                {isPendingVerification && (
                                    <Badge className="bg-blue-600 text-white">
                                        <Clock className="w-3 h-3 mr-1" />
                                        Pending Verification
                                    </Badge>
                                )}
                                {isPending && !isOverdue && (
                                    <Badge className="bg-orange-100 text-orange-800">
                                        <AlertCircle className="w-3 h-3 mr-1" />
                                        Action Required
                                    </Badge>
                                )}
                                {isOverdue && (
                                    <Badge className="bg-red-600 text-white">
                                        <AlertCircle className="w-3 h-3 mr-1" />
                                        Overdue
                                    </Badge>
                                )}
                            </div>

                            <div className="text-3xl font-bold text-gray-900 mb-2">
                                <Price amount={transaction.amount} currency={transaction.currency} />
                            </div>

                            <p className="text-sm text-muted-foreground mb-2">
                                {transaction.description}
                            </p>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    Requested {formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}
                                </span>
                                {transaction.deadline && (
                                    <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 font-semibold' : ''}`}>
                                        <AlertCircle className="w-4 h-4" />
                                        Due: {new Date(transaction.deadline).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </CardHeader>

            {!isCompleted && !isPendingVerification && (
                <CardContent>
                    <Tabs defaultValue="receipt" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="receipt" className="gap-2">
                                <Upload className="w-4 h-4" />
                                Upload Receipt
                            </TabsTrigger>
                            <TabsTrigger value="card" className="gap-2">
                                <CreditCard className="w-4 h-4" />
                                Pay by Card
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="receipt" className="space-y-4 mt-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="font-semibold text-blue-900 text-sm">Upload Payment Receipt</p>
                                        <p className="text-sm text-blue-800 mt-1">
                                            If you&apos;ve already made the payment, upload your receipt here for verification.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="receipt-upload">Select Receipt (JPG, PNG, or PDF)</Label>
                                    <Input
                                        id="receipt-upload"
                                        type="file"
                                        accept="image/jpeg,image/png,image/jpg,application/pdf"
                                        onChange={handleFileSelect}
                                        className="mt-2 cursor-pointer"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Maximum file size: 5MB
                                    </p>
                                </div>

                                {selectedFile && (
                                    <div className="bg-white border rounded-lg p-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-start gap-3 flex-1">
                                                <FileText className="w-8 h-8 text-blue-600" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm truncate">{selectedFile.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Drag &apos;n&apos; drop your receipt here, or click to select file ({(selectedFile.size / 1024).toFixed(1)} KB)
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedFile(null);
                                                    setPreviewUrl(null);
                                                }}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        {previewUrl && (
                                            <div className="mt-4">
                                                <Image
                                                    src={previewUrl}
                                                    alt="Receipt preview"
                                                    width={400}
                                                    height={256}
                                                    className="w-full max-h-64 object-contain rounded border"
                                                    unoptimized
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}

                                <Button
                                    onClick={handleUploadReceipt}
                                    disabled={!selectedFile || isUploading}
                                    className="w-full gap-2"
                                    size="lg"
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4" />
                                            Upload Receipt
                                        </>
                                    )}
                                </Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="card" className="space-y-4 mt-6">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <CreditCard className="w-5 h-5 text-green-600 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="font-semibold text-green-900 text-sm">Secure Card Payment</p>
                                        <p className="text-sm text-green-800 mt-1">
                                            Pay securely using your credit or debit card. Payment is processed instantly.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white border rounded-lg p-6">
                                <div className="flex items-center justify-center gap-4 mb-6">
                                    <Image src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Visa_Logo_2014.svg" alt="Visa" width={64} height={32} className="h-8 w-auto" unoptimized />
                                    <Image src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg" alt="Mastercard" width={64} height={32} className="h-8 w-auto" unoptimized />
                                    <Image src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple Pay" width={64} height={24} className="h-6 w-auto" unoptimized />
                                </div>
                                <Button
                                    onClick={handleCardPayment}
                                    disabled={isProcessing}
                                    className="w-full gap-2 bg-gradient-to-r from-primary to-primary/80"
                                    size="lg"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Redirecting to payment...
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="w-4 h-4" />
                                            Pay <Price amount={transaction.amount} currency={transaction.currency} /> Securely
                                        </>
                                    )}
                                </Button>
                                <p className="text-xs text-center text-muted-foreground mt-3">
                                    Powered by Stripe. Your payment is 100% secure.
                                </p>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            )}

            {isPendingVerification && transaction.receipt_url && (
                <CardContent>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div className="flex-1">
                                <p className="font-semibold text-blue-900 text-sm">Receipt Submitted</p>
                                <p className="text-sm text-blue-800 mt-1">
                                    Your payment receipt has been uploaded and is awaiting verification by the admissions team.
                                </p>
                                <a
                                    href={transaction.receipt_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                                >
                                    View uploaded receipt →
                                </a>
                            </div>
                        </div>
                            </div>
                        </div>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="w-full mt-3"
                            onClick={async () => {
                                if (confirm("Are you sure you want to reset your payment status? This will allow you to re-upload a receipt or pay by card.")) {
                                    setIsProcessing(true);
                                    const result = await resetPaymentStatus(transaction.id);
                                    if (result.error) {
                                        toast.error(result.error);
                                    } else {
                                        toast.success("Payment status reset");
                                    }
                                    setIsProcessing(false);
                                }
                            }}
                            disabled={isProcessing}
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reset / Re-upload Receipt
                        </Button>
                    </div>
                </CardContent >
            )
}

{
    isCompleted && (
                <CardContent>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                            <div className="flex-1">
                                <p className="font-semibold text-green-900 text-sm">Payment Completed</p>
                                <p className="text-sm text-green-800 mt-1">
                                    Your payment has been verified and processed successfully.
                                </p>
                            </div>
                        </div>
                            </div>
                        </div>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="w-full mt-3"
                            onClick={async () => {
                                if (confirm("Are you sure you want to reset your payment status? This will allow you to re-upload a receipt or pay by card.")) {
                                    setIsProcessing(true);
                                    const result = await resetPaymentStatus(transaction.id);
                                    if (result.error) {
                                        toast.error(result.error);
                                    } else {
                                        toast.success("Payment status reset");
                                    }
                                    setIsProcessing(false);
                                }
                            }}
                            disabled={isProcessing}
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reset / Re-upload Receipt
                        </Button>
                    </div >
                </CardContent >
            )
}
        </Card >
    );
}
