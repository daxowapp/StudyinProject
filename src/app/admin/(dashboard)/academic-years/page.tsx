import { getAcademicYears } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AcademicYearDialog } from "./components/AcademicYearDialog";
import { IntakeDialog } from "./components/IntakeDialog";
import { format } from "date-fns";

export default async function AcademicYearsPage() {
    const academicYears = await getAcademicYears();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Academic Years</h1>
                    <p className="text-muted-foreground">
                        Manage academic years and admission intakes.
                    </p>
                </div>
                <AcademicYearDialog />
            </div>

            <div className="grid gap-6">
                {academicYears?.map((year: any) => (
                    <Card key={year.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="space-y-1">
                                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                    {year.name}
                                    {year.is_active && <Badge variant="default">Active</Badge>}
                                </CardTitle>
                                <CardDescription>
                                    {format(new Date(year.start_date), "MMM d, yyyy")} -{" "}
                                    {format(new Date(year.end_date), "MMM d, yyyy")}
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <AcademicYearDialog academicYear={year} />
                                <IntakeDialog academicYearId={year.id} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="mt-4">
                                <h4 className="text-sm font-medium mb-3">Intakes</h4>
                                {year.intakes && year.intakes.length > 0 ? (
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {year.intakes.map((intake: any) => (
                                            <div
                                                key={intake.id}
                                                className="flex items-center justify-between p-3 border rounded-lg bg-muted/50"
                                            >
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">{intake.name}</span>
                                                        {intake.is_open ? (
                                                            <Badge variant="outline" className="text-green-600 border-green-600">Open</Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="text-muted-foreground">Closed</Badge>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {format(new Date(intake.start_date), "MMM d")} -{" "}
                                                        {format(new Date(intake.end_date), "MMM d, yyyy")}
                                                    </div>
                                                </div>
                                                <IntakeDialog academicYearId={year.id} intake={intake} />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">No intakes added yet.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {academicYears?.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <h3 className="text-lg font-medium">No academic years found</h3>
                        <p className="text-muted-foreground mb-4">
                            Get started by creating your first academic year.
                        </p>
                        <AcademicYearDialog />
                    </div>
                )}
            </div>
        </div>
    );
}
