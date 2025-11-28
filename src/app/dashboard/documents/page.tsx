import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DocumentsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Documents</h2>
                    <p className="text-muted-foreground">
                        Manage your application documents
                    </p>
                </div>
                <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Document
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Passport
                        </CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Uploaded</div>
                        <p className="text-xs text-muted-foreground">
                            Valid until 2030
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Transcript
                        </CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Missing</div>
                        <p className="text-xs text-muted-foreground">
                            Please upload PDF
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
