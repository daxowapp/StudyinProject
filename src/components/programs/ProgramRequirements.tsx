import { Card, CardContent } from "@/components/ui/card";
import { Check, FileText, DollarSign, Info } from "lucide-react";

interface RequirementItem {
    name: string;
    note?: string;
}

interface DocumentItem {
    name: string;
    note?: string;
    required?: boolean;
}

interface ProgramRequirementsData {
    academic?: RequirementItem[];
    language?: RequirementItem[];
    documents?: DocumentItem[];
    financial?: RequirementItem[];
    other?: RequirementItem[];
}

interface ProgramRequirementsProps {
    requirements: ProgramRequirementsData;
}

export function ProgramRequirements({ requirements }: ProgramRequirementsProps) {
    const renderRequirement = (req: RequirementItem | string) => {
        if (typeof req === 'string') return req;
        return (
            <div>
                <span className="font-medium">{req.name}</span>
                {req.note && <p className="text-xs text-muted-foreground mt-1">{req.note}</p>}
            </div>
        );
    };

    return (
        <div className="space-y-8">
            {/* Entry Requirements */}
            <section className="space-y-4">
                <h2 className="text-2xl font-bold font-heading">Entry Requirements</h2>
                <Card>
                    <CardContent className="p-6 grid md:grid-cols-2 gap-8">
                        {requirements.academic && requirements.academic.length > 0 && (
                            <div>
                                <h3 className="font-bold mb-3 flex items-center gap-2">
                                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">1</div>
                                    Academic
                                </h3>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    {requirements.academic?.map((req: RequirementItem, i: number) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                            {renderRequirement(req)}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {requirements.language && requirements.language.length > 0 && (
                            <div>
                                <h3 className="font-bold mb-3 flex items-center gap-2">
                                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">2</div>
                                    Language
                                </h3>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    {requirements.language?.map((req: RequirementItem, i: number) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                            {renderRequirement(req)}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </section>

            {/* Required Documents */}
            {requirements.documents && requirements.documents.length > 0 && (
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold font-heading">Required Documents</h2>
                    <Card>
                        <CardContent className="p-0">
                            <div className="divide-y">
                                {requirements.documents?.map((doc: DocumentItem, i: number) => (
                                    <div key={i} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <FileText className="h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium text-sm">{doc.name}</p>
                                                {doc.note && <p className="text-xs text-muted-foreground">{doc.note}</p>}
                                            </div>
                                        </div>
                                        <div className="text-xs font-medium px-2 py-1 rounded bg-muted">
                                            {doc.required ? "Required" : "Optional"}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </section>
            )}

            {/* Financial Requirements */}
            {requirements.financial && requirements.financial.length > 0 && (
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold font-heading">Financial Requirements</h2>
                    <Card>
                        <CardContent className="p-6">
                            <ul className="space-y-3">
                                {requirements.financial?.map((req: RequirementItem, i: number) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <DollarSign className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                                        <div className="flex-1">
                                            {renderRequirement(req)}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </section>
            )}

            {/* Other Requirements */}
            {requirements.other && requirements.other.length > 0 && (
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold font-heading">Additional Information</h2>
                    <Card>
                        <CardContent className="p-6">
                            <ul className="space-y-3">
                                {requirements.other?.map((req: RequirementItem, i: number) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <Info className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                                        <div className="flex-1">
                                            {renderRequirement(req)}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </section>
            )}
        </div>
    );
}
