'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { verifyPayment, approveDocument, rejectPayment, rejectDocument } from '../actions';
import { toast } from 'sonner';

interface VerifyPaymentButtonProps {
    transactionId: string;
}

export function VerifyPaymentButton({ transactionId }: VerifyPaymentButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleVerify = async () => {
        setIsLoading(true);
        try {
            const result = await verifyPayment(transactionId);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success('Payment verified successfully');
            }
        } catch {
            toast.error('Failed to verify payment');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            size="sm"
            onClick={handleVerify}
            disabled={isLoading}
            className="bg-amber-600 hover:bg-amber-700 text-white gap-2"
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <CheckCircle2 className="h-4 w-4" />
            )}
            Verify Payment
        </Button>
    );
}

interface ApproveDocumentButtonProps {
    requestId: string;
}

export function ApproveDocumentButton({ requestId }: ApproveDocumentButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleApprove = async () => {
        setIsLoading(true);
        try {
            const result = await approveDocument(requestId);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success('Document approved successfully');
            }
        } catch {
            toast.error('Failed to approve document');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            size="sm"
            onClick={handleApprove}
            disabled={isLoading}
            className="bg-amber-600 hover:bg-amber-700 text-white gap-2"
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <CheckCircle2 className="h-4 w-4" />
            )}
            Approve Document
        </Button>
    );
}

export function RejectPaymentButton({ transactionId }: VerifyPaymentButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleReject = async () => {
        if (!confirm('Are you sure you want to reject this payment? The student will be notified to re-upload.')) return;

        setIsLoading(true);
        try {
            const result = await rejectPayment(transactionId);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success('Payment rejected');
            }
        } catch {
            toast.error('Failed to reject payment');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            size="sm"
            variant="destructive"
            onClick={handleReject}
            disabled={isLoading}
            className="gap-2"
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <XCircle className="h-4 w-4" />
            )}
            Reject
        </Button>
    );
}

export function RejectDocumentButton({ requestId }: ApproveDocumentButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleReject = async () => {
        if (!confirm('Are you sure you want to reject this document? The student will be notified to re-upload.')) return;

        setIsLoading(true);
        try {
            const result = await rejectDocument(requestId);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success('Document rejected');
            }
        } catch {
            toast.error('Failed to reject document');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            size="sm"
            variant="destructive"
            onClick={handleReject}
            disabled={isLoading}
            className="gap-2"
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <XCircle className="h-4 w-4" />
            )}
            Reject
        </Button>
    );
}


/* GEO Fundamentals auto-patch:
// application/ld+json
// author: Studyatchina
// datePublished: 2026-02-26
// <h1>Title</h1>
// <h2>Section 0</h2>
// <h2>Section 1</h2>
*/
