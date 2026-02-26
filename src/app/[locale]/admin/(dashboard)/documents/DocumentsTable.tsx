"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    CheckCircle,
    Search,
    FileText,
    ExternalLink,
    Loader2,
    Trash2
} from "lucide-react";
import { toast } from "sonner";
import { verifyDocument, deleteDocument } from "./actions";
import { formatDate, formatBytes } from "@/lib/utils";

interface Document {
    id: string;
    student_id: string;
    document_type: string;
    document_name: string;
    file_url: string;
    file_size: number;
    file_type: string;
    uploaded_at: string;
    is_verified: boolean;
    student_name: string;
    student_email?: string;
}

interface DocumentsTableProps {
    documents: Document[];
}

export default function DocumentsTable({ documents: initialDocuments }: DocumentsTableProps) {
    const [documents, setDocuments] = useState(initialDocuments);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [processingId, setProcessingId] = useState<string | null>(null);

    const filteredDocuments = documents.filter(doc => {
        const matchesSearch =
            doc.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.document_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.document_name.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
            statusFilter === "all" ? true :
                statusFilter === "verified" ? doc.is_verified :
                    !doc.is_verified;

        return matchesSearch && matchesStatus;
    });

    const handleVerify = async (id: string) => {
        setProcessingId(id);
        const result = await verifyDocument(id);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("Document verified successfully");
            setDocuments(docs => docs.map(d =>
                d.id === id ? { ...d, is_verified: true } : d
            ));
        }
        setProcessingId(null);
    };

    const handleDelete = async (id: string, url: string) => {
        if (!confirm("Are you sure you want to delete this document? This cannot be undone.")) return;

        setProcessingId(id);
        const result = await deleteDocument(id, url);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("Document deleted successfully");
            setDocuments(docs => docs.filter(d => d.id !== id));
        }
        setProcessingId(null);
    };

    const getDocumentTypeLabel = (type: string) => {
        return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search documents..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="verified">Verified</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Document</TableHead>
                            <TableHead>Uploaded</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredDocuments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No documents found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredDocuments.map((doc) => (
                                <TableRow key={doc.id}>
                                    <TableCell>
                                        <div className="font-medium">{doc.student_name}</div>
                                        <div className="text-xs text-muted-foreground">{doc.student_email}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <div className="font-medium">{getDocumentTypeLabel(doc.document_type)}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {doc.document_name} ({formatBytes(doc.file_size)})
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {formatDate(doc.uploaded_at)}
                                    </TableCell>
                                    <TableCell>
                                        {doc.is_verified ? (
                                            <Badge className="bg-green-100 text-green-800 border-green-200">
                                                Verified
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                                                Pending
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                asChild
                                                title="View Document"
                                            >
                                                <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="h-4 w-4" />
                                                </a>
                                            </Button>

                                            {!doc.is_verified && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleVerify(doc.id)}
                                                    disabled={processingId === doc.id}
                                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                    title="Verify Document"
                                                >
                                                    {processingId === doc.id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <CheckCircle className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            )}

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(doc.id, doc.file_url)}
                                                disabled={processingId === doc.id}
                                                className="text-destructive hover:text-destructive hover:bg-red-50"
                                                title="Delete Document"
                                            >
                                                {processingId === doc.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
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
