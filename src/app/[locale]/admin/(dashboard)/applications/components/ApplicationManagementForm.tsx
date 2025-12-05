"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateApplicationStatus, addAdminNote, sendMessageToStudent, requestPayment, requestDocuments, uploadConditionalLetter } from "../actions";
import { toast } from "sonner";
import { Send, DollarSign, FileText, Upload, CheckCircle, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ApplicationManagementFormProps {
    application: {
        id: string;
        student_name: string;
        status: string;
        student_email: string;
        student_id: string;
        student_phone?: string;
        student_country?: string;
        admin_notes?: string;
    };
}

export function ApplicationManagementForm({ application }: ApplicationManagementFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [comment, setComment] = useState("");
    const [messageSubject, setMessageSubject] = useState("");
    const [messageBody, setMessageBody] = useState("");
    const [messageType, setMessageType] = useState("general");

    // Payment request state
    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentCurrency, setPaymentCurrency] = useState("USD");
    const [paymentDescription, setPaymentDescription] = useState("");

    // Document request state
    const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
    const [documentInstructions, setDocumentInstructions] = useState("");

    // File upload state
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const commonDocuments = [
        "Passport Copy",
        "Academic Transcripts",
        "Degree Certificate",
        "English Proficiency Test (IELTS/TOEFL)",
        "Personal Statement",
        "Recommendation Letters",
        "CV/Resume",
        "Financial Proof",
        "Medical Certificate",
        "Police Clearance Certificate"
    ];

    async function handleStatusChange(value: string) {
        setIsLoading(true);
        try {
            const result = await updateApplicationStatus(application.id, value);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Status updated");
                if (result.emailSent) {
                    toast.success("Email notification sent");
                } else if (result.emailError) {
                    toast.error(`Email failed: ${result.emailError}`);
                }
                router.refresh();
            }
        } finally {
            setIsLoading(false);
        }
    }

    async function handleAddNote() {
        if (!comment.trim()) return;
        setIsLoading(true);
        try {
            const result = await addAdminNote(application.id, comment);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Note added");
                setComment("");
                router.refresh();
            }
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSendMessage() {
        if (!messageSubject.trim() || !messageBody.trim()) {
            toast.error("Please fill in both subject and message");
            return;
        }
        setIsLoading(true);
        try {
            const result = await sendMessageToStudent(
                application.id,
                messageSubject,
                messageBody,
                messageType,
                false
            );
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Message sent to student!");
                setMessageSubject("");
                setMessageBody("");
                setMessageType("general");
            }
        } finally {
            setIsLoading(false);
        }
    }

    async function handleRequestPayment() {
        if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }
        if (!paymentDescription.trim()) {
            toast.error("Please enter a payment description");
            return;
        }

        setIsLoading(true);
        try {
            const result = await requestPayment(
                application.id,
                parseFloat(paymentAmount),
                paymentCurrency,
                paymentDescription
            );
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Payment request sent to student!");
                setPaymentAmount("");
                setPaymentDescription("");
                router.refresh();
            }
        } finally {
            setIsLoading(false);
        }
    }

    async function handleRequestDocuments() {
        if (selectedDocuments.length === 0) {
            toast.error("Please select at least one document");
            return;
        }

        setIsLoading(true);
        try {
            const result = await requestDocuments(
                application.id,
                selectedDocuments,
                documentInstructions
            );
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Document request sent to student!");
                setSelectedDocuments([]);
                setDocumentInstructions("");
                router.refresh();
            }
        } finally {
            setIsLoading(false);
        }
    }

    async function handleUploadLetter() {
        if (!selectedFile) {
            toast.error("Please select a file");
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const result = await uploadConditionalLetter(application.id, formData);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Conditional acceptance letter uploaded and sent to student!");
                setSelectedFile(null);
                router.refresh();
            }
        } finally {
            setIsLoading(false);
        }
    }

    const toggleDocument = (doc: string) => {
        setSelectedDocuments(prev =>
            prev.includes(doc)
                ? prev.filter(d => d !== doc)
                : [...prev, doc]
        );
    };

    return (
        <div className="grid gap-6">
            {/* Status Control Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Application Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 items-end">
                        <div className="flex-1 space-y-2">
                            <Label>Change Status</Label>
                            <Select defaultValue={application.status} onValueChange={handleStatusChange}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="pending_documents">Pending Documents</SelectItem>
                                    <SelectItem value="pending_payment">Pending Payment</SelectItem>
                                    <SelectItem value="submitted">Submitted</SelectItem>
                                    <SelectItem value="under_review">Under Review</SelectItem>
                                    <SelectItem value="accepted">Accepted</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                    <SelectItem value="withdrawn">Withdrawn</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            onClick={() => handleStatusChange('accepted')}
                            disabled={isLoading}
                            className="gap-2"
                        >
                            <CheckCircle className="h-4 w-4" />
                            Mark as Accepted
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Main Management Tabs */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        Application Management
                        <span className="text-xs text-muted-foreground font-normal">v1.1 (Debug)</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="notes" className="w-full">
                        <TabsList className="flex w-full flex-wrap h-auto gap-2 bg-muted/50 p-1 justify-start">
                            <TabsTrigger value="notes" className="flex-1 min-w-[120px]">Admin Notes</TabsTrigger>
                            <TabsTrigger value="message" className="flex-1 min-w-[120px]">Send Message</TabsTrigger>
                            <TabsTrigger value="payment" className="flex-1 min-w-[120px]">Request Payment</TabsTrigger>
                            <TabsTrigger value="documents" className="flex-1 min-w-[120px]">Request Documents</TabsTrigger>
                            <TabsTrigger value="upload" className="flex-1 min-w-[120px]">Upload Letter</TabsTrigger>
                        </TabsList>

                        {/* Admin Notes Tab */}
                        <TabsContent value="notes" className="space-y-4 mt-6">
                            {application.admin_notes && (
                                <div className="bg-muted p-4 rounded-lg">
                                    <p className="text-sm font-medium mb-2">Current Notes:</p>
                                    <p className="text-sm whitespace-pre-wrap">{application.admin_notes}</p>
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label>Add or Update Notes (Internal Only)</Label>
                                <Textarea
                                    placeholder="Add or update admin notes (student won't see this)..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="min-h-[120px]"
                                />
                                <Button
                                    onClick={handleAddNote}
                                    disabled={isLoading || !comment.trim()}
                                    className="gap-2"
                                >
                                    <Save className="h-4 w-4" />
                                    Save Notes
                                </Button>
                            </div>
                        </TabsContent>

                        {/* Send Message Tab */}
                        <TabsContent value="message" className="space-y-4 mt-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Message Type</Label>
                                    <Select value={messageType} onValueChange={setMessageType}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="general">General Message</SelectItem>
                                            <SelectItem value="status_update">Status Update</SelectItem>
                                            <SelectItem value="additional_info_request">Additional Info Request</SelectItem>
                                            <SelectItem value="interview_invitation">Interview Invitation</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Subject</Label>
                                    <Input
                                        placeholder="Message subject..."
                                        value={messageSubject}
                                        onChange={(e) => setMessageSubject(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Message</Label>
                                    <Textarea
                                        placeholder="Type your message to the student..."
                                        value={messageBody}
                                        onChange={(e) => setMessageBody(e.target.value)}
                                        className="min-h-[200px]"
                                    />
                                </div>
                                <Button
                                    onClick={handleSendMessage}
                                    disabled={isLoading || !messageSubject.trim() || !messageBody.trim()}
                                    className="w-full gap-2"
                                    size="lg"
                                >
                                    <Send className="h-4 w-4" />
                                    Send Message to Student
                                </Button>
                            </div>
                        </TabsContent>

                        {/* Payment Request Tab */}
                        <TabsContent value="payment" className="space-y-4 mt-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Amount</Label>
                                        <Input
                                            type="number"
                                            placeholder="0.00"
                                            value={paymentAmount}
                                            onChange={(e) => setPaymentAmount(e.target.value)}
                                            min="0"
                                            step="0.01"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Currency</Label>
                                        <Select value={paymentCurrency} onValueChange={setPaymentCurrency}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="USD">USD ($)</SelectItem>
                                                <SelectItem value="EUR">EUR (€)</SelectItem>
                                                <SelectItem value="GBP">GBP (£)</SelectItem>
                                                <SelectItem value="CNY">CNY (¥)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Payment Description</Label>
                                    <Textarea
                                        placeholder="E.g., Application fee, Tuition deposit, etc."
                                        value={paymentDescription}
                                        onChange={(e) => setPaymentDescription(e.target.value)}
                                        className="min-h-[120px]"
                                    />
                                </div>
                                <Button
                                    onClick={handleRequestPayment}
                                    disabled={isLoading || !paymentAmount || !paymentDescription.trim()}
                                    className="w-full gap-2"
                                    size="lg"
                                >
                                    <DollarSign className="h-4 w-4" />
                                    Request Payment from Student
                                </Button>
                                <p className="text-sm text-muted-foreground">
                                    This will send a payment request message to the student and update the application status to &quot;Pending Payment&quot;.
                                </p>
                            </div>
                        </TabsContent>

                        {/* Document Request Tab */}
                        <TabsContent value="documents" className="space-y-4 mt-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Select Required Documents</Label>
                                    <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto border rounded-lg p-4">
                                        {commonDocuments.map((doc) => (
                                            <div key={doc} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={doc}
                                                    checked={selectedDocuments.includes(doc)}
                                                    onCheckedChange={() => toggleDocument(doc)}
                                                />
                                                <label
                                                    htmlFor={doc}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                >
                                                    {doc}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Additional Instructions (Optional)</Label>
                                    <Textarea
                                        placeholder="Any specific requirements or deadlines..."
                                        value={documentInstructions}
                                        onChange={(e) => setDocumentInstructions(e.target.value)}
                                        className="min-h-[100px]"
                                    />
                                </div>
                                <Button
                                    onClick={handleRequestDocuments}
                                    disabled={isLoading || selectedDocuments.length === 0}
                                    className="w-full gap-2"
                                    size="lg"
                                >
                                    <FileText className="h-4 w-4" />
                                    Request Documents from Student
                                </Button>
                                <p className="text-sm text-muted-foreground">
                                    This will send a document request message to the student and update the application status to &quot;Pending Documents&quot;.
                                </p>
                            </div>
                        </TabsContent>

                        {/* Upload Letter Tab */}
                        <TabsContent value="upload" className="space-y-4 mt-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Conditional Acceptance Letter</Label>
                                    <Input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                        className="cursor-pointer"
                                    />
                                    {selectedFile && (
                                        <div className="p-3 bg-muted rounded-lg">
                                            <p className="text-sm font-medium">Selected File:</p>
                                            <p className="text-sm text-muted-foreground">
                                                {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <Button
                                    onClick={handleUploadLetter}
                                    disabled={isLoading || !selectedFile}
                                    className="w-full gap-2"
                                    size="lg"
                                >
                                    <Upload className="h-4 w-4" />
                                    Upload & Send to Student
                                </Button>
                                <p className="text-sm text-muted-foreground">
                                    This will upload the letter, send it to the student, and update the application status to &quot;Accepted&quot;.
                                </p>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
