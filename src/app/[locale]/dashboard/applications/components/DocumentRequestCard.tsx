'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
    FileText,
    Upload,
    CheckCircle2,
    AlertCircle,
    Loader2,
    X,
    Download,
    File,
    Image as ImageIcon,
    Clock
} from 'lucide-react';
import Image from 'next/image';
import { uploadDocument } from '../actions';
import { toast } from 'sonner';

interface DocumentRequest {
    id: string;
    document_name: string;
    status: string;
    uploaded_file_url?: string;
    uploaded_at?: string;
    description?: string;
    deadline?: string;
    created_at: string;
}

interface DocumentRequestCardProps {
    requests: DocumentRequest[];
}

export function DocumentRequestCard({ requests }: DocumentRequestCardProps) {
    const [selectedFiles, setSelectedFiles] = useState<Map<string, File>>(new Map());
    const [previewUrls, setPreviewUrls] = useState<Map<string, string>>(new Map());
    const [uploadingIds, setUploadingIds] = useState<Set<string>>(new Set());

    const handleFileSelect = (requestId: string, file: File | null) => {
        if (!file) {
            const newFiles = new Map(selectedFiles);
            const newPreviews = new Map(previewUrls);
            newFiles.delete(requestId);
            newPreviews.delete(requestId);
            setSelectedFiles(newFiles);
            setPreviewUrls(newPreviews);
            return;
        }

        // Validate file type
        const validTypes = [
            'image/jpeg', 'image/png', 'image/jpg',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        if (!validTypes.includes(file.type)) {
            toast.error('Please upload a JPG, PNG, PDF, or DOC file');
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            toast.error('File size must be less than 10MB');
            return;
        }

        const newFiles = new Map(selectedFiles);
        newFiles.set(requestId, file);
        setSelectedFiles(newFiles);

        // Create preview for images
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newPreviews = new Map(previewUrls);
                newPreviews.set(requestId, reader.result as string);
                setPreviewUrls(newPreviews);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async (requestId: string, documentName: string) => {
        const file = selectedFiles.get(requestId);
        if (!file) {
            toast.error('Please select a file');
            return;
        }

        setUploadingIds(new Set(uploadingIds).add(requestId));

        try {
            const formData = new FormData();
            formData.append('file', file);

            const result = await uploadDocument(requestId, formData);

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(`${documentName} uploaded successfully!`);
                setTimeout(() => window.location.reload(), 1500);
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to upload document');
        } finally {
            const newUploading = new Set(uploadingIds);
            newUploading.delete(requestId);
            setUploadingIds(newUploading);
        }
    };

    const getFileIcon = (fileName: string) => {
        const ext = fileName.split('.').pop()?.toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) {
            return <ImageIcon className="w-5 h-5 text-blue-600" />;
        }
        if (ext === 'pdf') {
            return <FileText className="w-5 h-5 text-red-600" />;
        }
        return <File className="w-5 h-5 text-gray-600" />;
    };

    const completedCount = requests.filter(r => r.status === 'submitted' || r.status === 'approved').length;
    const totalCount = requests.length;
    const progress = (completedCount / totalCount) * 100;

    return (
        <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-xl">Missing Documents</CardTitle>
                            <Badge className="bg-orange-100 text-orange-800">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                {totalCount - completedCount} Pending
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                            Please upload the following documents to complete your application
                        </p>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-semibold">{completedCount} of {totalCount} completed</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {requests.map((request) => {
                    const isUploading = uploadingIds.has(request.id);
                    const isCompleted = request.status === 'submitted' || request.status === 'approved';
                    const selectedFile = selectedFiles.get(request.id);
                    const previewUrl = previewUrls.get(request.id);
                    const isOverdue = request.deadline && new Date(request.deadline) < new Date();

                    return (
                        <div
                            key={request.id}
                            className={`border rounded-lg p-4 ${isCompleted ? 'bg-amber-50 border-amber-200' :
                                isOverdue ? 'bg-red-50 border-red-200' :
                                    'bg-white border-gray-200'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isCompleted ? 'bg-amber-100' : 'bg-orange-100'
                                    }`}>
                                    {isCompleted ? (
                                        <CheckCircle2 className="w-5 h-5 text-amber-600" />
                                    ) : (
                                        <FileText className="w-5 h-5 text-orange-600" />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        <h4 className="font-semibold">{request.document_name}</h4>
                                        {isCompleted && (
                                            <Badge className="bg-amber-600 text-white text-xs">
                                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                                Uploaded
                                            </Badge>
                                        )}
                                        {isOverdue && !isCompleted && (
                                            <Badge className="bg-red-600 text-white text-xs">
                                                Overdue
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                        <Clock className="h-3 w-3" />
                                        <span>Requested on: {new Date(request.created_at).toLocaleDateString()}</span>
                                    </div>
                                    {request.description && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {request.description}
                                        </p>
                                    )}

                                    {request.deadline && !isCompleted && (
                                        <p className={`text-xs mb-3 ${isOverdue ? 'text-red-600 font-semibold' : 'text-muted-foreground'}`}>
                                            Deadline: {new Date(request.deadline).toLocaleDateString()}
                                        </p>
                                    )}

                                    {isCompleted && request.uploaded_file_url ? (
                                        <div className="bg-white border rounded-lg p-3">
                                            <div className="flex items-center gap-3">
                                                {getFileIcon(request.uploaded_file_url)}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium">Document uploaded</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {request.uploaded_at && new Date(request.uploaded_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <a
                                                    href={request.uploaded_file_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    download
                                                >
                                                    <Button variant="outline" size="sm" className="gap-2">
                                                        <Download className="w-4 h-4" />
                                                        View
                                                    </Button>
                                                </a>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <div>
                                                <Label htmlFor={`doc-${request.id}`} className="text-sm">
                                                    Upload {request.document_name}
                                                </Label>
                                                <Input
                                                    id={`doc-${request.id}`}
                                                    type="file"
                                                    accept="image/*,.pdf,.doc,.docx"
                                                    onChange={(e) => handleFileSelect(request.id, e.target.files?.[0] || null)}
                                                    className="mt-1 cursor-pointer"
                                                    disabled={isUploading}
                                                />
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Accepted: JPG, PNG, PDF, DOC (Max 10MB)
                                                </p>
                                            </div>

                                            {selectedFile && (
                                                <div className="bg-gray-50 border rounded-lg p-3">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="flex items-start gap-3 flex-1">
                                                            {getFileIcon(selectedFile.name)}
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {(selectedFile.size / 1024).toFixed(1)} KB
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleFileSelect(request.id, null)}
                                                            disabled={isUploading}
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                    </div>

                                                    {previewUrl && (
                                                        <div className="mt-3">
                                                            <Image
                                                                src={previewUrl}
                                                                alt="Preview"
                                                                width={400}
                                                                height={192}
                                                                className="w-full max-h-48 object-contain rounded border"
                                                                unoptimized
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <Button
                                                onClick={() => handleUpload(request.id, request.document_name)}
                                                disabled={!selectedFile || isUploading}
                                                className="w-full gap-2"
                                            >
                                                {isUploading ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Uploading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload className="w-4 h-4" />
                                                        Upload {request.document_name}
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {completedCount === totalCount && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-6 h-6 text-amber-600" />
                            <div>
                                <p className="font-semibold text-amber-900">All Documents Uploaded!</p>
                                <p className="text-sm text-amber-800">
                                    Thank you for submitting all required documents. They are now under review.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
