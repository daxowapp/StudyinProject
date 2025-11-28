import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Clock, MapPin, Calendar, DollarSign, GraduationCap } from "lucide-react";
import Link from "next/link";

interface Program {
    id: string;
    slug?: string;
    name: string;
    university: string;
    city: string;
    level: string;
    duration: string;
    tuition: string;
    deadline: string;
    badges: string[];
}

interface ProgramCardProps {
    program: Program;
}

export function ProgramCard({ program }: ProgramCardProps) {
    return (
        <Card className="hover:shadow-lg transition-all duration-300 border-none shadow-sm bg-card flex flex-col h-full">
            <CardContent className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                    <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center text-xs font-bold shrink-0">
                        Logo
                    </div>
                    <Badge variant={program.level === "Master" ? "default" : "secondary"}>
                        {program.level}
                    </Badge>
                </div>

                <div className="mb-4">
                    <div className="text-sm font-medium text-primary mb-1">{program.university}</div>
                    <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2">
                        {program.name}
                    </h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        {program.city}
                    </div>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" /> {program.duration}
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> Deadline: {program.deadline}
                    </div>
                    <div className="flex items-center gap-2 font-medium text-foreground">
                        <DollarSign className="h-4 w-4" /> {program.tuition}
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {program.badges.map((badge) => (
                        <Badge key={badge} variant="outline" className="text-xs font-normal">
                            {badge}
                        </Badge>
                    ))}
                </div>
            </CardContent>

            <CardFooter className="p-6 pt-0">
                <Link href={`/programs/${program.slug || program.id}`} className="w-full">
                    <Button className="w-full">View Program</Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
