import { getPrograms, getUniversities, getLanguages } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgramDialog } from "./components/ProgramDialog";
import { format } from "date-fns";

export default async function ProgramsPage() {
    const programs = await getPrograms();
    const universities = await getUniversities();
    const languages = await getLanguages();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Programs</h1>
                    <p className="text-muted-foreground">
                        Manage university programs and scholarship details.
                    </p>
                </div>
                <ProgramDialog universities={universities} languages={languages} />
            </div>

            <div className="grid gap-6">
                {programs?.map((program: any) => (
                    <Card key={program.id} className={program.is_active ? "" : "opacity-70"}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="space-y-1">
                                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                    {program.title}
                                    {program.is_active ? (
                                        <Badge variant="default" className="bg-amber-600 hover:bg-amber-700">Active</Badge>
                                    ) : (
                                        <Badge variant="secondary">Inactive</Badge>
                                    )}
                                    {program.has_force_payment && (
                                        <Badge variant="destructive">Force Payment</Badge>
                                    )}
                                </CardTitle>
                                <CardDescription className="text-base">
                                    {program.university?.name} • {program.level} • {program.field}
                                </CardDescription>
                            </div>
                            <ProgramDialog
                                program={program}
                                universities={universities}
                                languages={languages}
                            />
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm">
                                <div>
                                    <span className="text-muted-foreground block">Tuition Fee</span>
                                    <span className="font-medium">
                                        {program.tuition_fee} {program.currency}/year
                                    </span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block">Scholarship</span>
                                    <span className="font-medium text-amber-600">
                                        {program.scholarship_chance || "N/A"}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block">Language</span>
                                    <span className="font-medium">
                                        {program.language?.name || program.language || "English"}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block">Deadline</span>
                                    <span className="font-medium">
                                        {program.deadline ? format(new Date(program.deadline), "MMM d, yyyy") : "N/A"}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground block">Application Fee</span>
                                    <span className="font-medium">${program.application_fee}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block">Service Fee</span>
                                    <span className="font-medium">${program.service_fee}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {programs?.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <h3 className="text-lg font-medium">No programs found</h3>
                        <p className="text-muted-foreground mb-4">
                            Get started by creating your first program.
                        </p>
                        <ProgramDialog universities={universities} languages={languages} />
                    </div>
                )}
            </div>
        </div>
    );
}
