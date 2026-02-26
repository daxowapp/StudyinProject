"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    FileText,
    Upload,
    Download,
    Trash2,
    CheckCircle,
    Clock,
    Loader2,
    File,
} from "lucide-react";
import { toast } from "sonner";
import { uploadDocument, deleteDocument, markDocumentsAsRead } from "./actions";
import { formatBytes, formatDate } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface Document {
    id: string;
    document_type: string;
    document_name: string;
    file_url: string;
    file_size: number;
    file_type: string;
    uploaded_at: string;
    is_verified: boolean;
}

interface DocumentsManagerProps {
    userId: string;
    initialDocuments: Document[];
}

export default function DocumentsManager({ userId, initialDocuments }: DocumentsManagerProps) {
    const t = useTranslations('Documents');
    const [documents, setDocuments] = useState<Document[]>(initialDocuments);
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedType, setSelectedType] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const documentTypes = [
        { value: "passport", label: t('types.passport') },
        { value: "transcript", label: t('types.transcript') },
        { value: "diploma", label: t('types.diploma') },
        { value: "recommendation_letter", label: t('types.recommendation_letter') },
        { value: "personal_statement", label: t('types.personal_statement') },
        { value: "cv", label: t('types.cv') },
        { value: "language_certificate", label: t('types.language_certificate') },
        { value: "photo", label: t('types.photo') },
        { value: "bank_statement", label: t('types.bank_statement') },
        { value: "health_certificate", label: t('types.health_certificate') },
        { value: "police_clearance", label: t('types.police_clearance') },
        { value: "other", label: t('types.other') },
    ];

    useEffect(() => {
        markDocumentsAsRead(userId);
    }, [userId]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                toast.error(t('error.fileSize'));
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !selectedType) {
            toast.error(t('error.selectFile'));
            return;
        }

        setUploading(true);
        const result = await uploadDocument(userId, selectedType, selectedFile);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success(t('success.uploaded'));
            setUploadDialogOpen(false);
            setSelectedFile(null);
            setSelectedType("");
            // Refresh documents
            window.location.reload();
        }
        setUploading(false);
    };

    const handleDelete = async (documentId: string, documentName: string) => {
        if (!confirm(t('deleteConfirm', { name: documentName }))) return;

        const result = await deleteDocument(userId, documentId);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success(t('success.deleted'));
            setDocuments(documents.filter(d => d.id !== documentId));
        }
    };

    const handleDownload = (url: string, filename: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getDocumentIcon = (fileType: string) => {
        if (fileType.includes('pdf')) return '📄';
        if (fileType.includes('image')) return '🖼️';
        if (fileType.includes('word') || fileType.includes('document')) return '📝';
        return '📎';
    };

    const getDocumentTypeLabel = (type: string) => {
        const docType = documentTypes.find(t => t.value === type);
        return docType?.label || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const verifiedCount = documents.filter(d => d.is_verified).length;
    const pendingCount = documents.filter(d => !d.is_verified).length;

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('stats.total')}</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{documents.length}</div>
                        <p className="text-xs text-muted-foreground">{t('stats.uploaded')}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('stats.verified')}</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{verifiedCount}</div>
                        <p className="text-xs text-muted-foreground">{t('stats.approved')}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('stats.pending')}</CardTitle>
                        <Clock className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
                        <p className="text-xs text-muted-foreground">{t('stats.awaiting')}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Upload Button */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold">{t('yourDocuments')}</h2>
                    <p className="text-sm text-muted-foreground">
                        {t('manageDocuments')}
                    </p>
                </div>
                <Button onClick={() => setUploadDialogOpen(true)}>
                    <Upload className="mr-2 h-4 w-4" />
                    {t('uploadDocument')}
                </Button>
            </div>

            {/* Documents Grid */}
            {documents.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">{t('noDocuments')}</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            {t('uploadFirst')}
                        </p>
                        <Button onClick={() => setUploadDialogOpen(true)}>
                            <Upload className="mr-2 h-4 w-4" />
                            {t('uploadDocument')}
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {documents.map((doc) => (
                        <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">{getDocumentIcon(doc.file_type)}</span>
                                        <div>
                                            <CardTitle className="text-sm">
                                                {getDocumentTypeLabel(doc.document_type)}
                                            </CardTitle>
                                            <CardDescription className="text-xs">
                                                {doc.document_name}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    {doc.is_verified ? (
                                        <Badge className="bg-green-100 text-green-800 border-green-200">
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                            {t('stats.verified')}
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200" title="Awaiting admin verification">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {t('stats.pending')}
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="text-xs text-muted-foreground space-y-1">
                                    <div>{t('size')}: {formatBytes(doc.file_size)}</div>
                                    <div>{t('uploaded')}: {formatDate(doc.uploaded_at)}</div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => handleDownload(doc.file_url, doc.document_name)}
                                    >
                                        <Download className="h-3 w-3 mr-1" />
                                        {t('download')}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(doc.id, doc.document_name)}
                                        className="text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Upload Dialog */}
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('uploadDialog.title')}</DialogTitle>
                        <DialogDescription>
                            {t('uploadDialog.description')}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="document-type">{t('uploadDialog.type')}</Label>
                            <Select value={selectedType} onValueChange={setSelectedType}>
                                <SelectTrigger id="document-type">
                                    <SelectValue placeholder={t('uploadDialog.selectType')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {documentTypes.map((type) => {
                                        const isUploaded = documents.some(d => d.document_type === type.value);
                                        return (
                                            <SelectItem
                                                key={type.value}
                                                value={type.value}
                                                disabled={isUploaded}
                                            >
                                                {type.label} {isUploaded ? t('uploadDialog.alreadyUploaded') : ""}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="file">{t('uploadDialog.file')}</Label>
                            <Input
                                id="file"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                onChange={handleFileSelect}
                            />
                            {selectedFile && (
                                <p className="text-sm text-muted-foreground">
                                    {t('uploadDialog.selected')}: {selectedFile.name} ({formatBytes(selectedFile.size)})
                                </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                {t('uploadDialog.formats')}
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setUploadDialogOpen(false)}
                            disabled={uploading}
                        >
                            {t('uploadDialog.cancel')}
                        </Button>
                        <Button onClick={handleUpload} disabled={uploading || !selectedFile || !selectedType}>
                            {uploading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t('uploadDialog.uploading')}
                                </>
                            ) : (
                                <>
                                    <Upload className="mr-2 h-4 w-4" />
                                    {t('uploadDialog.upload')}
                                </>
                            )}
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
*/
