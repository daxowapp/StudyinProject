import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from "lucide-react";

interface UniversityProgramsProps {
    programs: any[];
}

export function UniversityPrograms({ programs }: UniversityProgramsProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold font-heading">Programs</h2>
                <Button variant="link">View All Programs</Button>
            </div>

            <Tabs defaultValue="all" className="w-full">
                <TabsList className="w-full justify-start overflow-x-auto">
                    <TabsTrigger value="all">All Programs</TabsTrigger>
                    <TabsTrigger value="bachelor">Bachelor</TabsTrigger>
                    <TabsTrigger value="master">Master</TabsTrigger>
                    <TabsTrigger value="phd">PhD</TabsTrigger>
                    <TabsTrigger value="non-degree">Non-Degree</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-6 space-y-4">
                    {programs.map((program, index) => (
                        <Card key={index} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">{program.level}</Badge>
                                        {program.badges.map((badge: string) => (
                                            <Badge key={badge} variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">
                                                {badge}
                                            </Badge>
                                        ))}
                                    </div>
                                    <h3 className="text-lg font-bold">{program.name}</h3>
                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" /> {program.duration}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" /> Intake: {program.intake}
                                        </div>
                                        <div>Language: {program.language}</div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-1 min-w-[120px]">
                                    <span className="text-lg font-bold text-primary">{program.tuition}</span>
                                    <span className="text-xs text-muted-foreground">per year</span>
                                    <Button className="mt-2 w-full md:w-auto">Apply Now</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>
                {/* Other tabs would filter the programs list */}
            </Tabs>
        </div>
    );
}
