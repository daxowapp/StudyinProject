'use client';

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { processRefundRequest } from "../actions";
import { toast } from "sonner";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

import { useTranslations } from 'next-intl';

interface RefundRequest {
    id: string;
    application_id: string;
    student_id: string;
    reason: string;
    amount: number;
    currency: string;
    status: 'pending' | 'approved' | 'rejected';
    admin_response?: string;
    created_at: string;
    application: {
        id: string;
        student_name: string;
        student_email: string;
        payment_amount: number;
        payment_currency: string;
        university_program: {
            university: {
                name: string;
            }
        }
    };
}

interface RefundRequestsTableProps {
    initialData: RefundRequest[];
}

export function RefundRequestsTable({ initialData }: RefundRequestsTableProps) {
    const t = useTranslations('Refunds');
    const [selectedRequest, setSelectedRequest] = useState<RefundRequest | null>(null);
    const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
    const [adminResponse, setAdminResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAction = async () => {
        if (!selectedRequest || !actionType) return;

        setLoading(true);
        try {
            const result = await processRefundRequest(
                selectedRequest.id,
                selectedRequest.application_id,
                actionType,
                adminResponse
            );

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(t('successMessage'));
                setSelectedRequest(null);
                setActionType(null);
                setAdminResponse('');
            }
        } catch {
            toast.error(t('errorMessage'));
        } finally {
            setLoading(false);
        }
    };

    const openActionDialog = (request: RefundRequest, type: 'approve' | 'reject') => {
        setSelectedRequest(request);
        setActionType(type);
        setAdminResponse('');
    };

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{t('table.student')}</TableHead>
                        <TableHead>{t('table.program')}</TableHead>
                        <TableHead>{t('table.reason')}</TableHead>
                        <TableHead>{t('table.status')}</TableHead>
                        <TableHead>{t('table.date')}</TableHead>
                        <TableHead className="text-right">{t('table.actions')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {initialData.map((request) => (
                        <TableRow key={request.id}>
                            <TableCell>
                                <div>
                                    <div className="font-medium">{request.application.student_name}</div>
                                    <div className="text-sm text-muted-foreground">{request.application.student_email}</div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="text-sm">
                                    {request.application.university_program?.university?.name}
                                </div>
                            </TableCell>
                            <TableCell className="max-w-[300px]">
                                <p className="truncate" title={request.reason}>{request.reason}</p>
                            </TableCell>
                            <TableCell>
                                <Badge variant={
                                    request.status === 'approved' ? 'default' :
                                        request.status === 'rejected' ? 'destructive' :
                                            'secondary'
                                }>
                                    {request.status.toUpperCase()}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                {new Date(request.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                                {request.status === 'pending' && (
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                            onClick={() => openActionDialog(request, 'approve')}
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => openActionDialog(request, 'reject')}
                                        >
                                            <XCircle className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                    {initialData.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                {t('table.noRequests')}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {actionType === 'approve' ? t('table.approveTitle') : t('table.rejectTitle')}
                        </DialogTitle>
                        <DialogDescription>
                            {actionType === 'approve'
                                ? t('table.approveDescription')
                                : t('table.rejectDescription')}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>{t('table.reason')}</Label>
                            <div className="p-3 bg-muted rounded-md text-sm">
                                {selectedRequest?.reason}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="response">{t('table.adminResponsePlaceholder')}</Label>
                            <Textarea
                                id="response"
                                value={adminResponse}
                                onChange={(e) => setAdminResponse(e.target.value)}
                                placeholder={t('table.adminResponsePlaceholder')}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedRequest(null)} disabled={loading}>
                            {t('cancelButton')}
                        </Button>
                        <Button
                            variant={actionType === 'approve' ? 'default' : 'destructive'}
                            onClick={handleAction}
                            disabled={loading}
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {actionType === 'approve' ? t('table.approve') : t('table.reject')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
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
